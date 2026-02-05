# 🚀 Quick Command Reference

## Essential Commands

### Start the App
```bash
npm start
```
Opens Expo DevTools. Scan QR code with Expo Go app.

### Run on iOS Simulator (Mac Only)
```bash
npm run ios
```

### Run on Android Emulator
```bash
npm run android
```

### Clear Cache
```bash
npm start -- --reset-cache
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

---

## Common Tasks

### Download Fonts (if needed)
```bash
./download-fonts.sh
```

### Check Project Structure
```bash
ls -la
```

### View Running Processes
```bash
ps aux | grep node
```

### Kill Metro Bundler
```bash
killall node
```

---

## Debugging Commands

### Open Dev Menu
- **iOS:** Cmd + D (simulator) or Shake (device)
- **Android:** Cmd + M (emulator) or Shake (device)

### Reload App
- **iOS/Android:** Press R in terminal or shake device

### Enable Fast Refresh
Already enabled by default!

---

## Project Info

### View Dependencies
```bash
npm list --depth=0
```

### Check Package Version
```bash
npm list expo react-native
```

### View Expo Configuration
```bash
cat app.json
```

---

## Useful Expo Commands

### Start with Tunnel
```bash
npm start -- --tunnel
```
Use when QR code doesn't work on local network.

### Start with Clear Cache
```bash
npm start -- --clear
```

### Check Expo Version
```bash
npx expo --version
```

---

## File Operations

### Count Lines of Code
```bash
wc -l src/app/components/*.native.tsx
```

### Find All TypeScript Files
```bash
find . -name "*.tsx" -o -name "*.ts"
```

### Check File Sizes
```bash
ls -lh assets/fonts/
```

---

## Git Commands (Optional)

### Check Status
```bash
git status
```

### Create Commit
```bash
git add .
git commit -m "Converted to React Native"
```

### View Changes
```bash
git diff
```

---

## Testing

### Test on Physical Device
1. Install Expo Go
2. Run `npm start`
3. Scan QR code

### Test on Simulator
```bash
# iOS
npm run ios

# Android
npm run android
```

---

## Troubleshooting

### Port Already in Use
```bash
killall node
npm start
```

### Metro Bundler Error
```bash
npm start -- --reset-cache
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

### Font Loading Error
```bash
npm start -- --clear
```

---

## Quick Start Sequence

```bash
# 1. Start the server
npm start

# 2. Open Expo Go on your phone

# 3. Scan the QR code

# 4. Wait for app to load

# 5. Enjoy!
```

---

## Documentation Quick Links

- `START-HERE.md` - Overview
- `QUICK-START.md` - Setup guide
- `README-NATIVE.md` - Full docs
- `CONVERSION-SUMMARY.md` - Technical details

---

## Need Help?

**Can't scan QR code?**
```bash
npm start -- --tunnel
```

**App won't load?**
```bash
npm start -- --reset-cache
```

**Something broken?**
```bash
rm -rf node_modules && npm install
```

---

## Pro Tips

1. Keep terminal open while developing
2. Check terminal for errors
3. Shake device for dev menu
4. Use real device for best performance
5. Fast Refresh works automatically

---

**Quick Start:** `npm start` → Scan QR → Done! 🎉
