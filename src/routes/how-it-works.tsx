import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { pageHead } from "@/lib/metadata";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_DM_URL } from "@/lib/sheets";

export const Route = createFileRoute("/how-it-works")({ head: () => pageHead("How it works", "Pick a CBS Surf trip, request via WhatsApp, and we get back to you with all the details."), component: HowItWorks });
const faqs = [
  ["Do I need surf experience?", "No, all levels are welcome. Our surf lessons are split into groups by experience, so there are sessions for complete beginners as well as for more experienced surfers."],
  ["Are flights included?", "No, flights are not included. You book them yourself, based on the trip dates."],
  ["Do I need travel insurance?", "That's up to you. If you book one, check that it covers surfing."],
  ["What should I pack?", "It depends on the trip. Once you've booked, we'll send you a packing list in good time before departure."],
  ['What does "all inclusive" mean?', "It depends on the trip. You'll find exactly what's included on each trip page under \"What's included\"."],
  ["How do I pay?", "After you request a spot, we'll send you all the payment details."],
];
const steps = [
  { title: "Pick a trip", text: "Browse our upcoming trips and find your wave." },
  { title: "Send a request", text: "Choose the number of people and message us on WhatsApp." },
  { title: "We get back to you", text: "You'll receive all the details, including payment info." },
];
function HowItWorks() {
  return <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14"><h1 className="text-4xl font-extrabold md:text-6xl">How it works</h1><section className="relative py-10 md:py-16"><div aria-hidden="true" className="absolute left-6 top-10 bottom-10 w-px bg-border md:left-[16.66%] md:right-[16.66%] md:top-7 md:bottom-auto md:h-px md:w-auto" /><ol className="relative grid items-stretch gap-6 md:grid-cols-3 md:gap-8">{steps.map((step, i) => <li key={step.title} className="relative flex gap-5 md:block md:pt-7"><span aria-hidden="true" className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean font-display text-lg font-extrabold text-primary-foreground shadow-soft md:absolute md:left-1/2 md:top-0 md:h-14 md:w-14 md:-translate-x-1/2 md:text-xl">0{i + 1}</span><div className="grow rounded-3xl bg-card p-5 shadow-soft md:h-full md:p-6 md:pt-12 md:text-center"><h2 className="text-xl font-bold md:text-2xl">{step.title}</h2><p className="mt-2 text-muted-foreground md:mx-auto md:max-w-[26ch]">{step.text}</p></div></li>)}</ol></section><section className="mx-auto max-w-3xl border-t border-border pt-12"><h2 className="mb-6 text-3xl font-extrabold">Your questions, answered</h2><Accordion type="single" collapsible>{faqs.map(([question, answer]) => <AccordionItem key={question} value={question ?? ""}><AccordionTrigger className="py-5 text-lg">{question}</AccordionTrigger><AccordionContent className="text-base leading-relaxed text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}</Accordion></section><div className="mt-12 flex flex-wrap justify-center gap-4"><Button asChild className="rounded-full"><Link to="/trips">Explore trips</Link></Button><Button asChild className="rounded-full"><a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer"><Instagram /> Contact us</a></Button></div></div>;
}