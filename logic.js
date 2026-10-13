function adminAddGold() {
    if (!currentUserId) return;
    gameState.gold += 1000000;
    saveGame();
    updateUI();
    logMessage('👑 [Admin] Đã cấp thêm <span class="text-amber-300">1,000,000 Vàng</span> để test bản đồ!');
}

function adminMaxStamina() {
    if (!currentUserId) return;
    gameState.stamina = gameState.maxStamina;
    saveGame();
    updateUI();
    logMessage('👑 [Admin] Đã hồi phục đầy năng lượng hành động!');
}



// ==========================================
// 1. BIẾN TOÀN CỤC & TRẠNG THÁI MẶC ĐỊNH
// ==========================================
var currentUserId = null; 
var isSignUpMode = false; 
var actionCooldowns = {};
var activeSellIndex = null;

// Hàm trả về trạng thái mặc định ban đầu của game[span_3](start_span)[span_3](end_span)
function getDefaultGameState() {
    return {
        gold: 150,
        stamina: 20,
        maxStamina: 20,
        currentMap: 'light_city',
        previousMap: 'light_city',
        inventory: [],
        lastStaminaTime: Date.now(),
        player: {
            name: "",
            avatar: "images/avatars/warrior_m.png",
            level: 1,
            exp: 0,
            maxExp: 100,
            hp: 120,
            maxHp: 120,
            mp: 70,
            maxMp: 70,
            atk: 15,
            def: 5,
            spd: 5,
            stats: { 
                atk: 10, 
                def: 5, 
                spd: 8, 
                agi: 5, 
                mdef: 5, 
                mag: 5, 
                crit: 5,
                str: 8,
                spi: 8
            },
            statPoints: 0
        },
        skills: {} // Giữ cho tính năng phát triển kỹ năng trong tương lai
    };
}

var gameState = getDefaultGameState();


// ==========================================
// 2. XÁC THỰC (AUTH) & LƯU TRỮ (SAVE MANAGER)
// ==========================================

function toggleAuthMode() {
    isSignUpMode = !isSignUpMode;
    var title = document.getElementById('auth-title');
    var btnSubmit = document.getElementById('btn-auth-submit');
    var toggleText = document.getElementById('auth-toggle-text');
    var btnToggle = document.getElementById('btn-auth-toggle');
    var errBox = document.getElementById('auth-error');
    var confirmContainer = document.getElementById('confirm-password-container');

    if (errBox) errBox.classList.add('hidden');

    if (isSignUpMode) {
        title.innerText = "✨ Tạo Tài Khoản Mới";
        btnSubmit.innerText = "Đăng Ký";
        toggleText.innerText = "Đã có tài khoản?";
        btnToggle.innerText = "Đăng nhập";
        if (confirmContainer) confirmContainer.classList.remove('hidden');
    } else {
        title.innerText = "✨ Đăng Nhập Tài Khoản";
        btnSubmit.innerText = "Đăng Nhập";
        toggleText.innerText = "Chưa có tài khoản?";
        btnToggle.innerText = "Đăng ký ngay";
        if (confirmContainer) confirmContainer.classList.add('hidden');
    }
}

function togglePasswordVisibility(fieldId, btnEl) {
    var inputField = document.getElementById(fieldId);
    if (!inputField) return;

    if (inputField.type === "password") {
        inputField.type = "text";
        btnEl.innerText = "🙈";
    } else {
        inputField.type = "password";
        btnEl.innerText = "👁️";
    }
}

async function handleAuthSubmit() {
    var rawInput = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value.trim();

    if (!rawInput || !password) {
        showAuthError("Vui lòng điền đầy đủ Tên tài khoản và Mật khẩu!");
        return;
    }

    if (isSignUpMode) {
        var confirmPassword = document.getElementById('auth-confirm-password').value.trim();
        if (password !== confirmPassword) {
            showAuthError("Mật khẩu xác nhận không khớp!");
            return;
        }
    }

    var authEmail = rawInput;
    if (!rawInput.includes('@')) {
        var cleanUsername = rawInput.toLowerCase().replace(/\s+/g, '');
        authEmail = cleanUsername + "@hocvienphapsu.local";
    }

    try {
        if (isSignUpMode) {
            await auth.createUserWithEmailAndPassword(authEmail, password);
            logMessage("🎉 Tạo tài khoản thành công!");
        } else {
            await auth.signInWithEmailAndPassword(authEmail, password);
            logMessage("🔑 Đăng nhập thành công!");
        }

        var authModal = document.getElementById('auth-modal');
        if (authModal) authModal.classList.add('hidden');

    } catch (err) {
        var msg = "Lỗi xác thực!";
        if (err.code === 'auth/email-already-in-use') msg = "Tên tài khoản hoặc Email này đã được sử dụng!";
        else if (err.code === 'auth/wrong-password') msg = "Mật khẩu không chính xác!";
        else if (err.code === 'auth/user-not-found') msg = "Tài khoản không tồn tại!";
        else if (err.code === 'auth/weak-password') msg = "Mật khẩu phải từ 6 ký tự trở lên!";
        else if (err.code === 'auth/invalid-email') msg = "Định dạng tài khoản không hợp lệ!";
        showAuthError(msg);
    }
}

function showAuthError(msg) {
    var errBox = document.getElementById('auth-error');
    if (errBox) {
        errBox.innerText = msg;
        errBox.classList.remove('hidden');
    }
}

