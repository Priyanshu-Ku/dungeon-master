/**
 * Utility for ElevenLabs Text-to-Speech
 *
 * SYNC STRATEGY:
 * - prefetchDialogueAudio()  → fetches one line, returns a ready Audio object
 * - prefetchAllDialogue()    → fetches ALL lines in parallel, returns Audio[]
 * - playAudio()              → plays a pre-fetched Audio and waits until it ends
 *
 * This eliminates the API round-trip delay between lines, giving perfect text/voice sync.
 */

const API_KEY =
  process.env.NEXT_PUBLIC_ELEVANLABS_API_KEY ||
  process.env.ELEVANLABS_API_KEY ||
  "sk_3d1d708cebb20871cfdbb3974dd16bf82deddd5dd8f12070";

// Verified free-tier ElevenLabs voices:
const WIZARD_VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Josh — deep, authoritative
const PLAYER_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Bella — clear, expressive

export interface DialogueLine {
  speaker: "Player" | "Wizard";
  text: string;
}

/**
 * Fetches TTS audio for a single line and returns a ready-to-play Audio object.
 * Returns null on failure so the caller can still show the text.
 */
export async function prefetchDialogueAudio(
  line: DialogueLine
): Promise<HTMLAudioElement | null> {
  const voiceId = line.speaker === "Wizard" ? WIZARD_VOICE_ID : PLAYER_VOICE_ID;
  console.log(`[Voice/Prefetch] Fetching ${line.speaker}…`);

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text: line.text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[Voice/Prefetch] ${line.speaker} failed ${response.status}: ${body}`);
      return null;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    // Pre-load the audio so it's ready to play immediately
    await new Promise<void>((resolve) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => resolve(); // don't block on error
      audio.load();
    });

    console.log(`[Voice/Prefetch] ✓ ${line.speaker} ready`);
    return audio;
  } catch (err) {
    console.error(`[Voice/Prefetch] Unexpected error for ${line.speaker}:`, err);
    return null;
  }
}

/**
 * Fetches ALL dialogue lines in parallel.
 * Call this BEFORE starting the conversation sequence.
 */
export async function prefetchAllDialogue(
  lines: DialogueLine[]
): Promise<Array<HTMLAudioElement | null>> {
  console.log(`[Voice/Prefetch] Pre-fetching ${lines.length} lines in parallel…`);
  const results = await Promise.all(lines.map(prefetchDialogueAudio));
  const success = results.filter(Boolean).length;
  console.log(`[Voice/Prefetch] Done — ${success}/${lines.length} lines ready`);
  return results;
}

/**
 * Plays a pre-fetched Audio object and waits until it ends.
 * Safe to call with null (silently resolves immediately).
 */
export async function playPreloadedAudio(
  audio: HTMLAudioElement | null
): Promise<void> {
  if (!audio) return;

  return new Promise<void>((resolve) => {
    const cleanup = (url: string) => {
      URL.revokeObjectURL(url);
      resolve();
    };

    const url = audio.src;
    audio.onended = () => cleanup(url);
    audio.onerror = () => {
      console.error("[Voice/Play] Playback error");
      cleanup(url);
    };

    audio.play().catch((err) => {
      console.warn("[Voice/Play] play() rejected:", err);
      resolve();
    });
  });
}

/**
 * Legacy single-shot helper (kept for compatibility).
 * For synced conversations, prefer prefetchAllDialogue + playPreloadedAudio.
 */
export async function playDialogueVoice(
  text: string,
  speaker: "Player" | "Wizard"
): Promise<void> {
  const audio = await prefetchDialogueAudio({ text, speaker });
  await playPreloadedAudio(audio);
}
