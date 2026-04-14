import { useState, useEffect, useRef } from "react";

const TALLY_SOLO_URL = "https://tally.so/r/5Bv7bE";
const TALLY_COUPLE_URL = "https://tally.so/r/9qvkZQ";
const ADMIN_PASSWORD = "blueprint2024";

const ELEMENT_META = {
  Wood: { emoji: "🌿", color: "#3a7d44", bg: "#edf7ee", accent: "#5aab64", label: "Growth · Vision · Drive" },
  Fire: { emoji: "🔥", color: "#c9502a", bg: "#fdf1ec", accent: "#d96b45", label: "Passion · Warmth · Speed" },
  Earth: { emoji: "🪨", color: "#9a6b2e", bg: "#fdf6ea", accent: "#c49040", label: "Stability · Care · Depth" },
  Metal: { emoji: "⚡", color: "#5a5a8a", bg: "#f0f0f8", accent: "#7a7ab0", label: "Precision · Will · Edge" },
  Water: { emoji: "🌊", color: "#1b6fa8", bg: "#e8f4fd", accent: "#3a8fc8", label: "Flow · Wisdom · Quiet" },
};

const SAMPLE_SOLO_REPORT = {
  element: "Fire",
  name: "Alex, born 1992",
  sections: [
    { id: "identity", label: "🔥 Who you are", headline: "You don't enter rooms. You ignite them. 🔥", body: "Your dominant element is 🔥 Fire — supported by 🌿 Wood. That combo means you don't just burn, you burn toward something.\n\nYou feel things before you think them. You move before others have decided. And yeah, you've definitely sent a few apology texts.\n\nThe 🌿 Wood underneath gives you direction most Fire people don't have. You can actually build things — not just start them. (Though you start a lot of things.)", callout: "Your shadow side: you burn people out without meaning to. Learning when to turn it down is the skill that changes everything." },
    { id: "love", label: "❤️ Love", headline: "You love hard. Sometimes too hard, too fast. ❤️", body: "You're all-in from day one. The right person finds it electric. The wrong one finds it exhausting.\n\nWhat you need: someone with their own fire. Their own life. Dependency makes you feel trapped — interdependence energises you.\n\nThe pattern to watch: when things get stable and good, you get restless. You mistake peace for stagnation. It isn't.", callout: null },
    { id: "career", label: "💼 Career", headline: "Give you ownership or lose you. 💼", body: "You can be a great employee — but only with real autonomy, real visibility, a mission you believe in. Miss any one of these and you're already planning your exit.\n\nRoles that fit: creative direction, brand strategy, coaching, entertainment, your own thing.\n\nBiggest career risk: staying somewhere safe for too long.", callout: null },
    { id: "money", label: "💰 Money", headline: "Feast or famine. You know it. 💰", body: "Big wins. Dry spells. Repeat. This isn't bad luck — it's your element. 🔥 Fire generates in surges, not streams.\n\nBuild a freedom fund in the good times. Not an emergency fund — a freedom fund.\n\nThe 48-hour rule: any financial decision over $500 that excites you — wait two days.", callout: null },
    { id: "outlook", label: "📅 2026", headline: "2026: the quiet build, then the real move. 📅", body: "First half of 2026: underground work. Things are growing — you just can't see them yet.\n\n🌱 January — Close old loops.\n🌊 February — Someone shows you who they really are.\n✨ March — Creative surge.\n💬 April — Say the thing you've been avoiding.\n\n🔥 July — Pivot point.\n⚡ August — Highest energy month.\n🎯 October — Decision window opens.", callout: null },
  ],
};

