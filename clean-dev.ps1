# Clean and start Next.js dev server
Write-Host "Cleaning .next directory..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Force tsconfig.tsbuildinfo -ErrorAction SilentlyContinue
Write-Host "Starting dev server..." -ForegroundColor Green
npm run dev

