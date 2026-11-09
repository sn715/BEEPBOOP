const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// The Figma icons and dividers are SVG files rendered through expo-image.
config.resolver.assetExts.push("svg");

module.exports = config;
