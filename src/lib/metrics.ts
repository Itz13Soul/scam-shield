import type { Level } from "./rules";
import { ruleFloor, ruleHits } from "./rules";
import { CASES, type Case } from "./testset";

export type Scores = { n: number; scams: number; legit: number; recall: number | null; falseAlarm: number | null; highPrecision: number | null };

export function scoreLevels(levels: Map<string, Level>): Scores {
  const rows = CASES.filter((c) => levels.has(c.id)).map((c) => ({ c, l: levels.get(c.id)! }));
  const scams = rows.filter((r) => r.c.label === "scam");
  const legit = rows.filter((r) => r.c.label === "legit");
  const flagged = (r: { l: Level }) => r.l !== "none";
  const high = rows.filter((r) => r.l === "high");
  return {
    n: rows.length,
    scams: scams.length,
    legit: legit.length,
    recall: scams.length ? scams.filter(flagged).length / scams.length : null,
    falseAlarm: legit.length ? legit.filter(flagged).length / legit.length : null,
    highPrecision: high.length ? high.filter((r) => r.c.label === "scam").length / high.length : null,
  };
}

export function rulesOnlyLevels(cases: Case[] = CASES): Map<string, Level> {
  return new Map(cases.map((c) => [c.id, ruleFloor(ruleHits(c.text))]));
}
