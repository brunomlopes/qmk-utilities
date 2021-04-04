mkdir local -force

$prev_ProgressPreference = $ProgressPreference
try {
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest https://nodejs.org/dist/v14.16.0/node-v14.16.0-win-x64.zip -OutFile local/node-v14.16.0-win-x64.zip     
}
finally {
    $ProgressPreference = $prev_ProgressPreference
}

Expand-Archive local/node-v14.16.0-win-x64.zip -DestinationPath local
if (Test-path local/node) {
    Remove-Item local/node -Force -Recurse
}
move-item local/node-v14.16.0-win-x64 local/node