const SAMPLE_COUPLE_REPORT = {
  elementA: "Fire", elementB: "Water", nameA: "Alex", nameB: "Jordan",
  sections: [
    { id: "who", label: "🔥 Who they are", headline: "Two elements. Two worlds. One relationship.", bodyA: "Alex, you're 🔥 Fire through and through.\n\nYou lead with intensity. You feel first, think later, and apologize somewhere in between.\n\nThe 🌿 Wood underneath your Fire gives you direction. Most Fire people start things. You actually finish them. Sometimes.", bodyB: "Jordan, you're 🌊 Water at your core.\n\nYou process everything. Twice. Maybe three times. While others are reacting, you're observing.\n\nYour depth is your superpower. You see what others miss. That grudge from 2019? Still there. Still valid." },
    { id: "dynamic", label: "💑 Your dynamic", headline: "\"Fire wants to be seen. Water wants to be felt. You're both speaking — just in different languages.\"", body: "The attraction here is real. 🔥 Fire is drawn to 🌊 Water's calm, mysterious depth. Water is drawn to Fire's warmth and confidence.\n\nThe friction is also real. Fire moves fast. Water moves deep. Neither is wrong — but both feel misunderstood more often than they should." },
    { id: "chemistry", label: "💕 Emotional chemistry", headline: "Fire burns hot. Water runs deep.", body: "Alex processes emotions by expressing them. Immediately. Loudly. With hand gestures.\n\nJordan processes emotions by... processing them. Internally. For days. Maybe weeks.\n\nYou're both emotional — you just show it differently.", callout: "One thing to try: When emotions are high, Fire speaks first (briefly), then gives Water 24 hours before expecting a real response." },
    { id: "communicate", label: "💬 How you communicate", headline: "Fire talks to think. Water thinks to talk.", body: "Alex, you process out loud. Talking IS your thinking. You don't always mean what you say in the first five minutes.\n\nJordan, you process internally. When you speak, you've already thought about it.\n\nThe mismatch: Fire says something half-formed. Water takes it as final.", callout: "One thing to try: Fire, preface half-baked thoughts with 'I'm thinking out loud.' Water, ask 'Is this final or are you still processing?'" },
    { id: "conflict", label: "⚡ Your conflict pattern", headline: "\"Fire explodes. Water withdraws. Both feel abandoned.\"", body: "Here's how most fights go: Something bothers Jordan, but they don't say it yet. Alex senses something's off and pushes. Jordan retreats. Alex pushes harder. Jordan goes cold. Alex explodes. Jordan disappears.\n\nThe pattern only breaks when Fire learns that pushing doesn't help, and Water learns that withdrawing makes everything worse.", callout: "One thing to try: Code word. When either of you says 'pause,' you both stop for 30 minutes. Then come back." },
    { id: "work", label: "❤️ What makes you work", headline: "When this works, it really works.", body: "Fire brings momentum. When Water is stuck in analysis paralysis, Fire says 'let's just try it.'\n\nWater brings depth. When Fire is about to make an impulsive decision, Water asks the one question that changes everything.\n\nTogether, you balance each other. Fire warms Water up. Water calms Fire down." },
    { id: "redflags", label: "⚠️ Red flags", headline: "Watch for these.", body: "🚩 Fire starts censoring themselves because Water's reactions feel too intense.\n\n🚩 Water stops telling Fire when something's wrong because 'it's not worth the explosion.'\n\n🚩 You avoid hard conversations because you're 'good right now.'" },
    { id: "greenflags", label: "✅ Green flags", headline: "You're doing well if...", body: "🟢 Fire has learned to ask 'do you need space or do you need me?' and actually respects the answer.\n\n🟢 Water has started sharing feelings before they become floods.\n\n🟢 You've had at least one fight where nobody left the room." },
    { id: "2026", label: "🔮 2026 together", headline: "\"This year asks you to build something — together.\"", body: "2026 is not about passion. It's about partnership. The things you've been avoiding? They're coming up.\n\nFirst half: recalibration. Old patterns will surface.\n\nSecond half: momentum. August through November is your window.", months: [
      { emoji: "❄️", name: "January", vibe: "slow start", body: "Don't force connection. Let it be quiet.", move: "One phone-free dinner." },
      { emoji: "💕", name: "February", vibe: "the real talk", body: "Something unspoken surfaces. Don't panic.", move: "Stay in the room." },
      { emoji: "🌱", name: "March", vibe: "rebuilding", body: "Whatever came up in February — now you work with it.", move: "One habit you both commit to." },
      { emoji: "💬", name: "April", vibe: "communication unlocks", body: "Something clicks. A way of talking that actually works.", move: "Notice what worked." },
      { emoji: "🌸", name: "May", vibe: "lightness returns", body: "Things feel easier. Don't over-schedule.", move: "Spontaneous date." },
      { emoji: "☀️", name: "June", vibe: "decisions", body: "Something needs deciding. Don't stall.", move: "Make the call." },
      { emoji: "🔥", name: "July", vibe: "tension point", body: "Old patterns might resurface. Not a setback — a test.", move: "Use your code word." },
      { emoji: "⚡", name: "August", vibe: "breakthrough", body: "Highest energy month. Something accelerates.", move: "Say yes to what scares you." },
      { emoji: "🍂", name: "September", vibe: "grounding", body: "Time to integrate. Let August settle.", move: "Reflect together." },
      { emoji: "🎯", name: "October", vibe: "alignment", body: "You're more in sync than you've been all year.", move: "Revisit your goals." },
      { emoji: "🌙", name: "November", vibe: "deepening", body: "Intimacy hits different this month.", move: "Share something new." },
      { emoji: "✨", name: "December", vibe: "celebration", body: "Look back. You made it through a real year together.", move: "Acknowledge the growth." },
    ]},
    { id: "final", label: "💌 Final word", headline: "This works if you want it to.", body: "Fire and Water aren't easy. You know that. You've lived it.\n\nBut there's something here — something worth protecting. When Fire learns to pause and Water learns to speak, you stop being opposites and start being partners.\n\nAlex, keep burning. Just remember: warmth is more useful than heat. Jordan, keep feeling. Just remember: sharing your depths is how they become connection.", callout: "\"You're not too different to work. You're different enough to be worth it.\"" },
  ],
};

