param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$petId = "nai-xiaolong"
$sourceDir = Join-Path $PSScriptRoot "pet"
$targetRoot = Join-Path $HOME ".codex\pets"
$targetDir = Join-Path $targetRoot $petId

if (-not (Test-Path -LiteralPath $sourceDir)) {
  throw "Missing pet directory: $sourceDir"
}

$requiredFiles = @("pet.json", "spritesheet.webp")
foreach ($file in $requiredFiles) {
  $path = Join-Path $sourceDir $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required file: $path"
  }
}

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

if (Test-Path -LiteralPath $targetDir) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $backupDir = "$targetDir.backup-$stamp"
  if ($Force) {
    Copy-Item -LiteralPath $targetDir -Destination $backupDir -Recurse -Force
    Remove-Item -LiteralPath $targetDir -Recurse -Force
  } else {
    Write-Host "Existing installation found: $targetDir"
    Write-Host "Backup will be created: $backupDir"
    Copy-Item -LiteralPath $targetDir -Destination $backupDir -Recurse -Force
    Remove-Item -LiteralPath $targetDir -Recurse -Force
  }
}

New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
Copy-Item -LiteralPath (Join-Path $sourceDir "pet.json") -Destination (Join-Path $targetDir "pet.json") -Force
Copy-Item -LiteralPath (Join-Path $sourceDir "spritesheet.webp") -Destination (Join-Path $targetDir "spritesheet.webp") -Force

Write-Host ""
Write-Host "Installed 奶小龙 Codex pet."
Write-Host "Path: $targetDir"
Write-Host ""
Write-Host "Next:"
Write-Host "1. Restart Codex, or open Settings -> Appearance -> Pets and click Refresh."
Write-Host "2. Select 奶小龙."
Write-Host "3. Click Wake Pet."
