# pi-kimi-code

> Kimi Code provider extension for the [pi coding agent](https://github.com/badlogic/pi-mono).

This extension was rewritten to use **Kimi Code API** (Anthropic Messages compatible)
instead of the general Moonshot API.
It supports the third-party-agent integration documented in:
https://www.kimi.com/code/docs/en/more/third-party-agents.html

## What it does

- Registers provider: `kimi-coding`
- Uses `https://api.kimi.com/coding` (Kimi Code endpoint)
- Uses `anthropic-messages` transport
- Supports the following models:
  - `kimi-for-coding` (recommended)
  - `k2p5` (alias)
  - `kimi-k2-thinking`
- Adds `/login` menu entry so credentials can be managed interactively
- Also supports environment variable and `auth.json` credentials

## Install

This extension is already prepared under `~/.pi/agent/extensions/moonshot-kimi` in this workspace.
If using elsewhere:

```bash
git clone https://github.com/dpolishuk/pi-moonshot-kimi ~/.pi/agent/extensions/pi-kimi-code
```

## Configuration

### Option A: Interactive login (recommended)

In pi:

```text
/login
```

Select **"Kimi Code (API Key)"** and paste your key.

### Option B: Environment variable

```bash
export KIMI_API_KEY="sk-kimi-..."
```

Add to shell profile for persistence.

### Option C: auth.json

Add this entry to `~/.pi/agent/auth.json`:

```json
{
  "kimi-coding": { "type": "api_key", "key": "sk-kimi-..." }
}
```

### Option D: Legacy Anthropic-style variables (optional)

Some Kimi CLI examples use:

```bash
export ANTHROPIC_API_KEY="sk-kimi-..."
export ANTHROPIC_BASE_URL="https://api.kimi.com/coding/"
```

For this extension, `KIMI_API_KEY` (or `/login`) is preferred.

## Verify

```bash
pi --list-models | grep -i kimi
```

Expected entries:

- `kimi-coding  kimi-for-coding`
- `kimi-coding  k2p5`
- `kimi-coding  kimi-k2-thinking`

## Use

```bash
# select by provider/model
pi --model kimi-coding/kimi-for-coding

# or
pi --model kimi-coding/k2p5
```

## Notes

- Kimi Code endpoint is primarily aimed at coding workflows.
- Max output is typically `32768` and context is `262144` tokens for these models.
- API costs are currently set to `0` placeholders.
  (pi still needs concrete cost values for accounting; you can tune these in `index.ts`.)

## References

- Kimi third-party agents guide: https://www.kimi.com/code/docs/en/more/third-party-agents.html
- Kimi membership/API key page: https://www.kimi.com/code?source=docs
- pi docs: https://github.com/badlogic/pi-mono/blob/main/docs/providers.md
- custom providers: https://github.com/badlogic/pi-mono/blob/main/docs/custom-provider.md
