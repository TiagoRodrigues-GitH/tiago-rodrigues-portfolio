# Publish the site on Cloudflare Pages (direct upload with Wrangler), from this folder:
#
#   powershell -ExecutionPolicy Bypass -File scripts\deploy-cloudflare.ps1
#
# First run: a browser tab asks to authorise Wrangler on your Cloudflare account (click "Allow").
# It creates the Pages project, points the site's own links (canonical, sitemap, robots...) to the
# *.pages.dev address, builds with base href "/" and uploads. Later runs only rebuild and upload.
param([string]$Project = 'tiago-rodrigues-portfolio')

$ErrorActionPreference = 'Continue'  # wrangler writes notices to stderr; exit codes are checked instead
Set-Location (Split-Path -Parent $PSScriptRoot)
$wrangler = 'wrangler@4'

npx -y $wrangler whoami | Out-String | Tee-Object -Variable who | Out-Null
if ($who -match 'not authenticated') {
  Write-Host 'Opening the Cloudflare login in your browser: click "Allow".'
  npx -y $wrangler login
  if ($LASTEXITCODE -ne 0) { throw 'Cloudflare login failed or timed out; run the script again.' }
}

# Create the project (fails harmlessly if it already exists) and read its address.
$created = (npx -y $wrangler pages project create $Project --production-branch main 2>&1 | Out-String)
$url = [regex]::Match($created, 'https://[a-z0-9-]+\.pages\.dev').Value
if (-not $url) { $url = "https://$Project.pages.dev" }

$current = [regex]::Match((Get-Content src\app\services\seo.service.ts -Raw), "SITE_URL = '([^']+)'").Groups[1].Value
if ($current -ne $url) { node scripts/set-site-url.mjs $url }

npm run build:cloudflare
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
$deploy = (npx -y $wrangler pages deploy dist/tiago-rodrigues-portfolio/browser --project-name $Project --branch main --commit-dirty=true 2>&1 | Out-String)
Write-Host $deploy
if ($LASTEXITCODE -ne 0) { throw 'Upload failed.' }

Write-Host "Site published at $url"
if ($current -ne $url) {
  Write-Host 'The site links now point to the new address: commit and push src/, public/ (git commit -am "Site address: Cloudflare Pages"; git push).'
}
