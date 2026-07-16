param(
    [string]$Root
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = Split-Path -Parent $PSScriptRoot
}

$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$errors = New-Object System.Collections.Generic.List[string]
$files = Get-ChildItem -LiteralPath $resolvedRoot -Recurse -File -Filter '*.md'

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw

    if ($content.IndexOf([char]0x2014) -ge 0) {
        $errors.Add("$($file.FullName): contains an em-dash character")
    }

    foreach ($match in [regex]::Matches($content, '\]\(([^)]+)\)')) {
        $target = $match.Groups[1].Value.Trim()

        if ($target.StartsWith('<') -and $target.EndsWith('>')) {
            $target = $target.Substring(1, $target.Length - 2)
        }

        if ([string]::IsNullOrWhiteSpace($target) -or
            $target.StartsWith('#') -or
            $target -match '^(?i)(https?|mailto):') {
            continue
        }

        $pathOnly = $target.Split('#')[0]
        if ([string]::IsNullOrWhiteSpace($pathOnly)) {
            continue
        }

        $candidate = Join-Path (Split-Path -Parent $file.FullName) $pathOnly
        if (-not (Test-Path -LiteralPath $candidate)) {
            $errors.Add("$($file.FullName): missing Markdown link target '$target'")
        }
    }
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output ("Validated {0} Markdown files: links and style rules are clean." -f $files.Count)
