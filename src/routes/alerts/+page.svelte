<script>
  import { alerts } from '$lib/data/mockData.js';
  import { Flame, Factory, HardHat, Car, GraduationCap, Cloud, Leaf, Bell, Filter, Clock, Zap, MapPin, Shield, ChevronRight } from '@lucide/svelte';

  const iconMap = {
    flame: Flame,
    factory: Factory,
    'hard-hat': HardHat,
    car: Car,
    school: GraduationCap,
    cloud: Cloud,
    leaf: Leaf
  };

  const filters = ['All', 'Critical', 'High', 'Active', 'Resolved'];

  let activeFilter = $state('All');

  let filteredAlerts = $derived(
    activeFilter === 'All'
      ? alerts
      : activeFilter === 'Active'
        ? alerts.filter(a => a.status === 'Active' || a.status === 'Responding' || a.status === 'Monitoring')
        : activeFilter === 'Resolved'
          ? alerts.filter(a => a.status === 'Resolved')
          : alerts.filter(a => a.priority === activeFilter.toLowerCase())
  );

  function getPriorityAccent(priority) {
    switch (priority) {
      case 'critical': return '#FF4D4F';
      case 'high': return '#FF8C00';
      case 'medium': return '#FFB020';
      case 'low': return '#30D158';
      default: return '#4F8CFF';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Active': return 'badge-critical';
      case 'Responding': return 'badge-high';
      case 'Monitoring': return 'badge-medium';
      case 'Advisory Sent': return 'badge-info';
      case 'Predicted': return 'badge-info';
      case 'Resolved': return 'badge-low';
      default: return 'badge-info';
    }
  }

  function getPriorityBadge(priority) {
    switch (priority) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-info';
    }
  }
</script>

