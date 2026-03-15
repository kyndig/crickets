import { EventEmitter } from "node:events";
import { access } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";

import {
  SUCCESS_HUD_MESSAGE,
  resolveSoundFilePath,
  runCricketsCommand,
  type RunCricketsCommandOptions,
} from "../src/lib/play-crickets";

test("resolveSoundFilePath resolves to bundled mp3", () => {
  const resolved = resolveSoundFilePath("/tmp/example/src");
  assert.equal(resolved, path.resolve("/tmp/example/src", "../assets/crickets.mp3"));
});

test("runCricketsCommand shows HUD when playback starts", async () => {
  const hudMessages: string[] = [];
  const failures: Array<{ title: string; message: string }> = [];

  class FakeChild extends EventEmitter {}

  const options: RunCricketsCommandOptions = {
    ensureReadable: async () => {},
    spawnImpl: () => {
      const child = new FakeChild() as unknown as ReturnType<NonNullable<RunCricketsCommandOptions["spawnImpl"]>>;
      process.nextTick(() => {
        (child as unknown as EventEmitter).emit("spawn");
      });
      return child;
    },
    showHud: async (message) => {
      hudMessages.push(message);
    },
    showFailure: async (title, message) => {
      failures.push({ title, message });
    },
  };

  await runCricketsCommand(options);

  assert.deepEqual(hudMessages, [SUCCESS_HUD_MESSAGE]);
  assert.equal(failures.length, 0);
});

test("runCricketsCommand shows failure when asset is missing", async () => {
  const hudMessages: string[] = [];
  const failures: Array<{ title: string; message: string }> = [];

  await runCricketsCommand({
    ensureReadable: async () => {
      throw new Error("ENOENT: missing file");
    },
    spawnImpl: () => {
      throw new Error("spawn should not run");
    },
    showHud: async (message) => {
      hudMessages.push(message);
    },
    showFailure: async (title, message) => {
      failures.push({ title, message });
    },
  });

  assert.equal(hudMessages.length, 0);
  assert.equal(failures.length, 1);
  assert.equal(failures[0].title, "Failed to play sound");
  assert.match(failures[0].message, /missing file/);
});

test("assets/crickets.mp3 exists in repository", async () => {
  const soundAssetPath = path.join(process.cwd(), "assets/crickets.mp3");
  await access(soundAssetPath);
});
