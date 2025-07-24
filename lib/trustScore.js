export function calculateTrustScore(text) {
  const lowered = text.toLowerCase();
  let score = 10;

  const penalties = [
    { regex: /resell|resale|shared with (?:third[- ]?)?part(?:y|ies)|sell.*data/, points: -3 },
    { regex: /no responsibility|not liable|disclaim(?:s|er) all liability/, points: -2 },
    { regex: /without encryption|unencrypted|not encrypted/, points: -2 },
    { regex: /location data collected|track.*location/, points: -1 },
    { regex: /retain.*data|data kept.*indefinitely/, points: -1 },
    { regex: /consent.*not required|without consent|may use.*without.*permission/, points: -1 }
  ];

  const bonuses = [
    { regex: /encrypt(ed)?|secured?|ssl|https/, points: +2 },
    { regex: /user control|opt[- ]out|data deletion|delete.*account/, points: +1 },
    { regex: /only.*necessary data|minimal data/, points: +1 },
    { regex: /transparency|clear.*policy/, points: +1 }
  ];

  for (const { regex, points } of penalties) {
    if (regex.test(lowered)) score += points;
  }

  for (const { regex, points } of bonuses) {
    if (regex.test(lowered)) score += points;
  }

  return Math.max(0, Math.min(10, score)); // Clamp score between 0–10
}
