import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MessageCircle, Sun } from "lucide-react";
import { pageHead } from "@/lib/metadata";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { contactUrl } from "@/components/site";

export const Route = createFileRoute("/how-it-works")({ head: () => pageHead("How it works", "Pick a CBS Surf trip, request via WhatsApp, and get the details from Jonas."), component: HowItWorks });
const faqs = [
  ["Do I need surf experience?", "Ask Jonas about the level and coaching available on your chosen trip. We'll share the full details before you book."],
  ["Are flights included?", "Check the trip's included section and confirm the flight arrangements with Jonas before booking."],
  ["Do I need travel insurance?", "Check with your insurance provider about travel and surfing cover. Jonas can help with any trip-specific questions."],
  ["What should I pack?", "Jonas will share the packing details for your destination before departure."],
  ['What does "all inclusive" mean?', "What's included varies by trip. See the trip page and ask Jonas to confirm the details."],
  ["How do I pay?", "Jonas will send the payment details and booking terms after your request."],
];
function HowItWorks() {
  return <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14"><h1 className="text-4xl font-extrabold md:text-6xl">How it works</h1><section className="grid gap-10 py-10 md:grid-cols-3 md:py-16">{[{ Icon: Compass, title: "Pick a trip" }, { Icon: MessageCircle, title: "Send a request via WhatsApp" }, { Icon: Sun, title: "Jonas gets back to you with all the details" }].map(({ Icon, title }, i) => <div key={title}><Icon className="mb-6 h-12 w-12 text-primary" /><p className="font-display text-lg font-bold text-accent">0{i + 1}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div>)}</section><section className="mx-auto max-w-3xl border-t border-border pt-12"><h2 className="mb-6 text-3xl font-extrabold">Your questions, answered</h2><Accordion type="single" collapsible>{faqs.map(([question, answer]) => <AccordionItem key={question} value={question ?? ""}><AccordionTrigger className="py-5 text-lg">{question}</AccordionTrigger><AccordionContent className="text-base leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></section><div className="mt-12 flex flex-wrap justify-center gap-4"><Button asChild className="rounded-full"><Link to="/trips">Explore trips</Link></Button><Button asChild variant="outline" className="rounded-full"><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle /> Contact us</a></Button></div></div>;
}