# AI Google Form Filler - Chrome Extension

A Chrome extension that automates Google Form submissions with AI-powered contextual answers.

## Installation & Configuration

### For Replit Deployments (Recommended)

1. **Configure the API URL**:
   - Open `config.js`
   - Set `DEFAULT_API_URL` to your Replit deployment URL:
     ```javascript
     DEFAULT_API_URL: 'https://your-repl-name.username.replit.app'
     ```

2. **Load the extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `chrome-extension` folder
   - The extension will automatically connect to your configured Replit URL

### For Local Development

1. **No configuration needed** - the extension auto-detects `localhost:5000`

2. **Make sure the main app is running**:
   ```bash
   npm run dev
   ```

3. **Load the extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `chrome-extension` folder

### Manual Configuration (Alternative)

If automatic detection fails or you need to change the URL:

1. Click the extension icon
2. If you see the setup screen, enter your API URL
3. Click "Test Connection"
4. Once verified, the URL is saved for future use
5. Use "Reconfigure" link in the footer to change URLs anytime

## Usage

### Method 1: From Any Page

1. Click the extension icon
2. Enter a Google Form URL
3. Configure settings (number of responses, user data)
4. Click "Generate & Fill"
5. Watch real-time progress

### Method 2: From a Google Form

1. Navigate to any Google Form
2. Click the extension icon
3. The form URL is auto-filled
4. Configure and submit

## Features

- ✅ **Auto-Discovery**: Automatically finds API in Replit and localhost environments
- ✅ **One-Time Setup**: Configure once, works everywhere
- ✅ **Real-Time Progress**: Live SSE streaming of submission progress
- ✅ **Smart Detection**: Auto-fills form URL when on Google Forms
- ✅ **Persistent Storage**: Remembers configuration across sessions
- ✅ **Manual Override**: Reconfigure anytime via footer link

## Configuration Priority

The extension tries URLs in this order:

1. **Stored URL** (from previous manual configuration)
2. **Config URL** (from `config.js` - deployment specific)
3. **Localhost** (`http://localhost:5000` - auto-detect for dev)
4. **Manual Setup** (shows setup screen if all fail)

## Deployment Checklist

When deploying to a new Replit instance:

- [ ] Update `config.js` with your Replit URL
- [ ] Test the web app is accessible at that URL
- [ ] Reload the extension in `chrome://extensions/`
- [ ] Verify connection with "Test Connection" if needed

## Troubleshooting

### Extension shows setup screen every time
- **Cause**: API URL not configured or unreachable
- **Fix**: 
  1. Update `config.js` with correct Replit URL
  2. Reload extension
  3. Or use manual configuration via setup screen

### "Connection failed" error
- **Cause**: API server not running or URL incorrect
- **Fix**:
  1. Verify the web app is running (`npm run dev`)
  2. Check the URL in `config.js` matches your deployment
  3. Try accessing the URL directly in browser
  4. Check `/api/health` endpoint responds

### Auto-fill not working
- **Cause**: Not on a Google Form page
- **Fix**: Navigate to `docs.google.com/forms/...` first

### Progress bar stuck at 0%
- **Cause**: SSE streaming issue or server error
- **Fix**:
  1. Check browser console for errors
  2. Verify backend is running and accessible
  3. Try reconfiguring API URL

## Development

To modify the extension:

1. Make changes to files
2. Go to `chrome://extensions/`
3. Click reload icon on the extension card
4. Test your changes

## API Compatibility

The extension expects these endpoints:

- `GET /api/health` - Health check (returns `{ service: "AI Google Form Filler" }`)
- `POST /api/fill-form` - Form filling with SSE progress streaming

## Icons

The extension uses placeholder icon paths. To add custom icons:

1. Create PNG icons: 16×16, 32×32, 48×48, 128×128
2. Place in `icons/` folder
3. Name as: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

## Support

For issues or questions:
- Check browser console (F12) for errors
- Verify `config.js` is configured correctly
- Test the API URL directly in browser
- Use "Reconfigure" to update URLs manually

## Security Notes

- API URL is stored locally in browser
- No sensitive data is transmitted except form submissions
- All communication uses HTTPS in production (Replit)
- Extension only requests `activeTab` permission