const DEFAULT_REVIEWS = [
  { id: "r1", name: "Jiyeon K.", location: "Toronto, Canada", product: "Personal Blueprint", initials: "JK", color: "#c9502a", bg: "#fdf1ec", quote: "I've tried every personality test — MBTI, Enneagram, you name it. This is the first one that actually made me pause and reflect. The career section called out exactly why I've been feeling stuck. Lowkey life-changing tbh." },
  { id: "r2", name: "Marcus W.", location: "Vancouver, Canada", product: "Couple Blueprint", initials: "MW", color: "#1b6fa8", bg: "#e8f4fd", quote: "Got this for my girlfriend and me as a fun date night thing. We ended up talking for three hours about patterns we'd never noticed. The conflict section was uncomfortably accurate lol." },
  { id: "r3", name: "Soomin Park", location: "Los Angeles, CA", product: "Personal Blueprint", initials: "SP", color: "#3a7d44", bg: "#edf7ee", quote: "As a Korean-American, I was curious how this would translate the traditional system. It's modern, clear, and hits different than the stuff my grandma used to tell me. The 2026 outlook literally gave me chills." },
  { id: "r4", name: "Ashley Chen", location: "New York, NY", product: "Personal Blueprint", initials: "AC", color: "#9a6b2e", bg: "#fdf6ea", quote: "Okay I was skeptical but the money section exposed me so hard 😭 It described my exact spending patterns and WHY I keep doing it. Already sent this to my whole group chat." },
  { id: "r5", name: "David Nguyen", location: "Seattle, WA", product: "Couple Blueprint", initials: "DN", color: "#5a5a8a", bg: "#f0f0f8", quote: "My wife and I have been together 8 years and this report pointed out dynamics we'd never verbalized. The 'conflict pattern' section was spot on — we literally do that exact loop." },
  { id: "r6", name: "Minhee Lee", location: "Calgary, Canada", product: "Personal Blueprint", initials: "ML", color: "#c9502a", bg: "#fdf1ec", quote: "The relationship section read me for filth and I'm not even mad about it. Finally understand why I keep attracting the same type of person. This is self-awareness you can't get from therapy memes." },
  { id: "r7", name: "Taylor Morrison", location: "Austin, TX", product: "Personal Blueprint", initials: "TM", color: "#1b6fa8", bg: "#e8f4fd", quote: "I don't usually believe in this stuff but my friend made me try it. The identity section was so accurate it was almost scary? Like how did a birth date tell you I'm a people-pleaser?" },
  { id: "r8", name: "Olivia Martinez", location: "Miami, FL", product: "Couple Blueprint", initials: "OM", color: "#3a7d44", bg: "#edf7ee", quote: "Bought this for me and my boyfriend before moving in together. Best $15 we ever spent. The 'green flags' and 'red flags' section helped us have conversations we'd been avoiding." },
  { id: "r9", name: "James O'Connor", location: "Chicago, IL", product: "Personal Blueprint", initials: "JO", color: "#9a6b2e", bg: "#fdf6ea", quote: "As someone who usually rolls their eyes at astrology, this hit different. It's not about predicting the future — it's about understanding patterns. The career section alone was worth the price." },
  { id: "r10", name: "Priya Sharma", location: "San Francisco, CA", product: "Personal Blueprint", initials: "PS", color: "#5a5a8a", bg: "#f0f0f8", quote: "I read my report three times in one sitting. The way it explained my relationship with money and why I make the decisions I do... I literally texted my therapist about it." },
];

