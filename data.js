// data.js - Lưu trữ dữ liệu bản đồ, phần thưởng và trạng thái game (Đã cân chỉnh lại kinh tế & phí dịch chuyển)

// data.js - Cấu hình bản đồ với chỉ số quái cố định theo cấp độ khuyến nghị[span_0](start_span)[span_0](end_span)
var gameMaps = {
    light_city: {
        name: "Thành Phố Ánh Sáng",
        recommendedLevel: 1,
        normalMonster: "Slime Nhỏ",
        endemicMonster: "Thỏ Rừng",
        boss: "Vua Slime",
        monsterStats: {
            normal: { hp: 40, atk: 12, def: 2 },
            endemic: { hp: 80, atk: 18, def: 4 },
            boss: { hp: 200, atk: 30, def: 8 }
        },
        commonItem: { name: "Thảo mộc", price: 8, image: "images/collections/herb.png" },
        exclusiveItem: { name: "Nấm Cổ", price: 25, image: "images/collections/mushroom.png" },
        rewards: {
            normal: { gold: 15, exp: 20 },
            endemic: { gold: 40, exp: 50 },
            boss: { gold: 150, exp: 150 }
        },
        routes: [
            { id: "wind_valley", name: "Thung Lũng Gió", fee: 1200 }
        ]
    },
    wind_valley: {
        name: "Thung Lũng Gió",
        recommendedLevel: 5,
        normalMonster: "Chim Sắt",
        endemicMonster: "Tinh Linh Gió",
        boss: "Cuồng Phong Sư",
        monsterStats: {
            normal: { hp: 90, atk: 22, def: 5 },
            endemic: { hp: 160, atk: 35, def: 8 },
            boss: { hp: 450, atk: 60, def: 15 }
        },
        commonItem: { name: "Lông Vũ Bay", price: 15, image: "images/collections/feather.png" },
        exclusiveItem: { name: "Đá Gió Xoáy", price: 45, image: "images/collections/wind_stone.png" },
        rewards: {
            normal: { gold: 50, exp: 60 },
            endemic: { gold: 120, exp: 140 },
            boss: { gold: 500, exp: 450 }
        },
        routes: [
            { id: "light_city", name: "Thành Phố Ánh Sáng", fee: 100 },
            { id: "crystal_cave", name: "Hang Động Pha Lê", fee: 9000 }
        ]
    },
    crystal_cave: {
        name: "Hang Động Pha Lê",
        recommendedLevel: 10,
        normalMonster: "Dơi Pha Lê",
        endemicMonster: "Thạch Nhũ Sống",
        boss: "Quái Vật Đá",
        monsterStats: {
            normal: { hp: 180, atk: 40, def: 10 },
            endemic: { hp: 320, atk: 65, def: 16 },
            boss: { hp: 1000, atk: 110, def: 30 }
        },
        commonItem: { name: "Tinh Thể Thô", price: 25, image: "images/collections/raw_crystal.png" },
        exclusiveItem: { name: "Pha Lê Ngũ Sắc", price: 90, image: "images/collections/rainbow_crystal.png" },
        rewards: {
            normal: { gold: 150, exp: 180 },
            endemic: { gold: 350, exp: 400 },
            boss: { gold: 1500, exp: 1200 }
        },
        routes: [
            { id: "wind_valley", name: "Thung Lũng Gió", fee: 1000 },
            { id: "shadow_forest", name: "Rừng Bóng Tối", fee: 50000 }
        ]
    },
    shadow_forest: {
        name: "Rừng Bóng Tối",
        recommendedLevel: 15,
        normalMonster: "Nhện Độc",
        endemicMonster: "Bóng Ma",
        boss: "Chúa Tể Hắc Ám",
        monsterStats: {
            normal: { hp: 350, atk: 75, def: 18 },
            endemic: { hp: 600, atk: 120, def: 30 },
            boss: { hp: 2200, atk: 200, def: 55 }
        },
        commonItem: { name: "Gai U Mê", price: 95, image: "images/collections/dark_thorn.png" },
        exclusiveItem: { name: "Quả Hạch Đêm", price: 340, image: "images/collections/night_nut.png" },
        rewards: {
            normal: { gold: 500, exp: 600 },
            endemic: { gold: 1200, exp: 1300 },
            boss: { gold: 5000, exp: 4000 }
        },
        routes: [
            { id: "crystal_cave", name: "Hang Động Pha Lê", fee: 5000 },
            { id: "volcanic_peak", name: "Đỉnh Núi Lửa", fee: 350000 }
        ]
    },
    volcanic_peak: {
        name: "Đỉnh Núi Lửa",
        recommendedLevel: 20,
        normalMonster: "Thằn Lằn Lửa",
        endemicMonster: "Quỷ Nham Thạch",
        boss: "Rồng Lửa Cổ Đại",
        monsterStats: {
            normal: { hp: 700, atk: 140, def: 35 },
            endemic: { hp: 1200, atk: 220, def: 55 },
            boss: { hp: 5000, atk: 380, def: 100 }
        },
        commonItem: { name: "Tro Núi Lửa", price: 180, image: "images/collections/volcanic_ash.png" },
        exclusiveItem: { name: "Tinh Hoa Nham Trạch", price: 650, image: "images/collections/magma_essence.png" },
        rewards: {
            normal: { gold: 1500, exp: 1800 },
            endemic: { gold: 3500, exp: 3800 },
            boss: { gold: 15000, exp: 12000 }
        },
        routes: [
            { id: "shadow_forest", name: "Rừng Bóng Tối", fee: 30000 },
            { id: "deep_sea_abyss", name: "Vực Sâu Đáy Biển", fee: 2000000 }
        ]
    },
    deep_sea_abyss: {
        name: "Vực Sâu Đáy Biển",
        recommendedLevel: 25,
        normalMonster: "Cua Gai",
        endemicMonster: "Cá Angler",
        boss: "Thủy Quái Leviathan",
        monsterStats: {
            normal: { hp: 1400, atk: 260, def: 65 },
            endemic: { hp: 2400, atk: 420, def: 100 },
            boss: { hp: 11000, atk: 700, def: 180 }
        },
        commonItem: { name: "San Hô Đen", price: 340, image: "images/collections/black_coral.png" },
        exclusiveItem: { name: "Ngọc Trai Sâu Thẳm", price: 1200, image: "images/collections/abyssal_pearl.png" },
        rewards: {
            normal: { gold: 5000, exp: 6000 },
            endemic: { gold: 12000, exp: 13000 },
            boss: { gold: 50000, exp: 40000 }
        },
        routes: [
            { id: "volcanic_peak", name: "Đỉnh Núi Lửa", fee: 200000 },
            { id: "sky_island", name: "Đảo Trên Mây", fee: 10000000 }
        ]
    },
    sky_island: {
        name: "Đảo Trên Mây",
        recommendedLevel: 30,
        normalMonster: "Hiệp Sĩ Mây",
        endemicMonster: "Điểu Sư",
        boss: "Thần Sấm Bão",
        monsterStats: {
            normal: { hp: 2800, atk: 500, def: 120 },
            endemic: { hp: 4800, atk: 800, def: 190 },
            boss: { hp: 25000, atk: 1300, def: 350 }
        },
        commonItem: { name: "Mây Cô Đặc", price: 650, image: "images/collections/condensed_cloud.png" },
        exclusiveItem: { name: "Lông Cánh Thiên Sứ", price: 2300, image: "images/collections/angel_feather.png" },
        rewards: {
            normal: { gold: 15000, exp: 18000 },
            endemic: { gold: 35000, exp: 40000 },
            boss: { gold: 150000, exp: 120000 }
        },
        routes: [
            { id: "deep_sea_abyss", name: "Vực Sâu Đáy Biển", fee: 1000000 },
            { id: "ancient_ruin", name: "Di Tích Cổ Xưa", fee: 50000000 }
        ]
    },
    ancient_ruin: {
        name: "Di Tích Cổ Xưa",
        recommendedLevel: 35,
        normalMonster: "Binh Lính Đá",
        endemicMonster: "Hồn Ma Cổ",
        boss: "Pharaoh Vô Diện",
        monsterStats: {
            normal: { hp: 5500, atk: 950, def: 230 },
            endemic: { hp: 9500, atk: 1500, def: 360 },
            boss: { hp: 55000, atk: 2500, def: 700 }
        },
        commonItem: { name: "Mảnh Gốm Vỡ", price: 1200, image: "images/collections/broken_pottery.png" },
        exclusiveItem: { name: "Phiến Đá Cổ Ngữ", price: 4400, image: "images/collections/rune_stone.png" },
        rewards: {
            normal: { gold: 50000, exp: 60000 },
            endemic: { gold: 120000, exp: 130000 },
            boss: { gold: 500000, exp: 400000 }
        },
        routes: [
            { id: "sky_island", name: "Đảo Trên Mây", fee: 5000000 },
            { id: "frozen_tundra", name: "Đài Nguyên Băng Giá", fee: 200000000 }
        ]
    },
    frozen_tundra: {
        name: "Đài Nguyên Băng Giá",
        recommendedLevel: 40,
        normalMonster: "Sói Băng",
        endemicMonster: "Người Tuyết Khổng Lồ",
        boss: "Nữ Hoàng Băng Giá",
        monsterStats: {
            normal: { hp: 11000, atk: 1800, def: 450 },
            endemic: { hp: 19000, atk: 2800, def: 700 },
            boss: { hp: 120000, atk: 4800, def: 1400 }
        },
        commonItem: { name: "Băng Vĩnh Cửu", price: 2300, image: "images/collections/eternal_ice.png" },
        exclusiveItem: { name: "Trái Tim Băng", price: 8500, image: "images/collections/ice_heart.png" },
        rewards: {
            normal: { gold: 150000, exp: 180000 },
            endemic: { gold: 350000, exp: 400000 },
            boss: { gold: 1500000, exp: 1200000 }
        },
        routes: [
            { id: "ancient_ruin", name: "Di Tích Cổ Xưa", fee: 20000000 },
            { id: "magical_wasteland", name: "Vùng Đất Hoang Ma Thuật", fee: 800000000 }
        ]
    },
    magical_wasteland: {
        name: "Vùng Đất Hoang Ma Thuật",
        recommendedLevel: 45,
        normalMonster: "Dị Vật Hư Không",
        endemicMonster: "Thú Săn Ma Thuật",
        boss: "Kẻ Hủy Diệt Không Gian",
        monsterStats: {
            normal: { hp: 22000, atk: 3500, def: 900 },
            endemic: { hp: 38000, atk: 5500, def: 1400 },
            boss: { hp: 250000, atk: 9000, def: 2800 }
        },
        commonItem: { name: "Bụi Phép Thuật", price: 4500, image: "images/collections/magic_dust.png" },
        exclusiveItem: { name: "Lõi Năng Lượng Hư Không", price: 16000, image: "images/collections/void_core.png" },
        rewards: {
            normal: { gold: 500000, exp: 600000 },
            endemic: { gold: 1200000, exp: 1300000 },
            boss: { gold: 5000000, exp: 4000000 }
        },
        routes: [
            { id: "frozen_tundra", name: "Đài Nguyên Băng Giá", fee: 80000000 },
            { id: "celestial_realm", name: "Vương Quốc Thiên Giới", fee: 3500000000 }
        ]
    },
    celestial_realm: {
        name: "Vương Quốc Thiên Giới",
        recommendedLevel: 50,
        normalMonster: "Thiên Sứ Sa Ngã",
        endemicMonster: "Kỵ Sĩ Ánh Sáng",
        boss: "Thực Thể Tối Thượng",
        monsterStats: {
            normal: { hp: 45000, atk: 7000, def: 1800 },
            endemic: { hp: 75000, atk: 11000, def: 2800 },
            boss: { hp: 500000, atk: 18000, def: 5500 }
        },
        commonItem: { name: "Hạt Giống Ánh Sáng", price: 9000, image: "images/collections/light_seed.png" },
        exclusiveItem: { name: "Quả Cầu Tinh Tú", price: 32000, image: "images/collections/starlight_orb.png" },
        rewards: {
            normal: { gold: 2000000, exp: 2500000 },
            endemic: { gold: 5000000, exp: 6000000 },
            boss: { gold: 20000000, exp: 15000000 }
        },
        routes: [
            { id: "magical_wasteland", name: "Vùng Đất Hoang Ma Thuật", fee: 350000000 }
        ]
    }
};


