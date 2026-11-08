import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy", "How CBS Surf handles your data."),
  component: Privacy,
});

const sections: [string, string][] = [
  ["Who we are", "Placeholder: CBS Surf is a small community organising surf trips for friends. This page explains, in simple terms, what happens with your data when you use this website."],
  ["What data we process", "Placeholder: the only personal data we process is what you send us yourself via WhatsApp (for example your name and the number of people joining). This website itself stores no form data, sets no cookies for tracking, and uses no analytics or tracking tools."],
  ["Images and hosting", "Placeholder: photos on this site are delivered via Cloudinary, and the website is hosted on Lovable. These services may process technical data (such as your IP address) to deliver the content."],
  ["Contact", "Placeholder: if you have any questions about your data, reach out to us via the WhatsApp contact button on this site."],
];

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10 md:pt-14">
      <h1 className="text-4xl font-extrabold md:text-6xl">Privacy</h1>
      <p className="mt-4 text-lg text-muted-foreground">A short, plain-language overview of how we handle data.</p>
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
