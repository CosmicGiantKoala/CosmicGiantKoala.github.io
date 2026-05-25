# Portfolio MD File Merge Script
# Usage: powershell -ExecutionPolicy Bypass -File merge-md-files.ps1

$ErrorActionPreference = "Stop"

# Settings
$BaseUrl = "https://cosmicgiantkoala.github.io"
$ContentPath = "C:\Users\CGK\Documents\WebProject\CosmicGiantKoala.github.io\content\docs"
$RootPath = "C:\Users\CGK\Documents\WebProject\CosmicGiantKoala.github.io"

# MD list file path
$ListFilePath = Join-Path $RootPath "rule"
$ListFilePath = Join-Path $ListFilePath "포트폴리오 MD 리스트.md"

$OutputPath = $RootPath

# Read MD list file
Write-Host "Reading MD list file..."
$listContent = [System.IO.File]::ReadAllText($ListFilePath, [System.Text.Encoding]::UTF8)

# Parse projects
$projects = @()
$currentProject = $null

$lines = $listContent -split "`n"
foreach ($line in $lines) {
    $line = $line.Trim()
    
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    # Project name (ends with .md)
    if ($line -match '^([A-Za-z]+)\.md$') {
        if ($currentProject) {
            $projects += $currentProject
        }
        $currentProject = @{
            Name = $matches[1]
            Paths = @()
        }
    }
    # Path (starts with -)
    elseif ($line -match '^- (.+)$') {
        $path = $matches[1].Trim()
        $currentProject.Paths += $path
    }
}

if ($currentProject) {
    $projects += $currentProject
}

Write-Host "Processing $($projects.Count) projects..."

# Process each project
foreach ($project in $projects) {
    Write-Host "`nProcessing: $($project.Name)"
    
    $outputContent = ""
    
    foreach ($path in $project.Paths) {
        # Convert path to file path
        # /docs/personal/info/introduce/ -> content\docs\Personal\Info\Introduce.md
        $filePath = $path -replace '^/docs/', '' -replace '/$', ''
        $filePath = Join-Path $ContentPath $filePath
        $filePath = $filePath + ".md"
        
        # Check file exists
        if (Test-Path $filePath) {
            Write-Host "  - Reading $path..."
            
            $mdContent = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
            
            # Remove frontmatter (+++ to +++)
            $content = $mdContent
            
            if ($mdContent -match '^\+\+\+[\s\S]*?\+\+\+') {
                $content = $mdContent -replace '^\+\+\+[\s\S]*?\+\+\+', ''
            }
            
            $content = $content.Trim()
            
            if ($content) {
                $fullUrl = $BaseUrl + $path
                $outputContent += "`n## [$path]($fullUrl)`n"
                $outputContent += $content
                $outputContent += "`n`n"
            }
        }
        else {
            Write-Host "  - [WARN] File not found: $filePath"
        }
    }
    
    # Save output file
    $outputFile = Join-Path $OutputPath "$($project.Name).md"
    [System.IO.File]::WriteAllText($outputFile, $outputContent, [System.Text.Encoding]::UTF8)
    Write-Host "  Saved: $outputFile"
}

Write-Host "`nAll MD files merged!"