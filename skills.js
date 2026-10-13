// skills.js - Hệ thống kỹ năng toàn bộ các Class tích hợp cơ chế Hồi chiêu (Cooldown)

// skills.js - Hệ thống kỹ năng toàn bộ các Class tích hợp chi phí Vàng học kỹ năng
var classNameToKeyMap = {
    "Chiến Binh": "warrior",
    "Nhạc Công": "bard",
    "Thợ Săn": "hunter",
    "Xạ Thủ": "archer",
    "Phù Thủy": "witch",
    "Pháp Sư": "wizard",
    "Danh Y": "healer",
    "Hiệp Sĩ": "knight"
};

var classSkills = {
    // 1. CHIẾN BINH
    warrior: [
        { id: "wind_fist", name: "Phong Linh Quyền", levelReq: 1, goldCost: 0, mpCost: 10, cooldown: 0, multiplier: 1.5, desc: "Đòn đánh bộc phát kình phong, gây (ATK + 150% ATK) sát thương." },
        { id: "wind_warrior_stance", name: "Chiến Sĩ Phong Linh", levelReq: 5, goldCost: 500, mpCost: 15, cooldown: 3, duration: 3, reduction: 0.30, desc: "Giảm 30% sát thương nhận vào trong 3 hiệp. (Hồi chiêu: 3 hiệp)" },
        { id: "whirlwind_slash", name: "Toàn Phong Trảm", levelReq: 10, goldCost: 2000, mpCost: 20, cooldown: 2, strMulti: 2.0, spdMulti: 1.5, critChance: 30, desc: "Tạo lốc kiếm khí gây sát thương lớn. (Hồi chiêu: 2 hiệp)" },
        { id: "four_direction_wind", name: "Tứ Diện Phong Sát", levelReq: 30, goldCost: 10000, mpCost: 35, cooldown: 5, multiplier: 5.0, executeThreshold: 0.10, desc: "Tuyệt chiêu 500% ATK bỏ qua phòng thủ. Kết liễu ngay nếu HP < 10%. (Hồi chiêu: 5 hiệp)" }
    ],

    // 2. NHẠC CÔNG
    bard: [
        { id: "soothing_melody", name: "Khúc Ca Thanh Tẩy", levelReq: 1, goldCost: 0, mpCost: 10, cooldown: 1, healPercent: 0.25, desc: "Hồi phục 25% HP tối đa. (Hồi chiêu: 1 hiệp)" },
        { id: "harmony_shield", name: "Vũ Điệu Anh Vũ", levelReq: 5, goldCost: 500, mpCost: 15, cooldown: 3, duration: 3, mdefBonus: 10, desc: "Tăng mạnh kháng phép trong 3 hiệp. (Hồi chiêu: 3 hiệp)" },
        { id: "sonic_boom", name: "Sóng Âm Cuồng Nộ", levelReq: 10, goldCost: 2000, mpCost: 22, cooldown: 2, magMulti: 3.2, desc: "Gây sát thương phép thuật lớn. (Hồi chiêu: 2 hiệp)" },
        { id: "requiem_of_light", name: "Thanh Âm Vĩnh Cửu", levelReq: 30, goldCost: 10000, mpCost: 40, cooldown: 5, multiplier: 4.5, desc: "Khúc ca hủy diệt gây 450% MAG. (Hồi chiêu: 5 hiệp)" }
    ],

    // 3. THỢ SĂN
    hunter: [
        { id: "precision_shot", name: "Phục Kích Chuẩn Xác", levelReq: 1, goldCost: 0, mpCost: 10, cooldown: 0, multiplier: 1.6, desc: "Bắn lén gây sát thương vật lý." },
        { id: "hunter_trap", name: "Bẫy Rừng Hoang Dã", levelReq: 5, goldCost: 500, mpCost: 15, cooldown: 3, duration: 2, desc: "Gây tổn thương liên tục trong 2 hiệp. (Hồi chiêu: 3 hiệp)" },
        { id: "beast_instinct", name: "Bản Năng Săn Mồi", levelReq: 10, goldCost: 2000, mpCost: 20, cooldown: 4, desc: "Tăng mạnh nhanh nhẹn và chí mạng. (Hồi chiêu: 4 hiệp)" },
        { id: "ultimate_hunt", name: "Tận Diệt Thú Vương", levelReq: 30, goldCost: 10000, mpCost: 35, cooldown: 5, multiplier: 5.2, desc: "Mũi tên định mệnh 520% không thể né. (Hồi chiêu: 5 hiệp)" }
    ],

    // 4. XẠ THỦ
    archer: [
        { id: "hawk_eye", name: "Mắt Diều Hâu", levelReq: 1, goldCost: 0, mpCost: 10, cooldown: 0, multiplier: 1.7, desc: "Ngắm bắn chuẩn xác gây sát thương." },
        { id: "piercing_arrow", name: "Mũi Tên Xuyên Giáp", levelReq: 5, goldCost: 500, mpCost: 16, cooldown: 2, defIgnore: 0.4, desc: "Bỏ qua 40% phòng thủ. (Hồi chiêu: 2 hiệp)" },
        { id: "rapid_fire", name: "Liên Châu Tiễn", levelReq: 10, goldCost: 2000, mpCost: 25, cooldown: 3, hits: 3, desc: "Bắn liên tiếp 3 mũi tên. (Hồi chiêu: 3 hiệp)" },
        { id: "god_bow", name: "Thần Tiễn Phá Không", levelReq: 30, goldCost: 10000, mpCost: 38, cooldown: 5, multiplier: 5.5, desc: "Tuyệt kỹ 550% ATK chí mạng 100%. (Hồi chiêu: 5 hiệp)" }
    ],

    // 5. PHÙ THỦY
    witch: [
        { id: "dark_bolt", name: "Hắc Hỏa Tiễn", levelReq: 1, goldCost: 0, mpCost: 12, cooldown: 0, multiplier: 1.6, desc: "Phóng đốm lửa hắc ám gây sát thương phép." },
        { id: "curse_weakness", name: "Nguyền Rủa Đát Kỷ", levelReq: 5, goldCost: 500, mpCost: 18, cooldown: 3, duration: 3, desc: "Giảm 25% tấn công mục tiêu. (Hồi chiêu: 3 hiệp)" },
        { id: "shadow_explosion", name: "Bộc Phát Hắc Ám", levelReq: 10, goldCost: 2000, mpCost: 25, cooldown: 2, magMulti: 3.5, desc: "Tạo vụ nổ hắc ám 350% MAG. (Hồi chiêu: 2 hiệp)" },
        { id: "abyssal_hex", name: "Tử Vực Ma Chú", levelReq: 30, goldCost: 10000, mpCost: 45, cooldown: 5, multiplier: 6.0, desc: "Nguyền rủa tận diệt 600% MAG. (Hồi chiêu: 5 hiệp)" }
    ],

    // 6. PHÁP SƯ
    wizard: [
        { id: "elemental_ball", name: "Quả Cầu Nguyên Tố", levelReq: 1, goldCost: 0, mpCost: 12, cooldown: 0, multiplier: 1.7, desc: "Ngưng tụ ma thuật thuần khiết." },
        { id: "mana_shield", name: "Khiên Ma Pháp", levelReq: 5, goldCost: 500, mpCost: 15, cooldown: 4, duration: 3, desc: "Dùng MP hấp thụ 35% sát thương. (Hồi chiêu: 4 hiệp)" },
        { id: "meteor_strike", name: "Hỏa Vũ Thiên Giáng", levelReq: 10, goldCost: 2000, mpCost: 28, cooldown: 3, magMulti: 3.8, desc: "Triệu hồi mưa thiên thạch 380% MAG. (Hồi chiêu: 3 hiệp)" },
        { id: "apocalypse", name: "Hủy Diệt Nguyên Tố", levelReq: 30, goldCost: 10000, mpCost: 50, cooldown: 6, multiplier: 6.2, desc: "Tối thượng ma pháp 620% MAG. (Hồi chiêu: 6 hiệp)" }
    ],

    // 7. DANH Y
    healer: [
        { id: "healing_light", name: "Ánh Sáng Chữa Lành", levelReq: 1, goldCost: 0, mpCost: 12, cooldown: 2, healPercent: 0.35, desc: "Phục hồi 35% HP tối đa. (Hồi chiêu: 2 hiệp)" },
        { id: "sacred_barrier", name: "Hộ Thân Chú", levelReq: 5, goldCost: 500, mpCost: 18, cooldown: 3, duration: 3, desc: "Tăng cường giáp bảo vệ. (Hồi chiêu: 3 hiệp)" },
        { id: "holy_strike", name: "Thánh Quang Phạt", levelReq: 10, goldCost: 2000, mpCost: 22, cooldown: 2, magMulti: 2.8, desc: "Gây sát thương và hút máu. (Hồi chiêu: 2 hiệp)" },
        { id: "divine_resurrection", name: "Phúc Âm Vĩnh Hằng", levelReq: 30, goldCost: 10000, mpCost: 40, cooldown: 6, healPercent: 1.0, desc: "Lập tức hồi phục 100% HP. (Hồi chiêu: 6 hiệp)" }
    ],

    // 8. HIỆP SĨ
    knight: [
        { id: "shield_bash", name: "Khiên Kích", levelReq: 1, goldCost: 0, mpCost: 10, cooldown: 1, defScale: 1.5, desc: "Dùng thuẫn giáng mạnh dựa theo DEF. (Hồi chiêu: 1 hiệp)" },
        { id: "iron_wall", name: "Tường Đồng Vách Sắt", levelReq: 5, goldCost: 500, mpCost: 15, cooldown: 4, duration: 3, desc: "Tăng 40% phòng thủ trong 3 hiệp. (Hồi chiêu: 4 hiệp)" },
        { id: "retaliation", name: "Phản Đòn Kiên Định", levelReq: 10, goldCost: 2000, mpCost: 20, cooldown: 3, reflectPercent: 0.5, desc: "Phản hồi sát thương trong 2 hiệp. (Hồi chiêu: 3 hiệp)" },
        { id: "holy_bastion", name: "Thánh Vực Hắc Nham", levelReq: 30, goldCost: 10000, mpCost: 35, cooldown: 5, multiplier: 4.0, desc: "Hóa thân pháo đài 400% DEF. (Hồi chiêu: 5 hiệp)" }
    ]
};


