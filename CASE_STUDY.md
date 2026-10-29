# Scam Shield: case study

**Problem.** Most scams reaching Indian families follow a script: urgency, a claimed authority such as police or a bank, and a demand for money or an OTP. Existing tools flag spam but explain little and are English-first.

**Existing tools.** Hiya's deepfake voice detector, Truecaller and Google Messages.

**What I built.** Paste a message or upload a recording and get a Hindi or English verdict, the exact lines that look like a scam, and what to do next, including the 1930 helpline. Two independent signals: a language model that must quote real words from the text (or the flag is dropped in code), and fixed rules for known patterns such as digital arrest and safe-account transfers, which ignore warnings like "do not share your OTP". The higher risk is shown. It never says "safe".

**Decisions.** Not built and not claimed: deepfake voice scoring and a WhatsApp bot. Silent audio is rejected before the model sees it, after I found the model invented a transcript for silence. Every result carries "not legal advice; a probability, not proof".

**Evidence.** 40 labelled texts I wrote (20 scam, 20 genuine, English, Hinglish, Hindi): **20 of 20 scams caught, 1 of 20 genuine messages wrongly flagged (5%)**. The false alarm came from the rules (a genuine bank alert). Rules alone caught 65%. Same-author, small and easy, so 100% recall is not a real-world claim.

**Speed work.** Checks took 18 to 24 s. With a backup model racing the main one, they now take about 5 s on typical runs; one of three test runs still took about 18 s because of model variance. The page also shows an instant rule-based scan and a timer while the full check runs.

**Limits.** No held-out set from another author. Real-speech audio path lightly tested.

**Next.** A held-out test set and a fix for the bank-alert rule.

Live: https://scam-shield-dusky-nine.vercel.app
