import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Testimonials } from "./testimonials";

const items = [
  { order: 1, name: "Anna", trip: "Fuerteventura 2026", quote: "A wonderful crew.", photo_url: "" },
  { order: 2, name: "Ben", trip: "Portugal 2026", quote: "So many great waves.", photo_url: "" },
];
const current = () => screen.getByRole("group").getAttribute("aria-label");
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("testimonial carousel", () => {
  it("hides the section when no testimonials are visible", () => {
    render(<Testimonials items={[]} />);
    expect(screen.queryByRole("region")).toBeNull();
  });
  it("advances every 6 seconds", () => {
    vi.useFakeTimers(); render(<Testimonials items={items} />);
    act(() => vi.advanceTimersByTime(5999)); expect(current()).toBe("1 of 2");
    act(() => vi.advanceTimersByTime(1)); expect(current()).toBe("2 of 2");
    act(() => vi.advanceTimersByTime(6000)); expect(current()).toBe("1 of 2");
  });
  it("pauses on hover and resumes after leaving", () => {
    vi.useFakeTimers(); render(<Testimonials items={items} />);
    fireEvent.mouseEnter(screen.getByRole("region"));
    act(() => vi.advanceTimersByTime(12000)); expect(current()).toBe("1 of 2");
    fireEvent.mouseLeave(screen.getByRole("region"));
    act(() => vi.advanceTimersByTime(6000)); expect(current()).toBe("2 of 2");
  });
  it("pauses on touch and swipes in either direction", () => {
    vi.useFakeTimers(); render(<Testimonials items={items} />);
    const region = screen.getByRole("region");
    fireEvent.touchStart(region, { touches: [{ clientX: 200, clientY: 100 }] });
    act(() => vi.advanceTimersByTime(12000)); expect(current()).toBe("1 of 2");
    fireEvent.touchEnd(region, { changedTouches: [{ clientX: 100, clientY: 100 }] }); expect(current()).toBe("2 of 2");
    fireEvent.touchStart(region, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(region, { changedTouches: [{ clientX: 200, clientY: 100 }] }); expect(current()).toBe("1 of 2");
  });
  it("navigates and wraps with arrows and selects with dots", () => {
    render(<Testimonials items={items} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" })); expect(current()).toBe("2 of 2");
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" })); expect(current()).toBe("1 of 2");
    fireEvent.click(screen.getByRole("button", { name: "Show testimonial 2" })); expect(current()).toBe("2 of 2");
  });
});