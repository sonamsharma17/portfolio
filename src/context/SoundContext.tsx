"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (name: string, force?: boolean) => void;
  setVolume: (name: string, volume: number) => void;
  isReady: boolean;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: true,
  toggleMute: () => {},
  playSound: (_name: string, _force?: boolean) => {},
  setVolume: () => {},
  isReady: false,
});

export const useSoundContext = () => useContext(SoundContext);

// Synthesize a noise buffer once and cache it
let cachedNoiseBuffer: AudioBuffer | null = null;
let cachedAnnouncementBuffer: AudioBuffer | null = null;
const getNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
  if (!cachedNoiseBuffer) {
    const bufferSize = ctx.sampleRate * 1.5; // 1.5s of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    cachedNoiseBuffer = buffer;
  }
  return cachedNoiseBuffer;
};

// Helper to generate looping train ambient audio buffer
const generateAmbientBuffer = (ctx: AudioContext): AudioBuffer => {
  const duration = 2.5; // 2.5 seconds loop
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  const hits = [0.2, 0.38, 1.25, 1.43]; // click-clack rhythms

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Low frequency engine hum (48Hz and 96Hz harmonics)
    let val = Math.sin(2 * Math.PI * 48 * t) * 0.35 + Math.sin(2 * Math.PI * 96 * t) * 0.15;

    // 2. Subtle low rumble noise
    const noise = Math.random() * 2 - 1;
    val += noise * 0.03;

    // 3. Rhythmic track joint clicks ("click-clack")
    hits.forEach((t_hit) => {
      if (t >= t_hit) {
        const dt = t - t_hit;
        const env = Math.exp(-35 * dt);
        if (env > 0.001) {
          const jointClick = Math.sin(2 * Math.PI * 180 * t) * env * 0.12;
          const jointThud = Math.sin(2 * Math.PI * 60 * t) * env * 0.35;
          const jointNoise = noise * env * 0.06;
          val += jointClick + jointThud + jointNoise;
        }
      }
    });

    data[i] = val;
  }

  // Apply a fade-in / fade-out at buffer boundaries to prevent clicks when looping
  const fadeSamples = Math.floor(sampleRate * 0.05); // 50ms fade
  for (let i = 0; i < fadeSamples; i++) {
    const gain = i / fadeSamples;
    data[i] *= gain;
    data[numSamples - 1 - i] *= gain;
  }

  return buffer;
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setIsReady(true);
      }
      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };

    document.addEventListener("click", initAudio);
    document.addEventListener("keydown", initAudio);
    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };
  }, []);

  // Sync ambient sound loop with mute state and interaction readiness
  useEffect(() => {
    if (!isReady || !audioContextRef.current) return;
    const ctx = audioContextRef.current;

    // Lazy load ambient source & gain
    if (!ambientGainRef.current) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.connect(ctx.destination);
      ambientGainRef.current = gain;

      const buffer = generateAmbientBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start(0);
      ambientSourceRef.current = source;
    }

    const now = ctx.currentTime;
    const currentGain = ambientGainRef.current.gain;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (isMuted) {
      currentGain.cancelScheduledValues(now);
      currentGain.setValueAtTime(currentGain.value, now);
      currentGain.linearRampToValueAtTime(0, now + 0.5);
    } else {
      currentGain.cancelScheduledValues(now);
      currentGain.setValueAtTime(currentGain.value, now);
      currentGain.linearRampToValueAtTime(0.12, now + 0.5); // Smooth fade in
    }
  }, [isMuted, isReady]);

  // Clean up references on unmount
  useEffect(() => {
    return () => {
      if (ambientSourceRef.current) {
        try {
          ambientSourceRef.current.stop();
        } catch { /* ignore already stopped */ }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const playSound = useCallback(
    (name: string, force = false) => {
      if (isMuted && !force) return;

      // Lazy initialize audio context if not already done (e.g., on first interaction click)
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        setIsReady(true);
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      switch (name) {
        case "click": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case "scanner": {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(1400, now + 0.45);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.46);
          break;
        }

        case "punch": {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

          oscGain.gain.setValueAtTime(0.25, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

          const lp = ctx.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.setValueAtTime(160, now);

          osc.connect(lp);
          lp.connect(oscGain);
          oscGain.connect(ctx.destination);

          // Punch noise burst
          const noise = ctx.createBufferSource();
          noise.buffer = getNoiseBuffer(ctx);
          const noiseGain = ctx.createGain();

          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = "bandpass";
          noiseFilter.frequency.setValueAtTime(220, now);
          noiseFilter.Q.setValueAtTime(2.5, now);

          noiseGain.gain.setValueAtTime(0.35, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          osc.start(now);
          noise.start(now);
          osc.stop(now + 0.22);
          noise.stop(now + 0.22);
          break;
        }

        case "steam": {
          const noise = ctx.createBufferSource();
          noise.buffer = getNoiseBuffer(ctx);
          const gain = ctx.createGain();

          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(2800, now);
          filter.frequency.exponentialRampToValueAtTime(900, now + 1.1);
          filter.Q.setValueAtTime(1.2, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
          noise.stop(now + 1.15);
          break;
        }

        case "whistle": {
          const playWhistleTone = (freq: number, detuneVal: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Vibrato (LFO)
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 5.5; // Vibrato speed
            lfoGain.gain.value = 4.5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.type = "triangle";
            osc.frequency.value = freq;
            osc.detune.value = detuneVal;

            // Tremolo
            const tremolo = ctx.createOscillator();
            const tremoloGain = ctx.createGain();
            tremolo.frequency.value = 4;
            tremoloGain.gain.value = 0.03;
            tremolo.connect(tremoloGain);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.15);
            gain.gain.setValueAtTime(0.1, now + 0.7);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            lfo.start(now);
            tremolo.start(now);
            osc.start(now);

            lfo.stop(now + 1.15);
            tremolo.stop(now + 1.15);
            osc.stop(now + 1.15);
          };

          // Classic double-tone chord
          playWhistleTone(659.25, -4); // E5
          playWhistleTone(783.99, 4);  // G5
          break;
        }

        case "horn": {
          const freqs = [311.13, 370.00, 415.30, 493.88, 622.25]; // Nathan K5LA chord
          freqs.forEach((freq, i) => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sawtooth";
            osc2.type = "triangle";

            osc1.frequency.value = freq;
            osc2.frequency.value = freq * 1.005;

            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(800, now);
            filter.Q.setValueAtTime(1.0, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
            gain.gain.setValueAtTime(0.06, now + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 1.3);
            osc2.stop(now + 1.3);
          });
          break;
        }

        case "indian_horn": {
          const tones = [330.0, 440.0]; // Indian Railways dual-tone WAP7/WDP4 horn chord (perfect fourth E4/A4)
          tones.forEach((freq, i) => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sawtooth";
            osc2.type = "triangle";

            osc1.frequency.value = freq;
            osc2.frequency.value = freq * 1.006;

            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(1000, now);
            filter.Q.setValueAtTime(1.2, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.15); // sharp attack
            gain.gain.setValueAtTime(0.08, now + 2.6);          // blow for 2.6 seconds
            gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0); // 400ms release decay

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 3.1);
            osc2.stop(now + 3.1);
          });
          break;
        }

        case "train_run": {
          const chugTimes = [
            0.0, 0.4, // Slow, heavy chugs during backward jerk
            0.7, 0.95, 1.15, 1.3, 1.42, 1.52, 1.62, 1.72, 1.82, 1.92, 2.02 // Accelerating chugs forward
          ];

          chugTimes.forEach((delay, index) => {
            const t = now + delay;
            const noise = ctx.createBufferSource();
            noise.buffer = getNoiseBuffer(ctx);

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";

            const isHeavy = index < 2;
            const filterFreq = isHeavy ? 120 : (160 + (delay - 0.6) * 70);
            filter.frequency.setValueAtTime(filterFreq, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, t);

            const peakGain = isHeavy ? 0.26 : 0.18;
            const attack = isHeavy ? 0.06 : 0.04;
            const decay = isHeavy ? 0.28 : 0.15;

            gain.gain.linearRampToValueAtTime(peakGain, t + attack);
            gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(t);
            noise.stop(t + decay + 0.05);
          });
          break;
        }

        case "announcement": {
          const playSynthesizedAnnouncement = () => {
            // Major triad chime arpeggio: C5 -> E5 -> G5 -> C6
            const notes = [523.25, 659.25, 783.99, 1046.50];
            const delays = [0, 0.2, 0.4, 0.6];
            const durations = [0.35, 0.35, 0.35, 0.75];

            notes.forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = "sine";
              osc.frequency.value = freq;

              const t = now + delays[i];
              const d = durations[i];

              gain.gain.setValueAtTime(0, t);
              gain.gain.linearRampToValueAtTime(0.08, t + 0.04);
              gain.gain.exponentialRampToValueAtTime(0.001, t + d);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(t);
              osc.stop(t + d + 0.05);
            });

            // Spoken female voice announcement
            if (typeof window !== "undefined" && window.speechSynthesis) {
              setTimeout(() => {
                const speak = () => {
                  const voices = window.speechSynthesis.getVoices();
                  let voice = voices.find(v => {
                    const name = v.name.toLowerCase();
                    const isIndian = v.lang === "en-IN" || v.lang === "en_IN";
                    const isFemale = name.includes("female") || 
                                     name.includes("heera") || 
                                     name.includes("veena") || 
                                     name.includes("google english (india)");
                    return isIndian && isFemale;
                  });

                  if (!voice) {
                    voice = voices.find(v => {
                      const name = v.name.toLowerCase();
                      const isIndian = v.lang === "en-IN" || v.lang === "en_IN";
                      const isMale = name.includes("male") || 
                                     name.includes("ravi") || 
                                     name.includes("rishi");
                      return isIndian && !isMale;
                    });
                  }

                  if (!voice) {
                    voice = voices.find(v => {
                      const name = v.name.toLowerCase();
                      const isEnglish = v.lang.startsWith("en");
                      const isFemale = name.includes("female") || 
                                       name.includes("zira") || 
                                       name.includes("hazel") || 
                                       name.includes("samantha") || 
                                       name.includes("tessa") || 
                                       name.includes("susan");
                      return isEnglish && isFemale;
                    });
                  }

                  const utterance = new SpeechSynthesisUtterance(
                    "Attention please. The Portfolio Express is now arriving at Platform Number One."
                  );

                  if (voice) {
                    utterance.voice = voice;
                    utterance.lang = voice.lang;
                  } else {
                    utterance.lang = "en-IN";
                  }
                  utterance.rate = 0.85;
                  utterance.pitch = 0.9;

                  window.speechSynthesis.speak(utterance);
                };

                if (window.speechSynthesis.getVoices().length === 0) {
                  window.speechSynthesis.onvoiceschanged = () => {
                    speak();
                    window.speechSynthesis.onvoiceschanged = null;
                  };
                } else {
                  speak();
                }
              }, 1200);
            }
          };

          const playAnnouncementBuffer = (buffer: AudioBuffer) => {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain = ctx.createGain();

            // Set natural volume
            gain.gain.setValueAtTime(0.35, now);
            
            source.connect(gain);
            gain.connect(ctx.destination);
            source.start(now);
          };

          if (cachedAnnouncementBuffer) {
            playAnnouncementBuffer(cachedAnnouncementBuffer);
          } else {
            fetch("/arunangshubanerjee-indian-railway-train-arriving-announcement-333043_JSJYvEpQ.mp3")
              .then(res => res.arrayBuffer())
              .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
              .then(decodedBuffer => {
                cachedAnnouncementBuffer = decodedBuffer;
                playAnnouncementBuffer(decodedBuffer);
              })
              .catch(err => {
                console.error("Failed to load platform announcement MP3:", err);
                playSynthesizedAnnouncement();
              });
          }
          break;
        }

        case "departure": {
          // 1. Play deep warning steam whistle
          const whistleNotes = [329.63, 392.00, 523.25]; // E4, G4, C5
          whistleNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle";
            osc.frequency.value = freq;
            osc.detune.value = (i - 1) * 8;

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.07, now + 0.25);
            gain.gain.setValueAtTime(0.07, now + 1.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 2.05);
          });

          // 2. Chug-chug start sequence
          const chugTimes = [0.4, 0.9, 1.4, 1.9];
          chugTimes.forEach((delay) => {
            const t = now + delay;
            const noise = ctx.createBufferSource();
            noise.buffer = getNoiseBuffer(ctx);

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(220, t);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(t);
            noise.stop(t + 0.25);
          });
          break;
        }

        default:
          break;
      }
    },
    [isMuted, isReady]
  );

  const setVolume = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_name: string, _volume: number) => {
      // Volume control placeholder
    },
    []
  );

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound, setVolume, isReady }}>
      {children}
    </SoundContext.Provider>
  );
}
