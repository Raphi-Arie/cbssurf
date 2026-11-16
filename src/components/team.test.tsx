import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Team } from "./team";

afterEach(cleanup);

const member = (name: string, photo_url = "") => ({
  order: 1,
  name,
  role: "Trip organiser",
  intro: "Hi!",
  photo_url,
});

describe("team section", () => {
  it("hides the whole section when nobody is visible", () => {
    render(<Team members={[]} />);
    expect(screen.queryByText("The team")).toBeNull();
  });
  it("renders a card per member with name, role and intro", () => {
    render(<Team members={[member("Jonas"), member("Mia")]} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Jonas" })).toBeTruthy();
    expect(screen.getAllByText("Trip organiser")).toHaveLength(2);
  });
  it("shows the first letter when there is no photo", () => {
    render(<Team members={[member("jonas")]} />);
    expect(screen.getByRole("img", { name: "jonas" }).textContent).toBe("J");
  });
  it("falls back to the first letter when the photo fails to load", () => {
    render(<Team members={[member("Mia", "https://example.com/broken.jpg")]} />);
    fireEvent.error(screen.getByRole("img", { name: "Mia" }));
    expect(screen.getByRole("img", { name: "Mia" }).textContent).toBe("M");
  });
});