var savedData = localStorage.getItem('magical_school_state_img');
var gameState = savedData ? JSON.parse(savedData) : {
    gold: 150,
    stamina: 20,
    maxStamina: 20,
    currentMap: 'light_city',
    inventory: [],
    lastStaminaTime: Date.now(),
    player: {
        name: "",
        avatar: "images/avatars/avatar1.png",
        level: 1,
        exp: 0,
        maxExp: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        atk: 15,
        def: 5
    }
};

// Cấu hình danh sách vật phẩm cửa hàng
var shopItems = [
    { id: 'mana_potion', name: 'Thuốc Hồi Mana', price: 30, type: 'stamina', value: 10, icon: '🧪', desc: 'Hồi nhanh 10 ⚡ năng lượng' },
    { id: 'hp_potion_small', name: 'Bình Máu Nhỏ', price: 35, type: 'hp_percent', value: 0.30, icon: '❤️', desc: 'Hồi phục nhanh 30% tổng HP tối đa.' },
    { id: 'hp_potion_medium', name: 'Bình Máu Vừa', price: 65, type: 'hp_percent', value: 0.45, icon: '💖', desc: 'Hồi phục nhanh 45% tổng HP tối đa.' },
    { id: 'hp_potion_large', name: 'Bình Máu To', price: 110, type: 'hp_percent', value: 0.60, icon: '💝', desc: 'Hồi phục nhanh 60% tổng HP tối đa.' }
    // Sau này có thể thêm hàng ngàn item khác như: giáp, vũ khí, bùa chú,... mà không cần sửa code logic mua hàng!
];



