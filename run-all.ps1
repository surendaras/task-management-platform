$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$pidFile = Join-Path $projectRoot ".taskflow-pids.json"

if (-not (Test-Path $backendPath)) {
    throw "Backend folder not found: $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "Frontend folder not found: $frontendPath"
}

$frontendNodeModules = Join-Path $frontendPath "node_modules"

if (-not (Test-Path $frontendNodeModules)) {
    Write-Host "Installing frontend dependencies..."
    Push-Location $frontendPath
    try {
        & npm.cmd install
    }
    finally {
        Pop-Location
    }
}

$backendProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; mvn spring-boot:run" `
    -WorkingDirectory $backendPath `
    -PassThru

$frontendProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm.cmd run dev -- --host 127.0.0.1" `
    -WorkingDirectory $frontendPath `
    -PassThru

@{
    backendPid = $backendProcess.Id
    frontendPid = $frontendProcess.Id
} | ConvertTo-Json | Set-Content -Path $pidFile

Write-Host ""
Write-Host "TaskFlow started."
Write-Host "Backend PID : $($backendProcess.Id)"
Write-Host "Frontend PID: $($frontendProcess.Id)"
Write-Host ""
Write-Host "Open:"
Write-Host "http://127.0.0.1:8080"
Write-Host "http://127.0.0.1:5173"
Write-Host ""
Write-Host "To stop both later, run: .\stop-all.ps1"
