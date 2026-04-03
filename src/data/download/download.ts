// download-data.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all download page content.
// Replace fake file URLs, sizes and changelog entries with real ones on launch.
// Nothing else in the codebase should hardcode platform or version info.

export type PlatformId = "windows" | "macos" | "linux";

export interface DownloadFile {
  label:    string;       // e.g. "Windows Installer (.exe)"
  filename: string;       // e.g. "Plurse-Setup-1.0.0.exe"
  url:      string;       // swap with real CDN URL before launch
  size:     string;       // human-readable, e.g. "84 MB"
  arch:     string;       // e.g. "x64 / ARM64"
}

export interface Platform {
  id:       PlatformId;
  label:    string;
  version:  string;
  released: string;       // ISO date string
  files:    DownloadFile[];
  // Installation guide steps — used by InstallGuide component
  steps: {
    title: string;
    body:  string;
  }[];
}

export interface ChangelogEntry {
  type:    "new" | "improved" | "fix";
  message: string;
}

export interface Version {
  number:    string;
  released:  string;       // ISO date string
  changelog: ChangelogEntry[];
}

// ── Current version ──────────────────────────────────────────────────────────
export const CURRENT_VERSION: Version = {
  number:   "1.0.0",
  released: "2025-03-01",
  changelog: [
    { type: "new",      message: "Initial public release of Plurse."                          },
    { type: "new",      message: "Real-time inventory tracking across all product categories." },
    { type: "new",      message: "Cash flow dashboard with monthly and weekly breakdowns."     },
    { type: "new",      message: "Multi-user access with role-based permissions."              },
    { type: "new",      message: "Customer profiles with purchase history and contact info."   },
    { type: "new",      message: "Activity log for full team accountability."                  },
    { type: "new",      message: "Sales analytics with exportable reports."                    },
    { type: "improved", message: "Optimised startup time across all platforms."                },
    { type: "fix",      message: "Resolved sync issue on first-time account setup."            },
  ],
};

// ── Platform data ─────────────────────────────────────────────────────────────
export const PLATFORMS: Platform[] = [
  {
    id:       "windows",
    label:    "Windows",
    version:  CURRENT_VERSION.number,
    released: CURRENT_VERSION.released,
    files: [
      {
        label:    "Windows Installer (.exe)",
        filename: "Plurse-Setup-1.0.0.exe",
        url:      "/downloads/fake/Plurse-Setup-1.0.0.exe",   // replace with real URL
        size:     "84 MB",
        arch:     "x64 / ARM64",
      },
    ],
    steps: [
      {
        title: "Download the installer",
        body:  "Click the Download button to get Plurse-Setup-1.0.0.exe onto your machine.",
      },
      {
        title: "Run the installer",
        body:  "Double-click the downloaded .exe file. If Windows SmartScreen appears, click 'More info' then 'Run anyway' — Plurse is safe.",
      },
      {
        title: "Follow the setup wizard",
        body:  "Choose your install directory and click Install. The process takes under a minute.",
      },
      {
        title: "Launch Plurse",
        body:  "Once installed, Plurse will open automatically. Enter your activation key to get started.",
      },
    ],
  },

  {
    id:       "macos",
    label:    "macOS",
    version:  CURRENT_VERSION.number,
    released: CURRENT_VERSION.released,
    files: [
      {
        label:    "macOS Disk Image (.dmg)",
        filename: "Plurse-1.0.0.dmg",
        url:      "/downloads/fake/Plurse-1.0.0.dmg",         // replace with real URL
        size:     "91 MB",
        arch:     "Intel + Apple Silicon (Universal)",
      },
    ],
    steps: [
      {
        title: "Download the disk image",
        body:  "Click the Download button to get Plurse-1.0.0.dmg onto your Mac.",
      },
      {
        title: "Open the .dmg file",
        body:  "Double-click the downloaded file to mount the disk image.",
      },
      {
        title: "Drag Plurse to Applications",
        body:  "In the window that opens, drag the Plurse icon into your Applications folder.",
      },
      {
        title: "Launch and allow permissions",
        body:  "Open Plurse from Applications. If macOS shows a security prompt, go to System Settings → Privacy & Security and click 'Open Anyway'.",
      },
      {
        title: "Enter your activation key",
        body:  "Plurse will prompt you for your activation key on first launch. Enter it to activate your account.",
      },
    ],
  },

  {
    id:       "linux",
    label:    "Linux",
    version:  CURRENT_VERSION.number,
    released: CURRENT_VERSION.released,
    files: [
      {
        label:    "AppImage (.AppImage)",
        filename: "Plurse-1.0.0.AppImage",
        url:      "/downloads/fake/Plurse-1.0.0.AppImage",    // replace with real URL
        size:     "97 MB",
        arch:     "x86_64",
      },
      {
        label:    "Debian Package (.deb)",
        filename: "Plurse-1.0.0.deb",
        url:      "/downloads/fake/Plurse-1.0.0.deb",         // replace with real URL
        size:     "89 MB",
        arch:     "amd64",
      },
      {
        label:    "RPM Package (.rpm)",
        filename: "Plurse-1.0.0.rpm",
        url:      "/downloads/fake/Plurse-1.0.0.rpm",         // replace with real URL
        size:     "92 MB",
        arch:     "x86_64",
      },
    ],
    steps: [
      {
        title: "Download your preferred package",
        body:  "Choose AppImage (works on any distro), .deb (Ubuntu/Debian) or .rpm (Fedora/RHEL) from the options below.",
      },
      {
        title: "AppImage — make it executable",
        body:  "Run: chmod +x Plurse-1.0.0.AppImage then execute it with: ./Plurse-1.0.0.AppImage",
      },
      {
        title: ".deb install",
        body:  "Run: sudo dpkg -i Plurse-1.0.0.deb — then launch Plurse from your application menu.",
      },
      {
        title: ".rpm install",
        body:  "Run: sudo rpm -i Plurse-1.0.0.rpm — then launch Plurse from your application menu.",
      },
      {
        title: "Enter your activation key",
        body:  "Plurse will prompt you for your activation key on first launch. Enter it to activate your account.",
      },
    ],
  },
];

// ── Helper — get a platform by id ─────────────────────────────────────────────
export const getPlatform = (id: PlatformId): Platform =>
  PLATFORMS.find(p => p.id === id) ?? PLATFORMS[0];