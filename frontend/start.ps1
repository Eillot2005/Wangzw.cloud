# Frontend Startup Script for Windows PowerShell
# Friend Management System - Frontend

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Friend Management System - Frontend" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed!" -ForegroundColor Green
}

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created!" -ForegroundColor Green
}

# Start development server
Write-Host ""
Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host "Frontend will run at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Yellow
Write-Host "  Admin: username=admin" -ForegroundColor Yellow
Write-Host "  Friend: username=friend" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
