import { test } from "node:test";
import assert from "node:assert/strict";
import { wavIsSilent } from "../src/lib/audio";

function wav(freq: number, sec: number): Buffer {
  const sr = 16000;
  const n = sr * sec;
  const b = Buffer.alloc(44 + n * 2);
  b.write("RIFF", 0);
  b.writeUInt32LE(36 + n * 2, 4);
  b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24);
  b.writeUInt32LE(sr * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write("data", 36);
  b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(freq ? Math.round(Math.sin((2 * Math.PI * freq * i) / sr) * 12000) : 0, 44 + i * 2);
  return b;
}

test("digital silence in a WAV file is detected", () => {
  assert.equal(wavIsSilent(wav(0, 2)), true);
});

test("a WAV file with sound is not treated as silent", () => {
  assert.equal(wavIsSilent(wav(440, 2)), false);
});

test("non-WAV data is left for the transcriber", () => {
  assert.equal(wavIsSilent(Buffer.from("not audio at all, just some bytes of text here to pass length")), false);
});
