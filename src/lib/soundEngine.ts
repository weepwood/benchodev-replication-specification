export type SoundCategory =
  | "All"
  | "Press"
  | "Toggle"
  | "Hover"
  | "Notify"
  | "Success"
  | "Mechanical"
  | "Whoosh";

export interface UISoundItem {
  id: string;
  name: string;
  category: Exclude<SoundCategory, "All">;
  durationMs: number;
  baseFreq: number;
  accent: string;
  description: string;
  pro?: boolean;
  recipe: {
    wave: OscillatorType;
    freqStart: number;
    freqEnd: number;
    attack: number;
    decay: number;
    noiseMix: number;
    filterFreq: number;
    secondHarmonic?: number;
    doubleTapMs?: number;
  };
}

export const UI_SOUNDS: UISoundItem[] = [
  {
    id: "micro-detent",
    name: "Micro Detent",
    category: "Press",
    durationMs: 38,
    baseFreq: 1420,
    accent: "#0d99ff",
    description: "Crisp CNC rotary dial detent tick with zero low-end mud.",
    recipe: {
      wave: "triangle",
      freqStart: 1650,
      freqEnd: 420,
      attack: 0.001,
      decay: 0.034,
      noiseMix: 0.35,
      filterFreq: 2800,
    },
  },
  {
    id: "warm-tact",
    name: "Warm TactSwitch",
    category: "Press",
    durationMs: 55,
    baseFreq: 680,
    accent: "#e09a12",
    description: "Braun-inspired dampened push switch with warm polycarbonate body.",
    recipe: {
      wave: "sine",
      freqStart: 780,
      freqEnd: 210,
      attack: 0.002,
      decay: 0.05,
      noiseMix: 0.25,
      filterFreq: 1600,
      secondHarmonic: 1.5,
    },
  },
  {
    id: "glass-tap",
    name: "Glass Tap",
    category: "Press",
    durationMs: 68,
    baseFreq: 2180,
    accent: "#4c8dff",
    description: "Translucent borosilicate surface tap with subtle airy ring.",
    recipe: {
      wave: "sine",
      freqStart: 2400,
      freqEnd: 1180,
      attack: 0.001,
      decay: 0.064,
      noiseMix: 0.12,
      filterFreq: 4200,
      secondHarmonic: 2.02,
    },
  },
  {
    id: "spring-pop",
    name: "Spring Pop",
    category: "Toggle",
    durationMs: 92,
    baseFreq: 520,
    accent: "#ff3b6b",
    description: "Upward harmonic pitch pop calibrated for spring-animated pills.",
    recipe: {
      wave: "sine",
      freqStart: 380,
      freqEnd: 980,
      attack: 0.003,
      decay: 0.085,
      noiseMix: 0.08,
      filterFreq: 2600,
      secondHarmonic: 1.498,
    },
  },
  {
    id: "magnetic-snap",
    name: "Magnetic Snap",
    category: "Toggle",
    durationMs: 74,
    baseFreq: 890,
    accent: "#9d7bf5",
    description: "Dual-transient neodymium alignment snap when docking panels or cards.",
    recipe: {
      wave: "triangle",
      freqStart: 620,
      freqEnd: 1240,
      attack: 0.001,
      decay: 0.048,
      noiseMix: 0.3,
      filterFreq: 3200,
      doubleTapMs: 24,
    },
  },
  {
    id: "relay-latch",
    name: "Relay Latch",
    category: "Mechanical",
    durationMs: 80,
    baseFreq: 1120,
    accent: "#1f9d55",
    description: "Precision studio hardware relay closure with dual metallic click.",
    recipe: {
      wave: "square",
      freqStart: 1380,
      freqEnd: 340,
      attack: 0.001,
      decay: 0.038,
      noiseMix: 0.48,
      filterFreq: 2900,
      doubleTapMs: 32,
    },
  },
  {
    id: "velvet-hover",
    name: "Velvet Hover",
    category: "Hover",
    durationMs: 44,
    baseFreq: 940,
    accent: "#e57bb8",
    description: "Whisper-quiet air brush transient for navigation rails and list rows.",
    recipe: {
      wave: "sine",
      freqStart: 880,
      freqEnd: 1080,
      attack: 0.005,
      decay: 0.038,
      noiseMix: 0.16,
      filterFreq: 1850,
    },
  },
  {
    id: "vernier-tick",
    name: "Vernier Tick",
    category: "Hover",
    durationMs: 26,
    baseFreq: 2600,
    accent: "#74dcae",
    description: "Ultra-short 26ms ruler tick designed for rapid slider scrubbing.",
    recipe: {
      wave: "triangle",
      freqStart: 2900,
      freqEnd: 950,
      attack: 0.0008,
      decay: 0.022,
      noiseMix: 0.4,
      filterFreq: 4800,
    },
  },
  {
    id: "keycap-pbt",
    name: "Keycap PBT",
    category: "Mechanical",
    durationMs: 62,
    baseFreq: 560,
    accent: "#f2c46d",
    description: "Thocky lubricated mechanical switch bottom-out on thick PBT.",
    recipe: {
      wave: "triangle",
      freqStart: 640,
      freqEnd: 165,
      attack: 0.0015,
      decay: 0.056,
      noiseMix: 0.52,
      filterFreq: 1450,
      doubleTapMs: 16,
    },
  },
  {
    id: "paper-flick",
    name: "Paper Flick",
    category: "Whoosh",
    durationMs: 110,
    baseFreq: 760,
    accent: "#9ab8db",
    description: "Warm archival cardstock swipe for card-swap and page-peel gestures.",
    recipe: {
      wave: "sine",
      freqStart: 420,
      freqEnd: 910,
      attack: 0.012,
      decay: 0.095,
      noiseMix: 0.68,
      filterFreq: 2200,
    },
  },
  {
    id: "air-whoosh",
    name: "Air Whoosh",
    category: "Whoosh",
    durationMs: 165,
    baseFreq: 480,
    accent: "#5b8def",
    description: "Filtered breath sweep for drawer reveals, command bars, and modals.",
    recipe: {
      wave: "sine",
      freqStart: 260,
      freqEnd: 740,
      attack: 0.028,
      decay: 0.13,
      noiseMix: 0.75,
      filterFreq: 1700,
    },
  },
  {
    id: "chime-confirm",
    name: "Chime Confirm",
    category: "Success",
    durationMs: 240,
    baseFreq: 1046,
    accent: "#1f9d55",
    description: "Two-note fifth interval harmonic confirmation without gamey fanfare.",
    recipe: {
      wave: "sine",
      freqStart: 784,
      freqEnd: 1175,
      attack: 0.004,
      decay: 0.22,
      noiseMix: 0.04,
      filterFreq: 3800,
      secondHarmonic: 1.5,
      doubleTapMs: 68,
    },
  },
  {
    id: "orbit-ping",
    name: "Orbit Ping",
    category: "Notify",
    durationMs: 290,
    baseFreq: 1318,
    accent: "#0d99ff",
    description: "Clean sonar telemetry ping for AI completion and MCP pull events.",
    pro: true,
    recipe: {
      wave: "sine",
      freqStart: 1318,
      freqEnd: 1310,
      attack: 0.003,
      decay: 0.27,
      noiseMix: 0.03,
      filterFreq: 4500,
      secondHarmonic: 2.0,
    },
  },
  {
    id: "subtle-alert",
    name: "Subtle Alert",
    category: "Notify",
    durationMs: 180,
    baseFreq: 440,
    accent: "#e5484d",
    description: "Low-friction downward minor nudge for validation errors or bounds.",
    recipe: {
      wave: "triangle",
      freqStart: 520,
      freqEnd: 310,
      attack: 0.004,
      decay: 0.16,
      noiseMix: 0.1,
      filterFreq: 1400,
      doubleTapMs: 62,
    },
  },
  {
    id: "camera-shutter",
    name: "Leica Shutter",
    category: "Mechanical",
    durationMs: 95,
    baseFreq: 1250,
    accent: "#e09a12",
    description: "Cloth focal-plane shutter curtain release for copy & snapshot actions.",
    pro: true,
    recipe: {
      wave: "triangle",
      freqStart: 1520,
      freqEnd: 380,
      attack: 0.001,
      decay: 0.045,
      noiseMix: 0.62,
      filterFreq: 3400,
      doubleTapMs: 42,
    },
  },
  {
    id: "soft-thud",
    name: "Soft Thud",
    category: "Press",
    durationMs: 85,
    baseFreq: 240,
    accent: "#9d7bf5",
    description: "Sub-bass cushioned drop when releasing dragged cards onto canvas.",
    recipe: {
      wave: "sine",
      freqStart: 280,
      freqEnd: 78,
      attack: 0.002,
      decay: 0.08,
      noiseMix: 0.18,
      filterFreq: 680,
    },
  },
];

