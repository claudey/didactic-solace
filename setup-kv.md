# Cloudflare KV Setup Instructions

## 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

## 2. Login to Cloudflare
```bash
wrangler login
```

## 3. Create KV Namespace
```bash
# Create production namespace
wrangler kv:namespace create "EMAILS"

# Create preview namespace (for development)
wrangler kv:namespace create "EMAILS" --preview
```

## 4. Update wrangler.toml
Replace the placeholder IDs in `wrangler.toml` with the actual namespace IDs from step 3:
- `your-kv-namespace-id` → production namespace ID
- `your-preview-kv-namespace-id` → preview namespace ID

## 5. Deploy
```bash
# Deploy to Cloudflare Pages
wrangler pages deploy dist

# Or if using Cloudflare Workers
wrangler deploy
```

## 6. View Subscribed Emails
```bash
# List all emails
wrangler kv:key list --binding EMAILS

# Get specific email data
wrangler kv:key get "user@example.com" --binding EMAILS
```

## 7. Optional: Add to package.json scripts
```json
{
  "scripts": {
    "deploy": "wrangler pages deploy dist",
    "kv:list": "wrangler kv:key list --binding EMAILS"
  }
}
```
