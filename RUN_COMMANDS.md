Run the Placement Readiness Platform (static index) — commands

1) Quick check: list files in project root

  PowerShell:
    dir

2) Serve with Python (no install needed if Python is available)

  PowerShell (recommended if Python 3 is installed):
    py -3 -m http.server 3000

  or
    python -m http.server 3000

  Open in browser:
    http://localhost:3000/

3) Serve with Node (npx)

  If you have Node.js installed you can use npx:
    npx serve . -l 3000

  or install a global static server:
    npm install -g http-server
    http-server -p 3000

4) Development in VS Code

  - Install Live Server extension and click "Go Live" (serves on a local port).

Notes
  - The provided index.html is a static shell. Replace it with your app entry (React/Vite/Next build output) as needed.
  - If you want a Node dev server (React/Vite), add the relevant project manifest (package.json) and I can scaffold the scripts.

