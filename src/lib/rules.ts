export type RuleId =
  | "digital_arrest"
  | "authority_claim"
  | "otp_request"
  | "remote_access"
  | "safe_account"
  | "urgency_threat"
  | "payment_demand"
  | "secrecy";

export type RuleHit = { id: RuleId; label: string; match: string };

type Rule = { id: RuleId; label: string; strong: boolean; re: RegExp; negatable?: boolean };

const RULES: Rule[] = [
  {
    id: "digital_arrest",
    label: "Digital arrest pattern",
    strong: true,
    re: /digital[\s-]*arrest|डिजिटल\s*अरेस्ट|डिजिटल\s*गिरफ्तार|video\s*call\s*(par|pe|पर)?\s*(rehna|rahna|रहना)|arrest\s*warrant|गिरफ्तारी\s*वारंट/i,
  },
  {
    id: "authority_claim",
    label: "Claims to be police, CBI, customs, TRAI or a bank officer",
    strong: false,
    re: /\b(cbi|ncb|enforcement directorate|customs|trai|cyber\s*(crime|cell)|police|mumbai police|narcotics|income tax officer|rbi)\b|सीबीआई|पुलिस|कस्टम|ट्राई|साइबर\s*क्राइम|नारकोटिक्स|आयकर\s*विभाग/i,
  },
  {
    id: "otp_request",
    label: "Asks you to share an OTP, PIN or CVV",
    strong: true,
    negatable: true,
    re: /(share|send|tell|bata|batao|bhejo|bhej|read out|dena|do|de do|बताइए|बताओ|भेजो|भेजिए|दीजिए|बता)\W+(\w+\W+){0,4}(otp|pin|cvv|ओटीपी|पिन|सीवीवी)|(otp|pin|cvv|ओटीपी|पिन|सीवीवी)\W+(\w+\W+){0,3}(share|send|tell|bata|batao|bhejo|bhej|दीजिए|बताइए|बताओ|भेजो)/i,
  },
  {
    id: "remote_access",
    label: "Asks you to install a remote-access app",
    strong: true,
    negatable: true,
    re: /anydesk|teamviewer|quick\s*support|rustdesk|screen\s*share|स्क्रीन\s*शेयर|एनीडेस्क/i,
  },
  {
    id: "safe_account",
    label: "Asks you to move money to a 'safe' or 'verification' account",
    strong: true,
    re: /safe\s*account|verification\s*account|rbi\s*account|secure\s*account|सुरक्षित\s*खाते|वेरिफिकेशन\s*अकाउंट|सेफ\s*अकाउंट/i,
  },
  {
    id: "urgency_threat",
    label: "Urgency or a threat of arrest, blocking or legal action",
    strong: false,
    re: /(abhi|immediately|right now|within \d+\s*(minutes?|hours?)|turant|तुरंत|अभी|फौरन)|(arrest|block(ed)?|suspend(ed)?|seize|freeze|frozen|जब्त|गिरफ्तार|बंद\s*हो\s*जाएगा)/i,
  },
  {
    id: "payment_demand",
    label: "Demands a payment, fine, deposit or transfer",
    strong: false,
    re: /(pay|transfer|deposit|send)\W+(\w+\W+){0,4}(fine|penalty|fee|amount|money|rupees|rs\.?|₹|upi|gift\s*card)|(जुर्माना|पेनल्टी|पैसे\s*(भेज|ट्रांसफर)|रुपये\s*(भेज|ट्रांसफर)|ट्रांसफर\s*कर)|paise\s*(bhej|transfer)|fine\s*(bharna|bhar)/i,
  },
  {
    id: "secrecy",
    label: "Tells you to keep it secret or not to tell family",
    strong: false,
    re: /(don'?t|do not|mat|मत|kisi\s*ko\s*mat|किसी\s*को\s*मत)\W+(\w+\W+){0,3}(tell|bata|बता|inform|call)\W+(\w+\W+){0,3}(anyone|family|police|kisi|किसी|parivar|परिवार|ghar|घर)|keep\s*(this|it)\s*(secret|confidential)|गोपनीय|confidential\s*case/i,
  },
];

const NEGATION = /(do\s*not|don'?t|never|nahi|नहीं|mat|मत|kabhi\s*na|कभी\s*न|beware|सावधान)/i;

function negated(text: string, index: number): boolean {
  return NEGATION.test(text.slice(Math.max(0, index - 45), index + 10));
}

export function ruleHits(text: string): RuleHit[] {
  const out: RuleHit[] = [];
  for (const r of RULES) {
    const re = new RegExp(r.re.source, r.re.flags.includes("g") ? r.re.flags : r.re.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      if (r.negatable && negated(text, m.index)) continue;
      out.push({ id: r.id, label: r.label, match: m[0].trim().slice(0, 80) });
      break;
    }
  }
  return out;
}

export type Level = "high" | "suspicious" | "none";

export function ruleFloor(hits: RuleHit[]): Level {
  const ids = new Set(hits.map((h) => h.id));
  const strong = RULES.filter((r) => r.strong && ids.has(r.id)).length;
  if (ids.has("digital_arrest")) return "high";
  if (strong >= 2) return "high";
  if (strong >= 1 && ids.size >= 3) return "high";
  if (strong >= 1) return "suspicious";
  return "none";
}

export const LEVEL_ORDER: Record<Level, number> = { none: 0, suspicious: 1, high: 2 };

export function maxLevel(a: Level, b: Level): Level {
  return LEVEL_ORDER[a] >= LEVEL_ORDER[b] ? a : b;
}
