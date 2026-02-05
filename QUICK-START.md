# 🚀 Quick Start Guide - LifeNote React Native

Your React app has been converted to React Native! Follow these steps to get started.

## ✅ What's Already Done

- ✅ React Native project structure created
- ✅ All dependencies installed
- ✅ Custom fonts downloaded (DM Mono & Handlee)
- ✅ All components converted with identical animations
- ✅ AsyncStorage configured for data persistence
- ✅ Expo configuration completed

## 🎯 Run the App Now!

### Option 1: Test on Your Phone (Easiest!)

1. **Install Expo Go** on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Scan the QR code** that appears in your terminal with:
   - iOS: Camera app
   - Android: Expo Go app

That's it! The app will load on your phone.

### Option 2: iOS Simulator (Mac Only)

```bash
npm run ios
```

### Option 3: Android Emulator

```bash
npm run android
```

## 📱 Features Converted

All features from the web version work identically:

- ✅ **Calendar View** - See all 365 days of the year
- ✅ **New Note View** - Add photos and text with smooth animations
- ✅ **View Note** - View and edit existing notes
- ✅ **Drag Gestures** - Swipe note card up/down to expand/collapse
- ✅ **Spring Animations** - Playful physics when saving notes
- ✅ **Floating Animation** - Note card gently bobs up and down
- ✅ **Wiggle Animation** - Photo frames wiggle in edit mode
- ✅ **Image Picker** - Native photo selection
- ✅ **Data Persistence** - Notes saved with AsyncStorage

## 🎨 Animation Breakdown

The conversion maintains 1:1 animation parity:

| Web (Framer Motion) | React Native | Status |
|---------------------|--------------|--------|
| `motion.div` with `animate` | `Animated.View` with `useAnimatedStyle` | ✅ Complete |
| `drag="y"` | `Gesture.Pan()` | ✅ Complete |
| `whileTap` | `withSequence` animations | ✅ Complete |
| Spring physics | Bezier easing curves | ✅ Complete |
| CSS transforms | React Native transforms | ✅ Complete |

## 📂 Project Structure

```
/
├── App.tsx                                    # Main entry (AsyncStorage)
├── src/app/
│   ├── types.ts                               # Shared types
│   └── components/
│       ├── CalendarView.native.tsx            # Calendar grid
│       ├── NewNoteView.native.tsx             # Create note
│       └── ViewNote.native.tsx                # View/edit note
├── assets/fonts/                              # Custom fonts ✅
│   ├── DMMono-Regular.ttf
│   └── Handlee-Regular.ttf
├── app.json                                   # Expo config
├── babel.config.js                            # Babel config (Reanimated)
└── package.json                               # Dependencies
```

## 🛠️ Troubleshooting

### "Fonts not loaded"
- Run: `npm start -- --reset-cache`
- Fonts are already downloaded in `assets/fonts/`

### "Metro bundler error"
```bash
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Animations are choppy
- Test on a real device (not simulator) for best performance
- Reanimated runs on UI thread at 60fps

### Can't scan QR code
- Make sure your phone and computer are on the same Wi-Fi network
- Try tunnel mode: `npm start -- --tunnel`

## 🎯 Next Steps

1. **Disable Demo Mode** (optional):
   - Open `App.tsx`
   - Change `DEMO_MODE = false` to persist notes between sessions

2. **Add App Icons** (optional):
   - Create icon images (see `README-NATIVE.md` for details)
   - Update `app.json` with icon paths

3. **Customize Colors**:
   - All colors are in the component StyleSheet objects
   - Primary color: `#f2ede7` (background)
   - Text color: `#5a4a35`

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

## 🎉 You're All Set!

Run `npm start` and enjoy your app on mobile!

For detailed documentation, see `README-NATIVE.md`.
