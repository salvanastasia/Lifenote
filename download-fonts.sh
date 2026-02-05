#!/bin/bash

# Script to download Google Fonts for LifeNote React Native app

echo "📥 Downloading fonts for LifeNote..."
echo ""

# Create fonts directory if it doesn't exist
mkdir -p assets/fonts

# Download DM Mono
echo "Downloading DM Mono..."
curl -L "https://github.com/google/fonts/raw/main/ofl/dmmono/DMMono-Regular.ttf" -o assets/fonts/DMMono-Regular.ttf

# Download Handlee
echo "Downloading Handlee..."
curl -L "https://github.com/google/fonts/raw/main/ofl/handlee/Handlee-Regular.ttf" -o assets/fonts/Handlee-Regular.ttf

echo ""
echo "✅ Fonts downloaded successfully!"
echo ""
echo "Fonts saved to:"
echo "  - assets/fonts/DMMono-Regular.ttf"
echo "  - assets/fonts/Handlee-Regular.ttf"
echo ""
echo "You can now run: npm start"
