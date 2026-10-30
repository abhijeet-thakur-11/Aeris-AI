<script>
  import { userProfile, smartRoute, resources, recommendations } from '$lib/data/mockData.js';
  import { User, Navigation, Truck, Search, Users, Heart, GitBranch, Sparkles, Droplets, Shield, Bell, MapPin, Share2, Moon, ChevronRight, Route, Zap } from '@lucide/svelte';

  // Settings toggles
  let darkMode = $state(false);
  let pushNotifications = $state(true);
  let locationServices = $state(true);
  let dataSharing = $state(false);

  // Icon map for recommendations
  const iconMap = {
    'droplets': Droplets,
    'search': Search,
    'git-branch': GitBranch,
    'sparkles': Sparkles,
    'heart': Heart
  };

  // Priority color map
  function getPriorityClass(priority) {
    const p = priority.toLowerCase();
    if (p === 'critical') return 'badge-critical';
    if (p === 'high') return 'badge-high';
    if (p === 'medium') return 'badge-medium';
    return 'badge-low';
  }

  // Resource data formatted for display
  let resourceList = $derived([
    { name: 'Water Tankers', ...resources.waterTankers, color: '#4F8CFF' },
    { name: 'Inspection Teams', ...resources.inspectionTeams, color: '#36CFC9' },
    { name: 'Pollution Vehicle', ...resources.pollutionVehicle, color: '#FF8C00' },
    { name: 'Street Sweepers', ...resources.streetSweepers, color: '#30D158' }
  ]);

  // Health score SVG calculations
  const radius = 52;
  const circumference = radius * 2 * Math.PI;
  let dashOffset = $derived(circumference * (1 - userProfile.healthScore / 100));
</script>

