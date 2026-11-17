import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy", "How CBS Surf handles your data."),
  component: Privacy,
});

const sections: [string, string][] = [
  ["Who we are", "This website is run by CBS Surf, a student community that organizes surf trips."],
  ["What data we process", "This website has no forms that store your data, uses no tracking cookies and no analytics tools. When you click a WhatsApp button, WhatsApp opens with a prepared message. Everything you send us there (for example your name, phone number and how many people want to join) is processed by us to answer your request and organize the trip. We keep this information only as long as needed for that purpose."],
  ["WhatsApp", "WhatsApp is a service of WhatsApp Ireland Ltd. (Meta). When you contact us through WhatsApp, WhatsApp\u2019s own privacy policy also applies."],
  ["Hosting and content delivery", "This website is hosted by Vercel Inc. To deliver the site, Vercel processes technical data such as your IP address, browser type and time of access in server logs. Photos are delivered by Cloudinary, and some content is loaded from Google Sheets (Google). These providers may also process your IP address to deliver the content."],
  ["Photos", "Photos on this site show participants of our trips. If you\u2019re in a photo and want it removed, contact us and we\u2019ll take it down."],
];

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 md:pt-14">
      <h1 className="text-4xl font-extrabold md:text-6xl">Privacy</h1>
      <p className="mt-4 text-lg text-muted-foreground">How we handle your data when you use this website. Last updated: 17.11.2026</p>
      <div className="mt-10 space-y-10">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-foreground/85">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