let sharedCtx: AudioContext | null = null;
let globalMuted = false;

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return globalMuted;
}

export function setSoundMuted(muted: boolean) {
  globalMuted = muted;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("bencho_sound_muted", muted ? "1" : "0");
    window.dispatchEvent(new CustomEvent("bencho-sound-change", { detail: { muted } }));
  }
}

export function initSoundPreference() {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem("bencho_sound_muted");
  if (saved === "1") globalMuted = true;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedCtx = new AudioCtx();
    }
  }
  if (sharedCtx && sharedCtx.state === "suspended") {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function scheduleSynthOnContext(
  ctx: BaseAudioContext,
  destination: AudioNode,
  sound: UISoundItem,
  options?: { pitch?: number; crispness?: number; volume?: number }
) {
  const pitch = options?.pitch ?? 1;
  const crispness = options?.crispness ?? 1;
  const volume = options?.volume ?? 0.34;
  const { recipe } = sound;

  const triggerAt = (offsetSec: number, gainScale: number, freqMult: number) => {
    const now = ctx.currentTime + offsetSec;
    const totalDur = recipe.attack + recipe.decay;

    // Primary oscillator
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = recipe.wave;
    osc.frequency.setValueAtTime(Math.max(40, recipe.freqStart * pitch * freqMult), now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(30, recipe.freqEnd * pitch * freqMult),
      now + totalDur
    );

    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(volume * gainScale * (1 - recipe.noiseMix * 0.45), now + recipe.attack);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDur);

    osc.connect(oscGain);
    oscGain.connect(destination);
    osc.start(now);
    osc.stop(now + totalDur + 0.01);

    // Optional harmonic overtone
    if (recipe.secondHarmonic) {
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(
        Math.max(60, recipe.freqStart * pitch * freqMult * recipe.secondHarmonic),
        now
      );
      osc2.frequency.exponentialRampToValueAtTime(
        Math.max(40, recipe.freqEnd * pitch * freqMult * recipe.secondHarmonic),
        now + totalDur * 0.85
      );
      g2.gain.setValueAtTime(0.0001, now);
      g2.gain.linearRampToValueAtTime(volume * gainScale * 0.28 * crispness, now + recipe.attack);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + totalDur * 0.85);
      osc2.connect(g2);
      g2.connect(destination);
      osc2.start(now);
      osc2.stop(now + totalDur + 0.01);
    }

    // Filtered transient noise burst
    if (recipe.noiseMix > 0.01) {
      const bufferSize = Math.max(128, Math.floor(ctx.sampleRate * totalDur));
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.38));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(
        Math.min(16000, recipe.filterFreq * crispness * pitch),
        now
      );
      filter.Q.setValueAtTime(1.6, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.0001, now);
      nGain.gain.linearRampToValueAtTime(
        volume * gainScale * recipe.noiseMix * crispness,
        now + Math.min(0.003, recipe.attack)
      );
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDur);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(destination);
      noise.start(now);
      noise.stop(now + totalDur + 0.01);
    }
  };

  triggerAt(0, 1, 1);
  if (recipe.doubleTapMs) {
    triggerAt(recipe.doubleTapMs / 1000, 0.78, 1.18);
  }
}

