export function calculateTrustScore(text) {
  let score = 10;

  if (/resell|share.*data/.test(text)) score -= 3;
  if (/no responsibility|not liable/.test(text)) score -= 2;
  if (/encrypt|secure/.test(text) === false) score -= 2;

  return Math.max(0, Math.min(10, score)); // Clamp 0–10
}
