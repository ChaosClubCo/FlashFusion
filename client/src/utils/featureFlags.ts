import type { FeatureFlags } from '@shared/schema';

// Feature flags configuration
export const featureFlags: FeatureFlags = {
  PROMO_LAUNCH50: true,
  PWA_ENABLED: false,
  I18N_ENABLED: false,
  UPGRADE_MODAL_V2: false,
  REFERRAL_ENABLED: false,
  AGENT_TEASERS_ENABLED: false,
};

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  return featureFlags[flag];
}