// Lưu trữ bộ đếm hồi chiêu hiện tại trong trận đấu (Khởi tạo rỗng khi mở combat)
var skillCooldowns = {};

// Mở rộng hàm mở bảng combat để reset hoặc khởi tạo bộ đếm cooldown
function renderCombatSkills() {
    var container = document.getElementById('combat-skills-container');
    if (!container) return;

    var p = gameState.player;
    if (!p) return;

    var className = p.className || "Chiến Binh";
    var classKey = classNameToKeyMap[className] || "warrior";
    var skillsList = classSkills[classKey] || classSkills["warrior"] || [];
    
    var html = '';
    for (var i = 0; i < skillsList.length; i++) {
        var skill = skillsList[i];

        // Kiểm tra xem kỹ năng đã được học (mua bằng vàng) hay chưa
        var isLearned = gameState.skills && gameState.skills[skill.id] === true;

        // Chỉ render khi người chơi đã sở hữu kỹ năng đó
        if (isLearned) {
            var currentCd = skillCooldowns[skill.id] || 0;
            var isDisabled = currentCd > 0;
            
            var btnClass = isDisabled 
                ? "py-1.5 px-2 bg-slate-800 text-slate-500 border border-slate-700 rounded-xl text-[11px] font-bold cursor-not-allowed opacity-60 flex flex-col items-center justify-center" 
                : "py-1.5 px-2 bg-amber-900/60 hover:bg-amber-800 text-amber-300 border border-amber-600/40 rounded-xl text-[11px] font-bold transition-all flex flex-col items-center justify-center";
            
            var cdText = isDisabled ? '⏳ Chờ ' + currentCd + 'h' : '(' + skill.mpCost + ' MP)';

            html += '<button ' + (isDisabled ? 'disabled' : '') + ' onclick="executeSkillTurn(\'' + skill.id + '\')" class="' + btnClass + '">' +
                    '<span>' + skill.name + '</span>' +
                    '<span class="text-[9px] text-cyan-300">' + cdText + '</span>' +
                    '</button>';
        }
    }
    container.innerHTML = html;
}
// Cập nhật hàm thực thi kỹ năng tích hợp trừ hồi chiêu và kích hoạt cooldown
function executeSkillTurn(skillId) {
    if (!currentCombat.active) return;

    var p = gameState.player;
    var className = p.className || "Chiến Binh";
    var classKey = classNameToKeyMap[className] || "warrior";
    var skillsList = classSkills[classKey] || classSkills["warrior"] || [];
    var skill = skillsList.find(function(s) { return s.id === skillId; });

    if (!skill) return;

    // Kiểm tra kỹ năng có đang cooldown không
    if ((skillCooldowns[skill.id] || 0) > 0) {
        logMessage('⏳ Kỹ năng này đang trong thời gian hồi chiêu!');
        return;
    }

    var playerLevel = p.level || 1;
    if (playerLevel < skill.levelReq) {
        logMessage('⚠️ Bạn chưa đạt cấp độ ' + skill.levelReq + ' để sử dụng kỹ năng này!');
        return;
    }

    if (p.mp < skill.mpCost) {
        logMessage('❌ Không đủ Năng lượng (MP)! Cần ' + skill.mpCost + ' MP.');
        return;
    }

    // Kích hoạt thời gian hồi chiêu cho kỹ năng vừa dùng
    skillCooldowns[skill.id] = skill.cooldown || 0;

    p.mp -= skill.mpCost;
    var logBox = document.getElementById('combat-log');
    var finalDamage = 0;

    // Xử lý hồi phục
    if (skill.healPercent) {
        var healVal = Math.floor(p.maxHp * skill.healPercent);
        p.hp = Math.min(p.maxHp, p.hp + healVal);
        logBox.innerHTML += '<p class="text-emerald-300">> [Kỹ năng] Bạn sử dụng <b>' + skill.name + '</b> hồi phục <span class="text-amber-300">+' + healVal + ' HP</span>.</p>';
    }

    // Xử lý sát thương
        // Xử lý sát thương (ví dụ trong nhánh skill.multiplier)
    if (skill.multiplier) {
        var baseStat = (skill.id.includes('dark') || skill.id.includes('elemental') || skill.id.includes('healing')) ? p.mag : p.atk;
        var rawDmg = baseStat + (baseStat * (skill.multiplier - 1));
        
        if (skill.id === 'four_direction_wind') {
            finalDamage = Math.floor(rawDmg);
        } else {
            finalDamage = Math.max(1, Math.floor(rawDmg - currentCombat.monsterDef));
        }
        currentCombat.monsterHp -= finalDamage;
        
        // 👉 THÊM DÒNG NÀY VÀO NGAY SAU KHI TRỪ MÁU QUÁI:
        updateCombatUI(); 

        logBox.innerHTML += '<p class="text-amber-300">> [Kỹ năng] Sử dụng <b>' + skill.name + '</b> gây <span class="text-rose-400">-' + finalDamage + ' HP</span>.</p>';
    } 
    else if (skill.magMulti) {
        var rawDmg = p.mag * skill.magMulti;
        finalDamage = Math.max(1, Math.floor(rawDmg - (currentCombat.monsterDef * 0.8)));
        currentCombat.monsterHp -= finalDamage;
        
        // 👉 THÊM DÒNG NÀY VÀO ĐÂY:
        updateCombatUI();

        logBox.innerHTML += '<p class="text-purple-300">> [Phép thuật] Thi triển <b>' + skill.name + '</b> gây <span class="text-rose-400">-' + finalDamage + ' HP</span>.</p>';
    }
    else if (skill.strMulti && skill.spdMulti) {
        var rawDmg = (p.atk * 2.5) + (p.stats.str * skill.strMulti) + (p.stats.spd * skill.spdMulti);
        finalDamage = Math.max(1, Math.floor(rawDmg - currentCombat.monsterDef));
        currentCombat.monsterHp -= finalDamage;
        
        // 👉 THÊM DÒNG NÀY VÀO ĐÂY:
        updateCombatUI();

        logBox.innerHTML += '<p class="text-amber-400">> [Kỹ năng] Bộc phát <b>' + skill.name + '</b> gây <span class="text-rose-400">-' + finalDamage + ' HP</span>.</p>';
    }
    else if (skill.defScale) {
        var rawDmg = p.def * skill.defScale + p.atk;
        finalDamage = Math.max(1, Math.floor(rawDmg - currentCombat.monsterDef));
        currentCombat.monsterHp -= finalDamage;
        
        // 👉 THÊM DÒNG NÀY VÀO ĐÂY:
        updateCombatUI();

        logBox.innerHTML += '<p class="text-blue-300">> [Kỹ năng] Khiên kích <b>' + skill.name + '</b> gây <span class="text-rose-400">-' + finalDamage + ' HP</span>.</p>';
    }


    if (skill.duration) {
        currentCombat.playerBuffs.damageReduction = skill.reduction || 0.2;
        currentCombat.playerBuffs.remainingTurns = skill.duration;
    }

    // Quái phản đòn nếu chưa chết
    if (currentCombat.monsterHp > 0) {
        var baseMonsterDmg = Math.max(1, currentCombat.monsterAtk - p.def + Math.floor(Math.random() * 3));
        
        if (currentCombat.playerBuffs.remainingTurns > 0) {
            baseMonsterDmg = Math.floor(baseMonsterDmg * (1 - currentCombat.playerBuffs.damageReduction));
            currentCombat.playerBuffs.remainingTurns--;
        }

        p.hp -= baseMonsterDmg;
        logBox.innerHTML += '<p class="text-slate-300">> ' + currentCombat.monsterName + ' phản đòn gây <span class="text-red-400">-' + baseMonsterDmg + ' HP</span>.</p>';
    }

    // --- Ở CUỐI HÀM executeSkillTurn TRONG skills.js ---
    
    // ⏳ GIẢM THỜI GIAN HỒI CHIÊU SAU MỖI LƯỢT ĐÁNH
    for (var key in skillCooldowns) {
        if (skillCooldowns[key] > 0) {
            skillCooldowns[key]--;
        }
    }

    logBox.scrollTop = logBox.scrollHeight;

    if (currentCombat.monsterHp <= 0 && p.hp > 0) {
        currentCombat.monsterHp = 0;
        skillCooldowns = {};
        updateCombatUI();
        updateUI();
        endCombat('win');
        return;
    } else if (p.hp <= 0) {
        p.hp = 0;
        skillCooldowns = {};
        updateCombatUI();
        updateUI();
        endCombat('lose');
        return;
    }

    currentCombat.turn++;
    if (currentCombat.turn > currentCombat.maxTurns) {
        skillCooldowns = {};
        endCombat('draw');
        return;
    }

    // 👉 GỌI LẠI HÀM NÀY ĐỂ CẬP NHẬT TRẠNG THÁI KHÓA/MỞ NÚT NGAY LẬP TỨC:
    renderCombatSkills(); 
    updateCombatUI();
    updateUI();
    saveGame();
}

