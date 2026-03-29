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
 *   1. Set your API key: export MOONSHOT_API_KEY=your-key
 *      (Get one at https://platform.moonshot.ai/console/api-keys)
 *   2. Start pi (extension is auto-loaded from ~/.pi/agent/extensions/)
 *   3. Use /model to select moonshot/kimi-k2.5 or moonshot/kimi-k2-thinking
 *
 * Alternatively, add to ~/.pi/agent/models.json:
 *   {
 *     "providers": {
 *       "moonshot": {
 *         "baseUrl": "https://api.moonshot.ai/v1",
 *         "apiKey": "MOONSHOT_API_KEY",
 *         "api": "openai-completions",
 *         "models": [...]
 *       }
 *     }
 *   }
 *
 * Pricing (per million tokens):
 *   kimi-k2.5:        $0.60 input / $3.00 output (thinking tokens included)
 *   kimi-k2-thinking: $0.60 input / $3.00 output
 *
 * API docs: https://platform.moonshot.ai/docs/guide/start-using-kimi-api
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

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
	});
}