// Bổ sung vào danh sách gameMaps trong data.js
var sectMaps = {
    sect_phong_linh: {
        name: "Thành Phong Linh",
        classKey: ["warrior_m", "warrior_f"],
        description: "Tổng đà của Chiến Binh, nơi rèn luyện ý chí sắt đá.",
        routes: [] // Sẽ được cập nhật động quay về map trước đó
    },
    sect_anh_vu: {
        name: "Điện Anh Vũ",
        classKey: ["bard_m", "bard_f"],
        description: "Thánh địa âm luật và thanh âm linh thiêng.",
        routes: []
    },
    sect_hien_vien: {
        name: "Thung Lũng Hiên Viên",
        classKey: ["hunter_m", "hunter_f"],
        description: "Nơi ẩn náu của các Thợ Săn am hiểu địa hình.",
        routes: []
    },
    sect_ma_loc: {
        name: "Núi Ma Lộc",
        classKey: ["archer_m", "archer_f"],
        description: "Đỉnh núi hiểm trở rèn luyện bách phát bách trúng.",
        routes: []
    },
    sect_kim_mien: {
        name: "Rừng Kim Miên",
        classKey: ["witch"],
        description: "Vùng đất hắc ám nghiên cứu cổ ngữ và phù thủy.",
        routes: []
    },
    sect_vo_cuc: {
        name: "Tế Đàn Vô Cực",
        classKey: ["wizard"],
        description: "Nơi hội tụ nguyên tố ma thuật thuần khiết nhất.",
        routes: []
    },
    sect_vinh_da: {
        name: "Thôn Vĩnh Dạ",
        classKey: ["healer"],
        description: "Ngôi làng chữa lành và cứu thế.",
        routes: []
    },
    sect_hac_nham: {
        name: "Thành Hắc Nham",
        classKey: ["knight"],
        description: "Pháo đài kiên cố của những Hiệp Sĩ bảo hộ.",
        routes: []
    }
};
Object.assign(gameMaps, sectMaps);

