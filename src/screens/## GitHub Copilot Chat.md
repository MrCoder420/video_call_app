## GitHub Copilot Chat

- Extension Version: 0.29.1 (prod)
- VS Code: vscode/1.102.1
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.114.5 (3849 ms)
- DNS ipv6 Lookup: Error (1757 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (83 ms)
- Electron fetch (configured): HTTP 200 (1358 ms)
- Node.js https: HTTP 200 (6175 ms)
- Node.js fetch: HTTP 200 (3983 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.21 (1298 ms)
- DNS ipv6 Lookup: timed out after 10 seconds
- Proxy URL: None (153 ms)
- Electron fetch (configured): HTTP 200 (1556 ms)
- Node.js https: HTTP 200 (4847 ms)
- Node.js fetch: HTTP 200 (4760 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).