import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

export const SOUND_ASSET_RELATIVE_PATH = "../assets/crickets.mp3";
export const SUCCESS_HUD_MESSAGE = "Playing cricket sounds...";

type SpawnLike = typeof spawn;

export interface RunCricketsCommandOptions {
  baseDirectory?: string;
  spawnImpl?: SpawnLike;
  ensureReadable?: (filePath: string) => Promise<void>;
  showHud: (message: string) => Promise<void> | void;
  showFailure: (title: string, message: string) => Promise<void> | void;
}

export function resolveSoundFilePath(baseDirectory: string = __dirname): string {
  return path.resolve(baseDirectory, SOUND_ASSET_RELATIVE_PATH);
}

export async function ensureReadableFile(filePath: string): Promise<void> {
  await access(filePath, constants.R_OK);
}

export async function playSoundFile(soundFilePath: string, spawnImpl: SpawnLike = spawn): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawnImpl("afplay", [soundFilePath], { stdio: "ignore" });
    child.once("error", reject);
    child.once("spawn", () => resolve());
  });
}

export async function runCricketsCommand(options: RunCricketsCommandOptions): Promise<void> {
  const {
    baseDirectory = __dirname,
    spawnImpl = spawn,
    ensureReadable = ensureReadableFile,
    showHud,
    showFailure,
  } = options;

  const soundFilePath = resolveSoundFilePath(baseDirectory);

  try {
    await ensureReadable(soundFilePath);
    await playSoundFile(soundFilePath, spawnImpl);
    await showHud(SUCCESS_HUD_MESSAGE);
  } catch (error) {
    await showFailure("Failed to play sound", toErrorMessage(error));
  }
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
