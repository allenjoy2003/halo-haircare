# Halo Unified Single-Terminal Runner
$Host.UI.RawUI.WindowTitle = "Halo - Full Stack Runner"
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "            HALO - HAIRCARE, CLARIFIED                           " -ForegroundColor Cyan
Write-Host "     Launching Backend and Frontend in a Single Terminal         " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$env:PATH = "$rootDir\node_bin\node-v20.18.0-win-x64;$env:PATH"

# 1. Start Django in background job
Write-Host "[1/2] Starting Django REST Backend on Port 8000..." -ForegroundColor Yellow
$djangoJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location "$dir\backend"
    & "$dir\backend\venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000 --noreload
} -ArgumentList $rootDir

Start-Sleep -Seconds 3

# 2. Display Status
Write-Host "[2/2] Starting Vite Frontend on Port 5173..." -ForegroundColor Green
Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   Backend API:    http://127.0.0.1:8000/api/" -ForegroundColor White
Write-Host "   Frontend Store: http://localhost:5173/" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers." -ForegroundColor Gray
Write-Host ""

try {
    Set-Location "$rootDir\frontend"
    & "$rootDir\node_bin\node-v20.18.0-win-x64\npm.cmd" run dev
}
finally {
    Write-Host "`nStopping Django backend job..." -ForegroundColor Yellow
    Stop-Job $djangoJob -ErrorAction SilentlyContinue
    Remove-Job $djangoJob -ErrorAction SilentlyContinue
    Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*MiniProject*" } | Stop-Process -Force
    Write-Host "All servers stopped cleanly." -ForegroundColor Green
}
