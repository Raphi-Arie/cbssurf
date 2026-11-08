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