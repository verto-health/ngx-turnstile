export interface TurnstileOptions {
  sitekey: string;
  action?: string;
  cData?: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  tabindex?: number;
  appearance?: 'always' | 'execute' | 'interaction-only';
  retry?: 'never' | 'auto';
  size?: 'normal' | 'flexible' | 'compact';
}
