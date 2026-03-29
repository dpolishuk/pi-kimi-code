# pi-moonshot-kimi

> [Moonshot AI](https://moonshot.ai) [Kimi K2.5](https://platform.moonshot.ai/docs/guide/start-using-kimi-api) provider extension for the [pi coding agent](https://github.com/badlogic/pi-mono).

This extension adds Moonshot AI's Kimi models as a custom provider in pi, giving you access to Kimi K2.5's powerful reasoning and code generation capabilities directly from your terminal.

## Features

- **Two models registered:**
  - `kimi-k2.5` — Latest Kimi model with thinking enabled by default (recommended)
  - `kimi-k2-thinking` — Dedicated deep-reasoning model with thinking always forced on
- **262K context window** with 65K max output tokens
- **Thinking/reasoning support** — `reasoning_content` is automatically captured and displayed in pi's TUI
- **Image support** — Send images for visual reasoning tasks
- **Tool calling** — Full compatibility with pi's built-in tools (bash, read, write, edit, etc.)
- **Zero dependencies** — Uses pi's built-in `openai-completions` streaming handler (Moonshot's API is fully OpenAI-compatible)

## Models

| Model | Description | Context | Max Output | Thinking | Images |
|-------|-------------|---------|------------|----------|--------|
| `kimi-k2.5` | Latest Kimi model, thinking on by default | 262K | 65K | ✅ | ✅ |
| `kimi-k2-thinking` | Dedicated thinking model, reasoning always on | 262K | 65K | ✅ | ✅ |

## Pricing

| Model | Input | Output |
|-------|-------|--------|
| `kimi-k2.5` | $0.60 / 1M tokens | $3.00 / 1M tokens |
| `kimi-k2-thinking` | $0.60 / 1M tokens | $3.00 / 1M tokens |

