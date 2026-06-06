$ErrorActionPreference = "Stop"

$petId = "nai-xiaolong"
$targetDir = Join-Path $HOME ".codex\pets\$petId"

if (-not (Test-Path -LiteralPath $targetDir)) {
  Write-Host "奶小龙 is not installed at: $targetDir"
  exit 0
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "$targetDir.removed-$stamp"
Move-Item -LiteralPath $targetDir -Destination $backupDir

Write-Host "Removed 奶小龙 Codex pet."
Write-Host "Backup kept at: $backupDir"
Write-Host "Restart Codex or refresh the Pets settings page."