const LANGS = {
  EN: {
    tagline: "It reveals your patterns, tendencies, and what 2026 has in store.",
    tagline2: "Rooted in Saju—a 1,000-year-old Korean tradition still used by millions today.",
    steps: [
      { title: "choose your report", desc: "Personal Blueprint for yourself. Couple Blueprint to decode a relationship." },
      { title: "enter your details", desc: "name, date of birth, birth time if you know it. no birth time? you'll still get a full report." },
      { title: "get your blueprint", desc: "pay securely via Stripe — your personalized report lands in your inbox within minutes." },
    ],
    aboutTitle: "what is this, exactly?",
    aboutText: "Korean Blueprint is built on a centuries-old Korean analytical system that maps your birth date to elemental patterns and life tendencies. it's not astrology, it's not fortune telling — it's a personality and life-pattern profile that's surprisingly, uncomfortably accurate.",
    soloTitle: "Personal Blueprint", soloPrice: "CA$9.99", soloRegular: "CA$19.99", soloDesc: "understand yourself, finally.",
    soloFeatures: ["your dominant element + 3–5 core traits", "love & relationship style", "career tendencies + employee vs entrepreneur", "money patterns + 2 practical tips", "energy boosters vs drainers", "2026 outlook + month-by-month breakdown"],
    coupleTitle: "Couple Blueprint", couplePrice: "CA$14.99", coupleRegular: "CA$24.99", coupleDesc: "decode the dynamic between you two.",
    coupleFeatures: ["who they are — profile for each person", "relationship dynamic + emotional chemistry", "communication style + how to bridge gaps", "your conflict pattern (and how to break it)", "red flags + green flags for your combo", "2026 together + month-by-month outlook"],
    ctaSolo: "get my Personal Blueprint", ctaCouple: "get our Couple Blueprint", launchNote: "launch pricing",
    sampleLabel: "sample report", sampleTitle: "what's inside", sampleSub: "See what you'll get. Toggle between Personal and Couple samples.",
    reviewsLabel: "from readers", reviewsTitle: "what people are saying",
    faqLabel: "questions", faqTitle: "Answered.",
    faqs: [
      { q: "What is a Korean Blueprint?", a: "A Korean Blueprint is a modern interpretation of Saju—a 1,000-year-old Korean birth chart system. It uses your birth date and time to map out your personality, patterns, strengths, and life direction. Think of it as a personalized guide to understanding yourself and making better decisions." },
      { q: "What's the difference between the Personal and Couple Blueprint?", a: "The Personal Blueprint focuses on you—your personality, patterns, strengths, and life direction based on your Saju (Korean birth chart).\n\nThe Couple Blueprint goes further by analyzing two people together, revealing your compatibility, emotional dynamics, communication styles, and relationship patterns.\n\nIn Korean culture, compatibility is considered important. In Saju, compatibility is not just about whether two people \"match\"—it looks at how your elements interact, and how you naturally support, challenge, or balance each other in a relationship." },
      { q: "What do I need to get my blueprint?", a: "You only need your birth date and time.\n\nFor the most accurate results, your exact birth time is recommended—but if you don't know it, you can still receive a general reading." },
      { q: "Have you seen Saju in Korean shows like \"The Destiny War\"?", a: "You might have seen Saju featured in Korean shows like The Destiny War (운명전쟁49) on Disney+. These shows highlight how practitioners analyze personality, life patterns, and relationships using traditional Korean systems." },
      { q: "Is this the same reading used in Korean shows?", a: "Yes. The same core principles are used—your birth date and time are analyzed to understand your personality, tendencies, and life patterns.\n\nOur version translates this into a clear, modern format you can actually use in real life." },
      { q: "how long until I get my report?", a: "Your report lands in your inbox within minutes of payment." },
      { q: "is this astrology?", a: "No. Korean Blueprint is based on a traditional Korean analytical system that maps birth date to elemental patterns. It's a personality and pattern profile — not prediction, not star signs." },
      { q: "can I get a refund?", a: "Hey, we totally get it — but here's the thing: your report is personalized just for you and starts generating the moment you pay. Since it's custom-made and delivered instantly, we can't do refunds. But honestly? Most people are shook by how accurate it is. You've got this 💫" },
      { q: "how do I contact support?", a: "Just shoot us an email at koreanblueprint@gmail.com — we're real humans and we reply within 24 hours! Whether you have questions, feedback, or just wanna chat about your results, we're here for you 💬" },
    ],
    finalH: "Your tendencies. Your patterns. Decoded.", finalSub: "Less than two lattes. Way more insight.",
    disclaimer: "This is a personality and pattern profile for self-reflection — not professional medical, legal, financial, or relationship advice.",
  }
};

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.unobserve(el); } }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
}

function SectionReveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal(delay);
  return <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "opacity 0.55s ease, transform 0.55s ease", marginBottom: "72px" }}>{children}</div>;
}

const SectionLabel = ({ children }) => <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1.8px", textTransform: "uppercase", color: "#b0a89e", marginBottom: "12px" }}>{children}</p>;
const SectionH2 = ({ children, mb = "14px" }) => <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: mb, lineHeight: 1.2 }}>{children}</h2>;
const CheckMark = ({ color }) => <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="7.5" cy="7.5" r="7.5" fill={color} opacity="0.15" /><path d="M4.5 7.5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Stars = () => <span style={{ color: "#c9502a", fontSize: "13px", letterSpacing: "1px" }}>★★★★★</span>;
const Chevron = ({ open }) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid #e8e4de" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", textAlign: "left", padding: "18px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, color: "#1a1714" }}>{q}<Chevron open={open} /></button>
      {open && <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7, paddingBottom: "18px", maxWidth: "540px", fontWeight: 300 }}>{a}</p>}
    </div>
  );
}

function Btn({ onClick, children, bg = "#c9502a", color = "#fff", outline = false }) {
  const [hov, setHov] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ padding: "13px 26px", border: outline ? "1px solid rgba(26,23,20,0.2)" : "none", borderRadius: "100px", cursor: "pointer", background: outline ? (hov ? "#f3efe8" : "transparent") : bg, color: outline ? "#1a1714" : color, fontSize: "14px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", opacity: hov && !outline ? 0.88 : 1, transform: hov ? "translateY(-1px)" : "none", transition: "all 0.15s" }}>{children}</button>;
}