<div class="profile-page">
  <!-- Header / Avatar Section -->
  <section class="profile-header">
    <div class="avatar-ring">
      <div class="avatar">
        <span class="avatar-initials">AM</span>
      </div>
    </div>
    <h1 class="profile-name">{userProfile.name}</h1>
    <p class="profile-role">{userProfile.role}</p>
    <p class="profile-dept">{userProfile.department}</p>
  </section>

  <!-- Stats Row -->
  <section class="stats-row stagger-children">
    <div class="stat-item">
      <span class="stat-value">{userProfile.reportsSubmitted}</span>
      <span class="stat-label">Reports</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-value">{userProfile.alertsActioned}</span>
      <span class="stat-label">Alerts Actioned</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
      <span class="stat-value">{userProfile.joinedDate}</span>
      <span class="stat-label">Joined</span>
    </div>
  </section>

  <!-- Health Score Card -->
  <section class="glass-card health-card animate-float-up">
    <div class="health-content">
      <div class="health-chart">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(79,140,255,0.1)" stroke-width="8" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#healthGradient)" stroke-width="8"
            stroke-dasharray={circumference}
            stroke-dashoffset={dashOffset}
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
            style="transition: stroke-dashoffset 1.5s ease" />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4F8CFF" />
              <stop offset="100%" stop-color="#36CFC9" />
            </linearGradient>
          </defs>
        </svg>
        <div class="health-score-text">
          <span class="health-score-number">{userProfile.healthScore}</span>
          <span class="health-score-max">/100</span>
        </div>
      </div>
      <div class="health-info">
        <div class="health-label-row">
          <Heart size={16} color="#4F8CFF" />
          <span class="text-caption">Personal AQI Health Score</span>
        </div>
        <p class="health-description">Based on your commute patterns and exposure zones. Moderate — consider optimizing your routes.</p>
      </div>
    </div>
  </section>

  <!-- Smart Route Section -->
  <section class="float-card route-section animate-float-up" style="animation-delay: 0.1s">
    <div class="section-header">
      <div class="section-icon-wrap route-icon">
        <Route size={18} color="#4F8CFF" />
      </div>
      <div>
        <h2 class="text-headline">Smart Route</h2>
        <p class="text-micro" style="margin-top: 2px">{smartRoute.origin} → {smartRoute.destination}</p>
      </div>
    </div>

    <div class="route-cards">
      <!-- Fastest Route -->
      <div class="route-card route-fastest">
        <div class="route-card-header">
          <Zap size={14} color="#FF8C00" />
          <span class="route-card-title">Fastest</span>
        </div>
        <div class="route-card-time">{smartRoute.fastest.time}</div>
        <div class="route-card-meta">{smartRoute.fastest.distance}</div>
        <div class="route-aqi-badge danger">
          AQI {smartRoute.fastest.avgAQI}
        </div>
      </div>

      <!-- Healthiest Route -->
      <div class="route-card route-healthiest">
        <div class="route-card-header">
          <Heart size={14} color="#30D158" />
          <span class="route-card-title">Healthiest</span>
        </div>
        <div class="route-card-time">{smartRoute.healthiest.time}</div>
        <div class="route-card-meta">{smartRoute.healthiest.distance}</div>
        <div class="route-aqi-badge warning">
          AQI {smartRoute.healthiest.avgAQI}
        </div>
        <div class="route-reduction-badge">
          <Shield size={10} />
          {smartRoute.healthiest.reduction}
        </div>
      </div>
    </div>
  </section>

  <!-- Resource Optimization -->
  <section class="float-card resource-section animate-float-up" style="animation-delay: 0.15s">
    <div class="section-header">
      <div class="section-icon-wrap resource-icon">
        <Truck size={18} color="#36CFC9" />
      </div>
      <h2 class="text-headline">Resource Deployment</h2>
    </div>

    <div class="resource-list">
      {#each resourceList as resource}
        <div class="resource-item">
          <div class="resource-info">
            <span class="resource-name">{resource.name}</span>
            <span class="resource-count">{resource.deployed}/{resource.total} deployed</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              style="width: {(resource.deployed / resource.total) * 100}%; background: {resource.color}"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Smart Recommendations -->
  <section class="recommendations-section animate-float-up" style="animation-delay: 0.2s">
    <div class="section-header-inline">
      <Sparkles size={18} color="#4F8CFF" />
      <h2 class="text-headline">Smart Recommendations</h2>
    </div>

    <div class="recommendation-list stagger-children">
      {#each recommendations as rec}
        {@const Icon = iconMap[rec.icon]}
        <div class="float-card recommendation-card">
          <div class="rec-top">
            <div class="rec-icon-wrap" style="background: {rec.priority === 'Critical' ? 'rgba(255,77,79,0.1)' : rec.priority === 'High' ? 'rgba(255,140,0,0.1)' : 'rgba(79,140,255,0.1)'}">
              <Icon size={18} color={rec.priority === 'Critical' ? '#FF4D4F' : rec.priority === 'High' ? '#FF8C00' : '#4F8CFF'} />
            </div>
            <div class="rec-info">
              <h3 class="rec-action">{rec.action}</h3>
              <p class="text-caption">{rec.location}</p>
            </div>
            <span class="badge {getPriorityClass(rec.priority)}">{rec.priority}</span>
          </div>
          <div class="rec-bottom">
            <div class="rec-stat">
              <span class="rec-stat-label">AQI Reduction</span>
              <span class="rec-stat-value">{rec.aqiReduction}</span>
            </div>
            <div class="rec-stat">
              <span class="rec-stat-label">Affected</span>
              <span class="rec-stat-value">{rec.affectedPop}</span>
            </div>
            <div class="rec-stat">
              <span class="rec-stat-label">Response</span>
              <span class="rec-stat-value">{rec.responseTime}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Settings Section -->
  <section class="float-card settings-section animate-float-up" style="animation-delay: 0.25s">
    <div class="section-header">
      <div class="section-icon-wrap settings-icon">
        <User size={18} color="#6E6E73" />
      </div>
      <h2 class="text-headline">Settings</h2>
    </div>

    <div class="settings-list">
      <div class="setting-item">
        <div class="setting-label">
          <Moon size={18} color="#6E6E73" />
          <span>Dark Mode</span>
        </div>
        <button class="toggle" class:active={darkMode} onclick={() => darkMode = !darkMode}></button>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <Bell size={18} color="#6E6E73" />
          <span>Push Notifications</span>
        </div>
        <button class="toggle" class:active={pushNotifications} onclick={() => pushNotifications = !pushNotifications}></button>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <MapPin size={18} color="#6E6E73" />
          <span>Location Services</span>
        </div>
        <button class="toggle" class:active={locationServices} onclick={() => locationServices = !locationServices}></button>
      </div>

      <div class="setting-item">
        <div class="setting-label">
          <Share2 size={18} color="#6E6E73" />
          <span>Data Sharing</span>
        </div>
        <button class="toggle" class:active={dataSharing} onclick={() => dataSharing = !dataSharing}></button>
      </div>
    </div>
  </section>

  <div class="profile-footer">
    <p class="text-micro">AERIS AI v2.1 • Made with 💙 for cleaner air</p>
  </div>
</div>

<style>
  .profile-page {
    height: 100vh;
    overflow-y: auto;
    padding: 24px 16px 120px;
    background: var(--aeris-bg);
    -webkit-overflow-scrolling: touch;
  }

  /* ─── Header / Avatar ─── */
  .profile-header {
    text-align: center;
    margin-bottom: 24px;
    animation: float-up 0.5s var(--spring-bounce) both;
  }

  .avatar-ring {
    width: 96px;
    height: 96px;
    margin: 0 auto 16px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(135deg, #4F8CFF, #36CFC9, #4F8CFF);
    background-size: 200% 200%;
    animation: gradient-spin 4s ease infinite;
  }

  @keyframes gradient-spin {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #4F8CFF 0%, #36CFC9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(79, 140, 255, 0.3);
  }

  .avatar-initials {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    letter-spacing: -0.02em;
  }

  .profile-name {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--aeris-text);
  }

  .profile-role {
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--aeris-text-secondary);
    margin-top: 2px;
  }

  .profile-dept {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aeris-blue);
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 12px;
    background: rgba(79, 140, 255, 0.08);
    border-radius: var(--radius-full);
  }

  /* ─── Stats Row ─── */
  .stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    margin-bottom: 20px;
    padding: 16px 8px;
    background: var(--aeris-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--float-shadow);
    border: 1px solid var(--aeris-border);
  }

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--aeris-text);
    letter-spacing: -0.02em;
  }

  .stat-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--aeris-text-tertiary);
  }

  .stat-divider {
    width: 1px;
    height: 32px;
    background: var(--aeris-border);
  }

  /* ─── Health Score Card ─── */
  .health-card {
    padding: 24px;
    margin-bottom: 16px;
  }

  .health-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .health-chart {
    position: relative;
    flex-shrink: 0;
    width: 120px;
    height: 120px;
  }

  .health-score-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    gap: 1px;
  }

  .health-score-number {
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--aeris-blue);
    letter-spacing: -0.03em;
  }

  .health-score-max {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aeris-text-tertiary);
    margin-top: 8px;
  }

  .health-info {
    flex: 1;
  }

  .health-label-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .health-description {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: var(--aeris-text-secondary);
  }

  /* ─── Section Headers ─── */
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .section-header-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .section-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .route-icon {
    background: rgba(79, 140, 255, 0.1);
  }

  .resource-icon {
    background: rgba(54, 207, 201, 0.1);
  }

  .settings-icon {
    background: rgba(110, 110, 115, 0.1);
  }

  /* ─── Smart Route ─── */
  .route-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .route-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .route-card {
    padding: 16px;
    border-radius: var(--radius-md);
    position: relative;
    border: 1px solid var(--aeris-border);
  }

  .route-fastest {
    background: rgba(255, 140, 0, 0.04);
  }

  .route-healthiest {
    background: rgba(48, 209, 88, 0.04);
    border-color: rgba(48, 209, 88, 0.2);
  }

  .route-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }

  .route-card-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--aeris-text-secondary);
  }

  .route-card-time {
    font-size: 1.375rem;
    font-weight: 800;
    color: var(--aeris-text);
    letter-spacing: -0.02em;
  }

  .route-card-meta {
    font-size: 0.75rem;
    color: var(--aeris-text-tertiary);
    font-weight: 500;
    margin-top: 2px;
    margin-bottom: 10px;
  }

  .route-aqi-badge {
    display: inline-flex;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .route-aqi-badge.danger {
    background: rgba(255, 77, 79, 0.12);
    color: #FF4D4F;
  }

  .route-aqi-badge.warning {
    background: rgba(255, 176, 32, 0.12);
    color: #CC8E1A;
  }

  .route-reduction-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 0.625rem;
    font-weight: 700;
    color: #30D158;
    background: rgba(48, 209, 88, 0.1);
    padding: 3px 8px;
    border-radius: var(--radius-full);
    width: fit-content;
  }

  /* ─── Resources ─── */
  .resource-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .resource-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .resource-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .resource-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .resource-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--aeris-text);
  }

  .resource-count {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--aeris-text-tertiary);
  }

  /* ─── Recommendations ─── */
  .recommendations-section {
    margin-bottom: 16px;
  }

  .recommendation-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recommendation-card {
    padding: 16px;
  }

  .rec-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .rec-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rec-info {
    flex: 1;
    min-width: 0;
  }

  .rec-action {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--aeris-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rec-bottom {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--aeris-divider);
  }

  .rec-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rec-stat-label {
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--aeris-text-tertiary);
  }

  .rec-stat-value {
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--aeris-text);
  }

  /* ─── Settings ─── */
  .settings-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .settings-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid var(--aeris-divider);
  }

  .setting-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .setting-item:first-child {
    padding-top: 0;
  }

  .setting-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--aeris-text);
  }

  /* ─── Footer ─── */
  .profile-footer {
    text-align: center;
    padding: 24px 0 8px;
  }
</style>
