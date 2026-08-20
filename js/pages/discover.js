// ========================================
// FitLife Bulgaria — Discover Sofia Page
// ========================================

let activeDiscoverCategory = 'all'; // all, gyms, protein, running, climbing
let discoverSearchQuery = '';

const ALL_SOFIA_LOCATIONS = [
  // ── GYMS (Фитнес зали) ──
  {
    id: 'gym_1',
    category: 'gyms',
    icon: '🏋️',
    name: 'Pulse Fitness & SPA Lozenets',
    addressEn: '47 Cherni Vrah Blvd, Lozenets, Sofia',
    addressBg: 'бул. Черни Връх 47, Лозенец, София',
    coords: [42.6685, 23.3236],
    distance: '0.8 km',
    rating: '4.9',
    reviews: 320,
    tags: ['SPA', 'Pool', 'CrossFit', 'Open 24/7']
  },
  {
    id: 'gym_flais_1',
    category: 'gyms',
    icon: '🏋️',
    name: 'Flais Fitness Manastirski Livadi (Флайс)',
    addressEn: 'Bulgaria Blvd, Manastirski Livadi, Sofia',
    addressBg: 'бул. България, Манастирски Ливади, София',
    coords: [42.6565, 23.2845],
    distance: '1.8 km',
    rating: '4.9',
    reviews: 420,
    tags: ['Premium Machines', 'Boxing Zone', 'Protein Bar', 'Sauna']
  },
  {
    id: 'gym_flais_2',
    category: 'gyms',
    icon: '🏋️',
    name: 'Flais Fitness SkyCity (Флайс Гео Милев)',
    addressEn: 'SkyCity Mall, Floor 2, Geo Milev, Sofia',
    addressBg: 'SkyCity Мол, ет. 2, Гео Милев, София',
    coords: [42.6865, 23.3640],
    distance: '3.0 km',
    rating: '4.8',
    reviews: 310,
    tags: ['Panoramic View', 'Free Weights', 'Cross Training']
  },
  {
    id: 'gym_flais_3',
    category: 'gyms',
    icon: '🏋️',
    name: 'Flais Fitness Center Veslets (Флайс Център)',
    addressEn: '12 Veslets St, Center, Sofia',
    addressBg: 'ул. Веслец 12, Център, София',
    coords: [42.7010, 23.3275],
    distance: '1.4 km',
    rating: '4.7',
    reviews: 280,
    tags: ['Central Location', 'Cardio Deck', 'Locker Rooms']
  },
  {
    id: 'gym_2',
    category: 'gyms',
    icon: '🏋️',
    name: 'Next Level Gym Vitosha',
    addressEn: '120 Vitosha Blvd, Center, Sofia',
    addressBg: 'бул. Витоша 120, Център, София',
    coords: [42.6841, 23.3195],
    distance: '1.2 km',
    rating: '4.7',
    reviews: 215,
    tags: ['Cardio Zone', 'Heavy Weights', 'Les Mills']
  },
  {
    id: 'gym_3',
    category: 'gyms',
    icon: '🏋️',
    name: 'Titanium Fitness Arena',
    addressEn: 'Bulgaria Mall, Floor 3, Sofia',
    addressBg: 'България Мол, ет. 3, София',
    coords: [42.6620, 23.2920],
    distance: '2.4 km',
    rating: '4.8',
    reviews: 180,
    tags: ['Hammer Strength', 'Sauna', 'Personal Trainers']
  },
  {
    id: 'gym_4',
    category: 'gyms',
    icon: '🏋️',
    name: 'CrossFit Sofia Box',
    addressEn: '15 Shipchenski Prohod, Slatina, Sofia',
    addressBg: 'ул. Шипченски Проход 15, Слатина, София',
    coords: [42.6780, 23.3650],
    distance: '3.1 km',
    rating: '5.0',
    reviews: 95,
    tags: ['Olympic Lifting', 'WOD', 'Gymnastics']
  },
  {
    id: 'gym_5',
    category: 'gyms',
    icon: '🏋️',
    name: 'Athletic Fitness Center',
    addressEn: 'Mladost 4, Business Park Sofia',
    addressBg: 'Младост 4, Бизнес Парк София',
    coords: [42.6260, 23.3760],
    distance: '4.8 km',
    rating: '4.6',
    reviews: 140,
    tags: ['Modern Equipment', 'Affordable', 'Parking']
  },

  // ── PROTEIN & SUPPLEMENT SHOPS (Протеин & Добавки) ──
  {
    id: 'shop_1',
    category: 'protein',
    icon: '🥤',
    name: 'Protein Bar & Shakes Sofia',
    addressEn: '65 Vitosha Blvd, Center, Sofia',
    addressBg: 'бул. Витоша 65, Център, София',
    coords: [42.6912, 23.3204],
    distance: '0.5 km',
    rating: '4.8',
    reviews: 190,
    tags: ['Fresh Smoothies', 'Whey Protein', 'Pre-workouts']
  },
  {
    id: 'shop_2',
    category: 'protein',
    icon: '🥤',
    name: 'GNC Bulgaria Paradise Center',
    addressEn: 'Paradise Center, Floor 1, Sofia',
    addressBg: 'Парадайс Център, ет. 1, София',
    coords: [42.6582, 23.3150],
    distance: '2.1 km',
    rating: '4.5',
    reviews: 88,
    tags: ['Vitamins', 'Creatine', 'Amino Acids']
  },
  {
    id: 'shop_3',
    category: 'protein',
    icon: '🥤',
    name: 'FitnesHrani.com Flagship Store',
    addressEn: '78 Al. Stamboliyski Blvd, Sofia',
    addressBg: 'бул. Ал. Стамболийски 78, София',
    coords: [42.6980, 23.3080],
    distance: '1.7 km',
    rating: '4.9',
    reviews: 310,
    tags: ['Bulgarian Brand', 'Best Prices', 'Samples']
  },

  // ── RUNNING TRAILS & PARKS (Маршрути за бягане) ──
  {
    id: 'run_1',
    category: 'running',
    icon: '🏃',
    name: 'Borisova Gradina Park Loop',
    addressEn: '3.2 km shaded asphalt & gravel path',
    addressBg: '3.2 км сенчеста алея и парк',
    coords: [42.6853, 23.3402],
    distance: '1.5 km',
    rating: '4.9',
    reviews: 540,
    tags: ['Shaded', 'Water Fountains', 'Scenic']
  },
  {
    id: 'run_2',
    category: 'running',
    icon: '🏃',
    name: 'South Park (Yuzhen Park)',
    addressEn: '2.8 km lake & hill running circuit',
    addressBg: '2.8 км обиколка около езерото',
    coords: [42.6689, 23.3090],
    distance: '0.9 km',
    rating: '4.8',
    reviews: 420,
    tags: ['Lakeside', 'Outdoor Calisthenics', 'Hill Sprints']
  },
  {
    id: 'run_3',
    category: 'running',
    icon: '🏃',
    name: 'West Park (Zapaden Park)',
    addressEn: '4.0 km wide paved sports avenue',
    addressBg: '4.0 км обновена спортна алея',
    coords: [42.7050, 23.2750],
    distance: '3.8 km',
    rating: '4.6',
    reviews: 130,
    tags: ['Quiet', 'Flat', 'Long Distance']
  },

  // ── CLIMBING & SPECIALTY (Катерене & Екстремни) ──
  {
    id: 'climb_1',
    category: 'climbing',
    icon: '🧗',
    name: 'Walltopia Climbing Center',
    addressEn: '111 Tsarigradsko Shose Blvd, Sofia',
    addressBg: 'бул. Цариградско Шосе 111, София',
    coords: [42.6636, 23.3768],
    distance: '4.2 km',
    rating: '4.9',
    reviews: 450,
    tags: ['World-Class', 'Bouldering', 'Lead Climbing']
  },
  {
    id: 'climb_2',
    category: 'climbing',
    icon: '🧗',
    name: 'Vitosha Mountain Golden Bridges Trail',
    addressEn: 'Vitosha National Park, Golden Bridges',
    addressBg: 'Природен Парк Витоша, Златни Мостове',
    coords: [42.6120, 23.2450],
    distance: '9.5 km',
    rating: '5.0',
    reviews: 610,
    tags: ['Nature Trail', 'High Altitude', 'Clean Air']
  }
];

