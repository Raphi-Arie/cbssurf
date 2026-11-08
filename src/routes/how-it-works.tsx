import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, MessageCircle, Sun } from "lucide-react";
import { pageHead } from "@/lib/metadata";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { contactUrl } from "@/components/site";

export const Route = createFileRoute("/how-it-works")({ head: () => pageHead("How it works", "Pick a CBS Surf trip, request via WhatsApp, and we get back to you with all the details."), component: HowItWorks });
const faqs = [
  ["Do I need surf experience?", "No, all levels are welcome. Our surf lessons are split into groups by experience, so there are sessions for complete beginners as well as for more experienced surfers."],
  ["Are flights included?", "No, flights are not included. You book them yourself, based on the trip dates."],
  ["Do I need travel insurance?", "That's up to you. If you book one, check that it covers surfing."],
  ["What should I pack?", "It depends on the trip. Once you've booked, we'll send you a packing list in good time before departure."],
  ['What does "all inclusive" mean?', "It depends on the trip. You'll find exactly what's included on each trip page under \"What's included\"."],
  ["How do I pay?", "After you request a spot, we'll send you all the payment details."],
];
function HowItWorks() {
  return <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14"><h1 className="text-4xl font-extrabold md:text-6xl">How it works</h1><section className="grid gap-10 py-10 md:grid-cols-3 md:py-16">{[{ Icon: Compass, title: "Pick a trip" }, { Icon: MessageCircle, title: "Send a request via WhatsApp" }, { Icon: Sun, title: "We get back to you with all the details" }].map(({ Icon, title }, i) => <div key={title}><Icon className="mb-6 h-12 w-12 text-primary" /><p className="font-display text-lg font-bold text-accent">0{i + 1}</p><h2 className="mt-2 text-2xl font-bold">{title}</h2></div>)}</section><section className="mx-auto max-w-3xl border-t border-border pt-12"><h2 className="mb-6 text-3xl font-extrabold">Your questions, answered</h2><Accordion type="single" collapsible>{faqs.map(([question, answer]) => <AccordionItem key={question} value={question ?? ""}><AccordionTrigger className="py-5 text-lg">{question}</AccordionTrigger><AccordionContent className="text-base leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></section><div className="mt-12 flex flex-wrap justify-center gap-4"><Button asChild className="rounded-full"><Link to="/trips">Explore trips</Link></Button><Button asChild variant="outline" className="rounded-full"><a href={contactUrl} target="_blank" rel="noreferrer"><MessageCircle /> Contact us</a></Button></div></div>;
}