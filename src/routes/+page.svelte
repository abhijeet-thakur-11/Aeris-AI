<script>
  import { onMount } from 'svelte';
  import { fly, fade, slide, scale } from 'svelte/transition';
  import { activeIncidents } from '$lib/stores/incidents.js';
  import { aiInsight, windData, mapLayers, timelineSteps, getAQIColor, getAQILabel } from '$lib/data/mockData.js';
  import { Search, Layers, Navigation, Wind, ChevronDown, X, MapPin, Clock, Brain, AlertTriangle, School, Building, Thermometer, Eye, Crosshair } from '@lucide/svelte';
  import ReportFlow from '$lib/components/ReportFlow.svelte';

  let mapContainer = $state(null);
  let map = $state(null);
  let windCanvas = $state(null);
  let showLayers = $state(false);
  let showBottomSheet = $state(false);
  let selectedHotspot = $state(null);
  let activeTimeline = $state(0);
  let searchFocused = $state(false);
  let layerStates = $state(mapLayers.map(l => ({ ...l })));
  let showReportModal = $state(false);
  let markersReady = $state(false);
  let particles = [];
  let animFrameId;

  // Wind particle system
  class WindParticle {
    constructor(w, h, dir) {
      this.reset(w, h, dir);
      this.x = Math.random() * w;
      this.y = Math.random() * h;
    }
    reset(w, h, dir) {
      this.x = Math.random() * w;
      this.y = dir > 180 ? 0 : h;
      this.speed = 0.3 + Math.random() * 0.8;
      this.opacity = 0.08 + Math.random() * 0.18;
      this.size = 1 + Math.random() * 1.5;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
  }

  function initWindParticles() {
    if (!windCanvas) return;
    const ctx = windCanvas.getContext('2d');
    const w = windCanvas.width = windCanvas.offsetWidth;
    const h = windCanvas.height = windCanvas.offsetHeight;
    const dirRad = (windData.direction * Math.PI) / 180;
    const count = 80;

    particles = Array.from({ length: count }, () => new WindParticle(w, h, windData.direction));

    function animate() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += Math.cos(dirRad) * p.speed;
        p.y += Math.sin(dirRad) * p.speed;
        p.life++;

        const fadeIn = Math.min(p.life / 30, 1);
        const fadeOut = Math.max(1 - (p.life - p.maxLife + 50) / 50, 0);
        const alpha = p.opacity * fadeIn * (p.life > p.maxLife - 50 ? fadeOut : 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 140, 255, ${alpha})`;
        ctx.fill();

        // Trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(dirRad) * 8, p.y - Math.sin(dirRad) * 8);
        ctx.strokeStyle = `rgba(79, 140, 255, ${alpha * 0.4})`;
        ctx.lineWidth = p.size * 0.6;
        ctx.stroke();

        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10 || p.life > p.maxLife) {
          p.reset(w, h, windData.direction);
        }
      }

      animFrameId = requestAnimationFrame(animate);
    }

    animate();
  }

  onMount(() => {
    // Dynamic import leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      map = L.map(mapContainer, {
        center: [28.6139, 77.2090],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron - clean light tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Real-time markers layer
      let markerLayerGroup = L.layerGroup().addTo(map);

      // Subscribe to real-time incidents
      const unsubscribe = activeIncidents.subscribe(incidents => {
        markerLayerGroup.clearLayers(); // Remove old markers
        
        incidents.forEach((spot) => {
          // Calculate mock AQI visually based on severity if real AQI is missing
          const pseudoAqi = spot.severity === 'Critical' ? 350 : spot.severity === 'High' ? 250 : spot.severity === 'Medium' ? 150 : 50;
          const color = getAQIColor(pseudoAqi);
          const size = pseudoAqi > 250 ? 28 : pseudoAqi > 150 ? 22 : 16;

          const markerHtml = `
            <div class="aqi-marker" style="width: ${size + 40}px; height: ${size + 40}px; display: flex; align-items: center; justify-content: center;">
              <div class="aqi-marker-glow" style="background: ${color}; width: ${size + 38}px; height: ${size + 38}px;"></div>
              <div class="aqi-marker-ring" style="background: ${color}; width: ${size + 22}px; height: ${size + 22}px; animation-delay: ${Math.random() * 2}s;"></div>
              <div class="aqi-marker-dot" style="background: ${color}; width: ${size}px; height: ${size}px;"></div>
            </div>
          `;

          const icon = L.divIcon({
            html: markerHtml,
            className: '',
            iconSize: [size + 40, size + 40],
            iconAnchor: [(size + 40) / 2, (size + 40) / 2]
          });

          const marker = L.marker([spot.latitude, spot.longitude], { icon }).addTo(markerLayerGroup);

          marker.on('click', () => {
            selectedHotspot = {
              name: spot.pollution_type,
              aqi: pseudoAqi,
              severity: spot.severity,
              aiConfidence: spot.confidence,
              detectedAt: new Date(spot.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              suggestedAction: spot.suggested_action || "Investigate source",
              predictedSpread: spot.predicted_radius,
              type: spot.pollution_type
            };
            showBottomSheet = true;
          });
        });
      });

      // Initial data fetch and realtime setup
      activeIncidents.fetchInitial();
      activeIncidents.subscribeToChanges();

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.flyTo([latitude, longitude], 13, { duration: 1.5 });
            
            // Add user location marker
            const userIconHtml = `
              <div class="user-marker" style="width: 20px; height: 20px; background-color: #4F8CFF; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(79, 140, 255, 0.8);"></div>
            `;
            const userIcon = L.divIcon({ html: userIconHtml, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });
            L.marker([latitude, longitude], { icon: userIcon }).addTo(map).bindPopup("<b>You are here</b>").openPopup();
          },
          (err) => {
            console.error("Geolocation error:", err);
          }
        );
      }

      markersReady = true;
      initWindParticles();
    });

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (map) map.remove();
    };
  });

  function handleLocate() {
    if (map) {
      map.flyTo([28.6139, 77.2090], 14, { duration: 1.2 });
    }
  }

  function closeSheet() {
    showBottomSheet = false;
    setTimeout(() => selectedHotspot = null, 400);
  }

  function toggleLayer(id) {
    layerStates = layerStates.map(l =>
      l.id === id ? { ...l, active: !l.active } : l
    );
  }
</script>

<div class="map-screen">
  <!-- Map Container -->
  <div class="map-wrapper" bind:this={mapContainer} id="aeris-map"></div>

  <!-- Wind Particle Canvas -->
  <canvas
    bind:this={windCanvas}
    class="wind-canvas"
    aria-hidden="true"
  ></canvas>

  <!-- Floating Search Bar -->
  <div class="search-area" in:fly={{ y: -20, duration: 600, delay: 200 }}>
    <div class="search-bar glass-card-heavy" class:focused={searchFocused}>
      <Search size={18} strokeWidth={1.5} color="#6E6E73" />
      <input
        type="text"
        placeholder="Search locations..."
        class="search-input"
        onfocus={() => searchFocused = true}
        onblur={() => searchFocused = false}
        id="search-input"
      />
    </div>
  </div>

  <!-- Layer Toggle Button -->
  <button
    class="layer-btn glass-card-heavy btn-icon"
    onclick={() => showLayers = !showLayers}
    aria-label="Toggle map layers"
    id="layer-toggle"
    in:fly={{ x: 20, duration: 600, delay: 400 }}
  >
    <Layers size={20} strokeWidth={1.5} color="#4F8CFF" />
  </button>

  <!-- Layer Selector Panel -->
  {#if showLayers}
    <div class="layer-panel glass-card-heavy" transition:fly={{ x: 20, duration: 300 }}>
      <div class="layer-panel-header">
        <span class="text-headline">Map Layers</span>
        <button class="btn-icon" onclick={() => showLayers = false} style="background: transparent;">
          <X size={18} />
        </button>
      </div>
      <div class="layer-list">
        {#each layerStates as layer}
          <div class="layer-item">
            <span class="text-body">{layer.name}</span>
            <button
              class="toggle"
              class:active={layer.active}
              onclick={() => toggleLayer(layer.id)}
              aria-label="Toggle {layer.name}"
            ></button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Current Location Button -->
  <button
    class="locate-btn glass-card-heavy btn-icon"
    onclick={handleLocate}
    aria-label="My location"
    id="locate-btn"
    in:fly={{ x: 20, duration: 600, delay: 500 }}
  >
    <Crosshair size={20} strokeWidth={1.5} color="#4F8CFF" />
  </button>

  <!-- Wind Info Badge -->
  <div class="wind-badge glass-card" in:fly={{ x: -20, duration: 600, delay: 600 }}>
    <Wind size={14} strokeWidth={2} color="#4F8CFF" />
    <span>{windData.speed} km/h {windData.directionLabel}</span>
  </div>

  <!-- AI Insight Card -->
  <div class="ai-insight glass-card" in:fly={{ y: 30, duration: 700, delay: 700 }}>
    <div class="ai-insight-header">
      <div class="ai-badge">
        <Brain size={12} strokeWidth={2} />
        <span>AI Prediction</span>
      </div>
      <span class="confidence-badge">{aiInsight.confidence}%</span>
    </div>
    <h3 class="ai-insight-title">{aiInsight.title}</h3>
    <p class="ai-insight-sub">{aiInsight.location} · {aiInsight.windInfo}</p>
    <div class="ai-insight-stats">
      <div class="ai-stat">
        <span class="ai-stat-value" style="color: #FF4D4F">{aiInsight.pm25Change}</span>
        <span class="ai-stat-label">PM2.5</span>
      </div>
      <div class="ai-stat-divider"></div>
      <div class="ai-stat">
        <span class="ai-stat-value">{aiInsight.predictedSpread}</span>
        <span class="ai-stat-label">Spread</span>
      </div>
      <div class="ai-stat-divider"></div>
      <div class="ai-stat">
        <span class="ai-stat-value">{aiInsight.affectedPop}</span>
        <span class="ai-stat-label">Affected</span>
      </div>
    </div>
  </div>

  <!-- Pollution Timeline Slider -->
  <div class="timeline-area" in:fly={{ y: 30, duration: 600, delay: 800 }}>
    <div class="timeline-bar glass-card-heavy">
      <div class="timeline-track">
        {#each timelineSteps as step, i}
          <button
            class="timeline-step"
            class:active={activeTimeline === i}
            onclick={() => activeTimeline = i}
          >
            <span class="timeline-dot" class:active={activeTimeline === i}></span>
            <span class="timeline-label" class:active={activeTimeline === i}>{step.label}</span>
          </button>
        {/each}
        <div
          class="timeline-progress"
          style="width: {(activeTimeline / (timelineSteps.length - 1)) * 100}%"
        ></div>
      </div>
    </div>
  </div>

  <!-- Report FAB -->
  <button
    class="report-fab"
    onclick={() => showReportModal = true}
    aria-label="Report pollution"
    id="report-fab"
    in:scale={{ duration: 500, delay: 900 }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  </button>

  <!-- Bottom Sheet Overlay -->
  <div class="bottom-sheet-overlay" class:active={showBottomSheet} onclick={closeSheet} onkeydown={(e) => e.key === 'Escape' && closeSheet()} role="button" tabindex="-1" aria-label="Close details"></div>

  <!-- Incident Detail Bottom Sheet -->
  <div class="bottom-sheet" class:active={showBottomSheet}>
    <div class="bottom-sheet-handle"></div>

    {#if selectedHotspot}
      <div class="sheet-content" in:fade={{ duration: 200 }}>
        <!-- Header -->
        <div class="sheet-header">
          <div>
            <h2 class="text-title">{selectedHotspot.name}</h2>
            <p class="text-caption">{selectedHotspot.type}</p>
          </div>
          <div class="aqi-badge-large" style="background: {getAQIColor(selectedHotspot.aqi)}20; color: {getAQIColor(selectedHotspot.aqi)}; border: 1.5px solid {getAQIColor(selectedHotspot.aqi)}30">
            <span class="aqi-value">{selectedHotspot.aqi}</span>
            <span class="aqi-label-small">AQI</span>
          </div>
        </div>

        <!-- Severity & Confidence -->
        <div class="sheet-meta">
          <span class="badge" style="background: {getAQIColor(selectedHotspot.aqi)}18; color: {getAQIColor(selectedHotspot.aqi)}">
            {selectedHotspot.severity}
          </span>
          <span class="badge badge-info">
            <Eye size={12} />
            AI {selectedHotspot.aiConfidence}%
          </span>
          <span class="badge" style="background: rgba(0,0,0,0.04); color: var(--aeris-text-secondary)">
            <Clock size={12} />
            {selectedHotspot.detectedAt}
          </span>
        </div>

        <!-- Stats Grid -->
        <div class="sheet-stats">
          <div class="stat-item">
            <span class="stat-icon"><Thermometer size={16} color="#FF4D4F" /></span>
            <span class="stat-val">{selectedHotspot.pm25}</span>
            <span class="stat-key">PM2.5</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon"><Thermometer size={16} color="#FFB020" /></span>
            <span class="stat-val">{selectedHotspot.pm10}</span>
            <span class="stat-key">PM10</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon"><Wind size={16} color="#4F8CFF" /></span>
            <span class="stat-val">{selectedHotspot.windSpeed}</span>
            <span class="stat-key">km/h {selectedHotspot.windDirection}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon"><Navigation size={16} color="#36CFC9" /></span>
            <span class="stat-val">{selectedHotspot.predictedSpread}</span>
            <span class="stat-key">km spread</span>
          </div>
        </div>

        <!-- Nearby -->
        <div class="sheet-nearby">
          <div class="nearby-item">
            <School size={16} color="#FFB020" />
            <span>{selectedHotspot.nearbySchools} schools nearby</span>
          </div>
          <div class="nearby-item">
            <Building size={16} color="#FF4D4F" />
            <span>{selectedHotspot.nearbyHospitals} hospitals nearby</span>
          </div>
        </div>

        <!-- Suggested Action -->
        <div class="sheet-action">
          <div class="action-header">
            <AlertTriangle size={16} color="#FFB020" />
            <span class="text-micro">SUGGESTED ACTION</span>
          </div>
          <p class="text-body" style="font-weight: 600; margin-top: 6px;">{selectedHotspot.suggestedAction}</p>
        </div>

        <!-- Action Buttons -->
        <div class="sheet-buttons">
          <button class="btn-primary" style="flex: 1;" onclick={closeSheet}>Deploy Response</button>
          <button class="btn-glass" onclick={closeSheet}>Dismiss</button>
        </div>
      </div>
    {/if}
  </div>


  <!-- Report Modal -->
  <ReportFlow isOpen={showReportModal} onClose={() => showReportModal = false} />
</div>

<style>
  .map-screen {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .map-wrapper {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .wind-canvas {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  /* ─── Search ─── */
  .search-area {
    position: absolute;
    top: 56px;
    left: 20px;
    right: 20px;
    z-index: 10;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 20px;
    transition: box-shadow 0.3s ease;
  }

  .search-bar.focused {
    box-shadow: 0 4px 24px rgba(79, 140, 255, 0.15);
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    color: var(--aeris-text);
    outline: none;
  }

  .search-input::placeholder {
    color: var(--aeris-text-tertiary);
  }

  /* ─── Layer Button & Panel ─── */
  .layer-btn {
    position: absolute;
    top: 116px;
    right: 20px;
    z-index: 10;
    width: 44px;
    height: 44px;
    background: var(--glass-bg-heavy);
  }

  .layer-panel {
    position: absolute;
    top: 116px;
    right: 20px;
    width: 240px;
    z-index: 20;
    padding: 16px;
  }

  .layer-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .layer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .layer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* ─── Locate ─── */
  .locate-btn {
    position: absolute;
    top: 172px;
    right: 20px;
    z-index: 10;
    width: 44px;
    height: 44px;
    background: var(--glass-bg-heavy);
  }

  /* ─── Wind Badge ─── */
  .wind-badge {
    position: absolute;
    top: 116px;
    left: 20px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--aeris-text-secondary);
  }

  /* ─── AI Insight Card ─── */
  .ai-insight {
    position: absolute;
    bottom: 200px;
    left: 20px;
    right: 20px;
    z-index: 10;
    padding: 16px 18px;
  }

  .ai-insight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .ai-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--aeris-blue);
    background: rgba(79, 140, 255, 0.1);
    padding: 4px 10px;
    border-radius: 8px;
  }

  .confidence-badge {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--aeris-success);
    background: rgba(48, 209, 88, 0.1);
    padding: 3px 8px;
    border-radius: 6px;
  }

  .ai-insight-title {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--aeris-text);
    margin-bottom: 2px;
  }

  .ai-insight-sub {
    font-size: 0.8125rem;
    color: var(--aeris-text-secondary);
    margin-bottom: 12px;
  }

  .ai-insight-stats {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .ai-stat {
    flex: 1;
    text-align: center;
  }

  .ai-stat-value {
    display: block;
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--aeris-text);
  }

  .ai-stat-label {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--aeris-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .ai-stat-divider {
    width: 1px;
    height: 28px;
    background: var(--aeris-divider);
  }

  /* ─── Timeline ─── */
  .timeline-area {
    position: absolute;
    bottom: 100px;
    left: 20px;
    right: 20px;
    z-index: 10;
  }

  .timeline-bar {
    padding: 14px 12px;
    border-radius: 22px;
  }

  .timeline-track {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .timeline-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 6px;
    position: relative;
    z-index: 2;
    -webkit-tap-highlight-color: transparent;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #D1D1D6;
    transition: all 0.4s var(--spring-bounce);
  }

  .timeline-dot.active {
    background: var(--aeris-blue);
    box-shadow: 0 0 12px var(--aeris-blue-glow);
    transform: scale(1.3);
  }

  .timeline-label {
    font-size: 0.625rem;
    font-weight: 600;
    color: var(--aeris-text-tertiary);
    transition: color 0.3s ease;
  }

  .timeline-label.active {
    color: var(--aeris-blue);
  }

  .timeline-progress {
    position: absolute;
    top: 8px;
    left: 10px;
    height: 2px;
    background: var(--aeris-blue);
    border-radius: 2px;
    transition: width 0.5s var(--spring-smooth);
    z-index: 1;
  }

  /* ─── Report FAB ─── */
  .report-fab {
    position: absolute;
    bottom: 200px;
    right: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--aeris-blue), var(--aeris-teal));
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(79, 140, 255, 0.35);
    transition: all 0.3s var(--spring-bounce);
    z-index: 10;
    display: none;
  }

  .report-fab:active {
    transform: scale(0.9);
  }

  /* ─── Bottom Sheet Content ─── */
  .sheet-content {
    padding: 0 24px 32px;
  }

  .sheet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .aqi-badge-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 16px;
    border-radius: 16px;
    min-width: 64px;
  }

  .aqi-value {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
  }

  .aqi-label-small {
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.8;
  }

  .sheet-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .sheet-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: var(--aeris-bg);
    border-radius: var(--radius-md);
  }

  .stat-icon {
    display: flex;
  }

  .stat-val {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--aeris-text);
  }

  .stat-key {
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--aeris-text-tertiary);
    text-align: center;
  }

  .sheet-nearby {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .nearby-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8125rem;
    color: var(--aeris-text-secondary);
  }

  .sheet-action {
    background: rgba(255, 176, 32, 0.08);
    border: 1px solid rgba(255, 176, 32, 0.15);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    margin-bottom: 20px;
  }

  .action-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sheet-buttons {
    display: flex;
    gap: 10px;
  }
</style>
