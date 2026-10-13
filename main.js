// main.js - Quản lý khởi chạy và cập nhật giao diện tổng thể
window.addEventListener('DOMContentLoaded', function() {
    updateUI();
});

function updateUI() {
    var elGold = document.getElementById('player-gold');
    var elStamina = document.getElementById('player-stamina');
    var elMaxStamina = document.getElementById('player-max-stamina');
    var elMapName = document.getElementById('current-map-name');
    
    if (elGold) elGold.innerText = gameState.gold;
    if (elStamina) elStamina.innerText = gameState.stamina;
    if (elMaxStamina) elMaxStamina.innerText = gameState.maxStamina;
    if (elMapName && gameMaps[gameState.currentMap]) {
        elMapName.innerText = gameMaps[gameState.currentMap].name;
    }

    if (gameState.player) {
        var elAvatar = document.getElementById('player-avatar-header');
        var elName = document.getElementById('player-name-display');
        var elLevel = document.getElementById('player-level');
        var elClassName = document.getElementById('player-class-name');
        
        if (elAvatar && gameState.player.avatar) elAvatar.src = gameState.player.avatar;
        if (elName) elName.innerText = gameState.player.name || "Pháp Sư Tập Sự";
        if (elLevel) elLevel.innerText = gameState.player.level;
        if (elClassName) elClassName.innerText = gameState.player.className || "Chiến Binh";
        
                // Cập nhật HP
        var elHp = document.getElementById('player-hp');
        var elMaxHp = document.getElementById('player-max-hp');
        var elHpBar = document.getElementById('player-hp-bar');
        if (elHp) elHp.innerText = gameState.player.hp;
        if (elMaxHp) elMaxHp.innerText = gameState.player.maxHp;
        if (elHpBar && gameState.player.maxHp > 0) {
            var hpPercent = Math.max(0, Math.min(100, (gameState.player.hp / gameState.player.maxHp) * 100));
            elHpBar.style.width = hpPercent + '%';
        }

        // 👉 BỔ SUNG ĐOẠN CẬP NHẬT MP NÀY VÀO NGAY DƯỚI HP:
        var elMp = document.getElementById('player-mp');
        var elMaxMp = document.getElementById('player-max-mp');
        var elMpBar = document.getElementById('player-mp-bar');
        if (elMp) elMp.innerText = gameState.player.mp;
        if (elMaxMp) elMaxMp.innerText = gameState.player.maxMp;
        if (elMpBar && gameState.player.maxMp > 0) {
            var mpPercent = Math.max(0, Math.min(100, (gameState.player.mp / gameState.player.maxMp) * 100));
            elMpBar.style.width = mpPercent + '%';
        }


        var elExp = document.getElementById('player-exp');
        var elMaxExp = document.getElementById('player-max-exp');
        var elExpBar = document.getElementById('player-exp-bar');
        if (elExp) elExp.innerText = gameState.player.exp || 0;
        if (elMaxExp) elMaxExp.innerText = gameState.player.maxExp || 100;
        if (elExpBar && gameState.player.maxExp > 0) {
            var expPercent = Math.max(0, Math.min(100, (gameState.player.exp / gameState.player.maxExp) * 100));
            elExpBar.style.width = expPercent + '%';
        }

        if (gameState.player.stats) {
            var elAtk = document.getElementById('header-stat-atk');
            var elDef = document.getElementById('header-stat-def');
            var elMag = document.getElementById('header-stat-mag');
            var elSpd = document.getElementById('header-stat-spd');

            if (elAtk) elAtk.innerText = gameState.player.stats.atk || gameState.player.atk || 0;
            if (elDef) elDef.innerText = gameState.player.stats.def || gameState.player.def || 0;
            if (elMag) elMag.innerText = gameState.player.stats.mag || 5;
            if (elSpd) elSpd.innerText = gameState.player.stats.spd || 5;
        }

        var availablePoints = gameState.player.statPoints || 0;
        var btnOpenStat = document.getElementById('btn-open-stat-modal');
        var badgePoints = document.getElementById('stat-points-badge');

        if (btnOpenStat) {
            if (availablePoints > 0) {
                btnOpenStat.classList.remove('hidden');
                if (badgePoints) badgePoints.innerText = availablePoints;
            } else {
                btnOpenStat.classList.add('hidden');
            }
        }
    }
    
        // --- KHU VỰC RENDER GIAO DIỆN HÀNH ĐỘNG (THƯỜNG VS MÔN PHÁI) ---
        // --- ĐIỀU KHIỂN HIỂN THỊ KHUNG PHIÊU LƯU HOẶC MÔN PHÁI ---
    var advPanel = document.getElementById('adventure-panel');
    var sectPanel = document.getElementById('sect-panel');
    var isSect = gameState.currentMap && gameState.currentMap.startsWith('sect_');

    if (advPanel && sectPanel) {
        if (isSect) {
            advPanel.classList.add('hidden');
            sectPanel.classList.remove('hidden');

            var sectData = sectNPCInfo[gameState.currentMap] || { npc: "Trưởng Môn", desc: "Khu vực trang nghiêm của môn phái." };
            var elNpcName = document.getElementById('sect-npc-name');
            var elNpcDesc = document.getElementById('sect-npc-desc');
            if (elNpcName) elNpcName.innerText = sectData.npc;
            if (elNpcDesc) elNpcDesc.innerText = '"' + sectData.desc + ' Tại đây, đệ tử có thể lĩnh hội các tâm pháp độc môn hoặc trau dồi kỹ năng chiến đấu."';
        } else {
            advPanel.classList.remove('hidden');
            sectPanel.classList.add('hidden');
        }
    }

    // Render danh sách túi đồ màn hình chính
    var invContainer = document.getElementById('inventory-list');
    if (invContainer) {
        if (gameState.inventory.length === 0) {
            invContainer.innerHTML = '<span class="text-slate-500 italic text-[11px] col-span-3 text-center py-4">Túi đồ trống...</span>';
        } else {
            var html = '';
            var limit = Math.min(gameState.inventory.length, 3);
            for (var i = 0; i < limit; i++) {
                var item = gameState.inventory[i];
                html += '<div class="bg-slate-950 border border-slate-800 rounded-xl p-2 flex flex-col items-center relative">' +
                        '<span class="absolute top-1 right-1 bg-slate-900 text-amber-300 text-[9px] px-1.5 py-0.5 rounded border border-slate-800">x' + (item.count || 1) + '</span>' +
                        '<img src="' + item.image + '" class="w-8 h-8 object-contain mb-1 mt-1">' +
                        '<span class="text-slate-200 truncate max-w-[70px] text-[10px] font-medium">' + item.name + '</span>' +
                        '<span class="text-[10px] text-amber-400 font-bold">' + item.price + 'đ</span>' +
                        '</div>';
            }
            if (gameState.inventory.length > 3) {
                html += '<div onclick="toggleInventoryModal(true)" class="bg-slate-950/80 border border-dashed border-slate-700 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-all text-center">' +
                        '<span class="text-amber-400 text-xs font-bold">+' + (gameState.inventory.length - 3) + '</span>' +
                        '<span class="text-[9px] text-slate-400">Xem thêm</span>' +
                        '</div>';
            }
            invContainer.innerHTML = html;
        }
    }

    // Render danh sách túi đồ trong Modal Chi Tiết
    var modalInvContainer = document.getElementById('inventory-modal-list');
    if (modalInvContainer) {
        if (gameState.inventory.length === 0) {
            modalInvContainer.innerHTML = '<span class="text-slate-500 italic text-xs col-span-3 text-center py-8">Túi đồ trống...</span>';
        } else {
            var modalHtml = '';
            for (var j = 0; j < gameState.inventory.length; j++) {
                var mItem = gameState.inventory[j];
                modalHtml += '<div class="bg-slate-950 border border-slate-800 rounded-xl p-2 flex flex-col items-center relative">' +
                            '<span class="absolute top-1 right-1 bg-slate-900 text-amber-300 text-[9px] px-1.5 py-0.5 rounded border border-slate-800">x' + (mItem.count || 1) + '</span>' +
                            '<img src="' + mItem.image + '" class="w-8 h-8 object-contain mb-1 mt-1">' +
                            '<span class="text-slate-200 truncate max-w-[70px] text-[10px] font-medium">' + mItem.name + '</span>' +
                            '<span class="text-[10px] text-amber-400 font-bold mb-1">' + mItem.price + 'đ</span>' +
                            '<button onclick="promptSellItem(' + j + ')" class="text-[9px] bg-amber-900/50 hover:bg-amber-900 text-amber-300 px-2 py-0.5 rounded transition-all w-full">Bán</button>' +
                            '</div>';
            }
            modalInvContainer.innerHTML = modalHtml;
        }
    }
}