const SaveManager = {
    save: async function(state) {
        if (!currentUserId) return;
        try {
            localStorage.setItem('magical_school_state_' + currentUserId, JSON.stringify(state));
            if (typeof db !== 'undefined') {
                await db.collection('players').doc(currentUserId).set({
                    gameState: state,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (err) {
            console.error("❌ Lỗi lưu Firebase:", err);
        }
    },
    load: async function() {
        if (!currentUserId) return null;
        try {
            if (typeof db !== 'undefined') {
                let docRef = await db.collection('players').doc(currentUserId).get();
                if (docRef.exists) {
                    let loadedState = docRef.data().gameState;
                    if (loadedState && loadedState.player) {
                        ensurePlayerStats(loadedState.player);
                    }
                    return loadedState;
                }
            }
        } catch (err) {
            console.warn("⚠️ Không tải được từ Firebase, dùng LocalStorage.");
        }
        let saved = localStorage.getItem('magical_school_state_' + currentUserId);
        if (saved) {
            let parsedState = JSON.parse(saved);
            if (parsedState && parsedState.player) {
                ensurePlayerStats(parsedState.player);
            }
            return parsedState;
        }
        return null;
    },
    clear: function() {
        if (currentUserId) {
            localStorage.removeItem('magical_school_state_' + currentUserId);
        }
    }
};

function saveGame() {
    SaveManager.save(gameState);
}

if (typeof auth !== 'undefined') {
    // Tìm đến sự kiện onAuthStateChanged trong logic.js và cập nhật bên trong block (khi user đăng nhập thành công):
auth.onAuthStateChanged(async function(user) {
    var authModal = document.getElementById('auth-modal');
    var adminPanel = document.getElementById('admin-panel'); // Thêm dòng này

    if (user) {
        currentUserId = user.uid;
        gameState = getDefaultGameState();
        if (authModal) authModal.classList.add('hidden');

        // KIỂM TRA TÀI KHOẢN ADMIN DUY NHẤT (Ví dụ: tên đăng nhập là admin -> email là admin@hocvienphapsu.local)
        if (user.email === 'admin@hocvienphapsu.local') {
            if (adminPanel) adminPanel.classList.remove('hidden');
            logMessage('👑 Chào mừng Quản Trị Viên đăng nhập hệ thống!');
        } else {
            if (adminPanel) adminPanel.classList.add('hidden');
        }

        var savedData = await SaveManager.load();
        if (savedData) {
            gameState = Object.assign({}, getDefaultGameState(), savedData);
        }
        
        recalculatePlayerStats();
        updateUI();
        checkPlayerName(); 
    } else {
        currentUserId = null;
        gameState = getDefaultGameState(); 
        if (adminPanel) adminPanel.classList.add('hidden'); // Ẩn panel khi đăng xuất
        updateUI();
        if (authModal) {
            authModal.classList.remove('hidden');
        }
    }
});

}

function logoutUser() {
    if (confirm("⚠️ Anh có chắc chắn muốn đăng xuất tài khoản khỏi thiết bị này không?")) {
        if (typeof auth !== 'undefined' && auth.signOut) {
            auth.signOut().then(function() {
                logMessage("🔒 Đăng xuất tài khoản thành công.");
                var authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('hidden');
            }).catch(function(error) {
                console.error("❌ Lỗi khi đăng xuất:", error);
            });
        }
    }
}


// ==========================================
// 3. QUẢN LÝ NHÂN VẬT, CHỈ SỐ & TẠO NHÂN VẬT
// ==========================================

function ensurePlayerStats(player) {
    if (!player) return;
    if (!player.stats) {
        player.stats = { atk: 10, def: 5, spd: 8, agi: 5, mdef: 5, mag: 5, crit: 5 };
    } else {
        if (typeof player.stats.atk === 'undefined') player.stats.atk = 10;
        if (typeof player.stats.def === 'undefined') player.stats.def = 5;
        if (typeof player.stats.spd === 'undefined') player.stats.spd = 8;
        if (typeof player.stats.agi === 'undefined') player.stats.agi = 5;
        if (typeof player.stats.mdef === 'undefined') player.stats.mdef = 5;
        if (typeof player.stats.mag === 'undefined') player.stats.mag = 5;
        if (typeof player.stats.crit === 'undefined') player.stats.crit = 5;
    }
    if (typeof player.statPoints === 'undefined') {
        player.statPoints = 0;
    }
}

function recalculatePlayerStats() {
    if (!gameState.player || !gameState.player.stats) return;

    var p = gameState.player;
    var s = p.stats;

    s.str = s.str || 8;
    s.spi = s.spi || 8;
    s.atk = s.atk || 10;
    s.def = s.def || 5;
    s.mag = s.mag || 5;
    s.mdef = s.mdef || 5;
    s.agi = s.agi || 5;
    s.spd = s.spd || 8;
    s.crit = s.crit || 5;

    p.maxHp = 100 + (s.str * 15) + (p.level * 10);
    p.maxMp = 50 + (s.spi * 12) + (p.level * 5);
    p.atk = Math.floor(s.atk + (s.str * 1.5));
    p.mag = Math.floor(s.mag + (s.spi * 1.2));
    p.def = s.def;
    p.mdef = Math.floor(s.mdef + (s.spi * 0.5));

    if (p.hp > p.maxHp) p.hp = p.maxHp;
    if (p.mp > p.maxMp) p.mp = p.maxMp;
}

function gainExp(amount) {
    if (!gameState.player) return;

    gameState.player.exp += amount;
    logMessage('✨ Nhận được <span class="text-blue-300">' + amount + ' điểm EXP</span>.');

    while (gameState.player.exp >= gameState.player.maxExp) {
        levelUp();
    }

    SaveManager.save(gameState);
    updateUI();
}

function levelUp() {
    var p = gameState.player;
    if (!p) return;

    p.exp -= p.maxExp;
    p.level++;
    p.maxExp = Math.floor(p.maxExp * 1.5);
    p.statPoints = (p.statPoints || 0) + 5;

    recalculatePlayerStats();

    p.hp = p.maxHp;
    p.mp = p.maxMp;

    logMessage('🎉 <span class="text-amber-400 font-bold">LÊN CẤP ' + p.level + '!</span> Nhận 5 Điểm tiềm năng và hồi phục toàn bộ HP/MP.');
}

function checkPlayerName() {
    var modal = document.getElementById('character-modal');
    if (!modal) return;
    if (!gameState.player || !gameState.player.name || gameState.player.name.trim() === "") {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

var selectedAvatarPath = "images/avatars/warrior_m.png";
var selectedClassName = "Chiến Binh";

var classDataMap = {
    warrior_m: { name: "Chiến Binh", gender: "Nam", lore: "Dũng cảm và kiên định.", strength: "HP và thủ tốt", weaknesses: "Kém cơ động tầm xa", img: "images/avatars/warrior_m.png" },
    warrior_f: { name: "Chiến Binh", gender: "Nữ", lore: "Sắt đá và uy lực.", strength: "Sát thương cận chiến ổn", weaknesses: "Kháng phép trung bình", img: "images/avatars/warrior_f.png" },
    archer_m: { name: "Xạ Thủ", gender: "Nam", lore: "Mắt diều hâu bách phát.", strength: "Tầm xa, chí mạng cao", weaknesses: "Máu ít", img: "images/avatars/archer_m.png" },
    archer_f: { name: "Xạ Thủ", gender: "Nữ", lore: "Nhanh nhẹn như gió.", strength: "Tốc độ linh hoạt", weaknesses: "Phòng thủ yếu", img: "images/avatars/archer_f.png" },
    bard_m: { name: "Nhạc Công", gender: "Nam", lore: "Tiếng đàn lay động.", strength: "Hỗ trợ tốt", weaknesses: "Sát thương đơn lẻ thấp", img: "images/avatars/bard_m.png" },
    bard_f: { name: "Nhạc Công", gender: "Nữ", lore: "Khúc ca xoa dịu.", strength: "Hồi phục linh hoạt", weaknesses: "Thiếu đòn trực diện", img: "images/avatars/bard_f.png" },
    hunter_m: { name: "Thợ Săn", gender: "Nam", lore: "Am hiểu địa hình.", strength: "Sát thương quái dã ngoại cao", weaknesses: "Đông địch kém", img: "images/avatars/hunter_m.png" },
    hunter_f: { name: "Thợ Săn", gender: "Nữ", lore: "Nhạy bén bóng tối.", strength: "Né tránh tốt", weaknesses: "MP thấp", img: "images/avatars/hunter_f.png" },
    wizard: { name: "Pháp Sư", gender: "Nam", lore: "Cổ ngữ nguyên thủy.", strength: "Sát thương phép lớn", weaknesses: "Tốn MP", img: "images/avatars/wizard.png" },
    witch: { name: "Phù Thủy", gender: "Nữ", lore: "Lời nguyền hắc ám.", strength: "Khống chế, dồn sát thương", weaknesses: "Hồi chiêu lâu", img: "images/avatars/witch.png" },
    knight: { name: "Hiệp Sĩ", gender: "Nam", lore: "Thuẫn kiên cố.", strength: "Phòng thủ siêu việt", weaknesses: "Tăng trưởng chậm", img: "images/avatars/knight.png" },
    healer: { name: "Danh Y", gender: "Nữ", lore: "Bàn tay cứu thế.", strength: "Hồi HP mạnh", weaknesses: "Thiếu dứt điểm", img: "images/avatars/healer.png" }
};

window.selectClass = function(classKey, element) {
    var data = classDataMap[classKey];
    if (!data) return;
    selectedAvatarPath = data.img;
    selectedClassName = data.name;

    var items = document.querySelectorAll('.avatar-item');
    items.forEach(function(el) {
        el.classList.remove('border-amber-500', 'scale-105', 'bg-slate-800');
        el.classList.add('border-slate-700', 'bg-slate-900');
    });
    element.classList.remove('border-slate-700', 'bg-slate-900');
    element.classList.add('border-amber-500', 'scale-105', 'bg-slate-800');

    document.getElementById('info-class-name').innerText = '⚔️ Lớp nhân vật: ' + data.name;
    document.getElementById('info-class-gender').innerText = 'Giới tính: ' + data.gender;
    document.getElementById('info-class-lore').innerText = '"' + data.lore + '"';
    document.getElementById('info-class-strengths').innerText = '💪 Mạnh: ' + data.strength;
    document.getElementById('info-class-weaknesses').innerText = '⚠️ Yếu: ' + data.weaknesses;
};

window.createCharacter = function() {
    var nameInput = document.getElementById('player-name-input');
    var playerName = nameInput ? nameInput.value.trim() : "";
    if (!playerName) { alert("Vui lòng nhập tên cho pháp sư!"); return; }

    if (!gameState.player) {
        gameState.player = {};
    }

    gameState.player.name = playerName;
    gameState.player.avatar = selectedAvatarPath;
    gameState.player.className = selectedClassName;

    if (!gameState.player.stats) {
        gameState.player.stats = {
            atk: 10, def: 5, spd: 8, agi: 5, mdef: 5, mag: 5, crit: 5, str: 8, spi: 8
        };
        gameState.player.level = 1;
        gameState.player.exp = 0;
        gameState.player.maxExp = 100;
        gameState.player.hp = 100;
        gameState.player.maxHp = 100;
        gameState.player.mp = 50;
        gameState.player.maxMp = 50;
        gameState.player.statPoints = 0;
    }

    SaveManager.save(gameState);
    updateUI();

    var modal = document.getElementById('character-modal');
    if (modal) modal.classList.add('hidden');

    logMessage('🎉 Chào mừng pháp sư <span class="text-amber-300">' + playerName + '</span> bước vào thế giới pháp thuật!');
};

// ==========================================
// 4. HÀNH ĐỘNG, SĂN BẮN & CHIẾN ĐẤU (COMBAT)
// ==========================================

// Cập nhật lại khởi tạo currentCombat trong logic.js
var currentCombat = {
    active: false, monsterName: "", monsterType: "normal",
    monsterHp: 100, monsterMaxHp: 100, monsterAtk: 10, monsterDef: 2,
    turn: 1, maxTurns: 20,
    playerBuffs: {
        damageReduction: 0, // Lưu % giảm sát thương nhận vào
        remainingTurns: 0   // Số hiệp còn lại của hiệu ứng
    }
};


function doAction(type) {
    var cooldownSeconds = (type === 'hunt') ? 5 : 10;
    var btn = document.getElementById('btn-' + type);
    var cdText = document.getElementById('cd-' + type);
    var now = Date.now();
    var timeLeft = (actionCooldowns[type] || 0) + cooldownSeconds * 1000 - now;

    if (timeLeft > 0) {
        logMessage('⏳ Vui lòng đợi thêm ' + Math.ceil(timeLeft / 1000) + 's!');
        return;
    }
    if (gameState.stamina <= 0) { logMessage('❌ Năng lượng đã cạn!'); return; }

    actionCooldowns[type] = Date.now();
    if (btn) { btn.disabled = true; btn.classList.add('opacity-50', 'cursor-not-allowed'); }

    var timerInterval = setInterval(function() {
        var remaining = (actionCooldowns[type] + cooldownSeconds * 1000) - Date.now();
        if (remaining <= 0) {
            clearInterval(timerInterval);
            if (btn) { btn.disabled = false; btn.classList.remove('opacity-50', 'cursor-not-allowed'); }
            if (cdText) cdText.innerText = 'Tiêu hao 1 ⚡';
        } else if (cdText) {
            cdText.innerText = 'Chờ ' + (remaining / 1000).toFixed(1) + 's';
        }
    }, 100);

    var mapsSource = (typeof gameMaps !== 'undefined') ? gameMaps : {};
    var currentMap = mapsSource[gameState.currentMap] || {
        normalMonster: "Quái vật rừng",
        endemicMonster: "Thú hoang nguy hiểm",
        boss: "Trùm Thủ Lĩnh",
        commonItem: { name: 'Thảo mộc', price: 15, image: 'images/herb.png' },
        exclusiveItem: { name: 'Nấm Cổ', price: 50, image: 'images/mushroom.png' }
    };

    if (actionHandlers[type]) actionHandlers[type](currentMap);
}

var actionHandlers = {
        hunt: function(currentMap) {
        gameState.stamina -= 1;
        saveGame();
        updateUI();

        if (Math.random() < 0.1) {
            logMessage('🌿 Khu vực khá yên tĩnh.');
            return;
        }

        var statsTable = currentMap.monsterStats || {
            normal: { hp: 40, atk: 12, def: 2 },
            endemic: { hp: 80, atk: 18, def: 4 },
            boss: { hp: 200, atk: 30, def: 8 }
        };

        var r = Math.random();
        var mName = currentMap.normalMonster, mType = "normal";
        var baseStats = statsTable.normal;
        var rewardMultiplier = 1.0; // Hệ số nhân thưởng cho quái đặc biệt

        // Phân loại quái: Thường, Đặc hữu hoặc Boss
        if (r >= 0.7 && r < 0.95) {
            mName = currentMap.endemicMonster;
            mType = "endemic";
            baseStats = statsTable.endemic;
            rewardMultiplier = 2.5;
        } else if (r >= 0.95) {
            mName = currentMap.boss;
            mType = "boss";
            baseStats = statsTable.boss;
            rewardMultiplier = 10.0;
        }

        // 👉 XỬ LÝ ĐẶC TÍNH NGẪU NHIÊN CHO QUÁI THƯỜNG VÀ ĐẶC HỮU (TRỪ BOSS)
        var affix = "";
        var hp = baseStats.hp;
        var atk = baseStats.atk;
        var def = baseStats.def;

        if (mType !== "boss") {
            var affixRand = Math.random();
            if (affixRand < 0.20) {
                // 20% Tỷ lệ quái Suy yếu
                affix = " [Suy]";
                hp = Math.floor(hp * 0.8);
                atk = Math.floor(atk * 0.8);
                def = Math.floor(def * 0.8);
                rewardMultiplier *= 0.8;
            } else if (affixRand >= 0.20 && affixRand < 0.50) {
                // 30% Tỷ lệ quái Cường hoá
                affix = " [Cường]";
                hp = Math.floor(hp * 1.25);
                atk = Math.floor(atk * 1.25);
                def = Math.floor(def * 1.25);
                rewardMultiplier *= 1.3;
            } else if (affixRand >= 0.50 && affixRand < 0.65) {
                // 15% Tỷ lệ quái Biến dị (rất mạnh)
                affix = " [Dị]";
                hp = Math.floor(hp * 1.55);
                atk = Math.floor(atk * 1.55);
                def = Math.floor(def * 1.55);
                rewardMultiplier *= 1.8;
            }
            // 35% còn lại giữ nguyên bản (không có tiền tố)
        }

        var finalMonsterName = mName + affix;

                currentCombat = {
            active: true, 
            monsterName: finalMonsterName, 
            monsterType: mType,
            monsterHp: hp, 
            monsterMaxHp: hp, 
            monsterAtk: atk, 
            monsterDef: def,
            rewardMultiplier: rewardMultiplier,
            turn: 1, 
            maxTurns: 20,
            playerBuffs: { // 👉 THÊM KHỐI NÀY ĐỂ TRÁNH LỖI REMAININGTURNS
                damageReduction: 0,
                remainingTurns: 0
            }
        };
        openCombatModal();
    },
    gather: function(currentMap) {
        gameState.stamina -= 1;
        var common = currentMap.commonItem || { name: 'Thảo mộc', price: 15, image: 'images/collections/herb.png' };
        var exclusive = currentMap.exclusiveItem || { name: 'Nấm Cổ', price: 50, image: 'images/collections/mushroom.png' };
        var item = (Math.random() < 0.3) ? exclusive : common;

        var existing = gameState.inventory.find(function(i) { return i.name === item.name; });
        if (existing) { existing.count = (existing.count || 1) + 1; }
        else { gameState.inventory.push({ name: item.name, price: item.price, image: item.image, count: 1 }); }

        logMessage('🌿 Thu thập được <span class="text-amber-300">' + item.name + '</span>.');
        SaveManager.save(gameState);
        updateUI();
    }
};

function openCombatModal() {
    // Đảm bảo trong hàm openCombatModal (hoặc ở skills.js nếu cần) có đoạn reset này:
skillCooldowns = {}; // Reset toàn bộ thời gian chờ khi vừa gặp quái mới

    var modal = document.getElementById('combat-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.getElementById('combat-title').innerText = '⚔️ Chạm trán: ' + currentCombat.monsterName;
    document.getElementById('combat-player-avatar').src = gameState.player.avatar;
    document.getElementById('combat-player-name').innerText = gameState.player.name;
    document.getElementById('combat-monster-name').innerText = currentCombat.monsterName;
    document.getElementById('combat-log').innerHTML = '<p class="text-amber-400">> Phát hiện <span class="font-bold">' + currentCombat.monsterName + '</span>!</p>';
    
    // 👉 GỌI HÀM RENDER KỸ NĂNG TƯƠNG TỨC THEO CẤP ĐỘ Ở ĐÂY:
    if (typeof renderCombatSkills === 'function') {
        renderCombatSkills();
    }

    updateCombatUI();
}

function updateCombatUI() {
    document.getElementById('combat-player-hp').innerText = gameState.player.hp;
    document.getElementById('combat-player-max-hp').innerText = gameState.player.maxHp;
    
    // Bổ sung cập nhật MP cho player trong bảng combat
    var elMp = document.getElementById('combat-player-mp');
    var elMaxMp = document.getElementById('combat-player-max-mp');
    if (elMp) elMp.innerText = gameState.player.mp;
    if (elMaxMp) elMaxMp.innerText = gameState.player.maxMp;

    document.getElementById('combat-player-hp-bar').style.width = Math.max(0, (gameState.player.hp / gameState.player.maxHp) * 100) + '%';
    document.getElementById('combat-monster-hp').innerText = currentCombat.monsterHp;
    document.getElementById('combat-monster-max-hp').innerText = currentCombat.monsterMaxHp;
    document.getElementById('combat-monster-hp-bar').style.width = Math.max(0, (currentCombat.monsterHp / currentCombat.monsterMaxHp) * 100) + '%';
    document.getElementById('combat-turn-badge').innerText = 'Lượt: ' + currentCombat.turn + '/' + currentCombat.maxTurns;
}


function calculateNormalAttack(attackerStats, defenderStats) {
    var rawDamage = (attackerStats.mag > attackerStats.atk) ? attackerStats.mag : attackerStats.atk;
    var dodgeChance = (defenderStats.spd || 0) * 0.0001; 
    if (Math.random() < dodgeChance) {
        return { damage: 0, isDodged: true, isCrit: false };
    }

    var defense = (attackerStats.mag > attackerStats.atk) ? (defenderStats.mdef || 0) : (defenderStats.def || 0);
    var netDamage = Math.max(1, rawDamage - defense);

    var critChance = attackerStats.crit || 0; 
    var isCrit = false;
    var critMultiplier = 1.5; 

    if (critChance > 75) {
        var extraCrit = critChance - 75;
        critMultiplier = Math.min(3.0, 1.5 + (extraCrit * 0.02)); 
        critChance = 75; 
    }

    if (Math.random() * 100 < critChance) {
        isCrit = true;
        netDamage = Math.floor(netDamage * critMultiplier);
    }

    return { damage: netDamage, isDodged: false, isCrit: isCrit, critMultiplier: critMultiplier };
}

function executeCombatTurn() {
    if (!currentCombat.active) return;

// Giảm thời gian hồi chiêu kỹ năng ở đầu lượt hành động
for (var key in skillCooldowns) {
    if (skillCooldowns[key] > 0) {
        skillCooldowns[key]--;
    }
}

    var logBox = document.getElementById('combat-log');
    var monsterStats = {
        atk: currentCombat.monsterAtk,
        def: currentCombat.monsterDef,
        mdef: currentCombat.monsterDef,
        spd: 5
    };

    var playerAttackResult = calculateNormalAttack(gameState.player.stats, monsterStats);
    var playerDmg = playerAttackResult.damage;

    if (playerAttackResult.isDodged) {
        playerDmg = 0;
    }

    currentCombat.monsterHp -= playerDmg;

    var monsterDmg = Math.max(1, currentCombat.monsterAtk - (gameState.player.stats.def || gameState.player.def) + Math.floor(Math.random() * 3));
    gameState.player.hp -= monsterDmg;

    if (playerAttackResult.isDodged) {
        logBox.innerHTML += '<p class="text-cyan-300">> [Lượt ' + currentCombat.turn + '] ' + currentCombat.monsterName + ' đã né được đòn đánh của bạn!</p>';
    } else {
        var critText = playerAttackResult.isCrit ? ' <span class="text-amber-400 font-bold">(CHÍ MẠNG x' + playerAttackResult.critMultiplier.toFixed(1) + ')</span>' : '';
        logBox.innerHTML += '<p class="text-slate-300">> [Lượt ' + currentCombat.turn + '] Bạn gây <span class="text-amber-400">-' + playerDmg + ' HP</span>' + critText + '.</p>';
    }
    
    logBox.innerHTML += '<p class="text-slate-300">> ' + currentCombat.monsterName + ' phản đòn gây <span class="text-red-400">-' + monsterDmg + ' HP</span>.</p>';
    logBox.scrollTop = logBox.scrollHeight;

    if (currentCombat.monsterHp <= 0 && gameState.player.hp > 0) {
        currentCombat.monsterHp = 0;
        updateCombatUI();
        endCombat('win');
        return;
    } else if (gameState.player.hp <= 0) {
        gameState.player.hp = 0;
        updateCombatUI();
        endCombat('lose');
        return;
    }

    currentCombat.turn++;
    if (currentCombat.turn > currentCombat.maxTurns) {
        endCombat('draw');
        return;
    }

    updateCombatUI();
}

function endCombat(result) {
    currentCombat.active = false;
    
    // 👉 Lấy trực tiếp thông tin map hiện tại từ gameState để tránh lỗi "currentMap is not defined"
    var currentMap = (typeof gameMaps !== 'undefined' && gameMaps[gameState.currentMap]) 
        ? gameMaps[gameState.currentMap] 
        : { rewards: { normal: { gold: 15, exp: 20 }, endemic: { gold: 40, exp: 50 }, boss: { gold: 150, exp: 150 } } };

    if (result === 'win') {
        var baseGold = currentCombat.monsterType === 'boss' ? currentMap.rewards.boss.gold : (currentCombat.monsterType === 'endemic' ? currentMap.rewards.endemic.gold : currentMap.rewards.normal.gold);
        var baseExp = currentCombat.monsterType === 'boss' ? currentMap.rewards.boss.exp : (currentCombat.monsterType === 'endemic' ? currentMap.rewards.endemic.exp : currentMap.rewards.normal.exp);

        var multiplier = currentCombat.rewardMultiplier || 1.0;
        var gold = Math.floor(baseGold * multiplier);
        var exp = Math.floor(baseExp * multiplier);

        gameState.gold += gold;
        logMessage('🎉 Tiêu diệt thành công <b>' + currentCombat.monsterName + '</b>! Nhận <span class="text-amber-300">+' + gold + ' Vàng</span>.');
        gainExp(exp);
    } else if (result === 'lose') {
        logMessage('💀 Bạn đã bị hạ gục!');
        gameState.player.hp = 1;
    } else if (result === 'draw') {
        logMessage('🤝 Trận đấu bất phân thắng bại!');
    }

    SaveManager.save(gameState);
    updateUI();
    setTimeout(function() { 
        var combatModal = document.getElementById('combat-modal');
        if (combatModal) combatModal.classList.add('hidden'); 
    }, 2000);
}


function fleeCombat() {
    if (!currentCombat.active) return;
    currentCombat.active = false;
    document.getElementById('combat-modal').classList.add('hidden');
    logMessage('🏃 Tẩu thoát thành công.');
}

function unlockAvailableSkills(player) {
    if (!gameState.skills) gameState.skills = {};
    var classKey = classNameToKeyMap[player.className || "Chiến Binh"] || "warrior";
    var list = classSkills[classKey] || [];
    for (var i = 0; i < list.length; i++) {
        if (player.level >= list[i].levelReq) {
            gameState.skills[list[i].id] = true;
        }
    }
}


// ==========================================
// 5. CỬA HÀNG, TÚI ĐỒ & GIAO DỊCH
// ==========================================

function buyShopItem(itemId) {
    // 1. Tìm item từ mảng cấu hình (hoặc chuyển sang dạng Map/Object Dictionary nếu cần tối ưu tốc độ O(1) cho hàng chục ngàn item)
    var item = shopItems.find(function(i) { return i.id === itemId; });
    
    if (!item) {
        logMessage('❌ Vật phẩm không tồn tại trong hệ thống cửa hàng!');
        return;
    }

    // 2. Kiểm tra tiền chung cho mọi loại item
    if (gameState.gold < item.price) {
        logMessage('❌ Không đủ Vàng để mua ' + item.name + '! (Cần ' + item.price + ' 💰)');
        return;
    }

    // 3. Xử lý logic động dựa trên `type` của vật phẩm
    if (item.type === 'stamina') {
        var maxLimit = gameState.maxStamina || 20;
        if (gameState.stamina >= maxLimit) {
            logMessage('⚠️ Năng lượng của anh đang đầy, chưa cần dùng thuốc!');
            return;
        }
        gameState.gold -= item.price;
        gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + item.value);
        logMessage('🧪 Đã mua thành công <span class="text-amber-300">' + item.name + '</span>, hồi phục +' + item.value + ' ⚡.');
    } 
    else if (item.type === 'hp_percent') {
        if (gameState.player.hp >= gameState.player.maxHp) {
            logMessage('⚠️ Máu của nhân vật đang đầy, chưa cần dùng thuốc!');
            return;
        }

        // Tính toán lượng hồi phục dựa trên phần trăm HP tối đa
        var healAmount = Math.floor(gameState.player.maxHp * item.value);
        
        gameState.gold -= item.price;
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

        logMessage('❤️ Đã mua thành công <span class="text-rose-300">' + item.name + '</span>, hồi phục <span class="text-amber-300">+' + healAmount + ' HP</span> (' + (item.value * 100) + '%).');
    }
    // Nếu sau này có type mới (ví dụ: vũ khí, áo giáp), chỉ cần viết thêm 1 nhánh xử lý hoặc tách hàm riêng mà không làm đụng chạm đến code cũ.

    // 4. Lưu game và làm mới giao diện
    saveGame();
    updateUI();

    var shopModal = document.getElementById('shop-modal');
    if (shopModal && !shopModal.classList.contains('hidden')) {
        toggleShopModal(true);
    }
}

function toggleInventoryModal(isOpen) {
    var modal = document.getElementById('inventory-modal');
    if (modal) modal.classList.toggle('hidden', !isOpen);
    if (isOpen && typeof updateUI === 'function') updateUI();
}

function promptSellItem(index) {
    var item = gameState.inventory[index];
    if (!item) return;

    activeSellIndex = index;
    var currentCount = item.count || 1;

    document.getElementById('sell-modal-title').innerText = 'Thanh lý ' + item.name;
    document.getElementById('sell-modal-name').innerText = item.name;
    document.getElementById('sell-modal-price').innerText = 'Đơn giá: ' + item.price + 'đ / cái';
    document.getElementById('sell-modal-img').src = item.image;
    
    var input = document.getElementById('sell-quantity-input');
    input.value = currentCount;
    input.max = currentCount;

    document.getElementById('sell-modal').classList.remove('hidden');
    input.focus();
}

function closeSellModal() {
    document.getElementById('sell-modal').classList.add('hidden');
    activeSellIndex = null;
}

function confirmSell() {
    if (activeSellIndex === null) return;
    var item = gameState.inventory[activeSellIndex];
    if (!item) return;

    var input = document.getElementById('sell-quantity-input');
    var sellCount = parseInt(input.value);
    var currentCount = item.count || 1;

    if (isNaN(sellCount) || sellCount <= 0 || sellCount > currentCount) {
        logMessage('❌ Số lượng không hợp lệ!');
        return;
    }

    var totalEarned = item.price * sellCount;
    gameState.gold += totalEarned;
    item.count = currentCount - sellCount;

    logMessage('💰 Đã bán <span class="text-amber-300">' + sellCount + 'x ' + item.name + '</span>, thu về +' + totalEarned + ' Vàng.');

    if (item.count <= 0) {
        gameState.inventory.splice(activeSellIndex, 1);
    }

    closeSellModal();
    SaveManager.save(gameState);
    updateUI();
} 

function sellAllItems() {
    if (gameState.inventory.length === 0) return;
    var totalGold = 0;
    for (var k = 0; k < gameState.inventory.length; k++) {
        var item = gameState.inventory[k];
        totalGold += item.price * (item.count || 1);
    }
    gameState.gold += totalGold;
    gameState.inventory = [];
    SaveManager.save(gameState);
    updateUI();
    logMessage('💰 Bán hết đồ, thu về +' + totalGold + ' Vàng.');
}

function adjustSellQty(amount) {
    var input = document.getElementById('sell-quantity-input');
    if (!input) return;
    var current = parseInt(input.value) || 1;
    var max = parseInt(input.max) || 1;
    var newVal = Math.max(1, Math.min(max, current + amount));
    input.value = newVal;
}

function setMaxSellQty() {
    var input = document.getElementById('sell-quantity-input');
    if (!input) return;
    input.value = input.max || 1;
}

// ==========================================
// 6. BẢN ĐỒ, DỊCH CHUYỂN & MÔN PHÁI
// ==========================================

function toggleMapModal(isOpen) {
    var modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.toggle('hidden', !isOpen);
        if (isOpen && typeof renderMapInfo === 'function') renderMapInfo();
    }
}

window.toggleShopModal = function(isOpen) {
    var modal = document.getElementById('shop-modal');
    if (!modal) return;

    if (isOpen) {
        modal.classList.remove('hidden');

        if (typeof gameState !== 'undefined' && gameState.player) {
            var elAvatar = document.getElementById('shop-player-avatar');
            var elName = document.getElementById('shop-player-name');
            var elGold = document.getElementById('shop-player-gold');
            var elHp = document.getElementById('shop-player-hp');
            var elMaxHp = document.getElementById('shop-player-max-hp');
            var elHpBar = document.getElementById('shop-player-hp-bar');
            var elStamina = document.getElementById('shop-player-stamina');
            var elMaxStamina = document.getElementById('shop-player-max-stamina');

            if (elAvatar && gameState.player.avatar) elAvatar.src = gameState.player.avatar;
            if (elName) elName.innerText = gameState.player.name || "Pháp Sư";
            if (elGold) elGold.innerText = gameState.gold;
            if (elHp) elHp.innerText = gameState.player.hp;
            if (elMaxHp) elMaxHp.innerText = gameState.player.maxHp;
            
            if (elHpBar && gameState.player.maxHp > 0) {
                var hpPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
                hpPercent = Math.max(0, Math.min(100, hpPercent));
                elHpBar.style.width = hpPercent + '%';
            }
            
            if (elStamina) elStamina.innerText = gameState.stamina;
            if (elMaxStamina) elMaxStamina.innerText = gameState.maxStamina;
        }
    } else {
        modal.classList.add('hidden');
    }
};

var classToSectMap = {
    "Chiến Binh": "sect_phong_linh",
    "Nhạc Công": "sect_anh_vu",
    "Thợ Săn": "sect_hien_vien",
    "Xạ Thủ": "sect_ma_loc",
    "Phù Thủy": "sect_kim_mien",
    "Pháp Sư": "sect_vo_cuc",
    "Danh Y": "sect_vinh_da",
    "Hiệp Sĩ": "sect_hac_nham"
};

function teleportToMySect() {
    var className = gameState.player && gameState.player.className ? gameState.player.className : "Chiến Binh";
    var sectMapId = classToSectMap[className] || "sect_phong_linh";
    
    if (gameState.currentMap === sectMapId) {
        logMessage("⚠️ Bạn đang ở Tổng Đà Môn Phái rồi, không cần dùng Truyền Tống Phù!");
        return;
    }

    var fee = 100;
    if (gameState.gold < fee) {
        logMessage("❌ Cần ít nhất " + fee + " Vàng để kích hoạt Truyền Tống Phù!");
        return;
    }

    if (!gameState.currentMap.startsWith('sect_')) {
        gameState.previousMap = gameState.currentMap;
    }
    
    gameState.gold -= fee;
    gameState.currentMap = sectMapId;
    saveGame();

    if (typeof updateUI === 'function') updateUI();
    if (typeof renderMapInfo === 'function') renderMapInfo();
    logMessage("✨ Sử dụng Truyền Tống Phù, dịch chuyển về <span class='text-amber-300'>" + gameMaps[sectMapId].name + "</span>!");
}

function teleportTo(targetMapId, fee) {
    if (gameState.gold < fee) {
        logMessage('❌ Không đủ vàng (Cần ' + fee + ' Vàng)!');
        return;
    }
    gameState.gold -= fee;
    gameState.currentMap = targetMapId;
    saveGame();

    if (typeof updateUI === 'function') updateUI();
    if (typeof renderMapInfo === 'function') renderMapInfo();
    logMessage('✨ Dịch chuyển đến ' + gameMaps[targetMapId].name + '!');
}


// ==========================================
// 7. PHÂN BỔ CHỈ SỐ & TIỆN ÍCH (LOG, TOAST, STAMINA)
// ==========================================

function toggleStatModal(isOpen) {
    var modal = document.getElementById('stat-modal');
    if (modal) {
        if (isOpen) {
            modal.classList.remove('hidden');
            if (typeof updateStatModalUI === 'function') updateStatModalUI();
        } else {
            modal.classList.add('hidden');
        }
    }
}

function updateStatModalUI() {
    if (!gameState.player.stats) return;

    var elPoints = document.getElementById('modal-available-points');
    if (elPoints) {
        elPoints.innerText = gameState.player.statPoints || 0;
    }

    var stats = ['str', 'spi', 'atk', 'def', 'spd', 'agi', 'mdef', 'mag', 'crit'];
    stats.forEach(function(st) {
        var el = document.getElementById('modal-stat-' + st);
        if (el) el.innerText = gameState.player.stats[st] || 0;
    });
}

function allocateStat(statKey) {
    if (!gameState.player.statPoints || gameState.player.statPoints <= 0) {
        logMessage('⚠️ Bạn không còn điểm tiềm năng nào chưa sử dụng!');
        return;
    }
    
    if (!gameState.player.stats) {
        gameState.player.stats = { atk: 10, def: 5, spd: 8, agi: 5, mdef: 5, mag: 5, crit: 5, str: 8, spi: 8 };
    }

    var oldMaxHp = gameState.player.maxHp || 100;
    var oldMaxMp = gameState.player.maxMp || 50;

    gameState.player.statPoints--;
    gameState.player.stats[statKey] = (gameState.player.stats[statKey] || 0) + 1;

    recalculatePlayerStats();

    if (statKey === 'str') {
        gameState.player.hp += (gameState.player.maxHp - oldMaxHp);
    } else if (statKey === 'spi') {
        gameState.player.mp += (gameState.player.maxMp - oldMaxMp);
    }

    SaveManager.save(gameState);
    
    if (typeof updateUI === 'function') updateUI();
    if (typeof updateStatModalUI === 'function') updateStatModalUI();
    
    logMessage('✨ Đã tăng 1 điểm cho <span class="text-amber-300 uppercase">' + statKey + '</span>!');
}

var MAX_LOG_ENTRIES = 50;

function logMessage(text) {
    var logContainer = document.getElementById('action-log');
    if (logContainer) {
        var p = document.createElement('p');
        p.innerHTML = '> ' + text;
        logContainer.insertBefore(p, logContainer.firstChild);
        var logEntries = logContainer.getElementsByTagName('p');
        if (logEntries.length > MAX_LOG_ENTRIES) {
            for (var i = logEntries.length - 1; i >= MAX_LOG_ENTRIES; i--) {
                logEntries[i].remove();
            }
        }
    }
    showFloatingToast(text);
}

function clearActionLog() {
    var logContainer = document.getElementById('action-log');
    if (logContainer) {
        logContainer.innerHTML = '<p class="text-slate-500 italic">> Nhật ký đã được làm trống...</p>';
        showFloatingToast('🗑️ Đã xóa sạch nhật ký phiêu lưu.');
    }
}

function showFloatingToast(text) {
    var container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4';
        document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'bg-slate-900/95 border border-amber-500/70 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium tracking-wide transition-all duration-300 opacity-0 translate-y-[-10px] text-center pointer-events-auto';
    toast.innerHTML = '> ' + text;
    container.appendChild(toast);
    setTimeout(function() {
        toast.classList.remove('opacity-0', 'translate-y-[-10px]');
        toast.classList.add('opacity-100', 'translate-y-0');
    }, 10);
    setTimeout(function() {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

var STAMINA_REGEN_TIME = 60 * 1000;

function checkStaminaRegen() {
    if (!gameState) return;
    if (!gameState.lastStaminaTime) gameState.lastStaminaTime = Date.now();
    var now = Date.now();
    var elapsed = now - gameState.lastStaminaTime;
    var timerEl = document.getElementById('stamina-timer');

    if (gameState.stamina < gameState.maxStamina) {
        var timeLeft = STAMINA_REGEN_TIME - (elapsed % STAMINA_REGEN_TIME);
        var secondsLeft = Math.ceil(timeLeft / 1000);
        if (timerEl) timerEl.innerText = '⏱️ ' + secondsLeft + 's';

        if (elapsed >= STAMINA_REGEN_TIME) {
            var pointsToAdd = Math.floor(elapsed / STAMINA_REGEN_TIME);
            gameState.stamina = Math.min(gameState.maxStamina, gameState.stamina + pointsToAdd);
            gameState.lastStaminaTime = now - (elapsed % STAMINA_REGEN_TIME);
            saveGame();
            updateUI();
        }
    } else {
        gameState.lastStaminaTime = now;
        if (timerEl) timerEl.innerText = 'Đầy ⚡';
    }
}
setInterval(checkStaminaRegen, 1000);

function resetGameProgress() {
    if (!confirm("⚠️ Bạn có chắc chắn muốn xóa tiến trình và TẠO LẠI NHÂN VẬT mới không?")) {
        return;
    }

    localStorage.removeItem('magic_academy_save');
    localStorage.removeItem('gameState');
    if (currentUserId) {
        localStorage.removeItem('magical_school_state_' + currentUserId);
    }

    gameState = getDefaultGameState();
    recalculatePlayerStats();
    SaveManager.save(gameState);

    var modals = document.querySelectorAll('.fixed');
    modals.forEach(function(m) {
        m.classList.add('hidden');
    });

    if (typeof updateUI === 'function') updateUI();
    if (typeof checkPlayerName === 'function') checkPlayerName();

    logMessage('🔄 <span class="text-red-400 font-bold">Đã reset tiến trình thành công! Vui lòng tạo nhân vật mới.</span>');
}
// Mở / Đóng Modal Hồ Sơ Nhân Vật
function togglePlayerProfileModal(isOpen) {
    var modal = document.getElementById('player-profile-modal');
    if (!modal) return;

    if (isOpen) {
        modal.classList.remove('hidden');
        updateProfileModalUI();
    } else {
        modal.classList.add('hidden');
    }
}

// Đồng bộ và hiển thị dữ liệu chi tiết vào Modal Hồ Sơ
function updateProfileModalUI() {
    var p = gameState.player;
    if (!p) return;

    // Thông tin cơ bản
    document.getElementById('profile-avatar').src = p.avatar || "images/avatars/warrior_m.png";
    document.getElementById('profile-name').innerText = p.name || "Pháp Sư Tập Sự";
    document.getElementById('profile-level').innerText = p.level || 1;
    document.getElementById('profile-class').innerText = p.className || "Chiến Binh";
    document.getElementById('profile-gold').innerText = gameState.gold.toLocaleString();

    // Thanh trạng thái HP, MP, Stamina
    document.getElementById('profile-hp').innerText = p.hp;
    document.getElementById('profile-max-hp').innerText = p.maxHp;
    document.getElementById('profile-hp-bar').style.width = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100)) + '%';

    document.getElementById('profile-mp').innerText = p.mp;
    document.getElementById('profile-max-mp').innerText = p.maxMp;
    document.getElementById('profile-mp-bar').style.width = Math.max(0, Math.min(100, (p.mp / p.maxMp) * 100)) + '%';

    document.getElementById('profile-stamina').innerText = gameState.stamina;
    document.getElementById('profile-max-stamina').innerText = gameState.maxStamina;

    // Chỉ số chiến đấu
    var stats = p.stats || {};
    document.getElementById('profile-stat-atk').innerText = stats.atk || p.atk || 10;
    document.getElementById('profile-stat-def').innerText = stats.def || p.def || 5;
    document.getElementById('profile-stat-mag').innerText = stats.mag || 5;
    document.getElementById('profile-stat-mdef').innerText = stats.mdef || 5;
    document.getElementById('profile-stat-agi').innerText = stats.agi || 5;
    document.getElementById('profile-stat-spd').innerText = stats.spd || 8;
    document.getElementById('profile-stat-crit').innerText = (stats.crit || 5) + '%';
    document.getElementById('profile-stat-points').innerText = p.statPoints || 0;

    // Liệt kê kỹ năng đã học
    var skillsContainer = document.getElementById('profile-skills-list');
    if (skillsContainer) {
        var className = p.className || "Chiến Binh";
        var classKey = classNameToKeyMap[className] || "warrior";
        var allSkills = classSkills[classKey] || [];
        var learnedSkills = gameState.skills || {};

        var html = '';
        var hasLearnedAny = false;

        for (var i = 0; i < allSkills.length; i++) {
            var skill = allSkills[i];
            if (learnedSkills[skill.id]) {
                hasLearnedAny = true;
                html += '<div class="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center gap-2">' +
                        '<div class="min-w-0">' +
                        '<p class="text-xs font-bold text-purple-300 truncate">' + skill.name + '</p>' +
                        '<p class="text-[10px] text-slate-400">' + skill.desc + '</p>' +
                        '</div>' +
                        '<span class="flex-shrink-0 text-[10px] text-cyan-300 font-mono bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800">' + skill.mpCost + ' MP</span>' +
                        '</div>';
            }
        }

        if (!hasLearnedAny) {
            html = '<p class="text-slate-500 italic text-xs text-center py-4">Bạn chưa lĩnh hội kỹ năng nào. Hãy đến Môn Phái để học nhé!</p>';
        }

        skillsContainer.innerHTML = html;
    }
}
