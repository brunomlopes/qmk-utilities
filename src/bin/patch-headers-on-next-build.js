const fs = require("fs");

const now = new Date().toISOString();
let routesManifest = JSON.parse(fs.readFileSync(".next/routes-manifest.json"));

routesManifest.headers.forEach((headerDefinition) => {
  headerDefinition.headers.forEach((header) => {
    if (header.key == "X-Test-Build-Time-Header") {
      header.value = now;
    }
  });
});
let serializedRoutesManifest = JSON.stringify(routesManifest);

fs.writeFileSync(".next/routes-manifest.json", serializedRoutesManifest);
