/* ============================================================
   RECYCLE RUSH — SOUND
   Background music + correct/wrong effects.
   By default every sound is generated in code (Web Audio API), so
   no audio files are needed. To use your own files instead, set the
   paths in the SOUNDS section of js/config.js.
   ============================================================ */

const Sound = (() => {
  const STORAGE_KEY = "recycleRush.muted";

  // localStorage can throw in some private-browsing modes, so fail quietly.
  function loadMuted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function saveMuted(value) {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch (e) {}
  }

  let ctx = null;
  let muted = loadMuted();
  let musicWanted = false; // true while a level is being played

  // Generated music
  let musicGain = null;
  let musicTimer = null;
  let nextNoteTime = 0;
  let step = 0;

  // Custom audio files (only used if paths are set in config)
  let musicEl = null;
  const effectEls = {};

  // A cheerful looping tune: one entry per eighth note, null = rest.
  const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880;
  const MELODY = [
    C5, null, E5, null, G5, null, E5, null,
    D5, null, E5, null, C5, null, null, null,
    E5, null, G5, null, A5, null, G5, null,
    E5, null, D5, null, C5, null, null, null,
  ];
  // One bass note per bar (8 steps).
  const BASS = [130.81, 98.0, 87.31, 130.81];
  const STEP = 0.25; // seconds per eighth note (120 bpm)

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    // Browsers start audio suspended until the user clicks something.
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Plays one note with a soft attack/release. If endFreq is given the
  // pitch slides to it (used for the "wrong" buzz).
  function tone(freq, start, duration, type, volume, destination, endFreq) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }

  // Schedules notes slightly ahead of time so the music stays in rhythm
  // even if the timer callback is a little late.
  function scheduleMusic() {
    while (nextNoteTime < ctx.currentTime + 0.5) {
      const note = MELODY[step % MELODY.length];
      if (note) tone(note, nextNoteTime, STEP * 0.9, "triangle", 0.5, musicGain);
      if (step % 8 === 0) {
        const bass = BASS[Math.floor(step / 8) % BASS.length];
        tone(bass, nextNoteTime, STEP * 7, "sine", 0.6, musicGain);
      }
      nextNoteTime += STEP;
      step++;
    }
  }

  function startMusicInternal() {
    if (muted || musicTimer || (musicEl && !musicEl.paused)) return;

    if (SOUNDS.music) {
      if (!musicEl) {
        musicEl = new Audio(SOUNDS.music);
        musicEl.loop = true;
      }
      musicEl.volume = SOUNDS.musicVolume;
      musicEl.play().catch(() => {});
      return;
    }

    if (!ensureContext()) return;
    musicGain = ctx.createGain();
    // Generated tones are loud, so scale them down a bit.
    musicGain.gain.value = SOUNDS.musicVolume * 0.3;
    musicGain.connect(ctx.destination);
    step = 0;
    nextNoteTime = ctx.currentTime + 0.05;
    scheduleMusic();
    musicTimer = setInterval(scheduleMusic, 100);
  }

  function stopMusicInternal() {
    clearInterval(musicTimer);
    musicTimer = null;
    if (musicGain) {
      // Disconnecting silences notes that were already scheduled.
      musicGain.disconnect();
      musicGain = null;
    }
    if (musicEl) musicEl.pause();
  }

  // Browsers block audio until the player interacts with the page, so
  // music requested on page load actually starts on the first tap/click/key.
  const UNLOCK_EVENTS = ["pointerdown", "touchstart", "keydown"];
  function unlock() {
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (musicWanted && !muted && musicEl && musicEl.paused) musicEl.play().catch(() => {});
    UNLOCK_EVENTS.forEach((evt) => document.removeEventListener(evt, unlock));
  }
  UNLOCK_EVENTS.forEach((evt) => document.addEventListener(evt, unlock));

  function playFile(name) {
    if (!effectEls[name]) effectEls[name] = new Audio(SOUNDS[name]);
    const audio = effectEls[name];
    audio.volume = SOUNDS.effectsVolume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  return {
    startMusic() {
      musicWanted = true;
      startMusicInternal();
    },

    stopMusic() {
      musicWanted = false;
      stopMusicInternal();
    },

    // name: "correct" or "wrong"
    play(name) {
      if (muted) return;
      if (SOUNDS[name]) return playFile(name);
      if (!ensureContext()) return;

      const out = ctx.createGain();
      out.gain.value = SOUNDS.effectsVolume;
      out.connect(ctx.destination);
      const t = ctx.currentTime;

      if (name === "correct") {
        // Happy rising "ding-ding"
        tone(783.99, t, 0.15, "sine", 0.6, out);
        tone(1046.5, t + 0.1, 0.3, "sine", 0.6, out);
      } else {
        // Low sliding "bwomp"
        tone(220, t, 0.35, "square", 0.25, out, 110);
      }
    },

    isMuted() {
      return muted;
    },

    // Returns the new muted state (and remembers it for next visit).
    toggleMute() {
      muted = !muted;
      saveMuted(muted);
      if (muted) stopMusicInternal();
      else if (musicWanted) startMusicInternal();
      return muted;
    },
  };
})();