// Bổ sung vào data.js hoặc định nghĩa cấu trúc dữ liệu kỹ năng cho các Class
var classSkills = {
    warrior: [
        {
            id: "wind_fist",
            name: "Phong Linh Quyền",
            levelReq: 1,
            mpCost: 10,
            type: "active_damage",
            multiplier: 1.5, // 150% ATK cộng thêm vào đòn đánh
            desc: "Đòn đánh cơ bản bộc phát kình phong, gây (ATK + 150% ATK) sát thương vật lý."
        },
        {
            id: "wind_warrior_stance",
            name: "Chiến Sĩ Phong Linh",
            levelReq: 5,
            mpCost: 15,
            type: "buff_def",
            duration: 3, // Tác dụng trong 3 hiệp
            reduction: 0.30, // Giảm 30% sát thương nhận vào
            desc: "Gây sát thương đòn đánh và vận khí giảm mọi sát thương nhận vào 30% trong 3 hiệp kế tiếp."
        },
        {
            id: "whirlwind_slash",
            name: "Toàn Phong Trảm",
            levelReq: 10,
            mpCost: 20,
            type: "complex_damage",
            atkMulti: 2.5, // 250 - 300% ATK
            strMulti: 2.0, // 200% STR
            spdMulti: 1.5, // 150% SPD
            critChance: 30, // 30% tỉ lệ x2 sát thương
            desc: "Tạo ra cơn lốc kiếm khí gây 250-300% ATK + 200% STR + 150% SPD. Có 30% tỉ lệ x2 sát thương."
        },
        {
            id: "four_direction_wind",
            name: "Tứ Diện Phong Sát",
            levelReq: 30,
            mpCost: 35,
            type: "ultimate_execute",
            multiplier: 5.0, // 500% ATK
            executeThreshold: 0.10, // 10% HP tối đa của đối thủ
            desc: "Tuyệt chiêu chí mạng gây 500% ATK bỏ qua phòng thủ. Lập tức kết liễu nếu HP đối thủ dưới 10%."
        }
    ]
};
// Bổ sung vào data.js
var sectNPCInfo = {
    sect_phong_linh: { npc: "Phong Linh Trưởng Lão", desc: "Nơi rèn luyện ý chí sắt đá và các bí pháp cận chiến tối thượng của Chiến Binh." },
    sect_anh_vu: { npc: "Anh Vũ Tiên Tử", desc: "Thánh địa âm luật, lĩnh hội những khúc ca thanh tẩy và uy lực thanh âm." },
    sect_hien_vien: { npc: "Hiên Viên Đạo Sĩ", desc: "Nơi ẩn náu của các Thợ Săn, truyền thụ kỹ năng truy sát và bẫy rập." },
    sect_ma_loc: { npc: "Ma Lộc Hộ Pháp", desc: "Đỉnh núi hiểm trở, nơi rèn luyện bách phát bách trúng của Xạ Thủ." },
    sect_kim_mien: { npc: "Kim Miên Phù Sư", desc: "Vùng đất hắc ám nghiên cứu cổ ngữ, nguyền rủa và phù thủy." },
    sect_vo_cuc: { npc: "Vô Cực Đạo Nhân", desc: "Nơi hội tụ nguyên tố ma thuật thuần khiết nhất của Pháp Sư." },
    sect_vinh_da: { npc: "Vĩnh Dạ Thần Y", desc: "Ngôi làng chữa lành, truyền thụ y thuật cứu thế và bảo hộ." },
    sect_hac_nham: { npc: "Hắc Nham Thiết Vệ", desc: "Pháo đài kiên cố, huấn luyện nghệ thuật phòng thủ tuyệt đỉnh của Hiệp Sĩ." }
};
