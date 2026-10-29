export const APP_CONFIG = {
  aboutUrl: "https://www.doitforjesus.com/about",
  appUrl: "https://app.doitforjesus.com",
  communityGuidelinesUrl: "https://www.doitforjesus.com/community-guidelines",
  inviteUrl: "https://www.doitforjesus.com",
  privacyPolicyUrl: "https://www.doitforjesus.com/privacy-policy",
  supportEmail: "admin@doit4jesus.com",
  termsOfServiceUrl: "https://www.doitforjesus.com/terms-of-service",
} as const;

export function getLocalizedLegalUrls(language: "en" | "es") {
  const prefix = language === "es" ? "/es" : "";
  const origin = "https://www.doitforjesus.com";
  return {
    communityGuidelines: `${origin}${prefix}/community-guidelines`,
    privacy: `${origin}${prefix}/privacy-policy`,
    terms: `${origin}${prefix}/terms-of-service`,
  };
}
