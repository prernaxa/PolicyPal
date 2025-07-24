export function categorizePolicy(text) {
  const lowered = text.toLowerCase();

  return {
    dataCollection: /collect(ed)?|gather(ed)?|obtain(ed)?/.test(lowered),
    adTracking: /ads?|advertis(e|ing|ers?)|track(ing)?|behavioral.*data/.test(lowered),
    thirdParty: /third[- ]party|external (services|partners)|affiliates|share.*with.*partners?/.test(lowered),
    dataRetention: /retain(ed)?|store(d)?|keep.*data|preserve.*information/.test(lowered),
    userControl: /opt[- ]out|user.*control|delete.*account|revoke.*consent/.test(lowered),
    securityMeasures: /encrypt|ssl|https|secure|safety/.test(lowered),
  };
}
