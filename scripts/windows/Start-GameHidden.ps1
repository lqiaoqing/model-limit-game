# Launch Vite game server in a hidden process, then open the browser.
# Invoked by start-game.bat / 启动游戏.bat
# Set MLG_NO_BROWSER=1 to skip opening a browser (headless/automation).

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $root 'package.json'))) {
    $root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
}

$gameUrl   = 'http://127.0.0.1:5188/'
$port      = 5188
$pidFile   = Join-Path $root '.vite-dev.pid'
$logDir    = Join-Path $root 'logs'
$outLog    = Join-Path $logDir 'dev-out.log'
$errLog    = Join-Path $logDir 'dev-err.log'
$viteJs    = Join-Path $root 'node_modules\vite\bin\vite.js'
$noBrowser = ($env:MLG_NO_BROWSER -eq '1')

function Test-PortListening {
    param([int]$Port)
    try {
        $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        return [bool]$conns
    } catch {
        return $false
    }
}

function Open-GameBrowser {
    if ($noBrowser) {
        Write-Host "[ok] Browser skipped (MLG_NO_BROWSER=1). Open $gameUrl manually."
        return
    }
    try {
        Start-Process explorer.exe $gameUrl
        Write-Host "[ok] Browser -> $gameUrl"
    } catch {
        Write-Host "[warn] Could not open browser: $_"
        Write-Host "[info] Open manually: $gameUrl"
    }
}

$node = $null
try { $node = (Get-Command node -ErrorAction Stop).Source } catch {}
if (-not $node) {
    Write-Host '[error] Node.js not found in PATH. Install Node.js 20+ then retry.'
    exit 1
}

if (Test-PortListening -Port $port) {
    Write-Host "[ok] Port $port already listening."
    Open-GameBrowser
    exit 0
}

if (-not (Test-Path $viteJs)) {
    Write-Host '[setup] node_modules/vite missing — run npm install first.'
    exit 1
}

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Remove-Item $outLog, $errLog -Force -ErrorAction SilentlyContinue

Write-Host "[run] Starting Vite hidden via $node"

# Fully detached hidden node process — no stream redirect, so this
# PowerShell can exit without pinning or killing the game server.
$proc = Start-Process -FilePath $node `
    -ArgumentList @($viteJs, '--host', '127.0.0.1') `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -PassThru

if ($proc -and $proc.Id) {
    Set-Content -Path $pidFile -Value $proc.Id -Encoding ascii
    Write-Host "[ok] Server PID $($proc.Id) saved -> $pidFile"
}

$deadline = (Get-Date).AddSeconds(25)
$ready = $false
$listenPid = $null
while ((Get-Date) -lt $deadline) {
    $c = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($c) {
        $ready = $true
        $listenPid = $c[0].OwningProcess
        break
    }
    if ($proc -and $proc.HasExited -and -not $ready) {
        # cmd may have spawned node and exited; give the port a moment more
        Start-Sleep -Milliseconds 500
        $c2 = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($c2) {
            $ready = $true
            $listenPid = $c2[0].OwningProcess
            break
        }
        if ((Get-Date) -gt $deadline.AddSeconds(-2)) { break }
    }
    Start-Sleep -Milliseconds 350
}

if ($listenPid) {
    Set-Content -Path $pidFile -Value $listenPid -Encoding ascii
    Write-Host "[ok] Server PID $listenPid on $gameUrl"
} elseif (-not $ready) {
    Write-Host "[error] Port $port not ready in time. See logs under $logDir"
    if (Test-Path $errLog) { Get-Content $errLog -Tail 40 }
    if (Test-Path $outLog) { Get-Content $outLog -Tail 20 }
    exit 1
}

Open-GameBrowser
exit 0