function ProductCard({ accent, badge, title, tagline, features, launchPrice, regularPrice, launchNote, ctaLabel, onCta, featured = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ border: featured ? `1.5px solid ${accent}` : "0.5px solid #e8e4de", borderRadius: "14px", padding: "28px 24px", background: "#faf8f4", display: "flex", flexDirection: "column", position: "relative", transform: hov ? "translateY(-3px)" : "none", transition: "transform 0.2s" }}>
      {badge && <span style={{ position: "absolute", top: "16px", right: "16px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px", background: `${accent}18`, color: accent }}>{badge}</span>}
      <div style={{ width: "28px", height: "3px", borderRadius: "2px", background: accent, marginBottom: "20px" }} />
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#9a8f87", fontWeight: 300, marginBottom: "22px" }}>{tagline}</div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "9px", marginBottom: "28px" }}>{features.map((f, i) => <li key={i} style={{ fontSize: "13px", color: "#6b6560", display: "flex", alignItems: "flex-start", gap: "8px" }}><CheckMark color={accent} />{f}</li>)}</ul>
      <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "0.5px solid #e8e4de" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}><span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: accent }}>{launchPrice}</span><span style={{ fontSize: "13px", color: "#c0b8b0", textDecoration: "line-through" }}>{regularPrice}</span></div>
        <div style={{ fontSize: "11px", color: "#b0a89e", marginBottom: "16px" }}>{launchNote} · secure checkout via Stripe</div>
        <Btn onClick={onCta} bg={accent}>{ctaLabel}</Btn>
      </div>
    </div>
  );
}

