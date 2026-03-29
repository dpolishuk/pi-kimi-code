/**
 * Kimi Code API extension for pi
 *
 * Rewrites the previous Moonshot API extension to use the official Kimi Code API
 * used by Claude Code / Roo Code third-party agent integrations:
 * https://www.kimi.com/code/docs/en/more/third-party-agents.html
 *
 * Key integration details:
 * - Endpoint: https://api.kimi.com/coding/
 * - API type: Anthropic Messages API compatible
 * - Auth: KIMI_API_KEY
 */

import type { OAuthCredentials, OAuthLoginCallbacks } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

async function loginKimi(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials> {
	const apiKey = await callbacks.onPrompt({
		message: "Enter your Kimi Code API key (from Moonshot Kimi membership page):",
	});

	if (!apiKey || !apiKey.trim()) {
		throw new Error("No API key provided");
	}

	return {
		refresh: apiKey.trim(),
		access: apiKey.trim(),
		expires: Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
	};
}

function getKimiApiKey(credentials: OAuthCredentials): string {
	return credentials.access;
}

async function refreshKimiToken(credentials: OAuthCredentials): Promise<OAuthCredentials> {
	// API keys do not rotate.
	return credentials;
}

export default function (pi: ExtensionAPI) {
	pi.registerProvider("kimi-coding", {
		baseUrl: "https://api.kimi.com/coding",
		apiKey: "KIMI_API_KEY",
		api: "anthropic-messages",
		authHeader: true,
		models: [
			{
				id: "kimi-for-coding",
				name: "Kimi for Coding",
				reasoning: true,
				input: ["text", "image"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
				},
				contextWindow: 262144,
				maxTokens: 32768,
			},
			{
				id: "k2p5",
				name: "Kimi K2.5",
				reasoning: true,
				input: ["text", "image"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
				},
				contextWindow: 262144,
				maxTokens: 32768,
			},
			{
				id: "kimi-k2-thinking",
				name: "Kimi K2 Thinking",
				reasoning: true,
				input: ["text"],
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
				},
				contextWindow: 262144,
				maxTokens: 32768,
			},
		],
		oauth: {
			name: "Kimi Code (API Key)",
			login: loginKimi,
			refreshToken: refreshKimiToken,
			getApiKey: getKimiApiKey,
		},
	});
}
