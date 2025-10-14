import { TurnstileOptions } from './turnstile-options';

export interface Turnstile {
  /**
   * Registers a callback to be invoked when the turnstile is ready.
   * @param callback A callback function to be executed when the turnstile is ready. Use this callback to perform actions upon turnstile readiness.
   */
  ready: (callback: () => void) => void;

  /**
   * Invokes a Turnstile widget and returns the ID of the newly created widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @param params An object containing render parameters as key=value pairs, for example, {"sitekey": "your_site_key", "theme": "auto"}.
   * @return the ID of the newly created widget, or undefined if invocation is unsuccessful.
   */
  render: (
    container: string | HTMLElement,
    params?: TurnstileOptions,
  ) => string | null | undefined;

  /**
   * Invokes a Turnstile widget and returns the ID of the newly created widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @param params An object containing render parameters as key=value pairs, for example, {"sitekey": "your_site_key", "theme": "auto"}.
   * @return the ID of the newly created widget, or undefined if invocation is unsuccessful.
   */
  execute: (container: string | HTMLElement, params?: TurnstileOptions) => void;

  /**
   * Resets a Turnstile widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   */
  reset: (container?: string | HTMLElement) => void;

  /**
   * Fully removes the Turnstile widget from the DOM.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   */
  remove: (container?: string | HTMLElement) => void;

  /**
   * Gets the response of a Turnstile widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @return the response of the Turnstile widget.
   */
  getResponse: (container?: string | HTMLElement) => string | undefined;

  /**
   * Checks whether or not the token returned by the given widget is expired.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @return whether it is expired or not
   */
  isExpired: (container?: string | HTMLElement) => boolean;
}
