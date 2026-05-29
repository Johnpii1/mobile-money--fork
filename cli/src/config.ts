import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load .momorc from the cli/ directory, fall back to process.env
dotenv.config({ path: path.resolve(__dirname, "..", ".momorc") });

export interface CliConfig {
  apiUrl: string;
  apiKey: string;
}

export interface Profile {
  name: string;
  apiUrl: string;
  apiKey: string;
}

export interface ProfilesFile {
  profiles: Profile[];
  activeProfile?: string;
}

const PROFILES_FILE = path.resolve(__dirname, "..", ".momo-profiles.json");

function loadProfiles(): ProfilesFile {
  if (!fs.existsSync(PROFILES_FILE)) {
    return { profiles: [] };
  }
  try {
    const content = fs.readFileSync(PROFILES_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { profiles: [] };
  }
}

function saveProfiles(data: ProfilesFile): void {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function getConfig(): CliConfig {
  const profiles = loadProfiles();
  let apiKey: string | undefined;
  let apiUrl: string | undefined;

  // If an active profile is set, use it
  if (profiles.activeProfile) {
    const activeProfile = profiles.profiles.find(
      (p) => p.name === profiles.activeProfile,
    );
    if (activeProfile) {
      apiUrl = activeProfile.apiUrl;
      apiKey = activeProfile.apiKey;
    }
  }

  // Fall back to environment variables
  if (!apiKey) {
    apiKey = process.env.MOMO_API_KEY;
  }
  if (!apiUrl) {
    apiUrl = process.env.MOMO_API_URL;
  }

  if (!apiKey) {
    throw new Error(
      "MOMO_API_KEY is required. Set it in cli/.momorc, as an environment variable, or use 'momo-cli profile save'.",
    );
  }

  return {
    apiUrl: apiUrl ?? "http://localhost:3000",
    apiKey,
  };
}

export function saveProfile(
  name: string,
  apiUrl: string,
  apiKey: string,
): void {
  const profiles = loadProfiles();
  const index = profiles.profiles.findIndex((p) => p.name === name);

  if (index >= 0) {
    profiles.profiles[index] = { name, apiUrl, apiKey };
  } else {
    profiles.profiles.push({ name, apiUrl, apiKey });
  }

  saveProfiles(profiles);
}

export function useProfile(name: string): Profile {
  const profiles = loadProfiles();
  const profile = profiles.profiles.find((p) => p.name === name);

  if (!profile) {
    throw new Error(`Profile "${name}" not found`);
  }

  profiles.activeProfile = name;
  saveProfiles(profiles);
  return profile;
}

export function deleteProfile(name: string): void {
  const profiles = loadProfiles();
  const index = profiles.profiles.findIndex((p) => p.name === name);

  if (index < 0) {
    throw new Error(`Profile "${name}" not found`);
  }

  profiles.profiles.splice(index, 1);

  // If the deleted profile was active, clear the active profile
  if (profiles.activeProfile === name) {
    delete profiles.activeProfile;
  }

  saveProfiles(profiles);
}

export function listProfiles(): { profiles: Profile[]; activeProfile?: string } {
  const profiles = loadProfiles();
  return {
    profiles: profiles.profiles,
    activeProfile: profiles.activeProfile,
  };
}

export function getActiveProfile(): Profile | undefined {
  const profiles = loadProfiles();
  if (profiles.activeProfile) {
    return profiles.profiles.find((p) => p.name === profiles.activeProfile);
  }
  return undefined;
}
