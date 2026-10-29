# Scam Shield

Paste a suspicious message or upload a call recording. Get a plain-language verdict in Hindi or English, the exact lines that look like a scam, and what to do next, including the national cyber-crime helpline 1930.

## Existing tools and the wedge

Hiya's free deepfake voice detector returns an AI-voice probability. Truecaller and Google Messages flag spam and scams but explain little and are English-first. Most scams reaching Indian families follow a script (urgency, a claimed authority such as police or a bank, a demand for money or an OTP), and a cloned voice can sound real while the script gives it away.

This project's wedge is the script check in Hindi, Hinglish and English, with two independent signals and quoted evidence:

- A language model judges the script, and every flagged trait must quote words that exist in the text or it is dropped in code.
- Separate fixed rules catch known patterns such as digital arrest and safe-account transfers, and ignore warnings such as "do not share your OTP". The higher risk of the two is shown.
- It never says "safe". The lowest level is "no scam traits found".

## Scope of this version

Web upload and paste are live. Deepfake voice scoring and the WhatsApp bot from the plan are not built yet and are not claimed. They need a Hugging Face Space and a Meta developer account.

## Evaluation

40 short labelled texts written by the developer (20 scam, 20 genuine, in English, Hinglish and Hindi), with hard negatives such as bank alerts and police awareness notices. Results are stored by the admin console and shown on the Method page.

### Result (29 Oct 2026, gemini-3.8-flash)

Model plus rules: **20 of 20 scams caught (100%), 1 of 20 genuine messages wrongly flagged (5%)**, and every "high risk" verdict was a real scam. The one false alarm came from the pattern rules, not the model: a genuine bank alert that says "if you did not make this transaction, call the bank" was marked suspicious. The model alone had no false alarms on this set.

Pattern rules alone: 65% of scams caught, 5% of genuine messages wrongly flagged. The rules were written by the same author as the cases, so this figure is likely optimistic. This is a small, easy, synthetic set, so 100% recall is not a claim about real-world scams, which are messier. The live Method page shows the same numbers. A held-out set from another author and real traffic are needed for a fair accuracy claim.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in. Secrets are read only on the server.
3. Apply `supabase/schema.sql` to a Supabase project.
4. `npm run dev`

`ADMIN_PASSWORD` must be at least 16 characters. Open `/admin` to run the evaluation.

## Checks

`npm run typecheck`, `npm run lint`, `npm test`, `npm run secret-scan`.

## Deployment

Deploy on Vercel with the variables listed in `.env.example`.

## Notice

Not legal advice. A probability, not proof. Always verify through a number you already trust and report fraud at 1930 or cybercrime.gov.in. Audio and text are processed to produce the verdict and are not stored.

## License

Copyright (c) 2026 Divyansh Srivastava. All rights reserved. Viewing only; see LICENSE.
