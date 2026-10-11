<#
  Prints the BCrypt hash (cost 12) of a password, for ADMIN_PASSWORD_HASH on Render.
  The password is typed hidden and never written to disk or shown; only the hash is printed.
  Uses Spring Security's own encoder from the local Maven repository (run "mvn test" in backend/ once first).

    powershell -ExecutionPolicy Bypass -File backend\scripts\bcrypt-hash.ps1
#>
$m2 = Join-Path $env:USERPROFILE '.m2\repository'
$crypto = Get-ChildItem "$m2\org\springframework\security\spring-security-crypto" -Recurse -Filter 'spring-security-crypto-*.jar' -ErrorAction SilentlyContinue |
    Where-Object Name -notmatch 'sources|javadoc' | Sort-Object FullName | Select-Object -Last 1
if (-not $crypto) { Write-Host 'spring-security-crypto not found: run "mvn test" in backend/ first.' -ForegroundColor Red; exit 1 }
$jcl = Get-ChildItem "$m2\org\springframework\spring-jcl" -Recurse -Filter 'spring-jcl-*.jar' -ErrorAction SilentlyContinue | Select-Object -Last 1

$secure = Read-Host 'Admin password (hidden)' -AsSecureString
$again  = Read-Host 'Repeat it' -AsSecureString
$plain  = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
$plain2 = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($again))
if ($plain -ne $plain2) { Write-Host 'The passwords differ.' -ForegroundColor Red; exit 1 }
if ($plain.Length -lt 12) { Write-Host 'Use at least 12 characters.' -ForegroundColor Red; exit 1 }

$src = Join-Path $env:TEMP "BcryptHash$PID.java"
Set-Content $src 'public class BcryptHash { public static void main(String[] a) { System.out.print(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(12).encode(System.getenv("BCRYPT_INPUT"))); } }'
$cp = $crypto.FullName + $(if ($jcl) { ';' + $jcl.FullName } else { '' })
$env:BCRYPT_INPUT = $plain
try { $hash = & java -cp $cp $src 2>$null } finally { $env:BCRYPT_INPUT = $null; Remove-Item $src -ErrorAction SilentlyContinue }

if ($hash -notmatch '^\$2a\$12\$.{53}$') { Write-Host 'Hashing failed.' -ForegroundColor Red; exit 1 }
Write-Host ''
Write-Host 'ADMIN_PASSWORD_HASH (paste into Render):' -ForegroundColor Green
Write-Host $hash
