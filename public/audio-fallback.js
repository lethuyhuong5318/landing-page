// Global audio fallback for game modules (vanilla JS)
// Không phụ thuộc React, dùng Web Audio API

window.GameAudio = (() => {
  let audioContext = null;
  let enabled = true;

  const getContext = () => {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return audioContext;
  };

  const playTone = (frequency, duration, type = 'sine') => {
    if (!enabled) return;
    const ctx = getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  };

  return {
    click: () => playTone(400, 0.05, 'sine'),
    success: () => {
      playTone(523, 0.1, 'sine');
      setTimeout(() => playTone(659, 0.15, 'sine'), 100);
    },
    error: () => playTone(200, 0.2, 'sine'),
    complete: () => {
      playTone(523, 0.08, 'sine');
      setTimeout(() => playTone(659, 0.08, 'sine'), 80);
      setTimeout(() => playTone(784, 0.12, 'sine'), 160);
    },
    setEnabled: (value) => { enabled = value; },
    isEnabled: () => enabled,
  };
})();

// Alias functions cho backward compatibility
window.soundClick = () => window.GameAudio.click();
window.soundCorrect = () => window.GameAudio.success();
window.soundWrong = () => window.GameAudio.error();
window.soundComplete = () => window.GameAudio.complete();