export function playUISound(
  idOrSound: string | UISoundItem,
  options?: { pitch?: number; crispness?: number; volume?: number; force?: boolean }
) {
  if (!options?.force && isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const sound =
    typeof idOrSound === "string"
      ? UI_SOUNDS.find((s) => s.id === idOrSound) ?? UI_SOUNDS[0]
      : idOrSound;

  scheduleSynthOnContext(ctx, ctx.destination, sound, options);
}

/**
 * Renders any UI sound into a real 44.1kHz 16-bit mono WAV Blob for instant project download.
 */
export async function renderSoundToWavBlob(
  sound: UISoundItem,
  options?: { pitch?: number; crispness?: number }
): Promise<Blob> {
  const sampleRate = 44100;
  const durationSec = Math.max(0.18, (sound.durationMs + 90) / 1000);
  const length = Math.ceil(sampleRate * durationSec);
  const offline = new OfflineAudioContext(1, length, sampleRate);

  scheduleSynthOnContext(offline, offline.destination, sound, {
    pitch: options?.pitch ?? 1,
    crispness: options?.crispness ?? 1,
    volume: 0.65,
  });

  const rendered = await offline.startRendering();
  const channel = rendered.getChannelData(0);

  const wavBuffer = new ArrayBuffer(44 + channel.length * 2);
  const view = new DataView(wavBuffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + channel.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, channel.length * 2, true);

  let offset = 44;
  for (let i = 0; i < channel.length; i++) {
    const s = Math.max(-1, Math.min(1, channel[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([wavBuffer], { type: "audio/wav" });
}

export function generateSoundCodeSnippet(
  sound: UISoundItem,
  pitch = 1,
  crispness = 1
): string {
  const r = sound.recipe;
  return `// Bencho Sound: ${sound.name} (${sound.category}) — Zero-dependency Web Audio
export function play${sound.id
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("")}() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const now = ctx.currentTime;
  const dur = ${(r.attack + r.decay).toFixed(4)};

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "${r.wave}";
  osc.frequency.setValueAtTime(${Math.round(r.freqStart * pitch)}, now);
  osc.frequency.exponentialRampToValueAtTime(${Math.max(30, Math.round(r.freqEnd * pitch))}, now + dur);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.28, now + ${r.attack});
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + dur + 0.01);${
    r.noiseMix > 0.05
      ? `\n
  // Filtered transient click (${Math.round(r.filterFreq * crispness)}Hz bandpass)
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ch.length * 0.35));
  const noise = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const nGain = ctx.createGain();
  noise.buffer = buf;
  filter.type = "bandpass";
  filter.frequency.value = ${Math.round(r.filterFreq * crispness)};
  nGain.gain.setValueAtTime(${(0.22 * r.noiseMix).toFixed(3)}, now);
  nGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  noise.connect(filter).connect(nGain).connect(ctx.destination);
  noise.start(now);`
      : ""
  }
}`;
}
