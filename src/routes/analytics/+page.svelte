<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import {
    dailyAQI,
    pollutionSources,
    weeklyTrend,
    worstLocations,
    predictionAccuracy,
    aiFactors,
    alerts,
    getAQIColor
  } from '$lib/data/mockData.js';
  import { Activity, Target, AlertTriangle, TrendingUp, PieChart, BarChart3, Brain, Sparkles } from '@lucide/svelte';

  let aqiChartCanvas;
  let sourcesChartCanvas;
  let trendChartCanvas;
  let factorsVisible = $state(false);

  let avgAQI = $derived(
    Math.round(dailyAQI.data.reduce((a, b) => a + b, 0) / dailyAQI.data.length)
  );

  let activeAlertCount = $derived(
    alerts.filter(a => a.status !== 'Resolved').length
  );

  onMount(() => {
    // ─── Daily AQI Line Chart ───
    new Chart(aqiChartCanvas, {
      type: 'line',
      data: {
        labels: dailyAQI.labels,
        datasets: [{
          label: 'AQI',
          data: dailyAQI.data,
          borderColor: '#4F8CFF',
          backgroundColor: 'rgba(79, 140, 255, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#4F8CFF',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            padding: 12,
            cornerRadius: 12,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#A0A0A8'
            },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#A0A0A8',
              padding: 8
            },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    // ─── Pollution Sources Doughnut ───
    new Chart(sourcesChartCanvas, {
      type: 'doughnut',
      data: {
        labels: pollutionSources.labels,
        datasets: [{
          data: pollutionSources.data,
          backgroundColor: pollutionSources.colors,
          borderWidth: 0,
          spacing: 3,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#6E6E73'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            padding: 12,
            cornerRadius: 12
          }
        }
      }
    });

    // ─── Weekly Trend Area Chart ───
    new Chart(trendChartCanvas, {
      type: 'line',
      data: {
        labels: weeklyTrend.labels,
        datasets: [{
          label: 'AQI',
          data: weeklyTrend.data,
          borderColor: '#36CFC9',
          backgroundColor: 'rgba(54, 207, 201, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#36CFC9',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            padding: 12,
            cornerRadius: 12,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#A0A0A8'
            },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: '500' },
              color: '#A0A0A8',
              padding: 8
            },
            border: { display: false }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    // Animate AI factors in
    setTimeout(() => factorsVisible = true, 500);
  });
</script>

<div class="analytics-page">
  <!-- Header -->
  <header class="analytics-header animate-float-up">
    <div class="header-icon-wrap">
      <Activity size={22} strokeWidth={2.5} />
    </div>
    <div>
      <h1 class="text-title">Analytics</h1>
      <p class="text-caption">AI-powered environmental insights</p>
    </div>
  </header>

  <!-- Summary Cards -->
  <div class="summary-row stagger-children">
    <div class="summary-card glass-card-heavy">
      <div class="summary-icon" style="background: rgba(79, 140, 255, 0.12); color: #4F8CFF;">
        <Activity size={20} />
      </div>
      <span class="summary-value" style="color: {getAQIColor(avgAQI)};">{avgAQI}</span>
      <span class="text-micro">City AQI</span>
    </div>

    <div class="summary-card glass-card-heavy">
      <div class="summary-icon" style="background: rgba(48, 209, 88, 0.12); color: #30D158;">
        <Target size={20} />
      </div>
      <span class="summary-value" style="color: #30D158;">{predictionAccuracy}%</span>
      <span class="text-micro">AI Accuracy</span>
    </div>

    <div class="summary-card glass-card-heavy">
      <div class="summary-icon" style="background: rgba(255, 77, 79, 0.12); color: #FF4D4F;">
        <AlertTriangle size={20} />
      </div>
      <span class="summary-value" style="color: #FF4D4F;">{activeAlertCount}</span>
      <span class="text-micro">Active Alerts</span>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="charts-section stagger-children">
    <!-- Daily AQI Chart -->
    <div class="chart-card float-card animate-float-up">
      <div class="chart-header">
        <div class="chart-title-group">
          <TrendingUp size={16} class="chart-title-icon" />
          <h3 class="text-headline">Daily AQI Trend</h3>
        </div>
        <span class="badge badge-info">7 days</span>
      </div>
      <div class="chart-wrap" style="height: 200px;">
        <canvas bind:this={aqiChartCanvas}></canvas>
      </div>
    </div>

    <!-- Pollution Sources Chart -->
    <div class="chart-card float-card animate-float-up" style="animation-delay: 0.1s;">
      <div class="chart-header">
        <div class="chart-title-group">
          <PieChart size={16} class="chart-title-icon" />
          <h3 class="text-headline">Pollution Sources</h3>
        </div>
        <span class="badge badge-info">Breakdown</span>
      </div>
      <div class="chart-wrap" style="height: 240px;">
        <canvas bind:this={sourcesChartCanvas}></canvas>
      </div>
    </div>

    <!-- Worst Locations -->
    <div class="chart-card float-card animate-float-up" style="animation-delay: 0.2s;">
      <div class="chart-header">
        <div class="chart-title-group">
          <BarChart3 size={16} class="chart-title-icon" />
          <h3 class="text-headline">Worst Locations</h3>
        </div>
        <span class="badge badge-critical">Top 5</span>
      </div>
      <div class="locations-bars">
        {#each worstLocations as loc, i}
          <div class="location-row" style="animation-delay: {0.3 + i * 0.1}s;">
            <span class="location-rank">{i + 1}</span>
            <span class="text-caption location-name">{loc.name}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                style="width: {loc.aqi / 400 * 100}%; background: {getAQIColor(loc.aqi)}; transition: width 1s ease {0.5 + i * 0.15}s;"
              ></div>
            </div>
            <span class="location-aqi" style="color: {getAQIColor(loc.aqi)};">{loc.aqi}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Weekly Trend Chart -->
    <div class="chart-card float-card animate-float-up" style="animation-delay: 0.3s;">
      <div class="chart-header">
        <div class="chart-title-group">
          <TrendingUp size={16} class="chart-title-icon" />
          <h3 class="text-headline">Weekly Trend</h3>
        </div>
        <span class="badge badge-low">Improving</span>
      </div>
      <div class="chart-wrap" style="height: 200px;">
        <canvas bind:this={trendChartCanvas}></canvas>
      </div>
    </div>

    <!-- AI Explainability Card -->
    <div class="ai-card float-card animate-float-up" style="animation-delay: 0.4s;">
      <div class="ai-card-header">
        <div class="ai-icon-wrap">
          <Brain size={22} />
        </div>
        <div>
          <h3 class="text-headline">Why did AI predict this?</h3>
          <p class="text-caption">Model explainability factors</p>
        </div>
        <Sparkles size={18} class="sparkle-icon" />
      </div>

      <div class="factors-list">
        {#each aiFactors as factor, i}
          <div class="factor-row">
            <div class="factor-info">
              <span class="factor-name">{factor.factor}</span>
              <span class="factor-weight" style="color: {factor.color};">{factor.weight}%</span>
            </div>
            <div class="factor-bar-track">
              <div
                class="factor-bar-fill"
                style="
                  width: {factorsVisible ? factor.weight : 0}%;
                  background: linear-gradient(90deg, {factor.color}, {factor.color}88);
                  transition: width 1.2s var(--ease-premium) {0.2 + i * 0.15}s;
                "
              ></div>
            </div>
          </div>
        {/each}
      </div>

      <div class="ai-card-footer">
        <span class="text-micro">Based on 50+ environmental variables and ML analysis</span>
      </div>
    </div>
  </div>
</div>

<style>
  .analytics-page {
    height: 100vh;
    overflow-y: auto;
    background: var(--aeris-bg);
    padding-bottom: 100px;
  }

  /* ─── Header ─── */
  .analytics-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 20px 16px;
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--glass-bg-heavy);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border-bottom: 1px solid var(--aeris-border);
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

  /* ─── Summary Cards ─── */
  .summary-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 20px 20px 8px;
  }

  .summary-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 18px 10px 14px;
    text-align: center;
  }

  .summary-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .summary-value {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* ─── Charts Section ─── */
  .charts-section {
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chart-card {
    padding: 20px;
  }

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .chart-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .chart-title-group :global(.chart-title-icon) {
    color: var(--aeris-blue);
  }

  .chart-wrap {
    position: relative;
    width: 100%;
  }

  /* ─── Worst Locations ─── */
  .locations-bars {
    padding: 4px 0;
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
    animation: float-up 0.5s var(--spring-bounce) both;
  }

  .location-row:last-child {
    margin-bottom: 0;
  }

  .location-rank {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: var(--aeris-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6875rem;
    font-weight: 700;
    color: var(--aeris-text-secondary);
    flex-shrink: 0;
  }

  .location-name {
    width: 110px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar-track {
    flex: 1;
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--aeris-bg);
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    width: 0;
  }

  .location-aqi {
    width: 40px;
    text-align: right;
    font-size: 0.8125rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  /* ─── AI Explainability Card ─── */
  .ai-card {
    padding: 22px;
    background: linear-gradient(135deg, var(--aeris-card), rgba(79, 140, 255, 0.03));
  }

  .ai-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
  }

  .ai-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(79, 140, 255, 0.15), rgba(54, 207, 201, 0.15));
    color: var(--aeris-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ai-card-header :global(.sparkle-icon) {
    color: var(--aeris-warning);
    margin-left: auto;
    animation: breathe 3s ease-in-out infinite;
  }

  .factors-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .factor-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .factor-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .factor-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aeris-text);
  }

  .factor-weight {
    font-size: 0.8125rem;
    font-weight: 700;
  }

  .factor-bar-track {
    height: 8px;
    border-radius: var(--radius-full);
    background: var(--aeris-bg);
    overflow: hidden;
  }

  .factor-bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    width: 0;
  }

  .ai-card-footer {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--aeris-divider);
    text-align: center;
  }
</style>