function InlineSampleReport({ onGetSolo, onGetCouple }) {
  const [reportType, setReportType] = useState("solo");
  const [activeSection, setActiveSection] = useState("identity");
  useEffect(() => { setActiveSection(reportType === "solo" ? "identity" : "who"); }, [reportType]);
  const sections = reportType === "solo" ? SAMPLE_SOLO_REPORT.sections : SAMPLE_COUPLE_REPORT.sections;
  const section = sections.find(s => s.id === activeSection) || sections[0];
  const mF = ELEMENT_META.Fire, mW = ELEMENT_META.Water;

  const renderContent = () => {
    if (reportType === "solo") {
      return (
        <>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mF.bg, color: mF.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mF.accent}44`, marginBottom: "16px" }}>{mF.emoji} Fire element</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "18px", lineHeight: 1.25 }}>{section.headline}</h3>
          {section.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: "14px", color: "#4a4540", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300, whiteSpace: "pre-line" }}>{p}</p>)}
          {section.callout && <div style={{ marginTop: "20px", padding: "16px 18px", background: "#fdf1ec", borderRadius: "10px", borderLeft: "3px solid #c9502a" }}><p style={{ fontSize: "13px", color: "#7a3520", lineHeight: 1.7, fontWeight: 400 }}>{section.callout}</p></div>}
        </>
      );
    }
    if (section.id === "who") {
      return (
        <>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "18px" }}>{section.headline}</h3>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mF.bg, color: mF.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mF.accent}44`, marginBottom: "12px" }}>{mF.emoji} {SAMPLE_COUPLE_REPORT.nameA} · Fire</div>
          {section.bodyA.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: "14px", color: "#4a4540", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300, whiteSpace: "pre-line" }}>{p}</p>)}
          <div style={{ textAlign: "center", color: "#c0b8b0", fontSize: "13px", margin: "20px 0" }}>———</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mW.bg, color: mW.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mW.accent}44`, marginBottom: "12px" }}>{mW.emoji} {SAMPLE_COUPLE_REPORT.nameB} · Water</div>
          {section.bodyB.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: "14px", color: "#4a4540", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300, whiteSpace: "pre-line" }}>{p}</p>)}
        </>
      );
    }
    if (section.id === "2026" && section.months) {
      return (
        <>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mF.bg, color: mF.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mF.accent}44` }}>{mF.emoji} Fire</div>
            <span style={{ color: "#9a8f87", alignSelf: "center" }}>+</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mW.bg, color: mW.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mW.accent}44` }}>{mW.emoji} Water</div>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "18px", color: "#1a1714", lineHeight: 1.5, marginBottom: "20px", borderLeft: "3px solid #e8e4de", paddingLeft: "16px" }}>{section.headline}</p>
          {section.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: "14px", color: "#4a4540", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300 }}>{p}</p>)}
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", color: "#b0a89e", marginBottom: "16px" }}>Month by month</p>
            {section.months.map((m, i) => <div key={i} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: i < section.months.length - 1 ? "0.5px solid #e8e4de" : "none" }}><div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>{m.emoji} {m.name} — <span style={{ color: "#9a8f87", fontWeight: 400 }}>{m.vibe}</span></div><p style={{ fontSize: "13px", color: "#6b6560", lineHeight: 1.6, marginBottom: "6px" }}>{m.body}</p><p style={{ fontSize: "12px", color: "#c9502a", fontWeight: 500 }}>Practical move: {m.move}</p></div>)}
          </div>
        </>
      );
    }
    return (
      <>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mF.bg, color: mF.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mF.accent}44` }}>{mF.emoji} Fire</div>
          <span style={{ color: "#9a8f87", alignSelf: "center" }}>+</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "100px", background: mW.bg, color: mW.color, fontSize: "12px", fontWeight: 600, border: `1px solid ${mW.accent}44` }}>{mW.emoji} Water</div>
        </div>
        {["dynamic", "conflict"].includes(section.id) ? <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "18px", color: "#1a1714", lineHeight: 1.5, marginBottom: "20px", borderLeft: "3px solid #e8e4de", paddingLeft: "16px" }}>{section.headline}</p> : <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "18px" }}>{section.headline}</h3>}
        {section.body.split("\n\n").map((p, i) => <p key={i} style={{ fontSize: "14px", color: "#4a4540", lineHeight: 1.8, marginBottom: "14px", fontWeight: 300, whiteSpace: "pre-line" }}>{p}</p>)}
        {section.callout && <div style={{ marginTop: "20px", padding: "16px 18px", background: "#fdf6ea", borderRadius: "10px", borderLeft: "3px solid #b8893a" }}><p style={{ fontSize: "13px", color: "#7a5a20", lineHeight: 1.7, fontWeight: 400 }}>{section.callout}</p></div>}
      </>
    );
  };

  return (
    <div style={{ border: "0.5px solid #e8e4de", borderRadius: "16px", overflow: "hidden", background: "#fff" }}>
      <div style={{ padding: "20px 24px", background: reportType === "solo" ? "#fdf1ec" : "#fdf6ea", borderBottom: "0.5px solid #e8e4de" }}>
        <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1.6px", textTransform: "uppercase", color: "#b0a89e", marginBottom: "6px" }}>sample report</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>{reportType === "solo" ? SAMPLE_SOLO_REPORT.name : `${SAMPLE_COUPLE_REPORT.nameA} & ${SAMPLE_COUPLE_REPORT.nameB}`}</div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={() => setReportType("solo")} style={{ padding: "8px 18px", border: "none", borderRadius: "100px", background: reportType === "solo" ? "#c9502a" : "#f3efe8", color: reportType === "solo" ? "#fff" : "#6b6560", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Personal Blueprint</button>
          <button onClick={() => setReportType("couple")} style={{ padding: "8px 18px", border: "none", borderRadius: "100px", background: reportType === "couple" ? "#b8893a" : "#f3efe8", color: reportType === "couple" ? "#fff" : "#6b6560", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Couple Blueprint</button>
        </div>
        <div style={{ display: "flex", gap: "2px", overflowX: "auto", margin: "0 -24px", padding: "0 24px", scrollbarWidth: "none" }}>
          {sections.map(s => <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: "9px 14px", border: "none", cursor: "pointer", background: "transparent", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap", color: activeSection === s.id ? (reportType === "solo" ? "#c9502a" : "#b8893a") : "#9a8f87", borderBottom: activeSection === s.id ? `2px solid ${reportType === "solo" ? "#c9502a" : "#b8893a"}` : "2px solid transparent" }}>{s.label}</button>)}
        </div>
      </div>
      <div style={{ padding: "28px 24px", maxHeight: "500px", overflowY: "auto" }}>{renderContent()}</div>
      <div style={{ padding: "16px 24px", borderTop: "0.5px solid #e8e4de", background: "#f3efe8", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <p style={{ fontSize: "12px", color: "#9a8f87", fontWeight: 300 }}>{reportType === "solo" ? "Your full report has 7 sections and arrives within minutes." : "Your couple report covers 10 sections + 12 months together."}</p>
        <button onClick={reportType === "solo" ? onGetSolo : onGetCouple} style={{ padding: "10px 22px", background: reportType === "solo" ? "#c9502a" : "#b8893a", color: "#fff", border: "none", borderRadius: "100px", cursor: "pointer", fontSize: "13px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{reportType === "solo" ? "get my Blueprint — CA$9.99" : "get our Blueprint — CA$14.99"}</button>
      </div>
    </div>
  );
}

function AdminDeleteModal({ review, onClose, onConfirm }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const del = () => { if (pw === ADMIN_PASSWORD) { onConfirm(review.id); onClose(); } else setErr(true); };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,18,14,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "400px", background: "#faf8f4", borderRadius: "18px", border: "0.5px solid #e8e4de", padding: "28px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Delete Review?</div>
        <p style={{ fontSize: "14px", color: "#6b6560", marginBottom: "20px" }}>Review by <strong>{review.name}</strong> will be permanently removed.</p>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 500, color: "#6b6560", marginBottom: "6px", display: "block" }}>Admin Password</label>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }} placeholder="Enter admin password" style={{ width: "100%", padding: "12px 16px", border: `0.5px solid ${err ? "#c9502a" : "#e8e4de"}`, borderRadius: "10px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", background: "#fff", outline: "none" }} />
          {err && <p style={{ fontSize: "12px", color: "#c9502a", marginTop: "6px" }}>Incorrect password.</p>}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #e8e4de", borderRadius: "100px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
          <button onClick={del} style={{ padding: "10px 20px", background: "#c9502a", color: "#fff", border: "none", borderRadius: "100px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function KoreanBlueprint() {
  const [delRev, setDelRev] = useState(null);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const t = LANGS.EN;
  const goSolo = () => window.open(TALLY_SOLO_URL, "_blank", "noopener,noreferrer");
  const goCouple = () => window.open(TALLY_COUPLE_URL, "_blank", "noopener,noreferrer");
  const handleDel = id => setReviews(r => r.filter(x => x.id !== id));

  const css = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{background:#faf8f4}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}@keyframes floatEl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}.kb-fade{animation:fadeUp 0.7s ease both}.kb-f1{animation:floatEl 4s ease-in-out infinite}.kb-f2{animation:floatEl 5s ease-in-out infinite 0.8s}.kb-f3{animation:floatEl 3.5s ease-in-out infinite 1.5s}.kb-f4{animation:floatEl 4.5s ease-in-out infinite 0.4s}.kb-f5{animation:floatEl 6s ease-in-out infinite 1.2s}::selection{background:#c9502a;color:#fff}::-webkit-scrollbar{display:none}`;

  return (
    <>
      <style>{css}</style>
      {delRev && <AdminDeleteModal review={delRev} onClose={() => setDelRev(null)} onConfirm={handleDel} />}
      <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1a1714" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", borderBottom: "0.5px solid #e8e4de" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700 }}>Korean<span style={{ color: "#c9502a" }}>Blueprint</span></span>
          </nav>

          <section className="kb-fade" style={{ padding: "72px 0 56px", textAlign: "center", position: "relative" }}>
            {[{ cls: "kb-f1", top: "8%", left: "1%", el: "Wood" }, { cls: "kb-f2", top: "18%", right: "2%", el: "Fire" }, { cls: "kb-f3", top: "55%", left: "0%", el: "Water" }, { cls: "kb-f4", top: "62%", right: "0%", el: "Metal" }, { cls: "kb-f5", top: "38%", left: "3%", el: "Earth" }].map((f, i) => <span key={i} className={f.cls} style={{ position: "absolute", fontSize: "22px", opacity: 0.16, top: f.top, left: f.left, right: f.right, pointerEvents: "none" }}>{ELEMENT_META[f.el].emoji}</span>)}
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: "100px", background: "#fdf1ec", border: "0.5px solid rgba(201,80,42,0.3)", fontSize: "11px", fontWeight: 500, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c9502a", marginBottom: "28px" }}>launch pricing · limited spots</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 7vw, 62px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-1.5px", marginBottom: "22px" }}>You were born with<br />a <em style={{ fontStyle: "italic", color: "#c9502a" }}>blueprint.</em><br />Here's what it says.</h1>
            <p style={{ fontSize: "17px", color: "#6b6560", fontWeight: 300, maxWidth: "480px", margin: "0 auto 12px", lineHeight: 1.75 }}>{t.tagline}</p>
            <p style={{ fontSize: "15px", color: "#9a8f87", fontWeight: 300, maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.6 }}>{t.tagline2}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}><Btn onClick={goSolo}>Personal Blueprint — CA$9.99</Btn><Btn onClick={goCouple} outline>Couple Blueprint — CA$14.99</Btn></div>
          </section>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", padding: "18px 0", borderTop: "0.5px solid #e8e4de", borderBottom: "0.5px solid #e8e4de", marginBottom: "72px" }}>
            {["Built around you", "Ready in minutes", "Deep, not basic", "Only CA$9.99 (for now)"].map(s => <span key={s} style={{ fontSize: "13px", color: "#9a8f87", display: "flex", alignItems: "center", gap: "7px" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#c9502a" }} />{s}</span>)}
          </div>

          <SectionReveal>
            <SectionLabel>the system</SectionLabel>
            <SectionH2>Five elements. One blueprint.</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300, maxWidth: "460px", lineHeight: 1.7, marginBottom: "32px" }}>Every person is a blend of five elemental energies. One tends to lead. Your report shows you which — and what it means for how you live, love, and work.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
              {Object.entries(ELEMENT_META).map(([n, m]) => <div key={n} style={{ border: "0.5px solid #e8e4de", borderRadius: "12px", padding: "20px 12px", textAlign: "center", background: "#faf8f4" }}><div style={{ fontSize: "22px", marginBottom: "8px" }}>{m.emoji}</div><div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>{n}</div><div style={{ fontSize: "11px", color: "#9a8f87", lineHeight: 1.5 }}>{m.label}</div></div>)}
            </div>
          </SectionReveal>

          <SectionReveal delay={80}>
            <SectionLabel>the reports</SectionLabel>
            <SectionH2>Pick your blueprint.</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300, maxWidth: "460px", lineHeight: 1.7, marginBottom: "32px" }}>Both reports are designed to be read on your phone, shared with friends, and talked about for days.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              <ProductCard accent="#c9502a" badge="most popular" featured title={t.soloTitle} tagline={t.soloDesc} features={t.soloFeatures} launchPrice={t.soloPrice} regularPrice={t.soloRegular} launchNote={t.launchNote} ctaLabel={t.ctaSolo} onCta={goSolo} />
              <ProductCard accent="#b8893a" title={t.coupleTitle} tagline={t.coupleDesc} features={t.coupleFeatures} launchPrice={t.couplePrice} regularPrice={t.coupleRegular} launchNote={t.launchNote} ctaLabel={t.ctaCouple} onCta={goCouple} />
            </div>
          </SectionReveal>

          <SectionReveal delay={60}>
            <SectionLabel>{t.sampleLabel}</SectionLabel>
            <SectionH2 mb="12px">{t.sampleTitle}</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300, lineHeight: 1.7, marginBottom: "28px", maxWidth: "480px" }}>{t.sampleSub}</p>
            <InlineSampleReport onGetSolo={goSolo} onGetCouple={goCouple} />
          </SectionReveal>

          <SectionReveal delay={60}>
            <SectionLabel>how it works</SectionLabel>
            <SectionH2 mb="32px">Three steps. Five minutes.</SectionH2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {t.steps.map((s, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: "18px", alignItems: "flex-start", paddingBottom: i < t.steps.length - 1 ? "28px" : 0 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}><div style={{ width: 32, height: 32, borderRadius: "50%", border: "0.5px solid #e8e4de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 500, color: "#1a1714", background: "#faf8f4" }}>{i + 1}</div>{i < t.steps.length - 1 && <div style={{ width: 1, flex: 1, background: "#e8e4de", marginTop: "6px", minHeight: "28px" }} />}</div><div style={{ paddingTop: "4px" }}><div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>{s.title}</div><div style={{ fontSize: "13px", color: "#6b6560", fontWeight: 300, lineHeight: 1.6 }}>{s.desc}</div></div></div>)}
            </div>
          </SectionReveal>

          <SectionReveal delay={60}>
            <SectionLabel>{t.reviewsLabel}</SectionLabel>
            <SectionH2 mb="32px">{t.reviewsTitle}</SectionH2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
              {reviews.map(r => <div key={r.id} style={{ border: "0.5px solid #e8e4de", borderRadius: "14px", padding: "22px", background: "#faf8f4", position: "relative" }}><button onClick={() => setDelRev(r)} style={{ position: "absolute", top: "12px", right: "12px", width: "20px", height: "20px", borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", fontSize: "10px", color: "#c0b8b0", opacity: 0.5 }} title="Delete (admin)">✕</button><Stars /><p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "14px", color: "#3a3530", lineHeight: 1.75, margin: "12px 0 18px" }}>"{r.quote}"</p><div style={{ display: "flex", alignItems: "center", gap: "10px" }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: r.bg, color: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600 }}>{r.initials}</div><div><div style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</div><div style={{ fontSize: "11px", color: "#9a8f87", display: "flex", alignItems: "center", gap: "6px" }}><span>{r.location}</span><span style={{ width: 3, height: 3, borderRadius: "50%", background: "#c0b8b0" }} /><span style={{ color: r.color }}>{r.product}</span></div></div></div></div>)}
            </div>
          </SectionReveal>

          <SectionReveal delay={60}>
            <SectionLabel>the system</SectionLabel>
            <SectionH2 mb="18px">{t.aboutTitle}</SectionH2>
            <p style={{ fontSize: "16px", color: "#6b6560", fontWeight: 300, lineHeight: 1.8, maxWidth: "560px" }}>{t.aboutText}</p>
          </SectionReveal>

          <SectionReveal delay={60}>
            <SectionLabel>{t.faqLabel}</SectionLabel>
            <SectionH2 mb="28px">{t.faqTitle}</SectionH2>
            <div>{t.faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}</div>
          </SectionReveal>

          <SectionReveal delay={40}>
            <div style={{ border: "0.5px solid #e8e4de", borderRadius: "16px", padding: "48px 36px", textAlign: "center", background: "#f3efe8", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, marginBottom: "12px" }}>{t.finalH}</h2>
              <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300, marginBottom: "28px" }}>{t.finalSub}</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}><Btn onClick={goSolo} bg="#c9502a">Personal Blueprint — CA$9.99</Btn><Btn onClick={goCouple} bg="#b8893a">Couple Blueprint — CA$14.99</Btn></div>
            </div>
          </SectionReveal>

          <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", padding: "28px 0 40px", borderTop: "0.5px solid #e8e4de" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontWeight: 700 }}>Korean<span style={{ color: "#c9502a" }}>Blueprint</span></span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}><a href="mailto:koreanblueprint@gmail.com" style={{ fontSize: "13px", color: "#c9502a", textDecoration: "none" }}>koreanblueprint@gmail.com</a><p style={{ fontSize: "12px", color: "#b0a89e", maxWidth: "380px", lineHeight: 1.6, margin: 0 }}>{t.disclaimer}</p></div>
          </footer>
        </div>
      </div>
    </>
  );
}
