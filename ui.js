// ui.js - Quản lý toàn bộ hiển thị giao diện và các Modal

// Chuyển đổi qua lại giữa các view lớn (nếu có sử dụng)
function switchView(viewName) {
    var dashboard = document.getElementById('dashboard-view');
    var mapView = document.getElementById('map-view');
    
    if (!dashboard || !mapView) return;

    if (viewName === 'map') {
        dashboard.classList.add('hidden');
        mapView.classList.remove('hidden');
        renderMapInfo();
    } else {
        mapView.classList.add('hidden');
        dashboard.classList.remove('hidden');
    }
}

// Quản lý hiển thị Modal Bản Đồ & Các tuyến đường kết nối
function renderMapInfo() {
    var map = gameMaps[gameState.currentMap];
    if (!map) return;

    var titleEl = document.getElementById('map-modal-title');
    if (titleEl) titleEl.innerText = '📍 ' + map.name;
    
    var isSectMap = gameState.currentMap.startsWith('sect_');
    
    if (isSectMap) {
        document.getElementById('monster-normal').innerText = "Không có";
        document.getElementById('monster-endemic').innerText = "Không có";
        document.getElementById('monster-boss').innerText = "Không có";
        document.getElementById('item-common').innerText = "Khu vực an toàn";
        document.getElementById('item-exclusive').innerText = "Tổng đà môn phái";
    } else {
        document.getElementById('monster-normal').innerText = map.normalMonster;
        document.getElementById('monster-endemic').innerText = map.endemicMonster;
        document.getElementById('monster-boss').innerText = map.boss;
        document.getElementById('item-common').innerText = map.commonItem.name;
        document.getElementById('item-exclusive').innerText = map.exclusiveItem.name;
    }

    var routesContainer = document.getElementById('connected-routes');
    if (!routesContainer) return;

    var routesHtml = '';
    if (isSectMap) {
        var prevMapId = gameState.previousMap || 'light_city';
        var prevMapObj = gameMaps[prevMapId] || { name: "Khu vực trước đó" };
        var returnFee = 50;

        routesHtml += '<div class="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">' +
                      '<div><span class="text-xs font-bold text-slate-200 block mb-0.5">Quay lại: ' + prevMapObj.name + '</span>' +
                      '<span class="text-[10px] text-amber-400">Phí dịch chuyển: ' + returnFee.toLocaleString() + ' Vàng</span></div>' +
                      '<button onclick="teleportTo(\'' + prevMapId + '\', ' + returnFee + ')" class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow">Bay ⚡</button>' +
                      '</div>';
    } else if (map.routes) {
        for (var j = 0; j < map.routes.length; j++) {
            var r = map.routes[j];
            routesHtml += '<div class="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">' +
                          '<div><span class="text-xs font-bold text-slate-200 block mb-0.5">' + r.name + '</span>' +
                          '<span class="text-[10px] text-amber-400">Phí dịch chuyển: ' + r.fee.toLocaleString() + ' Vàng</span></div>' +
                          '<button onclick="teleportTo(\'' + r.id + '\', ' + r.fee + ')" class="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow">Bay ⚡</button>' +
                          '</div>';
        }
    }
    routesContainer.innerHTML = routesHtml;
}
