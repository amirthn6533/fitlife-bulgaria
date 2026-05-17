// ========================================
// FitLife Bulgaria — Discover Sofia Page
// ========================================

function renderDiscover() {
  const filters = [
    { key: 'discover_all', icon: '📍' },
    { key: 'discover_gyms', icon: '🏋️' },
    { key: 'discover_protein', icon: '🥤' },
    { key: 'discover_running', icon: '🏃' },
    { key: 'discover_climbing', icon: '🧗' },
  ];

  const locations = [
    { icon: '🏋️', name: 'Pulse Fitness Lozenets', address: getLang()==='bg'?'бул. Черни Връх 47, София':'47 Cherni Vrah Blvd, Sofia', distance: '0.8 km', rating: '4.8' },
    { icon: '🏋️', name: 'Next Level Gym', address: getLang()==='bg'?'ул. Витоша 120, София':'120 Vitosha St, Sofia', distance: '1.2 km', rating: '4.6' },
    { icon: '🥤', name: 'Protein Bar Sofia', address: getLang()==='bg'?'бул. Витоша 65, София':'65 Vitosha Blvd, Sofia', distance: '0.5 km', rating: '4.7' },
    { icon: '🥤', name: 'GNC Bulgaria', address: getLang()==='bg'?'Paradise Center, ет. 1':'Paradise Center, Floor 1', distance: '2.1 km', rating: '4.4' },
    { icon: '🏃', name: getLang()==='bg'?'Борисова Градина':'Borisova Gradina Park', address: getLang()==='bg'?'3.2 км маршрут за бягане':'3.2km running loop', distance: '1.5 km', rating: '4.9' },
    { icon: '🏃', name: getLang()==='bg'?'Южен Парк':'South Park', address: getLang()==='bg'?'2.8 км маршрут':'2.8km running path', distance: '0.9 km', rating: '4.7' },
    { icon: '🧗', name: 'Walltopia Climbing', address: getLang()==='bg'?'ул. Околовръстен път, София':'Okolovrasten pat St, Sofia', distance: '4.2 km', rating: '4.8' },
    { icon: '🧗', name: getLang()==='bg'?'Витоша - Скални маршрути':'Vitosha Rock Routes', address: getLang()==='bg'?'Природни скални стени':'Natural rock walls', distance: '12 km', rating: '4.9' },
  ];

  return `
    <div class="page">
      <div class="page-header">
        <h1>${t('discover_title')}</h1>
      </div>

      <!-- Map Container -->
      <div id="discover-map" style="height: 250px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: var(--space-md); z-index: 1;"></div>

      <!-- Filters -->
      <div class="category-pills" style="margin-bottom: var(--space-lg)">
        ${filters.map((f, i) => `
          <button class="category-pill ${i === 0 ? 'active' : ''}">${f.icon} ${t(f.key)}</button>
        `).join('')}
      </div>

      <!-- Locations -->
      ${locations.map((loc, i) => `
        <div class="location-card" style="animation: slideUp 0.3s ease-out both; animation-delay: ${i * 0.05}s">
          <div class="location-icon">${loc.icon}</div>
          <div class="location-info">
            <div class="location-name">${loc.name}</div>
            <div class="location-address">${loc.address}</div>
            <div class="location-distance">📏 ${loc.distance} ${t('discover_distance')} • ⭐ ${loc.rating}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

let discoverMap = null;

function initDiscoverMap() {
  if (discoverMap) {
    discoverMap.remove();
    discoverMap = null;
  }
  
  const mapEl = document.getElementById('discover-map');
  if (!mapEl) return;

  // Center on Sofia center
  discoverMap = L.map('discover-map', {
    zoomControl: false
  }).setView([42.6977, 23.3219], 12);

  // Use a dark-mode styled free cartodb tile layer to fit our design system beautifully!
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(discoverMap);

  // Custom marker coordinates for our locations
  const markerData = [
    { name: 'Pulse Fitness Lozenets', coords: [42.6685, 23.3236], icon: '🏋️' },
    { name: 'Next Level Gym Vitosha', coords: [42.6841, 23.3195], icon: '🏋️' },
    { name: 'Protein Bar Sofia', coords: [42.6912, 23.3204], icon: '🥤' },
    { name: 'GNC Paradise Center', coords: [42.6582, 23.3150], icon: '🥤' },
    { name: 'Borisova Gradina Park Loop', coords: [42.6853, 23.3402], icon: '🏃' },
    { name: 'South Park Loop', coords: [42.6689, 23.3090], icon: '🏃' },
    { name: 'Walltopia Climbing', coords: [42.6636, 23.3768], icon: '🧗' },
    { name: 'Vitosha Rock Routes', coords: [42.6391, 23.2427], icon: '🧗' }
  ];

  // Add custom emoji markers
  markerData.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'map-custom-marker';
    el.innerHTML = `<span style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${loc.icon}</span>`;
    
    const myIcon = L.divIcon({
      html: el,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker(loc.coords, { icon: myIcon })
      .addTo(discoverMap)
      .bindPopup(`<strong style="color: #fff; font-family: 'Outfit', sans-serif;">${loc.name}</strong>`);
  });
}
