export function extractRisks(text) {
  const lowered = text.toLowerCase();
  const risks = [];

  const patterns = [
    {
      regex: /resell|resale|shared with (?:third[- ]?)?part(?:y|ies)|sell.*data/,
      label: 'Possible data resale or third-party sharing',
    },
    {
      regex: /ads?|advertisers?|targeted (ads?|advertising)|ad[- ]partners?/,
      label: 'Advertising or tracking data usage',
    },
    {
      regex: /location|gps|geolocation|track.*location/,
      label: 'Location data collected',
    },
    {
      regex: /retain.*data|store.*indefinite|data.*retention|data kept.*period/,
      label: 'Extended data retention',
    },
    {
      regex: /biometric|face recognition|fingerprint|iris scan/,
      label: 'Biometric data collected',
    },
    {
      regex: /unencrypted|plaintext|no encryption|without encryption|not encrypted/,
      label: 'Unencrypted data storage or transmission',
    },
    {
      regex: /consent.*not required|without consent|may use.*without.*permission/,
      label: 'Ambiguous or missing user consent',
    },
    {
      regex: /combine.*data|linked.*accounts|cross-platform.*tracking/,
      label: 'Cross-platform tracking or account linking',
    },
    {
      regex: /legal authorities|law enforcement|subpoena|comply with legal requests/,
      label: 'Sharing data with legal authorities',
    }
  ];

  for (const { regex, label } of patterns) {
    if (regex.test(lowered)) {
      risks.push(label);
    }
  }

  return risks;
}
