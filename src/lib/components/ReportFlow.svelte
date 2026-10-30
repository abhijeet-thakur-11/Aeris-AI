<script>
  import { reportClassifications } from '$lib/data/mockData.js';
  const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:8000/api";
  import { Camera, Mic, MapPin, Check, X, ArrowRight, Sparkles } from '@lucide/svelte';
  import { Flame, HardHat, Trash2, Factory, Car } from '@lucide/svelte';
  import { fly, fade, scale } from 'svelte/transition';

  let { isOpen = false, onClose = () => {} } = $props();

  let step = $state(1);
  let description = $state('');
  let classification = $state(null);
  let isAnalyzing = $state(false);

  // Map icon strings to Lucide components
  const iconMap = {
    'flame': Flame,
    'hard-hat': HardHat,
    'trash': Trash2,
    'factory': Factory,
    'car': Car
  };

  function handleCapture() {
    // Simulate photo capture → advance to step 2
    step = 2;
  }

  async function handleAnalyze() {
    isAnalyzing = true;
    try {
      // Create a simple 1x1 transparent pixel base64 for prototyping since we don't have a real camera capture hooked up
      const dummyB64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      const res = await fetch(`${apiUrl}/upload/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image_b64: dummyB64,
          latitude: 28.6139 + (Math.random() - 0.5) * 0.1, // Random near Delhi
          longitude: 77.2090 + (Math.random() - 0.5) * 0.1
        })
      });
      
      const data = await res.json();
      if (data && data.incident) {
        classification = {
          type: data.incident.pollution_type,
          confidence: data.incident.confidence,
          severity: data.incident.severity,
          icon: data.incident.pollution_type === 'Garbage Burning' ? 'flame' : 
                data.incident.pollution_type === 'Construction Dust' ? 'hard-hat' :
                data.incident.pollution_type === 'Industrial Smoke' ? 'factory' :
                data.incident.pollution_type === 'Vehicle Pollution' ? 'car' : 'trash'
        };
      }
    } catch (e) {
      console.error("AI Analysis failed:", e);
      classification = { type: 'Analysis Error', confidence: 0, severity: 'Unknown', icon: 'trash' };
    } finally {
      isAnalyzing = false;
      step = 3;
    }
  }

  function handleSubmit() {
    // Reset and close
    step = 1;
    description = '';
    classification = null;
    onClose();
  }

  function handleClose() {
    step = 1;
    description = '';
    classification = null;
    onClose();
  }

  // Confidence bar animation
  let confidenceWidth = $derived(classification ? classification.confidence : 0);
</script>

{#if isOpen}
  <!-- Overlay -->
  <div class="report-overlay" transition:fade={{ duration: 300 }}>
    <div class="report-modal" transition:fly={{ y: 40, duration: 400 }}>
      <!-- Close Button -->
      <button class="report-close" onclick={handleClose}>
        <X size={18} color="var(--aeris-text-secondary)" />
      </button>

      <!-- Progress Dots -->
      <div class="progress-dots">
        {#each [1, 2, 3] as s}
          <div class="dot" class:active={step >= s} class:current={step === s}></div>
        {/each}
      </div>

      <!-- Step Content -->
      <div class="step-content">
        {#if step === 1}
          <div class="step-wrap" transition:fly={{ x: 0, y: 20, duration: 300 }}>
            <h2 class="step-title">Capture</h2>
            <p class="step-subtitle">Take a photo of the pollution source</p>

            <div class="capture-zone">
              <div class="capture-dashed">
                <div class="capture-icon-wrap">
                  <Camera size={32} color="var(--aeris-blue)" />
                </div>
                <p class="capture-text">Tap to capture or upload a photo</p>
                <p class="capture-hint">Supports JPG, PNG up to 10MB</p>
              </div>
            </div>

            <button class="btn-primary capture-btn" onclick={handleCapture}>
              <Camera size={16} />
              Take a Photo
            </button>
          </div>

        {:else if step === 2}
          <div class="step-wrap" transition:fly={{ x: 0, y: 20, duration: 300 }}>
            <h2 class="step-title">Details</h2>
            <p class="step-subtitle">Add optional context to your report</p>

            <!-- Photo Preview Placeholder -->
            <div class="photo-preview">
              <div class="photo-check">
                <Check size={20} color="white" />
              </div>
              <span class="photo-label">Photo captured</span>
            </div>

            <!-- Description -->
            <div class="detail-field">
              <label class="detail-label">Description (optional)</label>
              <textarea
                class="detail-textarea"
                placeholder="Describe what you see..."
                bind:value={description}
                rows="3"
              ></textarea>
            </div>

            <!-- Voice Note -->
            <button class="voice-btn">
              <Mic size={16} color="var(--aeris-blue)" />
              <span>Add Voice Note</span>
            </button>

            <!-- Location Badge -->
            <div class="location-badge">
              <MapPin size={14} color="var(--aeris-teal)" />
              <span>Location auto-detected</span>
              <div class="location-dot"></div>
            </div>

            <button class="btn-primary analyze-btn" onclick={handleAnalyze}>
              {#if isAnalyzing}
                <div class="spinner"></div>
                Analyzing...
              {:else}
                <Sparkles size={16} />
                Analyze with AI
              {/if}
            </button>
          </div>

        {:else if step === 3}
          <div class="step-wrap" transition:fly={{ x: 0, y: 20, duration: 300 }}>
            <h2 class="step-title">AI Analysis</h2>
            <p class="step-subtitle">Classification result</p>

            {#if classification}
              <div class="analysis-result" transition:scale={{ start: 0.9, duration: 400 }}>
                <!-- Icon -->
                <div class="analysis-icon-wrap">
                  {#if iconMap[classification.icon]}
                    {@const Icon = iconMap[classification.icon]}
                    <Icon
                      size={36}
                      color="var(--aeris-blue)"
                    />
                  {/if}
                </div>

                <!-- Type -->
                <h3 class="analysis-type">{classification.type}</h3>

                <!-- Confidence -->
                <div class="confidence-section">
                  <div class="confidence-header">
                    <span class="confidence-label">AI Confidence</span>
                    <span class="confidence-value">{classification.confidence}%</span>
                  </div>
                  <div class="confidence-bar">
                    <div
                      class="confidence-fill"
                      style="width: {confidenceWidth}%"
                    ></div>
                  </div>
                </div>

                <!-- AI Badge -->
                <div class="ai-verified-badge">
                  <Sparkles size={12} color="#4F8CFF" />
                  <span>AI Verified Classification</span>
                </div>
              </div>

              <button class="btn-primary submit-btn" onclick={handleSubmit}>
                <Check size={16} />
                Submit Report
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* ─── Overlay ─── */
  .report-overlay {
    position: fixed;
    inset: 0;
    z-index: 900;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  /* ─── Modal ─── */
  .report-modal {
    position: relative;
    width: 100%;
    max-width: 420px;
    max-height: 85vh;
    overflow-y: auto;
    background: var(--glass-bg-heavy);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-radius: var(--radius-xl);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--glass-border);
    padding: 28px 24px;
    -webkit-overflow-scrolling: touch;
  }

  /* ─── Close Button ─── */
  .report-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--aeris-bg);
    border: 1px solid var(--aeris-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: background 0.2s;
  }

  .report-close:hover {
    background: var(--aeris-border);
  }

  /* ─── Progress Dots ─── */
  .progress-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #D1D1D6;
    transition: all 0.3s var(--spring-bounce);
  }

  .dot.active {
    background: var(--aeris-blue);
  }

  .dot.current {
    width: 24px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, #4F8CFF, #36CFC9);
  }

  /* ─── Step Content ─── */
  .step-content {
    min-height: 360px;
  }

  .step-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .step-title {
    font-size: 1.375rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--aeris-text);
    margin-bottom: 4px;
  }

  .step-subtitle {
    font-size: 0.875rem;
    color: var(--aeris-text-secondary);
    margin-bottom: 24px;
  }

  /* ─── Step 1: Capture ─── */
  .capture-zone {
    width: 100%;
    margin-bottom: 20px;
  }

  .capture-dashed {
    border: 2px dashed rgba(79, 140, 255, 0.3);
    border-radius: var(--radius-lg);
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: rgba(79, 140, 255, 0.03);
    cursor: pointer;
    transition: all 0.3s;
  }

  .capture-dashed:hover {
    border-color: rgba(79, 140, 255, 0.5);
    background: rgba(79, 140, 255, 0.06);
  }

  .capture-icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(79, 140, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .capture-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--aeris-text);
  }

  .capture-hint {
    font-size: 0.75rem;
    color: var(--aeris-text-tertiary);
  }

  .capture-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: center;
  }

  /* ─── Step 2: Details ─── */
  .photo-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(48, 209, 88, 0.08);
    border: 1px solid rgba(48, 209, 88, 0.2);
    border-radius: var(--radius-md);
    width: 100%;
    margin-bottom: 16px;
  }

  .photo-check {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #30D158;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .photo-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #28A745;
  }

  .detail-field {
    width: 100%;
    margin-bottom: 12px;
    text-align: left;
  }

  .detail-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--aeris-text-tertiary);
    margin-bottom: 6px;
  }

  .detail-textarea {
    width: 100%;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--aeris-border);
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--aeris-text);
    resize: none;
    outline: none;
    transition: border-color 0.2s;
  }

  .detail-textarea:focus {
    border-color: rgba(79, 140, 255, 0.3);
  }

  .detail-textarea::placeholder {
    color: var(--aeris-text-tertiary);
  }

  .voice-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--aeris-border);
    background: var(--aeris-bg);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--aeris-text);
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 12px;
    font-family: inherit;
  }

  .voice-btn:hover {
    background: rgba(79, 140, 255, 0.06);
    border-color: rgba(79, 140, 255, 0.2);
  }

  .location-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: var(--radius-full);
    background: rgba(54, 207, 201, 0.08);
    border: 1px solid rgba(54, 207, 201, 0.15);
    margin-bottom: 20px;
  }

  .location-badge span {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--aeris-teal);
  }

  .location-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--aeris-teal);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .analyze-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: center;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin-slow 0.8s linear infinite;
  }

  /* ─── Step 3: Analysis ─── */
  .analysis-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 24px;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    margin-bottom: 20px;
  }

  .analysis-icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(79, 140, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .analysis-type {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--aeris-text);
    letter-spacing: -0.01em;
  }

  .confidence-section {
    width: 100%;
  }

  .confidence-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .confidence-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--aeris-text-tertiary);
  }

  .confidence-value {
    font-size: 1rem;
    font-weight: 800;
    color: var(--aeris-blue);
  }

  .confidence-bar {
    height: 8px;
    background: var(--aeris-bg);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .confidence-fill {
    height: 100%;
    border-radius: var(--radius-full);
    background: linear-gradient(90deg, #4F8CFF, #36CFC9);
    transition: width 1s var(--ease-premium);
  }

  .ai-verified-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: var(--radius-full);
    background: rgba(79, 140, 255, 0.08);
    border: 1px solid rgba(79, 140, 255, 0.12);
  }

  .ai-verified-badge span {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--aeris-blue);
    letter-spacing: 0.02em;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    justify-content: center;
    background: linear-gradient(135deg, #30D158, #28A745);
  }

  .submit-btn:hover {
    box-shadow: 0 4px 20px rgba(48, 209, 88, 0.35);
  }
</style>
