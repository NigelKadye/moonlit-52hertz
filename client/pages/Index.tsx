import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContactRequest, ContactResponse } from "@shared/api";

const services = [
  ["01", "Continuous improvement", "Business development, process analysis, operations management and workspaces built to reduce waste."],
  ["02", "Cultivating leadership", "Helping people become effective leaders of themselves before leading meaningful work with others."],
  ["03", "Project & change management", "Turning good intentions into focused, adopted improvements that hold their value over time."],
  ["04", "Speaking & facilitation", "Clear, energising conversations that make complex operational problems easier to act on."],
];

const principles = [
  ["01", "Begin with the end in mind", "Define what success means before changing the process."],
  ["02", "Put first things first", "Protect the work that creates value instead of letting urgency set the agenda."],
  ["03", "Think win-win", "Design improvements that help leaders, teams, customers and partners succeed together."],
  ["04", "Sharpen processes & systems", "Build systems that keep capability improving after the initial engagement."],
];

const method = [
  ["WHY", "Clarity", "A shared purpose gives every improvement a direction."],
  ["HOW", "Discipline", "Reliable habits transform intent into better work."],
  ["WHAT", "Consistency", "Repeatable systems protect quality and performance."],
  ["WHERE", "Awareness", "Improvement starts with seeing the whole operation."],
  ["WHEN", "Timeliness", "The right intervention at the right moment creates momentum."],
  ["WHO", "Focus", "People are at the centre of every sustainable change."],
];

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [dialogError, setDialogError] = useState("");

  const closeMenu = () => setIsMenuOpen(false);

  const openConversationDialog = () => {
    closeMenu();
    setDialogStatus("idle");
    setDialogError("");
    setIsDialogOpen(true);
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSent(true);
    event.currentTarget.reset();
  };

  const sendDialogMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialogStatus("sending");
    setDialogError("");
    const form = event.currentTarget;
    const data: ContactRequest = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ContactResponse = await res.json();
      if (!res.ok || !json.ok) {
        setDialogError(json.message || "Something went wrong. Please try again.");
        setDialogStatus("error");
      } else {
        setDialogStatus("sent");
        form.reset();
      }
    } catch {
      setDialogError("Could not send your message. Please email val@52hertz.co.zw directly.");
      setDialogStatus("error");
    }
  };

  return (
    <main className="overflow-hidden bg-sand text-ink">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
          <Link to="/" className="group flex items-center gap-3" aria-label="52Hertz home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg font-bold text-lime transition-transform group-hover:scale-105">52</span>
            <span className="text-lg font-semibold tracking-[-0.04em] text-white">hertz</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 md:flex">
            <a href="#about" className="transition hover:text-lime">About</a>
            <a href="#services" className="transition hover:text-lime">Services</a>
            <a href="#method" className="transition hover:text-lime">Approach</a>
            <Link to="/find-our-book" className="transition hover:text-lime">Find our Book</Link>
            <button onClick={openConversationDialog} className="rounded-full border border-white/30 px-5 py-2.5 text-white transition hover:border-lime hover:bg-lime hover:text-ink">Start a conversation</button>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white md:hidden" aria-label="Toggle menu">
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {isMenuOpen && <nav className="mx-6 rounded-2xl bg-ink p-5 text-white shadow-2xl md:hidden">
          {[["About", "#about"], ["Services", "#services"], ["Approach", "#method"]].map(([label, href]) => <a key={label} href={href} onClick={closeMenu} className="flex items-center justify-between border-b border-white/10 py-4 text-base last:border-0">{label}<ChevronRight size={18} /></a>)}
          <Link to="/find-our-book" onClick={closeMenu} className="flex items-center justify-between border-b border-white/10 py-4 text-base last:border-0">Find our Book<ChevronRight size={18} /></Link>
          <button onClick={openConversationDialog} className="flex w-full items-center justify-between border-b border-white/10 py-4 text-base last:border-0">Start a conversation<ChevronRight size={18} /></button>
        </nav>}
      </header>

      <section className="relative isolate min-h-[770px] overflow-hidden bg-ink px-6 pb-20 pt-36 text-white lg:min-h-[840px] lg:px-12 lg:pt-44">
        <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><div className="hero-grid" />
        <div className="relative mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-lime"><Sparkles size={14} /> Continuous improvement specialists</div>
            <h1 className="max-w-4xl text-balance font-display text-[clamp(3.5rem,7.1vw,7.3rem)] font-medium leading-[0.91] tracking-[-0.075em]">Make performance <span className="text-lime">easier</span> to hear, measure and improve.</h1>
            <p className="mt-9 max-w-xl text-lg leading-8 text-white/70">52 Hertz helps teams make the most of their time and resources through simpler processes, stronger systems and meaningful work.</p>
            <div className="mt-10 flex flex-wrap gap-4"><button onClick={openConversationDialog} className="inline-flex items-center gap-3 rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-ink transition hover:bg-white">Build better systems <ArrowRight size={17} /></button><a href="#services" className="inline-flex items-center gap-2 px-3 py-3.5 text-sm font-semibold text-white transition hover:text-lime">Our approach <ArrowDownRight size={17} /></a></div>
          </div>
          <div className="justify-self-end lg:max-w-sm">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">The signal</p><BarChart3 className="text-lime" size={22} /></div>
              <p className="mt-9 font-display text-4xl leading-none tracking-[-0.06em]">Less noise.<br />More progress.</p>
              <div className="mt-9 h-px bg-white/15" /><p className="mt-5 text-sm leading-6 text-white/60">We find the patterns that hold your business back, then shape practical ways forward.</p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto mt-16 max-w-[1320px] border-t border-white/15 pt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Harare, Zimbabwe <span className="float-right text-lime">Est. for better work</span></div>
      </section>

      <section id="about" className="scroll-mt-8 px-6 py-24 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div><p className="eyebrow">About 52Hertz</p><h2 className="section-title mt-5">Improvement is a practice, not a one-off project.</h2></div>
          <div className="max-w-2xl pt-1"><p className="text-xl leading-9 text-ink/80">We are a business operated by professionals who are continuously improving our methods and craft—staying true to the principles of continuous improvement.</p><p className="mt-7 text-base leading-8 text-ink/60">At the core of what we do is design thinking: asking who this is for, and what it is for. That curiosity helps us turn ambiguous data into clear insights and rare, valuable outcomes.</p><div className="mt-12 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl bg-moss p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.14em] text-lime">Our lens</p><p className="mt-4 text-xl font-medium leading-7">People, purpose, processes.</p></div><div className="rounded-2xl bg-lime p-6 text-ink"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Our aim</p><p className="mt-4 text-xl font-medium leading-7">Smoother businesses that endure.</p></div></div></div>
        </div>
      </section>

      <section className="bg-clay px-6 py-24 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1320px]"><div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="eyebrow text-lime">What changes</p><h2 className="section-title mt-5 text-white">Smoother businesses are built through better systems.</h2></div><p className="max-w-xl text-lg leading-8 text-white/65">We thrive in a sea of ambiguous data—applying statistics to uncover the insights that transform strategy into action.</p></div><div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/10 md:grid-cols-2"><div className="bg-clay p-8"><span className="stat-number">01</span><h3 className="mt-8 text-2xl font-medium text-white">Fewer errors & defects</h3><p className="mt-3 leading-7 text-white/60">Reduce costs, waste and friction in the work your teams do every day.</p></div><div className="bg-clay p-8"><span className="stat-number">02</span><h3 className="mt-8 text-2xl font-medium text-white">More reliable quality</h3><p className="mt-3 leading-7 text-white/60">Reduce variation in processes and outcomes, optimising quality and performance.</p></div><div className="bg-clay p-8"><span className="stat-number">03</span><h3 className="mt-8 text-2xl font-medium text-white">Stronger customer loyalty</h3><p className="mt-3 leading-7 text-white/60">Improve customer satisfaction and build the conditions for lasting value.</p></div><div className="bg-clay p-8"><span className="stat-number">04</span><h3 className="mt-8 text-2xl font-medium text-white">Healthier growth</h3><p className="mt-3 leading-7 text-white/60">Boost sales, revenue and profit margin through improvements that matter.</p></div></div></div></section>

      <section id="method" className="scroll-mt-8 px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto max-w-[1320px]"><div className="max-w-3xl"><p className="eyebrow">Modus operandi</p><h2 className="section-title mt-5">How we show up<br /><span className="text-olive">is part of the work.</span></h2></div><div className="mt-16 grid gap-5 md:grid-cols-3"><article className="rounded-3xl border border-ink/10 p-7"><p className="text-sm font-semibold text-olive">01. Empathy</p><p className="mt-10 text-lg leading-8 text-ink/70">It allows us to see what others are blind to—inside the other person and in the room.</p></article><article className="rounded-3xl border border-ink/10 p-7"><p className="text-sm font-semibold text-olive">02. Trust</p><p className="mt-10 text-lg leading-8 text-ink/70">Without it, we cannot build the culture and relationships needed to do our best work.</p></article><article className="rounded-3xl border border-ink/10 p-7"><p className="text-sm font-semibold text-olive">03. Passion</p><p className="mt-10 text-lg leading-8 text-ink/70">Business is the means we use to pursue meaningful work and contribute something unique.</p></article></div></div></section>

      <section className="bg-olive px-6 py-24 text-white lg:px-12 lg:py-32"><div className="mx-auto max-w-[1320px]"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow text-lime">The 52Hertz Method</p><h2 className="section-title mt-5 max-w-3xl">A framework for more intentional action.</h2></div><p className="max-w-sm text-base leading-7 text-white/65">Clarity, discipline and awareness make change more coherent—and more likely to last.</p></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{method.map(([code, title, text]) => <article key={code} className="rounded-2xl border border-white/15 bg-white/[0.06] p-6"><p className="text-xs font-bold tracking-[0.17em] text-lime">{code}</p><h3 className="mt-8 text-2xl font-medium">{title}</h3><p className="mt-3 leading-7 text-white/60">{text}</p></article>)}</div></div></section>

      <section id="services" className="scroll-mt-8 px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="eyebrow">Services</p><h2 className="section-title mt-5">Interesting problems deserve useful solutions.</h2><p className="mt-7 max-w-sm leading-7 text-ink/60">Inspired by Lean Six Sigma, we help businesses solve problems, cultivate leadership and make things better.</p></div><div className="divide-y divide-ink/15 border-y border-ink/15">{services.map(([number, title, text]) => <article key={number} className="group grid gap-4 py-7 sm:grid-cols-[70px_1fr_auto] sm:items-center"><span className="text-sm font-semibold text-olive">{number}</span><div><h3 className="text-2xl font-medium tracking-[-0.04em]">{title}</h3><p className="mt-2 max-w-xl leading-7 text-ink/60">{text}</p></div><ArrowRight className="hidden text-olive transition group-hover:translate-x-1 sm:block" /></article>)}</div></div></section>

      <section className="bg-moss px-6 py-24 text-white lg:px-12 lg:py-32"><div className="mx-auto max-w-[1320px]"><p className="eyebrow text-lime">Operating principles</p><div className="mt-5 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]"><h2 className="section-title">Performance improves when people share the same principles.</h2><p className="max-w-xl text-lg leading-8 text-white/65">Lean Six Sigma principles become practical when translated into operating discipline: clear outcomes, focused priorities, mutual benefit and constant renewal.</p></div><div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">{principles.map(([number, title, text]) => <article key={number} className="border-t border-white/20 pt-5"><p className="text-xs font-bold tracking-[0.14em] text-lime">{number}</p><h3 className="mt-5 text-2xl font-medium">{title}</h3><p className="mt-3 max-w-md leading-7 text-white/60">{text}</p></article>)}</div></div></section>

      <section className="px-6 py-24 lg:px-12 lg:py-36"><div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="eyebrow">Declaration of beliefs</p><h2 className="section-title mt-5">The standards we hold ourselves to.</h2></div><ul className="space-y-5">{["The one who sails on excuses will drown in the sea of mediocrity.", "Growth is a by-product of a company’s success in pursuit of its central purpose and reason for being.", "Disciplined people engage in disciplined thoughts and take disciplined action."].map(item => <li key={item} className="flex gap-4 text-lg leading-8 text-ink/75"><span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime"><Check size={13} strokeWidth={3} /></span>{item}</li>)}</ul></div></section>

      <section id="contact" className="scroll-mt-8 bg-lime px-6 py-24 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.9fr_1.1fr]"><div><p className="eyebrow text-ink/60">Let’s begin</p><h2 className="section-title mt-5">Ready to build a business worth remarking about?</h2><p className="mt-7 max-w-md text-lg leading-8 text-ink/70">Whether you’re a start-up finding its footing, a leader developing your voice, or a larger organisation untangling bureaucracy, we are here to walk with you.</p><a href="mailto:val@52hertz.co.zw" className="mt-8 inline-flex items-center gap-2 text-lg font-bold underline decoration-2 underline-offset-4">val@52hertz.co.zw <ArrowRight size={18} /></a></div><form onSubmit={sendMessage} className="rounded-3xl bg-ink p-7 text-white shadow-xl lg:p-9"><p className="text-2xl font-medium">Share your story.</p><p className="mt-2 text-sm leading-6 text-white/60">We would love to hear what you are working towards.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="form-label">Name<input required name="name" className="form-input" placeholder="Your name" /></label><label className="form-label">Email<input required name="email" type="email" className="form-input" placeholder="you@company.com" /></label></div><label className="form-label mt-5">What would you like to improve?<textarea required name="message" className="form-input min-h-32 resize-y" placeholder="Tell us a little about the challenge..." /></label><button type="submit" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-5 py-4 text-sm font-bold text-ink transition hover:bg-white">{isSent ? "Thank you — we’ll be in touch" : "Send your message"}<ArrowRight size={17} /></button><p className="mt-4 text-center text-xs text-white/45">Or email us directly at val@52hertz.co.zw</p></form></div></section>

      <footer className="bg-ink px-6 py-9 text-white/60 lg:px-12"><div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><Link to="/" className="flex items-center gap-3 text-white"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-xs font-bold text-ink">52</span><span className="font-semibold tracking-[-0.04em]">hertz</span></Link><p className="text-sm">Continuous improvement specialists · Harare, Zimbabwe</p><p className="text-sm">© {new Date().getFullYear()} 52Hertz</p></div></footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg bg-ink text-white border-white/15 p-0 overflow-hidden">
          <div className="p-7 lg:p-9">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-medium tracking-[-0.04em] text-white">Start a conversation.</DialogTitle>
              <DialogDescription className="text-sm leading-6 text-white/60">We would love to hear what you are working towards.</DialogDescription>
            </DialogHeader>
            {dialogStatus === "sent" ? (
              <div className="py-6 text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lime"><Check size={22} strokeWidth={3} className="text-ink" /></span>
                <p className="text-lg font-medium">Thank you — we'll be in touch.</p>
                <button onClick={() => setIsDialogOpen(false)} className="mt-6 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-lime hover:text-lime">Close</button>
              </div>
            ) : (
              <form onSubmit={sendDialogMessage} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="form-label">Name<input required name="name" className="form-input" placeholder="Your name" /></label>
                  <label className="form-label">Email<input required name="email" type="email" className="form-input" placeholder="you@company.com" /></label>
                </div>
                <label className="form-label">What would you like to improve?<textarea required name="message" className="form-input min-h-28 resize-y" placeholder="Tell us a little about the challenge..." /></label>
                {dialogStatus === "error" && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{dialogError}</p>}
                <button type="submit" disabled={dialogStatus === "sending"} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-5 py-4 text-sm font-bold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                  {dialogStatus === "sending" ? "Sending…" : "Send your message"}<ArrowRight size={17} />
                </button>
                <p className="text-center text-xs text-white/40">Or email us at val@52hertz.co.zw</p>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
