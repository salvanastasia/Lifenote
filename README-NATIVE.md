# LifeNote - React Native

A beautiful daily journal app converted to React Native with Expo. This version maintains 1:1 visual and animation parity with the web version.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo Go app on your phone (for testing)
- iOS Simulator (Mac only) or Android Emulator

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Download Fonts

The app requires two custom fonts. Download them from Google Fonts and place them in `assets/fonts/`:

1. **DM Mono Regular** - [Download from Google Fonts](https://fonts.google.com/specimen/DM+Mono)
   - Save as: `assets/fonts/DMMono-Regular.ttf`

2. **Handlee Regular** - [Download from Google Fonts](https://fonts.google.com/specimen/Handlee)
   - Save as: `assets/fonts/Handlee-Regular.ttf`

### 3. Create App Icons (Optional)

Create the following placeholder images in the `assets/` directory:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778 for iPhone)
- `adaptive-icon.png` (1024x1024 for Android)
- `favicon.png` (48x48)

Or use the default Expo placeholders for now.

### 4. Run the App

Start the development server:

```bash
npm start
```

This will open Expo DevTools. You can then:

- **Test on your phone**: Scan the QR code with Expo Go app (iOS) or Expo Go app (Android)
- **Test on iOS Simulator** (Mac only): Press `i`
- **Test on Android Emulator**: Press `a`
- **Test on Web**: Press `w`

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (Mac only)
- `npm run web` - Run in web browser

## Features

✅ All animations converted from Framer Motion to React Native Reanimated
✅ Identical visual design to web version
✅ Drag gestures for expandable note card
✅ Spring animations on save
✅ Wiggle animation when editing photos
✅ Floating animation for note card
✅ Native image picker for photos
✅ AsyncStorage for data persistence
✅ Custom fonts (DM Mono and Handlee)

## Tech Stack

- **React Native** 0.76.5
- **Expo** ~52.0.0
- **React Native Reanimated** ~3.16.1 - For smooth 60fps animations
- **React Native Gesture Handler** ~2.20.2 - For drag gestures
- **AsyncStorage** ~2.1.0 - For local data storage
- **Expo Image Picker** ~16.0.3 - For selecting photos
- **React Native SVG** - For the line decorations

## Architecture

```
/
├── App.tsx                           # Main app entry point
├── src/
│   └── app/
│       ├── types.ts                  # TypeScript type definitions
│       └── components/
│           ├── CalendarView.native.tsx   # Year calendar view
│           ├── NewNoteView.native.tsx    # Create new note view
│           └── ViewNote.native.tsx       # View/edit existing note
├── assets/
│   └── fonts/                        # Custom fonts
├── app.json                          # Expo configuration
├── babel.config.js                   # Babel configuration
└── metro.config.js                   # Metro bundler configuration
```

## Animation Details

All animations from the web version have been faithfully recreated:

1. **Entrance Animations**: Title, photo frames, and note card fade in with staggered timing
2. **Floating Animation**: Note card gently floats up and down when not expanded
3. **Drag Gesture**: Swipe the note card up to expand, down to collapse
4. **Save Animation**: Photos rotate and scale to center with spring physics
5. **Wiggle Animation**: Photo frames wiggle when clicking in edit mode
6. **Tap to Scale**: Photos scale down slightly when tapped (view mode)

## Notes

- The app currently runs in DEMO MODE by default (data doesn't persist between sessions)
- To disable demo mode, edit `App.tsx` and set `DEMO_MODE = false`
- All styling has been converted from Tailwind CSS to React Native StyleSheet
- The gradient fade effect on calendar uses a semi-transparent overlay

## Troubleshooting

### Fonts not loading
- Make sure font files are in `assets/fonts/` with exact names
- Clear Expo cache: `expo start -c`

### Animations are choppy
- Make sure you're testing on a real device or fast simulator
- React Native Reanimated runs animations on the UI thread for 60fps performance

### Metro bundler errors
- Clear cache: `npm start -- --reset-cache`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## License

Same as original project.
