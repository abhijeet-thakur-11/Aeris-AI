<script>
  import { page } from '$app/stores';
  import { Home, Sparkles, Bell, BarChart3, User } from '@lucide/svelte';
  import AIAssistant from '$lib/components/AIAssistant.svelte';
  import '../app.css';

  let { children } = $props();
  let aiOpen = $state(false);

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { action: 'ai', icon: Sparkles, label: 'Assistant' },
    { path: '/alerts', icon: Bell, label: 'Alerts' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];
</script>

<div class="app-shell">
  <main class="app-content">
    {@render children()}
  </main>

  <!-- Floating Bottom Navigation -->
  <nav class="bottom-nav glass-card-heavy" id="bottom-navigation">
    {#each tabs as tab}
      {@const Icon = tab.icon}
      {#if tab.action === 'ai'}
        <button
          class="nav-tab"
          class:active={aiOpen}
          onclick={() => aiOpen = !aiOpen}
          aria-label={tab.label}
          id="nav-{tab.label.toLowerCase()}"
        >
          <div class="nav-icon-wrapper" class:active={aiOpen}>
            <Icon size={22} strokeWidth={aiOpen ? 2.5 : 1.5} />
          </div>
          <span class="nav-label">{tab.label}</span>
        </button>
      {:else}
        {@const isTabActive = tab.path === '/' ? $page.url.pathname === '/' : $page.url.pathname === tab.path}
        <a
          href={tab.path}
          class="nav-tab"
          class:active={isTabActive}
          aria-label={tab.label}
          id="nav-{tab.label.toLowerCase()}"
        >
          <div class="nav-icon-wrapper" class:active={isTabActive}>
            <Icon size={22} strokeWidth={isTabActive ? 2.5 : 1.5} />
          </div>
          <span class="nav-label">{tab.label}</span>
        </a>
      {/if}
    {/each}
  </nav>

  <AIAssistant bind:isOpen={aiOpen} />
</div>

<style>
  .app-shell {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--aeris-bg);
    overflow: hidden;
  }

  .app-content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  /* ─── Bottom Navigation ─── */
  .bottom-nav {
    position: fixed;
    bottom: 16px;
    left: 20px;
    right: 20px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 800;
    border-radius: 28px;
    padding: 0 8px;
    box-shadow:
      0 8px 40px rgba(0, 0, 0, 0.08),
      0 2px 12px rgba(0, 0, 0, 0.04);
  }

  .nav-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    text-decoration: none;
    color: var(--aeris-text-tertiary);
    transition: color 0.3s var(--spring-smooth);
    position: relative;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-tab.active {
    color: var(--aeris-blue);
  }

  .nav-icon-wrapper {
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    transition: all 0.35s var(--spring-bounce);
  }

  .nav-icon-wrapper.active {
    background: rgba(79, 140, 255, 0.12);
    animation: glow-pulse 2.5s ease-in-out infinite;
  }

  .nav-label {
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .nav-tab:active .nav-icon-wrapper {
    transform: scale(0.88);
  }
</style>
