#!/bin/sh
# Builds the web version of the demo and publishes it to https://bridge-demo-psi.vercel.app.
# Needs you to be logged in to the Vercel CLI (`npx vercel login`) with access to the bridge-demo project.
set -e
cd "$(dirname "$0")/.."

OUT=dist/bridge-demo
npx expo export -p web --output-dir "$OUT"

# Every path serves the app, so links like /entry/ryan-beatty still load. Real files are served first.
printf '{\n  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]\n}\n' > "$OUT/vercel.json"

# The bridge-demo project on Vercel. These ids aren't secret; deploying still needs your login.
VERCEL_ORG_ID=team_SkOV5ckoZbxqe4JFCilJX3js VERCEL_PROJECT_ID=prj_7icY55OybfYNDTz9FJfiWekjnAUn \
  npx vercel deploy "$OUT" --prod --yes