// Mở / Đóng Modal học kỹ năng
function toggleSkillTrainingModal(isOpen) {
    var modal = document.getElementById('skill-training-modal');
    if (!modal) return;

    if (isOpen) {
        modal.classList.remove('hidden');
        renderSkillTrainingList();
    } else {
        modal.classList.add('hidden');
    }
}

// Thay thế hàm giả lập trước đó bằng hàm mở Modal thực tế
function openSkillTrainingModal() {
    toggleSkillTrainingModal(true);
}

// Render danh sách kỹ năng trong Modal Môn Phái
function renderSkillTrainingList() {
    var container = document.getElementById('skill-training-list');
    var elGold = document.getElementById('skill-modal-player-gold');
    if (!container) return;

    if (elGold) elGold.innerText = gameState.gold.toLocaleString();

    var p = gameState.player;
    if (!p) return;

    var className = p.className || "Chiến Binh";
    var classKey = classNameToKeyMap[className] || "warrior";
    var skillsList = classSkills[classKey] || classSkills["warrior"] || [];

    if (!gameState.skills) gameState.skills = {};

    var html = '';
    for (var i = 0; i < skillsList.length; i++) {
        var skill = skillsList[i];
        var isLearned = gameState.skills[skill.id] === true;
        var canUnlock = p.level >= skill.levelReq;

        var statusBadge = '';
        var actionBtn = '';

        if (isLearned) {
            statusBadge = '<span class="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Đã học</span>';
            actionBtn = '<span class="text-[10px] text-slate-500 font-bold px-3 py-1">Đã sở hữu</span>';
        } else if (canUnlock) {
            statusBadge = '<span class="text-[10px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">Đạt cấp độ yêu cầu</span>';
            actionBtn = '<button onclick="learnSkill(\'' + skill.id + '\')" class="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold rounded-lg transition-all shadow">Học (' + skill.goldCost.toLocaleString() + ' 💰)</button>';
        } else {
            statusBadge = '<span class="text-[10px] text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">Yêu cầu Cấp ' + skill.levelReq + '</span>';
            actionBtn = '<span class="text-[10px] text-slate-500 font-bold px-3 py-1">Chưa đủ cấp</span>';
        }

        html += '<div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center gap-3">' +
                '<div class="flex-1 min-w-0">' +
                '<div class="flex items-center gap-2 mb-1">' +
                '<p class="text-xs font-bold text-purple-300 truncate">' + skill.name + '</p>' +
                statusBadge +
                '</div>' +
                '<p class="text-[10px] text-slate-400 leading-relaxed mb-1">' + skill.desc + '</p>' +
                '</div>' +
                '<div class="flex-shrink-0">' + actionBtn + '</div>' +
                '</div>';
    }

    container.innerHTML = html;
}

