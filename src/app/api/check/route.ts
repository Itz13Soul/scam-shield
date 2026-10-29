import { z } from "zod";
import { analyze } from "../../../lib/analyze";
import { transcribeAudio } from "../../../lib/llm";
import { clientError, guard } from "../../../lib/usage";

export const maxDuration = 60;

const MAX_AUDIO = 3_500_000;
const AUDIO_TYPES = new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/webm", "audio/flac"]);
const TextBody = z.object({ text: z.string().trim().min(15).max(4000) });

export async function POST(req: Request) {
  const type = req.headers.get("content-type") ?? "";
  let text = "";
  let audio: { base64: string; mime: string } | null = null;

  if (type.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    const file = form?.get("audio");
    if (!(file instanceof File)) return clientError(400, "Attach an audio file.");
    const mime = file.type.split(";")[0].toLowerCase();
    if (!AUDIO_TYPES.has(mime)) return clientError(400, "Unsupported audio format. Use MP3, WAV, M4A, AAC, OGG, WEBM or FLAC.");
    if (file.size > MAX_AUDIO) return clientError(413, "The audio file is too large. The limit is 3.5 MB, about two to three minutes.");
    const buf = Buffer.from(await file.arrayBuffer());
    audio = { base64: buf.toString("base64"), mime };
  } else {
    const parsed = TextBody.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return clientError(400, "Paste at least 15 characters of the message or call text.");
    text = parsed.data.text;
  }

  const blocked = await guard();
  if (blocked) return blocked;

  try {
    let language: string | null = null;
    if (audio) {
      const t = await transcribeAudio(audio.base64, audio.mime);
      if (!t.speech_found || t.transcript.trim().length < 10) return clientError(422, "No clear speech was found in this audio.");
      text = t.transcript.trim();
      language = t.language;
    }
    const analysis = await analyze(text);
    return Response.json({ transcript: audio ? text : null, language, analysis });
  } catch (e) {
    const msg = String(e);
    const reason = /HTTP 404/.test(msg) ? "The configured model is unavailable." : msg.includes("schema validation") ? "The model returned an unexpected format." : /HTTP (429|5\d\d)|timeout|aborted|budget/i.test(msg) ? "The model is busy or slow." : "The check failed.";
    console.error("check failed", msg.slice(0, 400));
    return clientError(502, `${reason} Please try again.`);
  }
}
