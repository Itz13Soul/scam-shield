export function wavIsSilent(buf: Buffer): boolean {
  if (buf.length < 48 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") return false;
  let offset = 12;
  let bits = 0;
  let format = 0;
  while (offset + 8 <= buf.length) {
    const id = buf.toString("ascii", offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (id === "fmt ") {
      format = buf.readUInt16LE(body);
      bits = buf.readUInt16LE(body + 14);
    } else if (id === "data") {
      if (format !== 1 || bits !== 16) return false;
      const end = Math.min(buf.length, body + size);
      let peak = 0;
      for (let i = body; i + 1 < end; i += 2) peak = Math.max(peak, Math.abs(buf.readInt16LE(i)));
      return peak / 32768 < 0.005;
    }
    offset = body + size + (size % 2);
  }
  return false;
}