function getFilteredSofiaLocations() {
  return ALL_SOFIA_LOCATIONS.filter(loc => {
    const matchCategory = (activeDiscoverCategory === 'all' || loc.category === activeDiscoverCategory);
    const q = discoverSearchQuery.toLowerCase().trim();
    const matchSearch = !q || loc.name.toLowerCase().includes(q) || loc.addressEn.toLowerCase().includes(q) || loc.addressBg.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });
}

function renderDiscover() {
  const isBg = getLang() === 'bg';
  const filtered = getFilteredSofiaLocations();

  const filters = [
    { key: 'all', labelBg: 'Всички', labelEn: 'All', icon: '📍' },
    { key: 'gyms', labelBg: 'Фитнеси', labelEn: 'Gyms', icon: '🏋️' },
    { key: 'protein', labelBg: 'Протеин & Магазини', labelEn: 'Protein Shops', icon: '🥤' },
    { key: 'running', labelBg: 'Паркове & Бягане', labelEn: 'Running', icon: '🏃' },
    { key: 'climbing', labelBg: 'Катерене & Спорт', labelEn: 'Climbing', icon: '🧗' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <h1>${isBg ? 'Открий София' : 'Discover Sofia'}</h1>
        <span class="tag tag-primary">${filtered.length} ${isBg ? 'места' : 'spots'}</span>
      </div>

      <!-- Live Interactive Map Container -->
      <div id="discover-map" style="height: 260px; border-radius: var(--radius-lg); border: 1px solid var(--accent); margin-bottom: var(--space-md); overflow: hidden; position: relative; box-shadow: 0 0 25px rgba(0,210,255,0.15);"></div>

      <!-- Real-time Search Input -->
      <div style="position:relative; margin-bottom: var(--space-sm);">
        <input type="text" id="discover-search-input" value="${discoverSearchQuery}" placeholder="${isBg ? '🔍 Търси фитнес, протеин бар или парк в София...' : '🔍 Search gyms, supplement shops or parks in Sofia...'}" oninput="handleDiscoverSearch(this.value)" style="width:100%; border-radius:var(--radius-full); padding: 10px 16px; font-size: var(--fs-xs); background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color:#fff;">
      </div>

      <!-- Category Filter Pills with Active Filtering -->
      <div class="category-pills" style="margin-bottom: var(--space-md); display:flex; gap:6px; overflow-x:auto;" class="scroll-h">
        ${filters.map(f => `
          <button class="category-pill ${activeDiscoverCategory === f.key ? 'active' : ''}" style="cursor:pointer; white-space:nowrap; padding: 6px 14px; font-size: 11px; border-radius: var(--radius-full);" onclick="filterDiscoverCategory('${f.key}')">
            ${f.icon} ${isBg ? f.labelBg : f.labelEn}
          </button>
        `).join('')}
      </div>

      <!-- Filtered Locations List -->
      <div id="discover-locations-list" style="display:flex; flex-direction:column; gap: var(--space-xs);">
        ${filtered.length === 0 ? `
          <div class="card" style="text-align:center; padding: var(--space-xl); color: var(--text-muted);">
            <div style="font-size:2rem; margin-bottom:4px;">🔍</div>
            <div>${isBg ? 'Няма намерени места в тази категория.' : 'No locations found in this category.'}</div>
          </div>
        ` : filtered.map((loc, i) => `
          <div class="location-card card-glow" onclick="focusLocationOnMap(${loc.coords[0]}, ${loc.coords[1]}, '${loc.name}')" style="cursor:pointer; animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.04}s; background: var(--bg-glass); border-radius: var(--radius-lg); padding: 12px 14px; margin-bottom: 6px; display:flex; align-items:center; gap: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <div class="location-icon" style="font-size: 1.8rem; background: rgba(0,210,255,0.1); border-radius: var(--radius-md); width: 44px; height: 44px; display:flex; align-items:center; justify-content:center;">${loc.icon}</div>
            <div class="location-info" style="flex:1; min-width:0;">
              <div class="location-name" style="font-weight:800; font-size: var(--fs-sm); color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${loc.name}</div>
              <div class="location-address text-xs text-muted" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${isBg ? loc.addressBg : loc.addressEn}</div>
              <div class="location-distance text-xs" style="color: var(--accent); margin-top: 2px;">
                📏 ${loc.distance} ${isBg ? 'разстояние' : 'away'} • ⭐ ${loc.rating} <span class="text-muted">(${loc.reviews})</span>
              </div>
            </div>
            <button class="btn btn-sm btn-ghost" style="color:var(--accent); font-size:1.2rem; padding:0 6px;">›</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function filterDiscoverCategory(cat) {
  activeDiscoverCategory = cat;
  if (typeof HapticService !== 'undefined') HapticService.selection();
  renderPage();
  setTimeout(() => initDiscoverMap(), 80);
}

function handleDiscoverSearch(query) {
  discoverSearchQuery = query;
  const listContainer = document.getElementById('discover-locations-list');
  if (listContainer) {
    const isBg = getLang() === 'bg';
    const filtered = getFilteredSofiaLocations();
    listContainer.innerHTML = filtered.length === 0 ? `
      <div class="card" style="text-align:center; padding: var(--space-xl); color: var(--text-muted);">
        <div style="font-size:2rem; margin-bottom:4px;">🔍</div>
        <div>${isBg ? 'Няма намерени места.' : 'No spots found.'}</div>
      </div>
    ` : filtered.map((loc, i) => `
      <div class="location-card card-glow" onclick="focusLocationOnMap(${loc.coords[0]}, ${loc.coords[1]}, '${loc.name}')" style="cursor:pointer; background: var(--bg-glass); border-radius: var(--radius-lg); padding: 12px 14px; margin-bottom: 6px; display:flex; align-items:center; gap: 12px; border: 1px solid rgba(255,255,255,0.06);">
        <div class="location-icon" style="font-size: 1.8rem; background: rgba(0,210,255,0.1); border-radius: var(--radius-md); width: 44px; height: 44px; display:flex; align-items:center; justify-content:center;">${loc.icon}</div>
        <div class="location-info" style="flex:1; min-width:0;">
          <div class="location-name" style="font-weight:800; font-size: var(--fs-sm); color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${loc.name}</div>
          <div class="location-address text-xs text-muted" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${isBg ? loc.addressBg : loc.addressEn}</div>
          <div class="location-distance text-xs" style="color: var(--accent); margin-top: 2px;">
            📏 ${loc.distance} • ⭐ ${loc.rating} <span class="text-muted">(${loc.reviews})</span>
          </div>
        </div>
        <button class="btn btn-sm btn-ghost" style="color:var(--accent); font-size:1.2rem; padding:0 6px;">›</button>
      </div>
    `).join('');

    updateMapMarkersForFilter(filtered);
  }
}

let discoverMap = null;
let discoverMarkerLayer = null;

function initDiscoverMap() {
  if (typeof L === 'undefined') return;
  const mapEl = document.getElementById('discover-map');
  if (!mapEl) return;

  if (discoverMap) {
    discoverMap.remove();
    discoverMap = null;
  }

  // Center on Sofia center
  discoverMap = L.map('discover-map', { zoomControl: false }).setView([42.6800, 23.3250], 12);

  // Dark carto tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(discoverMap);

  discoverMarkerLayer = L.layerGroup().addTo(discoverMap);
  updateMapMarkersForFilter(getFilteredSofiaLocations());
}

function updateMapMarkersForFilter(locations) {
  if (!discoverMap || !discoverMarkerLayer) return;
  discoverMarkerLayer.clearLayers();

  const bounds = [];

  locations.forEach(loc => {
    bounds.push(loc.coords);
    const el = document.createElement('div');
    el.style = 'background:rgba(18,24,40,0.92);border:2px solid var(--accent);box-shadow:0 0 10px rgba(0,210,255,0.4);border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;';
    el.innerHTML = loc.icon;

    const myIcon = L.divIcon({
      html: el,
      className: 'custom-map-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(loc.coords, { icon: myIcon })
      .addTo(discoverMarkerLayer)
      .bindPopup(`<strong style="color: #fff; font-size:13px;">${loc.name}</strong><br><span style="font-size:11px;color:#94A3B8;">⭐ ${loc.rating} • ${loc.distance}</span>`);
  });

  if (bounds.length > 0) {
    try {
      discoverMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } catch(e) {}
  }
}

function focusLocationOnMap(lat, lng, name) {
  if (typeof HapticService !== 'undefined') HapticService.selection();
  if (discoverMap) {
    discoverMap.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
