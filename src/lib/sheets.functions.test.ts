import { afterEach, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({ handler: (handler: () => unknown) => handler }),
}));

import { getNews } from "./sheets.functions";

afterEach(() => vi.unstubAllGlobals());

it("returns no stories to older open tabs without loading the News CSV", async () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  expect(await getNews()).toEqual([]);
  expect(fetch).not.toHaveBeenCalled();
});
it("falls back to the built-in settings when the Settings CSV can't be loaded", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("", { status: 500 })),
  );
  const { getSettings } = await import("./sheets.functions");
  const { defaultSettings } = await import("./site-settings");
  expect(await getSettings()).toEqual(defaultSettings);
  expect(defaultSettings.whatsappNumber).toBe("4551160850");
});
