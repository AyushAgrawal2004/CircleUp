const https = require('https');
const fs = require('fs');

const mermaidCode = `
gitGraph
    commit id: "Initial-V1.0"
    branch "v1.1"
    checkout "v1.1"
    commit id: "Config"
    commit id: "Styles"
    checkout main
    merge "v1.1" id: "Rebase"
    branch "v1.2"
    checkout "v1.2"
    commit id: "IDB-Setup"
    commit id: "UI"
    checkout main
    merge "v1.2"
    branch "v1.5"
    checkout "v1.5"
    commit id: "Logout"
    commit id: "Del-Btn"
    checkout main
    merge "v1.5"
    commit id: "Release" tag: "v1.5"
`;

// Simple Base64 encode
const encoded = Buffer.from(mermaidCode).toString('base64');
const url = `https://mermaid.ink/img/${encoded}`;

console.log("Downloading from:", url);

const file = fs.createWriteStream("workflow_chart.png");
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => console.log("Download complete"));
    });
}).on('error', function (err) {
    fs.unlink("workflow_chart.png");
    console.error("Error downloading:", err.message);
});
