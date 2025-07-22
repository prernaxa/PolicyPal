export function extractRisks(text) {
  const risks = [];

  if (text.includes('resell') || text.includes('third-party')) {
    risks.push('Possible data resale');
  }
  if (text.includes('ads') || text.includes('advertisers')) {
    risks.push('Advertising/tracking data used');
  }
  if (text.includes('location')) {
    risks.push('Location data collected');
  }

  return risks;
}
