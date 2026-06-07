#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const petId = "nai-xiaolong";
const displayName = "奶小龙";
const packageRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(packageRoot, "pet");
const targetRoot = path.join(os.homedir(), ".codex", "pets");
const targetDir = path.join(targetRoot, petId);

function usage() {
  console.log(`奶小龙 Codex Pet

Usage:
  npx nai-xiaolong-codex-pet install
  npx nai-xiaolong-codex-pet uninstall

After install:
  Codex -> Settings -> Appearance -> Pets -> Refresh -> Select ${displayName} -> Wake Pet
`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join("");
}

function ensureSource() {
  for (const file of ["pet.json", "spritesheet.webp"]) {
    const filePath = path.join(sourceDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing package asset: ${filePath}`);
    }
  }
}

function install() {
  ensureSource();
  fs.mkdirSync(targetRoot, { recursive: true });

  if (fs.existsSync(targetDir)) {
    const backupDir = `${targetDir}.backup-${timestamp()}`;
    fs.cpSync(targetDir, backupDir, { recursive: true });
    removeDir(targetDir);
    console.log(`Existing installation backed up to: ${backupDir}`);
  }

  copyDir(sourceDir, targetDir);
  console.log(`Installed ${displayName} Codex pet.`);
  console.log(`Path: ${targetDir}`);
  console.log("");
  console.log("Next:");
  console.log(`1. Restart Codex, or open Settings -> Appearance -> Pets and click Refresh.`);
  console.log(`2. Select ${displayName}.`);
  console.log("3. Click Wake Pet.");
}

function uninstall() {
  if (!fs.existsSync(targetDir)) {
    console.log(`${displayName} is not installed at: ${targetDir}`);
    return;
  }
  const removedDir = `${targetDir}.removed-${timestamp()}`;
  fs.renameSync(targetDir, removedDir);
  console.log(`Removed ${displayName} Codex pet.`);
  console.log(`Backup kept at: ${removedDir}`);
  console.log("Restart Codex or refresh the Pets settings page.");
}

function main() {
  const command = process.argv[2] || "install";
  if (command === "install") {
    install();
    return;
  }
  if (command === "uninstall" || command === "remove") {
    uninstall();
    return;
  }
  if (command === "help" || command === "--help" || command === "-h") {
    usage();
    return;
  }
  console.error(`Unknown command: ${command}`);
  usage();
  process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
