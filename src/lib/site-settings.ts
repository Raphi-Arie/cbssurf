import { useLoaderData } from "@tanstack/react-router";
import hero from "@/assets/hero-surf.jpg";
import { DEFAULT_WHATSAPP_NUMBER, type SiteSettings } from "./sheets";

// Current built-in images and number, used when the Settings tab is empty or unreachable.
export const defaultSettings: SiteSettings = {
  homeHeroImage: hero,
  aboutHeroImage: hero,
  aboutStoryImage: hero,
  pastTripsHeroImage:
    "https://res.cloudinary.com/ugtwklc6/image/upload/f_auto,q_auto,w_1600/v1794163259/surftrip4.jpg",
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
};

// Settings are loaded once by the root route and shared by every page.
export function useSiteSettings(): SiteSettings {
  return useLoaderData({ from: "__root__" }) ?? defaultSettings;
}
