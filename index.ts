/**
 * Moonshot AI Kimi K2.5 Provider Extension for pi
 *
 * Adds Moonshot AI's Kimi models as a custom provider.
 * The Moonshot API is fully OpenAI Chat Completions compatible,
 * so we use the built-in openai-completions streaming.
 *
 * Models:
 *   - kimi-k2.5:        Latest Kimi model with optional thinking (enabled by default)
 *   - kimi-k2-thinking: Dedicated thinking model with reasoning always on
 *
 * Usage:
 *   1. Run /login in pi and select "Moonshot AI (API Key)"
 *      Or: export MOONSHOT_API_KEY=your-key
 *      (Get one at https://platform.moonshot.ai/console/api-keys)
 *   2. Use /model to select moonshot/kimi-k2.5 or moonshot/kimi-k2-thinking
 *
 * API docs: https://platform.moonshot.ai/docs/guide/start-using-kimi-api
 */

import type { OAuthCredentials, OAuthLoginCallbacks } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

async function loginMoonshot(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
	// Simple API key prompt — Moonshot doesn't offer browser OAuth for API keys
	const apiKey = await callbacks.onPrompt({
		message: "Enter your Moonshot API key (from https://platform.moonshot.ai/console/api-keys):",
	});

	if (!apiKey || !apiKey.trim()) {
		throw new Error("No API key provided");
	}

	// Store as a long-lived credential (API keys don't expire)
	return {
		refresh: apiKey.trim(),
		access: apiKey.trim(),
		expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
	};
}

async function refreshMoonshotToken(credentials: OAuthCredentials): Promise<OAuthCredentials> {
	// API keys don't expire, just return as-is
	return credentials;
}

function getMoonshotApiKey(credentials: OAuthCredentials): string {
	return credentials.access;
}

export default function (pi: ExtensionAPI) {
	pi.registerProvider("moonshot", {
		baseUrl: "https://api.moonshot.ai/v1",
		apiKey: "MOONSHOT_API_KEY",
		api: "openai-completions",
		authHeader: true,
		models: [
			{
				id: "kimi-k2.5",
				name: "Kimi K2.5",
				reasoning: true,
				input: ["text", "image"],
				cost: {
					input: 0.6,
					output: 3.0,
					cacheRead: 0,
					cacheWrite: 0,
				},
				contextWindow: 262144,
				maxTokens: 65536,
				compat: {
					// Moonshot uses system role (not developer)
					supportsDeveloperRole: false,
					// No standard reasoning_effort support
					supportsReasoningEffort: false,
					// Moonshot uses max_tokens (not max_completion_tokens)
					maxTokensField: "max_tokens",
				},
			},
			{
				id: "kimi-k2-thinking",
				name: "Kimi K2 Thinking",
				reasoning: true,
				input: ["text", "image"],
				cost: {
					input: 0.6,
					output: 3.0,
					cacheRead: 0,
					cacheWrite: 0,
				},
				contextWindow: 262144,
				maxTokens: 65536,
				compat: {
					supportsDeveloperRole: false,
					supportsReasoningEffort: false,
					maxTokensField: "max_tokens",
				},
			},
		],
		oauth: {
			name: "Moonshot AI (API Key)",
			login: loginMoonshot,
			refreshToken: refreshMoonshotToken,
			getApiKey: getMoonshotApiKey,
		},
	});
}
