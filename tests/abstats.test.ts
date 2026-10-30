import { test } from "node:test";
import assert from "node:assert/strict";
import { compare } from "../src/lib/abstats";

test("equal arms give no difference", () => {
  const r = compare({ exposure: 200, check_started: 40, check_completed: 30 }, { exposure: 200, check_started: 40, check_completed: 30 });
  assert.equal(r.z, 0);
  assert.ok(r.p > 0.99);
});

test("clear lift is significant", () => {
  const r = compare({ exposure: 1000, check_started: 100, check_completed: 80 }, { exposure: 1000, check_started: 150, check_completed: 120 });
  assert.ok(r.z > 3);
  assert.ok(r.p < 0.01);
  assert.ok(Math.abs((r.lift ?? 0) - 0.5) < 1e-9);
});

test("small samples are marked not enough", () => {
  const r = compare({ exposure: 20, check_started: 5, check_completed: 4 }, { exposure: 30, check_started: 9, check_completed: 7 });
  assert.equal(r.enough, false);
});
