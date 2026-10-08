/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 [1/4] Ξεκινάει η αυτόματη παραγωγή APK (Όπως ακριβώς το Electron build!)...');

// Helper to run command and stream output
function run(cmd, cwd = process.cwd()) {
  console.log(`\n💻 Εκτέλεση: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

try {
  // Step 1: Build the Web App (Vite)
  console.log('\n📦 [2/4] Μεταγλώττιση Web κώδικα (Vite build)...');
  run('npm run build');

  // Step 2: Ensure Capacitor Android folder exists & sync
  console.log('\n🔄 [3/4] Συγχρονισμός αρχείων στο Android...');
  if (!fs.existsSync(path.resolve('android'))) {
    console.log('⚡ Πρώτη φορά: Προσθήκη Android φακέλου...');
    run('npx cap add android');
  }
  run('npx cap sync android');

  // Step 3: Run Gradle directly from CLI (No Android Studio GUI needed!)
  console.log('\n⚙️ [4/4] Αυτόματο compile του APK με Gradle...');
  const isWindows = process.platform === 'win32';
  const gradleCmd = isWindows ? 'gradlew.bat assembleDebug' : './gradlew assembleDebug';
  
  run(gradleCmd, path.resolve('android'));

  const apkPath = path.resolve('android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
  console.log('\n======================================================');
  console.log('🎉 ΣΥΓΧΑΡΗΤΗΡΙΑ! ΤΟ APK ΕΙΝΑΙ ΕΤΟΙΜΟ!');
  console.log(`📍 Το αρχείο βρίσκεται στο:\n${apkPath}`);
  console.log('======================================================\n');
} catch (error) {
  console.error('\n❌ Σφάλμα κατά τη διαδικασία build:', error.message);
  process.exit(1);
}