> See [official pricing](https://platform.moonshot.ai/docs/price/chat) for the latest rates.

## Installation

### Prerequisites

- [pi coding agent](https://github.com/badlogic/pi-mono) installed
- A [Moonshot AI API key](https://platform.moonshot.ai/console/api-keys)

### Option 1: Clone into extensions directory (recommended)

```bash
# Clone directly into pi's global extensions directory
git clone https://github.com/dpolishuk/pi-moonshot-kimi ~/.pi/agent/extensions/moonshot-kimi
```

### Option 2: Manual copy

```bash
# Create the extension directory
mkdir -p ~/.pi/agent/extensions/moonshot-kimi

# Download the extension files
curl -o ~/.pi/agent/extensions/moonshot-kimi/package.json \
  https://raw.githubusercontent.com/dpolishuk/pi-moonshot-kimi/main/package.json
curl -o ~/.pi/agent/extensions/moonshot-kimi/index.ts \
  https://raw.githubusercontent.com/dpolishuk/pi-moonshot-kimi/main/index.ts
```

### Option 3: Add to `settings.json`

Add the repo path to your pi settings:

```json
{
  "extensions": [
    "/path/to/pi-moonshot-kimi"
  ]
}
```

### Option 4: As a pi package

Add to `~/.pi/agent/settings.json`:

```json
{
  "packages": [
    "git:github.com/dpolishuk/pi-moonshot-kimi"
  ]
}
```

## Configuration

### Option A: Login via pi (recommended)

Inside pi, run:

```
/login
```

Select **"Moonshot AI (API Key)"** from the menu, then paste your API key when prompted.

Credentials are stored in `~/.pi/agent/auth.json` and persist across sessions.

### Option B: Environment variable

```bash
export MOONSHOT_API_KEY="your-api-key-here"
```

Add it to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) for persistence:

```bash
echo 'export MOONSHOT_API_KEY="your-api-key-here"' >> ~/.bashrc
```

### Option C: Auth file

Add directly to `~/.pi/agent/auth.json`:

```json
{
  "moonshot": { "type": "api_key", "key": "your-api-key-here" }
}
```

**Get an API key:**
1. Go to [platform.moonshot.ai/console/api-keys](https://platform.moonshot.ai/console/api-keys)
2. Sign up or log in
3. Create a new API key

### Verify Installation

```bash
pi --list-models | grep moonshot
```

You should see:

```
moonshot      kimi-k2-thinking     262.1K   65.5K    yes       yes
moonshot      kimi-k2.5            262.1K   65.5K    yes       yes
```

## Usage

### Interactive Mode

```bash
# Start pi and select the model with /model
pi

# Or specify the model directly
pi --model moonshot/kimi-k2.5
```

Inside pi, switch models at any time:

```
/model moonshot/kimi-k2.5
```

### Print Mode (one-shot)

```bash
pi -p "Explain quantum computing in simple terms" --model moonshot/kimi-k2.5
```

### With Thinking Levels

```bash
# Use high thinking for complex tasks
pi --model moonshot/kimi-k2.5 --thinking high

# Use minimal thinking for faster responses
pi --model moonshot/kimi-k2.5 --thinking minimal
```

## How It Works

The extension registers a custom provider called `moonshot` with pi's `registerProvider()` API. Since Moonshot's Kimi API is fully OpenAI Chat Completions compatible (it even recommends using the OpenAI SDK), the extension uses pi's built-in `openai-completions` streaming handler — no custom streaming code needed.

Key implementation details:

| Setting | Value | Reason |
|---------|-------|--------|
| `api` | `openai-completions` | Moonshot API is OpenAI-compatible |
| `authHeader` | `true` | Adds `Authorization: Bearer` header |
| `supportsDeveloperRole` | `false` | Moonshot uses `system` role, not `developer` |
| `maxTokensField` | `max_tokens` | Moonshot expects `max_tokens`, not `max_completion_tokens` |
| `supportsReasoningEffort` | `false` | No standard `reasoning_effort` param; thinking is on by default for K2.5 |
| `reasoning` | `true` | Enables pi's thinking UI; `reasoning_content` is auto-captured from stream |

## Troubleshooting

### Models not showing in `/model`

- Verify the extension files exist: `ls ~/.pi/agent/extensions/moonshot-kimi/`
- Check for TypeScript errors in the extension: `pi --list-models 2>&1`
- Try `/reload` inside pi to re-discover extensions

### Authentication errors

- Ensure `MOONSHOT_API_KEY` is set: `echo $MOONSHOT_API_KEY`
- Verify your API key is valid at [platform.moonshot.ai](https://platform.moonshot.ai/console/api-keys)
- Check your account has credits

### Thinking not showing

- Make sure you're using `kimi-k2.5` or `kimi-k2-thinking` (other models may not support reasoning)
- Thinking is enabled by default for these models — if you disabled it, remove any custom thinking overrides

### Connection errors

- Verify network access to `api.moonshot.ai`
- If behind a proxy, set `HTTPS_PROXY` environment variable

## Alternative: models.json

If you prefer not to use an extension, you can add Moonshot directly to `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "moonshot": {
      "baseUrl": "https://api.moonshot.ai/v1",
      "apiKey": "MOONSHOT_API_KEY",
      "api": "openai-completions",
      "authHeader": true,
      "models": [
        {
          "id": "kimi-k2.5",
          "name": "Kimi K2.5",
          "reasoning": true,
          "input": ["text", "image"],
          "cost": { "input": 0.6, "output": 3.0, "cacheRead": 0, "cacheWrite": 0 },
          "contextWindow": 262144,
          "maxTokens": 65536,
          "compat": {
            "supportsDeveloperRole": false,
            "supportsReasoningEffort": false,
            "maxTokensField": "max_tokens"
          }
        },
        {
          "id": "kimi-k2-thinking",
          "name": "Kimi K2 Thinking",
          "reasoning": true,
          "input": ["text", "image"],
          "cost": { "input": 0.6, "output": 3.0, "cacheRead": 0, "cacheWrite": 0 },
          "contextWindow": 262144,
          "maxTokens": 65536,
          "compat": {
            "supportsDeveloperRole": false,
            "supportsReasoningEffort": false,
            "maxTokensField": "max_tokens"
          }
        }
      ]
    }
  }
}
```

## Resources

- **Moonshot AI Platform:** [platform.moonshot.ai](https://platform.moonshot.ai)
- **API Documentation:** [platform.moonshot.ai/docs](https://platform.moonshot.ai/docs/guide/start-using-kimi-api)
- **Thinking Models Guide:** [platform.moonshot.ai/docs/guide/use-kimi-k2-thinking-model](https://platform.moonshot.ai/docs/guide/use-kimi-k2-thinking-model)
- **API Keys:** [platform.moonshot.ai/console/api-keys](https://platform.moonshot.ai/console/api-keys)
- **pi Documentation:** [github.com/badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- **pi Custom Providers:** [custom-provider.md](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/custom-provider.md)

## License

MIT