<div class="alerts-page">
  <!-- Header -->
  <header class="alerts-header animate-float-up">
    <div class="header-top">
      <div class="header-title-group">
        <div class="header-icon-wrap">
          <Bell size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 class="text-title">Alerts</h1>
          <p class="text-caption">{filteredAlerts.length} alerts found</p>
        </div>
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="filter-chips">
      {#each filters as filter}
        <button
          class="chip"
          class:active={activeFilter === filter}
          onclick={() => activeFilter = filter}
        >
          {filter}
          {#if filter === 'Critical'}
            <span class="chip-count critical">{alerts.filter(a => a.priority === 'critical').length}</span>
          {:else if filter === 'High'}
            <span class="chip-count high">{alerts.filter(a => a.priority === 'high').length}</span>
          {:else if filter === 'Active'}
            <span class="chip-count active-count">{alerts.filter(a => a.status === 'Active' || a.status === 'Responding' || a.status === 'Monitoring').length}</span>
          {/if}
        </button>
      {/each}
    </div>
  </header>

  <!-- Alert Timeline -->
  <div class="alerts-list stagger-children">
    {#each filteredAlerts as alert, i (alert.id)}
      {@const IconComponent = iconMap[alert.icon]}
      <div class="alert-card float-card animate-float-up" style="animation-delay: {i * 0.07}s;">
        <!-- Color Accent Bar -->
        <div class="accent-bar" style="background: {getPriorityAccent(alert.priority)};"></div>

        <div class="alert-content">
          <!-- Top Row: Icon + Title + Time -->
          <div class="alert-top-row">
            <div class="alert-icon-wrap" style="background: {getPriorityAccent(alert.priority)}15; color: {getPriorityAccent(alert.priority)};">
              {#if IconComponent}
                <IconComponent size={20} />
              {/if}
            </div>
            <div class="alert-title-group">
              <h3 class="text-headline">{alert.type}</h3>
              <div class="alert-location">
                <MapPin size={12} />
                <span class="text-caption">{alert.location}</span>
              </div>
            </div>
            <div class="alert-time-badge">
              <Clock size={11} />
              <span>{alert.time}</span>
            </div>
          </div>

          <!-- Badges Row -->
          <div class="badges-row">
            <span class="badge {getStatusColor(alert.status)}">
              {#if alert.status === 'Active'}
                <span class="pulse-dot"></span>
              {/if}
              {alert.status}
            </span>
            <span class="badge {getPriorityBadge(alert.priority)}">
              {alert.priority}
            </span>
            <span class="badge badge-info">
              <Shield size={10} />
              {alert.verification}
            </span>
          </div>

          <!-- AI Prediction -->
          <div class="ai-prediction">
            <div class="prediction-row">
              <Zap size={13} class="prediction-icon" />
              <span class="text-caption"><strong>AI Prediction:</strong> {alert.prediction}</span>
            </div>
          </div>

          <!-- Action & ETA Row -->
          <div class="action-row">
            <div class="action-item">
              <span class="text-micro">Recommended Action</span>
              <span class="action-text">{alert.action}</span>
            </div>
            <div class="eta-item">
              <span class="text-micro">ETA</span>
              <span class="eta-text">{alert.eta}</span>
            </div>
            <button class="action-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    {/each}

    {#if filteredAlerts.length === 0}
      <div class="empty-state animate-float-up">
        <Bell size={48} strokeWidth={1.5} />
        <p class="text-headline">No alerts found</p>
        <p class="text-caption">Try adjusting your filters</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .alerts-page {
    height: 100vh;
    overflow-y: auto;
    background: var(--aeris-bg);
    padding-bottom: 100px;
  }

  /* ─── Header ─── */
  .alerts-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--glass-bg-heavy);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--aeris-border);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .header-title-group {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--aeris-blue), var(--aeris-teal));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px var(--aeris-blue-glow);
  }

  /* ─── Filter Chips ─── */
  .filter-chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .filter-chips::-webkit-scrollbar {
    display: none;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--aeris-border);
    background: var(--aeris-card);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--aeris-text-secondary);
    cursor: pointer;
    transition: all 0.3s var(--spring-bounce);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .chip:hover {
    border-color: var(--aeris-blue);
    color: var(--aeris-blue);
  }

  .chip.active {
    background: var(--aeris-blue);
    color: white;
    border-color: var(--aeris-blue);
    box-shadow: 0 4px 16px var(--aeris-blue-glow);
  }

  .chip-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    font-size: 0.6875rem;
    font-weight: 700;
    padding: 0 5px;
  }

  .chip-count.critical {
    background: rgba(255, 77, 79, 0.15);
    color: #FF4D4F;
  }

  .chip.active .chip-count.critical {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  .chip-count.high {
    background: rgba(255, 140, 0, 0.15);
    color: #FF8C00;
  }

  .chip.active .chip-count.high {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  .chip-count.active-count {
    background: rgba(79, 140, 255, 0.15);
    color: #4F8CFF;
  }

  .chip.active .chip-count.active-count {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  /* ─── Alert List ─── */
  .alerts-list {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ─── Alert Card ─── */
  .alert-card {
    position: relative;
    overflow: hidden;
    padding: 0;
  }

  .accent-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 4px 0 0 4px;
  }

  .alert-content {
    padding: 18px 18px 16px 22px;
  }

  /* ─── Top Row ─── */
  .alert-top-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
  }

  .alert-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .alert-title-group {
    flex: 1;
    min-width: 0;
  }

  .alert-title-group .text-headline {
    margin-bottom: 2px;
  }

  .alert-location {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--aeris-text-secondary);
  }

  .alert-time-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: var(--aeris-bg);
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--aeris-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ─── Badges ─── */
  .badges-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  /* ─── AI Prediction ─── */
  .ai-prediction {
    background: linear-gradient(135deg, rgba(79, 140, 255, 0.06), rgba(54, 207, 201, 0.06));
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    margin-bottom: 12px;
    border: 1px solid rgba(79, 140, 255, 0.1);
  }

  .prediction-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prediction-row :global(.prediction-icon) {
    color: var(--aeris-blue);
    flex-shrink: 0;
  }

  .prediction-row .text-caption strong {
    color: var(--aeris-blue);
  }

  /* ─── Action Row ─── */
  .action-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .action-item {
    flex: 1;
    min-width: 0;
  }

  .action-item .text-micro {
    display: block;
    margin-bottom: 2px;
  }

  .action-text {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--aeris-text);
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .eta-item {
    flex-shrink: 0;
    text-align: right;
  }

  .eta-item .text-micro {
    display: block;
    margin-bottom: 2px;
  }

  .eta-text {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--aeris-blue);
  }

  .action-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: var(--aeris-bg);
    color: var(--aeris-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s var(--spring-bounce);
    flex-shrink: 0;
  }

  .action-btn:hover {
    background: var(--aeris-blue);
    color: white;
    box-shadow: 0 4px 12px var(--aeris-blue-glow);
  }

  /* ─── Empty State ─── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px 20px;
    color: var(--aeris-text-tertiary);
    text-align: center;
  }

  .empty-state .text-headline {
    color: var(--aeris-text-secondary);
  }
</style>
