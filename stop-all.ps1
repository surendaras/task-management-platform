$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $projectRoot ".taskflow-pids.json"

if (-not (Test-Path $pidFile)) {
    Write-Host "No PID file found. Nothing to stop."
    exit 0
}

$pids = Get-Content $pidFile | ConvertFrom-Json

foreach ($processId in @($pids.backendPid, $pids.frontendPid)) {
    if ($processId) {
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $processId
            Write-Host "Stopped process $processId"
        }
    }
}

Remove-Item -LiteralPath $pidFile -ErrorAction SilentlyContinue
Write-Host "TaskFlow processes stopped."
