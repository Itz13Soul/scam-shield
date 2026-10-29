# Scam Shield: case study

**Problem.** Scams reaching Indian families follow a script: urgency, a claimed authority such as police or a bank, and a demand for money or an OTP. Deepfake detectors such as Hiya's free tool return an AI-voice probability and say nothing about the script, and a cloned voice can sound real while the script gives it away.

**What I built.** A web tool where a person pastes a message or uploads a call recording (up to 3.5 MB). It transcribes Hindi, Hinglish or English, judges the script, and returns a verdict in Hindi or English with the exact quoted evidence and what to do next, including the 1930 helpline.

**Decisions.**
- Two independent signals: a language model and fixed pattern rules. The higher risk wins, so a model miss on a known pattern such as digital arrest cannot lower the result.
- The model's quotes must exist in the text or they are dropped. Next steps are written in code, not generated, so the 1930 advice is always present.
- It never says "safe". The lowest level is "no scam traits found".
- Scope: deepfake voice scoring and the WhatsApp bot from the plan are not built. They need a Hugging Face Space and a Meta developer account, and they are not claimed.

**Result.** On 40 labelled synthetic cases (20 scam, 20 genuine, in English, Hinglish and Hindi, including hard negatives such as bank alerts and police awareness notices): 20 of 20 scams caught and 1 of 20 genuine messages wrongly flagged, by the rules rather than the model. Pattern rules alone catch 65% of scams. The set is small, synthetic and written by the same author as the rules, so real-world accuracy will be lower.

**Next.** A held-out set from another author and real scam messages, an audio test set of real and cloned clips, a Hugging Face deepfake model, and the WhatsApp bot.

Not legal advice. A probability, not proof.

Copyright (c) 2026 Divyansh Srivastava. All rights reserved.
