// Two-proportion z-test for the landing-page experiment.
export type Arm = { exposure: number; check_started: number; check_completed: number };

function normCdf(z: number) {
  // Abramowitz-Stegun approximation of the standard normal CDF.
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function compare(a: Arm, b: Arm) {
  const ra = a.exposure ? a.check_started / a.exposure : 0;
  const rb = b.exposure ? b.check_started / b.exposure : 0;
  const n = a.exposure + b.exposure;
  const pooled = n ? (a.check_started + b.check_started) / n : 0;
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / Math.max(a.exposure, 1) + 1 / Math.max(b.exposure, 1)));
  const z = se ? (rb - ra) / se : 0;
  const p = 2 * (1 - normCdf(Math.abs(z)));
  const lift = ra ? (rb - ra) / ra : null;
  const enough = a.exposure >= 100 && b.exposure >= 100;
  return { ra, rb, z, p, lift, enough };
}
