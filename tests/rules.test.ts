import { test } from "node:test";
import assert from "node:assert/strict";
import { ruleHits, ruleFloor } from "../src/lib/rules";
import { CASES } from "../src/lib/testset";

test("digital arrest is high on its own", () => {
  assert.equal(ruleFloor(ruleHits("You are under digital arrest")), "high");
  assert.equal(ruleFloor(ruleHits("आपको डिजिटल अरेस्ट किया जाता है")), "high");
});

test("OTP request is flagged but a warning not to share is not", () => {
  assert.equal(ruleHits("Please share your OTP now").some((h) => h.id === "otp_request"), true);
  assert.equal(ruleHits("Do not share this OTP with anyone").some((h) => h.id === "otp_request"), false);
  assert.equal(ruleHits("किसी को अपना ओटीपी या पिन न बताएं").some((h) => h.id === "otp_request"), false);
});

test("rules never raise a legitimate sample to high", () => {
  for (const c of CASES.filter((c) => c.label === "legit")) assert.notEqual(ruleFloor(ruleHits(c.text)), "high", c.id);
});

test("rules alone catch the strongest scam samples", () => {
  const caught = CASES.filter((c) => c.label === "scam").filter((c) => ruleFloor(ruleHits(c.text)) !== "none").length;
  assert.ok(caught >= 10, String(caught));
});

test("test set is balanced and ids are unique", () => {
  assert.equal(new Set(CASES.map((c) => c.id)).size, CASES.length);
  assert.equal(CASES.filter((c) => c.label === "scam").length, 20);
  assert.equal(CASES.filter((c) => c.label === "legit").length, 20);
});