// Xử lý học kỹ năng bằng Vàng
function learnSkill(skillId) {
    var p = gameState.player;
    var className = p.className || "Chiến Binh";
    var classKey = classNameToKeyMap[className] || "warrior";
    var skillsList = classSkills[classKey] || classSkills["warrior"] || [];
    var skill = skillsList.find(function(s) { return s.id === skillId; });

    if (!skill) return;
    if (gameState.skills && gameState.skills[skillId]) {
        logMessage('⚠️ Bạn đã học kỹ năng này rồi!');
        return;
    }
    if (p.level < skill.levelReq) {
        logMessage('❌ Cấp độ chưa đạt yêu cầu để học kỹ năng này!');
        return;
    }
    if (gameState.gold < skill.goldCost) {
        logMessage('❌ Không đủ Vàng! Cần ' + skill.goldCost.toLocaleString() + ' Vàng.');
        return;
    }

    // Trừ vàng và mở khóa kỹ năng
    gameState.gold -= skill.goldCost;
    if (!gameState.skills) gameState.skills = {};
    gameState.skills[skillId] = true;

    saveGame();
    updateUI();
    renderSkillTrainingList();

    logMessage('🎉 Chúc mừng! Đã lĩnh hội thành công kỹ năng <span class="text-purple-300 font-bold">' + skill.name + '</span>.');
}
