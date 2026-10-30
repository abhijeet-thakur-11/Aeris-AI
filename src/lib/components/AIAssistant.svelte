<script>
  import { aiQuestions, aiResponses } from '$lib/data/mockData.js';
  import { Sparkles, X, Send, Bot } from '@lucide/svelte';
  import { fly, fade } from 'svelte/transition';

  let { isOpen = $bindable(false) } = $props();
  let messages = $state([]);
  let inputText = $state('');
  let chatArea = $state(null);
  const apiUrl = import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:8000/api";
  
  let userLocation = { lat: 28.6139, lng: 77.2090 };
  
  import { onMount } from 'svelte';
  onMount(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      });
    }
  });

  function scrollToBottom() {
    if (chatArea) {
      setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 50);
    }
  }

  async function handleQuickQuestion(question) {
    messages = [...messages, { role: 'user', text: question }];
    scrollToBottom();
    messages = [...messages, { role: 'bot', text: 'Analyzing real-time data...', loading: true }];
    scrollToBottom();

    try {
      const res = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: question,
          latitude: userLocation.lat,
          longitude: userLocation.lng
        })
      });
      const data = await res.json();
      messages = messages.map((m, i) => i === messages.length - 1 ? { role: 'bot', text: data.reply } : m);
    } catch (e) {
      messages = messages.map((m, i) => i === messages.length - 1 ? { role: 'bot', text: "Connection error. Ensure backend is running." } : m);
    }
    scrollToBottom();
  }

  async function handleSend() {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    inputText = '';

    messages = [...messages, { role: 'user', text }];
    scrollToBottom();
    messages = [...messages, { role: 'bot', text: 'Analyzing real-time data...', loading: true }];
    scrollToBottom();

    try {
      const res = await fetch(`${apiUrl}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          latitude: userLocation.lat,
          longitude: userLocation.lng
        })
      });
      const data = await res.json();
      messages = messages.map((m, i) => i === messages.length - 1 ? { role: 'bot', text: data.reply } : m);
    } catch (e) {
      messages = messages.map((m, i) => i === messages.length - 1 ? { role: 'bot', text: "Connection error. Ensure backend is running." } : m);
    }
    scrollToBottom();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function toggleOpen() {
    isOpen = !isOpen;
    if (isOpen && messages.length === 0) {
      // Show welcome message
      messages = [{ role: 'bot', text: 'Hello! I\'m AERIS AI, your intelligent air quality assistant. Ask me anything about pollution levels, health recommendations, or smart routes.' }];
    }
  }
</script>


<!-- Chat Panel -->
{#if isOpen}
  <div class="ai-overlay" onclick={toggleOpen} transition:fade={{ duration: 300 }}></div>

  <div class="ai-panel" transition:fly={{ y: 300, duration: 400 }}>
    <!-- Header -->
    <div class="ai-panel-header">
      <div class="ai-header-left">
        <div class="ai-header-icon">
          <Sparkles size={16} color="white" />
        </div>
        <div>
          <h3 class="ai-header-title">AERIS AI</h3>
          <span class="ai-header-status">Online • Analyzing 47 sensors</span>
        </div>
      </div>
      <button class="ai-close-btn" onclick={toggleOpen}>
        <X size={18} color="var(--aeris-text-secondary)" />
      </button>
    </div>

    <!-- Quick Questions -->
    <div class="ai-quick-scroll">
      {#each aiQuestions as question}
        <button class="ai-quick-chip" onclick={() => handleQuickQuestion(question)}>
          {question}
        </button>
      {/each}
    </div>

    <!-- Chat Area -->
    <div class="ai-chat-area" bind:this={chatArea}>
      {#each messages as msg, i (i)}
        <div
          class="ai-message {msg.role}"
          transition:fly={{ y: 20, duration: 300 }}
        >
          {#if msg.role === 'bot'}
            <div class="ai-msg-avatar">
              <Bot size={14} color="#4F8CFF" />
            </div>
          {/if}
          <div class="ai-msg-bubble {msg.role}">
            <p>{msg.text}</p>
          </div>
        </div>
      {/each}
    </div>

    <!-- Input Area -->
    <div class="ai-input-area">
      <div class="ai-input-wrap">
        <input
          type="text"
          class="ai-input"
          placeholder="Ask AERIS AI..."
          bind:value={inputText}
          onkeydown={handleKeydown}
        />
        <button
          class="ai-send-btn"
          class:active={inputText.trim().length > 0}
          onclick={handleSend}
        >
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* ─── FAB ─── */
  .ai-fab {
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 800;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4F8CFF, #36CFC9);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(79, 140, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s var(--spring-bounce);
  }

  .ai-fab:active {
    transform: scale(0.92);
  }

  .fab-ring {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(79, 140, 255, 0.3);
    animation: pulse-ring 2.5s ease-out infinite;
  }

  /* ─── Overlay ─── */
  .ai-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 840;
  }

  /* ─── Panel ─── */
  .ai-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65vh;
    z-index: 850;
    background: var(--glass-bg-heavy);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ─── Header ─── */
  .ai-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--aeris-divider);
    flex-shrink: 0;
  }

  .ai-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ai-header-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4F8CFF, #36CFC9);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ai-header-title {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--aeris-text);
    letter-spacing: -0.01em;
  }

  .ai-header-status {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--aeris-teal);
  }

  .ai-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--aeris-bg);
    border: 1px solid var(--aeris-border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
  }

  .ai-close-btn:hover {
    background: var(--aeris-border);
  }

  /* ─── Quick Questions ─── */
  .ai-quick-scroll {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    overflow-x: auto;
    flex-shrink: 0;
    -webkit-overflow-scrolling: touch;
    border-bottom: 1px solid var(--aeris-divider);
  }

  .ai-quick-scroll::-webkit-scrollbar {
    display: none;
  }

  .ai-quick-chip {
    flex-shrink: 0;
    padding: 7px 14px;
    border-radius: var(--radius-full);
    background: rgba(79, 140, 255, 0.08);
    border: 1px solid rgba(79, 140, 255, 0.15);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--aeris-blue);
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .ai-quick-chip:hover {
    background: rgba(79, 140, 255, 0.15);
  }

  .ai-quick-chip:active {
    transform: scale(0.95);
  }

  /* ─── Chat Area ─── */
  .ai-chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    -webkit-overflow-scrolling: touch;
  }

  .ai-message {
    display: flex;
    gap: 8px;
    max-width: 88%;
  }

  .ai-message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }

  .ai-message.bot {
    align-self: flex-start;
  }

  .ai-msg-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(79, 140, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .ai-msg-bubble {
    padding: 10px 14px;
    border-radius: 18px;
  }

  .ai-msg-bubble.user {
    background: linear-gradient(135deg, #4F8CFF, #5B9AFF);
    color: white;
    border-bottom-right-radius: 6px;
  }

  .ai-msg-bubble.bot {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    color: var(--aeris-text);
    border-bottom-left-radius: 6px;
  }

  .ai-msg-bubble p {
    font-size: 0.8125rem;
    line-height: 1.5;
    margin: 0;
  }

  /* ─── Input Area ─── */
  .ai-input-area {
    padding: 12px 20px 20px;
    border-top: 1px solid var(--aeris-divider);
    flex-shrink: 0;
  }

  .ai-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--aeris-bg);
    border-radius: var(--radius-full);
    padding: 4px 4px 4px 16px;
    border: 1px solid var(--aeris-border);
    transition: border-color 0.2s;
  }

  .ai-input-wrap:focus-within {
    border-color: rgba(79, 140, 255, 0.3);
  }

  .ai-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    font-family: inherit;
    color: var(--aeris-text);
    outline: none;
  }

  .ai-input::placeholder {
    color: var(--aeris-text-tertiary);
  }

  .ai-send-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #D1D1D6;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .ai-send-btn.active {
    background: linear-gradient(135deg, #4F8CFF, #36CFC9);
    box-shadow: 0 2px 8px rgba(79, 140, 255, 0.3);
  }

  .ai-send-btn:active {
    transform: scale(0.9);
  }
</style>
