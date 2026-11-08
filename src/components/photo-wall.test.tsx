import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhotoWall } from "./photo-wall";

describe("past trip photo browsing", () => {
  it("shows 24 photos initially, reveals more, and browses them in a lightbox", () => {
    const photos = Array.from({ length: 30 }, (_, i) => ({ src: `/photo-${i}.jpg`, trip: `Trip ${i}` }));
    render(<PhotoWall photos={photos} />);
    expect(screen.getAllByRole("button", { name: /^Open Trip/ })).toHaveLength(24);
    fireEvent.click(screen.getByRole("button", { name: "Show more" }));
    expect(screen.getAllByRole("button", { name: /^Open Trip/ })).toHaveLength(30);
    const first = screen.getAllByRole("button", { name: /^Open Trip/ })[0];
    if (!first) throw new Error("Missing first photo");
    fireEvent.click(first);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("1 / 30")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByText("2 / 30")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByText("30 / 30")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});