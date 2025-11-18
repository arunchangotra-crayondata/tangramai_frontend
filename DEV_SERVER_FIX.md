# Dev Server Fix Instructions

## Issue
The dev server was showing errors about missing `vendor-chunks/next.js` files. This is a known Next.js 15 issue with corrupted build cache.

## Solution

### Option 1: Use Clean Dev Script (Recommended)
```bash
npm run dev:clean
```

### Option 2: Manual Clean
```powershell
# Stop any running dev server (Ctrl+C)
# Then run:
Remove-Item -Recurse -Force .next
npm run dev
```

### Option 3: Use PowerShell Script
```powershell
.\clean-dev.ps1
```

## For Production Build
The production build works fine:
```bash
npm run build
npm start
```

## Notes
- Always stop the dev server (Ctrl+C) before cleaning
- The build process works correctly
- This issue only affects the dev server, not production builds

