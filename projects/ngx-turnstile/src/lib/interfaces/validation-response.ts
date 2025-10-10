

/**
 * Server-side validation response from Cloudflare Turnstile.
 * See {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation the docs} for more info.
 */
export interface TurnstileServerValidationResponse {
	/** Indicate if the token validation was successful or not. */
	success: boolean;
	/** A list of errors that occurred. */
	'error-codes': TurnstileServerValidationErrorCode[];
	/** The ISO timestamp for the time the challenge was solved. */
	challenge_ts?: string;
	/** The hostname for which the challenge was served. */
	hostname?: string;
	/** The customer widget identifier passed to the widget on the client side. This is used to differentiate widgets using the same sitekey in analytics. Its integrity is protected by modifications from an attacker. It is recommended to validate that the action matches an expected value. */
	action?: string;
	/** The customer data passed to the widget on the client side. This can be used by the customer to convey state. It is integrity protected by modifications from an attacker. */
	cdata?: string;
	/** Whether or not an interactive challenge was issued by Cloudflare */
	metadata?: { interactive: boolean };
	/** Error messages returned */
	messages?: string[];
}

/**
 * Error codes returned by Cloudflare Turnstile server-side validation.
 * See {@link https://developers.cloudflare.com/turnstile/get-started/server-side-validation/#error-codes the docs} for more info.
 */
export type TurnstileServerValidationErrorCode =
	/**  The secret parameter was not passed. */
	| 'missing-input-secret'
	/**  The secret parameter was invalid or did not exist. */
	| 'invalid-input-secret'
	/**  The response parameter was not passed. */
	| 'missing-input-response'
	/**  The response parameter is invalid or has expired. */
	| 'invalid-input-response'
	/**  The widget ID extracted from the parsed site secret key was invalid or did not exist. */
	| 'invalid-widget-id'
	/**  The secret extracted from the parsed site secret key was invalid. */
	| 'invalid-parsed-secret'
	/**  The request was rejected because it was malformed. */
	| 'bad-request'
	/**  The response parameter has already been validated before. */
	| 'timeout-or-duplicate'
	/**  An internal error happened while validating the response. The request can be retried. */
	| 'internal-error';