$node_path = (get-item local/node).FullName

if (-not ($env:Path.Contains($node_path))){
    Write-Host "Adding $node_path to path"
    $env:Path = "$node_path;$env:path"
}