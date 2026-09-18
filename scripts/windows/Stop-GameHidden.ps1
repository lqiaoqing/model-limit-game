# Stop the game dev server on port 5188 (and any PID recorded in .vite-dev.pid).

$ErrorActionPreference = 'Continue'

$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not (Test-Path (Join-Path $root 'package.json'))) {
    $root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
}

$port    = 5188
$pidFile = Join-Path $root '.vite-dev.pid'
$stopped = $false

if (Test-Path $pidFile) {
    try {
        $procId = [int]((Get-Content $pidFile -Raw).Trim())
        if ($procId -gt 0) {
            $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
            if ($p) {
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "[ok] Stopped PID $procId ($($p.ProcessName))"
                $stopped = $true
            }
        }
    } catch {
        Write-Host "[warn] Bad PID file: $_"
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

try {
    $owners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $owners) {
        $own = $c.OwningProcess
        if (-not $own) { continue }
        $p = Get-Process -Id $own -ErrorAction SilentlyContinue
        if ($p) {
            Stop-Process -Id $own -Force -ErrorAction SilentlyContinue
            Write-Host "[ok] Stopped port $port owner PID $own ($($p.ProcessName))"
            $stopped = $true
        }
    }
} catch {}

if (-not $stopped) {
    Write-Host "[info] No game server process found on port $port."
}

exit 0
