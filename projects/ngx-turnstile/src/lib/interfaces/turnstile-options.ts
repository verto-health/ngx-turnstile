export interface TurnstileOptions {
  sitekey: string;
  action?: string;
  cData?: string;
  callback?: (token: string) => void;
  'expired-callback'?: (token: string) => void;
  'error-callback'?: (errorCode: string) => boolean;
  'timeout-callback'?: () => void;
	'before-interactive-callback'?: () => void;
	'after-interactive-callback'?: () => void;
	'unsupported-callback'?: () => void;
  theme?: Theme;
  language?: string;
  tabindex?: number;
  appearance?: AppearanceMode;
  retry?: FailureRetryMode;
  'retry-interval'?: number;
  size?: WidgetSize;
  'refresh-expired'?: RefreshExpiredMode;
  'refresh-timeout'?: RefreshTimeoutMode;
  execution?: ExecutionMode;
  'feedback-enabled'?: boolean;
}

/**
 * The theme of the Turnstile widget.
 * The default is "auto", which respects the user preference. This can be forced to "light" or "dark" by setting the theme accordingly.
 */
export type Theme = 'auto' | 'light' | 'dark';

/**
 * The widget size.
 * Can take the following values: normal, compact, flexible, invisible.
 */
export type WidgetSize = 'normal' | 'compact' | 'flexible' | 'invisible';

/**
 * How to retry on widget failure.
 * The default is "auto", which allows the user to retry. This can be forced to "never" by the user.
 */
export type FailureRetryMode = 'never' | 'auto';

/**
 * The appearance mode of the Turnstile widget.
 * The default is "always". If set to "execute", the widget will only appear when executing. If set to "interaction-only", the widget will only be shown when / if interactivity is required.
 */
export type AppearanceMode = 'always' | 'execute' | 'interaction-only';

/**
 * The refresh mode to use when the given Turnstile token expires.
 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
 */
export type RefreshExpiredMode = 'never' | 'manual' | 'auto';

/**
 * The refresh mode to use when the widget times out.
 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
 */
export type RefreshTimeoutMode = 'never' | 'manual' | 'auto';

/**
 * Execution controls when to obtain the token of the widget and can be on "render" (default) or on "execute".
 */
export type ExecutionMode = 'render' | 'execute';
