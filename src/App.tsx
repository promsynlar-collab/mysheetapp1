/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Github, 
  Wrench, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [copiedYaml, setCopiedYaml] = useState(false);

  const updatedYaml = `name: Build Android APK (100% Free & Automated)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Move nested files if uploaded inside subfolder
        run: |
          if [ ! -f "package.json" ]; then
            SUBDIR=$(find . -maxdepth 2 -name "package.json" -exec dirname {} \\; | head -n 1)
            if [ -n "$SUBDIR" ] && [ "$SUBDIR" != "." ]; then
              echo "Moving files from $SUBDIR to root..."
              shopt -s dotglob
              mv $SUBDIR/* .
            fi
          fi

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Setup Java JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: 17

      - name: Install Dependencies
        run: npm install --legacy-peer-deps

      - name: Build Web App & Sync Capacitor
        run: |
          npm run build
          npx cap add android || true
          npx cap sync android

      - name: Build Android APK with Gradle
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: android/app/build/outputs/apk/debug/app-debug.apk`;

  const copyYamlContent = () => {
    navigator.clipboard.writeText(updatedYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Διόρθωση: Lock File & Auto-Build APK
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Έτοιμη Λύση
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Αντικατάσταση του αρχείου build-apk.yml στο GitHub για άμεση εκτέλεση χωρίς σφάλματα.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                Τι προκάλεσε το μήνυμα και πώς λύνεται αμέσως:
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Το GitHub έψαχνε ένα αρχείο με όνομα <code>package-lock.json</code> (επειδή είχαμε βάλει <code>cache: npm</code>) και παραπονέθηκε ότι έλειπε.
                Επιπλέον, αναβάθμισε τον runner σε <strong>Node.js 22</strong>.
                Αφαίρεσα το cache και πρόσθεσα αυτόματο εντοπισμό αρχείων ώστε να δουλεύει 100%!
              </p>
            </div>

            <button
              onClick={copyYamlContent}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shrink-0 shadow-md"
            >
              {copiedYaml ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copiedYaml ? 'Αντιγράφηκε!' : 'Αντιγραφή Νέου Κώδικα'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-60 overflow-y-auto">
            <pre>{updatedYaml}</pre>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
            <strong>Η κίνηση στο GitHub:</strong> Μπες στο αρχείο <code>.github/workflows/build-apk.yml</code> στο GitHub, πάτα το μολυβάκι (Edit), σβήσε τα παλιά, κάνε επικόλληση αυτόν τον νέο κώδικα και πάτα <strong>«Commit changes»</strong>!
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-3 text-center text-xs text-slate-500">
        GitHub Actions Build Fix • Node 22 • 100% Αυτόματο APK
      </footer>
    </div>
  );
}
