export function categorizePolicy(text) {
  return {
    dataCollection: /collect|gather/.test(text),
    adTracking: /ads|advertiser/.test(text),
    thirdParty: /third[- ]party|partner/.test(text),
    dataRetention: /retain|store.*data/.test(text),
  };
}
