import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CONFIG — swap these for your real Tally URLs
// ─────────────────────────────────────────────
const TALLY_SOLO_URL   = "https://tally.so/r/5Bv7bE";
const TALLY_COUPLE_URL = "https://tally.so/r/9qvkZQ";

// ─────────────────────────────────────────────
// ELEMENT DATA
// ─────────────────────────────────────────────
const ELEMENT_META = {
  Wood:  { emoji: "🌿", color: "#3a7d44", bg: "#edf7ee", accent: "#5aab64", label: "Growth · Vision · Drive" },
  Fire:  { emoji: "🔥", color: "#c9502a", bg: "#fdf1ec", accent: "#d96b45", label: "Passion · Warmth · Speed" },
  Earth: { emoji: "🪨", color: "#9a6b2e", bg: "#fdf6ea", accent: "#c49040", label: "Stability · Care · Depth" },
  Metal: { emoji: "⚡", color: "#5a5a8a", bg: "#f0f0f8", accent: "#7a7ab0", label: "Precision · Will · Edge" },
  Water: { emoji: "🌊", color: "#1b6fa8", bg: "#e8f4fd", accent: "#3a8fc8", label: "Flow · Wisdom · Quiet" },
};

// ─────────────────────────────────────────────
// SAMPLE REPORT (Fire element)
// ─────────────────────────────────────────────
const SAMPLE_REPORT = {
  element: "Fire",
  name: "Alex, born 1992",
  sections: [
    {
      id: "identity",
      label: "🔥 Who you are",
      headline: "You don't enter rooms. You ignite them. 🔥",
      body: "Your dominant element is 🔥 Fire — supported by 🌿 Wood. That combo means you don't just burn, you burn toward something.\n\nYou feel things before you think them. You move before others have decided. And yeah, you've definitely sent a few apology texts.\n\nThe 🌿 Wood underneath gives you direction most Fire people don't have. You can actually build things — not just start them. (Though you start a lot of things.)",
      callout: "Your shadow side: you burn people out without meaning to. Learning when to turn it down is the skill that changes everything.",
    },
    {
      id: "love",
      label: "❤️ Love",
      headline: "You love hard. Sometimes too hard, too fast. ❤️",
      body: "You're all-in from day one. The right person finds it electric. The wrong one finds it exhausting.\n\nWhat you need: someone with their own fire. Their own life. Dependency makes you feel trapped — interdependence energises you.\n\nThe pattern to watch: when things get stable and good, you get restless. You mistake peace for stagnation. It isn't. This has ended more than one thing that was actually working.",
      callout: null,
    },
    {
      id: "career",
      label: "💼 Career",
      headline: "Give you ownership or lose you. 💼",
      body: "You can be a great employee — but only with real autonomy, real visibility, a mission you believe in. Miss any one of these and you're already planning your exit, even if you don't know it yet.\n\nRoles that fit: creative direction, brand strategy, coaching, entertainment, your own thing.\n\nBiggest career risk: staying somewhere safe for too long.",
      callout: null,
    },
    {
      id: "money",
      label: "💰 Money",
      headline: "Feast or famine. You know it. 💰",
      body: "Big wins. Dry spells. Repeat. This isn't bad luck — it's your element. 🔥 Fire generates in surges, not streams.\n\nBuild a freedom fund in the good times. Not an emergency fund — a freedom fund. 'This lets me say yes to the next real thing without desperation.'\n\nThe 48-hour rule: any financial decision over $500 that excites you — wait two days. Your worst decisions were all made in exciting rooms.",
      callout: null,
    },
    {
      id: "outlook",
      label: "📅 2026",
      headline: "2026: the quiet build, then the real move. 📅",
      body: "First half of 2026: underground work. Things are growing — you just can't see them yet. Don't force visible results before July.\n\n🌱 January — Close old loops. Not the time for new starts.\n🌊 February — Someone shows you who they really are. Trust it.\n✨ March — Creative surge. Capture everything, commit to nothing yet.\n💬 April — Say the thing you've been avoiding. It lands better this month.\n\n🔥 July — Pivot point. Something you gave up on comes back. Pay attention.\n⚡ August — Highest energy month of the year. Take the meeting. Show the work.\n🎯 October — Decision window opens. Make the call you've been sitting on.",
      callout: null,
    },
  ],
};

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Priya S.",
    location: "Mumbai, India",
    product: "Solo Blueprint",
    initials: "PS",
    color: "#c9502a",
    bg: "#fdf1ec",
    quote: "I've done every personality test out there — MBTI, Enneagram, Human Design. This is the first one where I read it and actually felt seen. The career section described my exact frustration with my current job without me saying a word. Sent the couple report to my partner the next day.",
  },
  {
    name: "James T.",
    location: "London, UK",
    product: "Couple Blueprint",
    initials: "JT",
    color: "#1b6fa8",
    bg: "#e8f4fd",
    quote: "My girlfriend and I went through the couple report together and it started a two-hour conversation we've needed for months. The conflict pattern section was almost uncomfortably accurate. We both sat quietly for a moment before laughing.",
  },
  {
    name: "Camille D.",
    location: "Lyon, France",
    product: "Solo Blueprint",
    initials: "CD",
    color: "#3a7d44",
    bg: "#edf7ee",
    quote: "The 2026 section gave me chills. It described a crossroads I'm currently at with my career in a way that felt impossible to know. I've shared it with four people already. My sister ordered one immediately.",
  },
  {
    name: "Marco R.",
    location: "São Paulo, Brazil",
    product: "Solo Blueprint",
    initials: "MR",
    color: "#9a6b2e",
    bg: "#fdf6ea",
    quote: "I was a skeptic. My partner bought this as a joke gift. I read the 'toxic tendency' section and put my phone down for five minutes. That's not something a random algorithm does. Genuinely impressive.",
  },
  {
    name: "Yuna K.",
    location: "Seoul, South Korea",
    product: "Couple Blueprint",
    initials: "YK",
    color: "#5a5a8a",
    bg: "#f0f0f8",
    quote: "As someone who already knew the traditional system, I was curious how this would translate for a Western audience. The reframing is brilliant — modern, clear, no mystical fluff. The couple report especially. We cried a little.",
  },
  {
    name: "Sofia M.",
    location: "Mexico City, Mexico",
    product: "Solo Blueprint",
    initials: "SM",
    color: "#c9502a",
    bg: "#fdf1ec",
    quote: "Por favor necesito que todo el mundo tenga esto. The money section alone was worth $9.99. Two sentences changed how I think about why I keep repeating the same financial pattern. Worth every cent.",
  },
];

// ─────────────────────────────────────────────
// MULTI-LANGUAGE STRINGS
// ─────────────────────────────────────────────
const LANGS = {
  EN: {
    flag: "EN",
    tagline: "you were born with a blueprint. this tells you what it says — your tendencies, your patterns, and what 2026 has in store.",
    steps: [
      { title: "enter your details", desc: "name, date of birth, birth time if you know it. no birth time? you'll still get a full report." },
      { title: "choose your report", desc: "Solo Blueprint for yourself. Couple Blueprint to decode a relationship." },
      { title: "get your blueprint", desc: "a personalized report in your inbox within minutes. built for reading and sharing." },
    ],
    aboutTitle: "what is this, exactly?",
    aboutText: "Korean Blueprint is built on a centuries-old Korean analytical system that maps your birth date to elemental patterns and life tendencies. it's not astrology, it's not fortune telling — it's a personality and life-pattern profile that's surprisingly, uncomfortably accurate. think of it as the self-knowledge tool you didn't know you needed.",
    soloTitle: "Solo Blueprint", soloPrice: "$9.99", soloRegular: "$19.99",
    soloDesc: "understand yourself, finally.",
    soloFeatures: ["your dominant element + 3–5 core traits","love & relationship style","career tendencies + employee vs entrepreneur","money patterns + 2 practical tips","energy boosters vs drainers","2026 outlook + month-by-month breakdown"],
    coupleTitle: "Couple Blueprint", couplePrice: "$14.99", coupleRegular: "$24.99",
    coupleDesc: "decode the dynamic between you two.",
    coupleFeatures: ["who they are — short profile for each person","relationship dynamic + emotional chemistry","communication differences + how to bridge them","your conflict pattern (and how to break it)","green flags + red flags for your combo","practical advice specific to your pairing"],
    ctaSolo: "get my Solo Blueprint", ctaCouple: "get our Couple Blueprint",
    launchNote: "launch pricing",
    sampleLabel: "sample report",
    sampleTitle: "what's inside",
    sampleSub: "Here's a real excerpt from a Fire element Solo Blueprint. Your report follows the same format.",
    sampleBtn: "read full sample →",
    reviewsLabel: "from readers",
    reviewsTitle: "what people are saying",
    faqLabel: "questions", faqTitle: "Answered.",
    faqs: [
      { q: "do I need my exact birth time?", a: "No. Birth time adds more detail, but your core blueprint — personality, relationships, money style, and 2026 outlook — is complete without it. Just select 'I don't know' in the form." },
      { q: "how long until I get my report?", a: "Your report lands in your inbox within minutes of payment." },
      { q: "is this astrology?", a: "No. Korean Blueprint is based on a traditional Korean analytical system that maps birth date to elemental patterns. It's a personality and pattern profile — not prediction, not star signs." },
      { q: "what's in the report?", a: "The Solo report covers core identity, relationship style, career tendencies, money patterns, and a month-by-month 2026 outlook. The Couple report covers chemistry, conflict patterns, green flags, red flags, and practical advice." },
      { q: "how do I contact you?", a: "Email us at koreanblueprint@gmail.com — we reply within 24 hours." },
    ],
    finalH: "Your tendencies. Your patterns. Decoded.",
    finalSub: "Less than two lattes. Way more insight.",
    disclaimer: "This is a personality and pattern profile for self-reflection — not professional medical, legal, financial, or relationship advice.",
  }
};

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.unobserve(el); }
    }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, visible];
}

// ─────────────────────────────────────────────
// SMALL UI COMPONENTS
// ─────────────────────────────────────────────
function SectionReveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal(delay);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(16px)",
      transition: "opacity 0.55s ease, transform 0.55s ease",
      marginBottom: "72px",
    }}>{children}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1.8px",
      textTransform: "uppercase", color: "#b0a89e", marginBottom: "12px" }}>
      {children}
    </p>
  );
}

function SectionH2({ children, mb = "14px" }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700,
      letterSpacing: "-0.5px", marginBottom: mb, lineHeight: 1.2 }}>
      {children}
    </h2>
  );
}

function CheckMark({ color }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={color} opacity="0.15" />
      <path d="M4.5 7.5l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars() {
  return <span style={{ color: "#c9502a", fontSize: "13px", letterSpacing: "1px" }}>★★★★★</span>;
}

function Chevron({ open }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      style={{ transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0)", flexShrink: 0 }}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid #e8e4de" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", background: "none", border: "none", textAlign: "left",
        padding: "18px 0", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500, color: "#1a1714",
      }}>
        {q}<Chevron open={open} />
      </button>
      {open && (
        <p style={{ fontSize: "14px", color: "#6b6560", lineHeight: 1.7,
          paddingBottom: "18px", maxWidth: "540px", fontWeight: 300 }}>{a}</p>
      )}
    </div>
  );
}

function Btn({ onClick, children, bg = "#c9502a", color = "#fff", outline = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "13px 26px", border: outline ? "1px solid rgba(26,23,20,0.2)" : "none",
        borderRadius: "100px", cursor: "pointer",
        background: outline ? (hov ? "#f3efe8" : "transparent") : bg,
        color: outline ? "#1a1714" : color,
        fontSize: "14px", fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        opacity: hov && !outline ? 0.88 : 1,
        transform: hov ? "translateY(-1px)" : "none",
        transition: "all 0.15s",
      }}>{children}</button>
  );
}

function ProductCard({ accent, badge, title, tagline, features,
  launchPrice, regularPrice, launchNote, ctaLabel, onCta, featured = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      border: featured ? `1.5px solid ${accent}` : "0.5px solid #e8e4de",
      borderRadius: "14px", padding: "28px 24px", background: "#faf8f4",
      display: "flex", flexDirection: "column", position: "relative",
      transform: hov ? "translateY(-3px)" : "none",
      transition: "transform 0.2s, border-color 0.2s",
    }}>
      {badge && (
        <span style={{
          position: "absolute", top: "16px", right: "16px",
          fontSize: "10px", fontWeight: 500, letterSpacing: "0.8px",
          textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px",
          background: `${accent}18`, color: accent,
        }}>{badge}</span>
      )}
      <div style={{ width: "28px", height: "3px", borderRadius: "2px",
        background: accent, marginBottom: "20px" }} />
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px",
        fontWeight: 700, letterSpacing: "-0.3px", marginBottom: "6px" }}>{title}</div>
      <div style={{ fontSize: "13px", color: "#9a8f87", fontWeight: 300,
        marginBottom: "22px" }}>{tagline}</div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column",
        gap: "9px", marginBottom: "28px" }}>
        {features.map((f, i) => (
          <li key={i} style={{ fontSize: "13px", color: "#6b6560",
            display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <CheckMark color={accent} />{f}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "0.5px solid #e8e4de" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px",
            fontWeight: 700, color: accent }}>{launchPrice}</span>
          <span style={{ fontSize: "13px", color: "#c0b8b0",
            textDecoration: "line-through" }}>{regularPrice}</span>
        </div>
        <div style={{ fontSize: "11px", color: "#b0a89e", marginBottom: "16px" }}>
          {launchNote} · secure checkout via Stripe
        </div>
        <Btn onClick={onCta} bg={accent} children={ctaLabel} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SAMPLE REPORT MODAL
// ─────────────────────────────────────────────
function SampleModal({ onClose, onGetBlueprint }) {
  const [active, setActive] = useState("identity");
  const section = SAMPLE_REPORT.sections.find(s => s.id === active);
  const m = ELEMENT_META[SAMPLE_REPORT.element];

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(20,18,14,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: "660px", maxHeight: "90vh",
        background: "#faf8f4", borderRadius: "18px",
        border: "0.5px solid #e8e4de",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>

        {/* Modal header */}
        <div style={{ padding: "24px 28px 0", borderBottom: "0.5px solid #e8e4de" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: "18px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "1.6px",
                textTransform: "uppercase", color: "#b0a89e", marginBottom: "6px" }}>
                sample report · Solo Blueprint
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif",
                fontSize: "20px", fontWeight: 700 }}>
                {SAMPLE_REPORT.name}
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#f3efe8", border: "none", cursor: "pointer",
              fontSize: "16px", color: "#6b6560", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px", overflowX: "auto",
            scrollbarWidth: "none" }}>
            {SAMPLE_REPORT.sections.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{
                padding: "9px 14px", border: "none", cursor: "pointer",
                background: "transparent",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px", fontWeight: 500, whiteSpace: "nowrap",
                color: active === s.id ? "#c9502a" : "#9a8f87",
                borderBottom: active === s.id ? "2px solid #c9502a" : "2px solid transparent",
                transition: "all 0.15s", borderRadius: "4px 4px 0 0",
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* Modal body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "5px 12px", borderRadius: "100px",
            background: m.bg, color: m.color,
            fontSize: "12px", fontWeight: 600,
            border: `1px solid ${m.accent}44`, marginBottom: "16px",
          }}>
            {m.emoji} Fire element
          </div>

          <h3 style={{ fontFamily: "'Playfair Display', serif",
            fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px",
            marginBottom: "18px", lineHeight: 1.25 }}>
            {section.headline}
          </h3>

          {section.body.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize: "14px", color: "#4a4540",
              lineHeight: 1.8, marginBottom: "14px", fontWeight: 300,
              whiteSpace: "pre-line" }}>{para}</p>
          ))}

          {section.callout && (
            <div style={{ marginTop: "20px", padding: "16px 18px",
              background: "#fdf1ec", borderRadius: "10px",
              borderLeft: "3px solid #c9502a" }}>
              <p style={{ fontSize: "13px", color: "#7a3520",
                lineHeight: 1.7, fontWeight: 400 }}>{section.callout}</p>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div style={{
          padding: "16px 28px", borderTop: "0.5px solid #e8e4de",
          background: "#f3efe8",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px", flexWrap: "wrap",
        }}>
          <p style={{ fontSize: "12px", color: "#9a8f87", fontWeight: 300 }}>
            Your full report has 7 sections and arrives within minutes.
          </p>
          <button onClick={onGetBlueprint} style={{
            padding: "10px 22px", background: "#c9502a", color: "#fff",
            border: "none", borderRadius: "100px", cursor: "pointer",
            fontSize: "13px", fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
          }}>get my Blueprint — $9.99</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function KoreanBlueprint() {
  const lang = "EN";
  const [showSample, setShowSample] = useState(false);
  const t = LANGS[lang] || LANGS.EN;

  const goSolo   = () => window.open(TALLY_SOLO_URL,   "_blank", "noopener,noreferrer");
  const goCouple = () => window.open(TALLY_COUPLE_URL, "_blank", "noopener,noreferrer");

  const handleGetBlueprint = () => {
    setShowSample(false);
    goSolo();
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #faf8f4; }
    @keyframes fadeUp  { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:none;} }
    @keyframes floatEl { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
    .kb-fade{animation:fadeUp 0.7s ease both;}
    .kb-f1{animation:floatEl 4s ease-in-out infinite;}
    .kb-f2{animation:floatEl 5s ease-in-out infinite 0.8s;}
    .kb-f3{animation:floatEl 3.5s ease-in-out infinite 1.5s;}
    .kb-f4{animation:floatEl 4.5s ease-in-out infinite 0.4s;}
    .kb-f5{animation:floatEl 6s ease-in-out infinite 1.2s;}
    ::selection{background:#c9502a;color:#fff;}
    ::-webkit-scrollbar{display:none;}
  `;

  return (
    <>
      <style>{css}</style>

      {showSample && (
        <SampleModal
          onClose={() => setShowSample(false)}
          onGetBlueprint={handleGetBlueprint}
        />
      )}

      <div style={{ minHeight: "100vh", background: "#faf8f4",
        fontFamily: "'DM Sans', system-ui, sans-serif", color: "#1a1714" }}>
        <div style={{ maxWidth: "740px", margin: "0 auto", padding: "0 24px" }}>

          {/* ── NAV ── */}
          <nav style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "24px 0", borderBottom: "0.5px solid #e8e4de",
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif",
              fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Korean<span style={{ color: "#c9502a" }}>Blueprint</span>
            </span>

          </nav>

          {/* ── HERO ── */}
          <section className="kb-fade" style={{
            padding: "72px 0 56px", textAlign: "center", position: "relative" }}>
            {[
              { cls:"kb-f1", top:"8%",  left:"1%",  el:"Wood"  },
              { cls:"kb-f2", top:"18%", right:"2%", el:"Fire"  },
              { cls:"kb-f3", top:"55%", left:"0%",  el:"Water" },
              { cls:"kb-f4", top:"62%", right:"0%", el:"Metal" },
              { cls:"kb-f5", top:"38%", left:"3%",  el:"Earth" },
            ].map((f, i) => (
              <span key={i} className={f.cls} style={{
                position: "absolute", fontSize: "22px", opacity: 0.16,
                top: f.top, left: f.left, right: f.right, pointerEvents: "none",
              }}>{ELEMENT_META[f.el].emoji}</span>
            ))}

            <div style={{
              display: "inline-block", padding: "6px 16px", borderRadius: "100px",
              background: "#fdf1ec", border: "0.5px solid rgba(201,80,42,0.3)",
              fontSize: "11px", fontWeight: 500, letterSpacing: "1.8px",
              textTransform: "uppercase", color: "#c9502a", marginBottom: "28px",
            }}>launch pricing · limited spots</div>

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(38px, 7vw, 62px)", fontWeight: 700,
              lineHeight: 1.12, letterSpacing: "-1.5px", marginBottom: "22px",
            }}>
              You were born with<br />
              a <em style={{ fontStyle: "italic", color: "#c9502a" }}>blueprint.</em><br />
              Here's what it says.
            </h1>

            <p style={{ fontSize: "17px", color: "#6b6560", fontWeight: 300,
              maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.75 }}>
              {t.tagline}
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={goSolo}>Solo Blueprint — $9.99</Btn>
              <Btn onClick={goCouple} outline>Couple Blueprint — $14.99</Btn>
            </div>
          </section>

          {/* ── PROOF STRIP ── */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center",
            padding: "18px 0", borderTop: "0.5px solid #e8e4de",
            borderBottom: "0.5px solid #e8e4de", marginBottom: "72px",
          }}>
            {["Made just for you", "Ready in minutes", "Deep, not basic", "Only $9.99 (for now)"].map(s => (
              <span key={s} style={{ fontSize: "13px", color: "#9a8f87",
                display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%",
                  background: "#c9502a", display: "inline-block" }} />
                {s}
              </span>
            ))}
          </div>

          {/* ── FIVE ELEMENTS ── */}
          <SectionReveal>
            <SectionLabel>the system</SectionLabel>
            <SectionH2>Five elements. One blueprint.</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300,
              maxWidth: "460px", lineHeight: 1.7, marginBottom: "32px" }}>
              Every person is a blend of five elemental energies. One tends to lead.
              Your report shows you which — and what it means for how you live, love, and work.
            </p>
            <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
              {Object.entries(ELEMENT_META).map(([name, m]) => (
                <div key={name} style={{
                  border: "0.5px solid #e8e4de", borderRadius: "12px",
                  padding: "20px 12px", textAlign: "center", background: "#faf8f4",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(26,23,20,0.28)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#e8e4de"; e.currentTarget.style.transform="none"; }}
                >
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>{m.emoji}</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>{name}</div>
                  <div style={{ fontSize: "11px", color: "#9a8f87", lineHeight: 1.5 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* ── PRODUCTS ── */}
          <SectionReveal delay={80}>
            <SectionLabel>the reports</SectionLabel>
            <SectionH2>Pick your blueprint.</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300,
              maxWidth: "460px", lineHeight: 1.7, marginBottom: "32px" }}>
              Both reports are designed to be read on your phone, shared with friends, and talked about for days.
            </p>
            <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
              <ProductCard
                accent="#c9502a" badge="most popular" featured
                title={t.soloTitle} tagline={t.soloDesc} features={t.soloFeatures}
                launchPrice={t.soloPrice} regularPrice={t.soloRegular}
                launchNote={t.launchNote} ctaLabel={t.ctaSolo} onCta={goSolo}
              />
              <ProductCard
                accent="#b8893a"
                title={t.coupleTitle} tagline={t.coupleDesc} features={t.coupleFeatures}
                launchPrice={t.couplePrice} regularPrice={t.coupleRegular}
                launchNote={t.launchNote} ctaLabel={t.ctaCouple} onCta={goCouple}
              />
            </div>
          </SectionReveal>

          {/* ── SAMPLE REPORT ── */}
          <SectionReveal delay={60}>
            <SectionLabel>{t.sampleLabel}</SectionLabel>
            <SectionH2 mb="12px">{t.sampleTitle}</SectionH2>
            <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300,
              lineHeight: 1.7, marginBottom: "28px", maxWidth: "480px" }}>
              {t.sampleSub}
            </p>

            <div style={{ border: "0.5px solid #e8e4de", borderRadius: "16px",
              overflow: "hidden", background: "#fff" }}>

              {/* Card header */}
              <div style={{ padding: "20px 24px", background: "#fdf1ec",
                borderBottom: "0.5px solid #e8e4de",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#c9502a", fontWeight: 500,
                    letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "4px" }}>
                    Solo Blueprint · Fire element
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif",
                    fontSize: "18px", fontWeight: 700 }}>Alex, born 1992</div>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["Core identity","Love","Career","Money","2026"].map((tab, i) => (
                    <span key={tab} style={{
                      padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
                      background: i === 0 ? "#c9502a" : "#f3efe8",
                      color: i === 0 ? "#fff" : "#9a8f87",
                    }}>{tab}</span>
                  ))}
                </div>
              </div>

              {/* Excerpt visible */}
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif",
                  fontSize: "19px", fontWeight: 700, marginBottom: "14px",
                  letterSpacing: "-0.2px" }}>
                  You don't enter rooms. You ignite them.
                </h3>
                <p style={{ fontSize: "14px", color: "#4a4540",
                  lineHeight: 1.8, marginBottom: "14px", fontWeight: 300 }}>
                  Your dominant element is Fire — and everything about how you move through
                  the world reflects that. You operate on instinct, passion, and momentum.
                  You feel things first and think about them later (sometimes much later).
                  People either love your energy or feel overwhelmed by it. Both reactions are correct.
                </p>
                <div style={{ padding: "14px 18px", background: "#fdf1ec",
                  borderRadius: "10px", borderLeft: "3px solid #c9502a", marginBottom: "20px" }}>
                  <p style={{ fontSize: "13px", color: "#7a3520", lineHeight: 1.7, fontWeight: 400 }}>
                    Your shadow side: you burn people out without meaning to. You can't help
                    being "a lot" — but learning when to turn it down is the skill that changes everything for you.
                  </p>
                </div>
              </div>

              {/* Blurred continuation + CTA */}
              <div style={{ position: "relative", overflow: "hidden", marginTop: "-8px" }}>
                <div style={{ padding: "0 24px", filter: "blur(4px)", opacity: 0.4,
                  pointerEvents: "none", userSelect: "none",
                  fontSize: "14px", color: "#4a4540", lineHeight: 1.8, fontWeight: 300 }}>
                  In relationships you're all-in from the start — which is intoxicating and
                  occasionally terrifying for the other person. You need a partner who can
                  match your intensity without feeling threatened by it. The right person
                  finds your passion electric. The wrong one finds it exhausting. You're most
                  compatible with Water and Wood types...
                </div>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.97) 65%)",
                  display: "flex", alignItems: "flex-end",
                  justifyContent: "center", paddingBottom: "20px",
                }}>
                  <button onClick={() => setShowSample(true)} style={{
                    padding: "11px 28px", background: "#1a1714", color: "#fff",
                    border: "none", borderRadius: "100px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "opacity 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity="0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity="1"}
                  >{t.sampleBtn}</button>
                </div>
              </div>
              <div style={{ height: "60px" }} />
            </div>
          </SectionReveal>

          {/* ── HOW IT WORKS ── */}
          <SectionReveal delay={60}>
            <SectionLabel>how it works</SectionLabel>
            <SectionH2 mb="32px">Three steps. Five minutes.</SectionH2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {t.steps.map((s, i) => (
                <div key={i} style={{ display: "grid",
                  gridTemplateColumns: "36px 1fr", gap: "18px", alignItems: "flex-start",
                  paddingBottom: i < t.steps.length - 1 ? "28px" : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%",
                      border: "0.5px solid #e8e4de", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 500, color: "#1a1714",
                      background: "#faf8f4", flexShrink: 0 }}>{i + 1}</div>
                    {i < t.steps.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: "#e8e4de",
                        marginTop: "6px", minHeight: "28px" }} />
                    )}
                  </div>
                  <div style={{ paddingTop: "4px" }}>
                    <div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "4px" }}>{s.title}</div>
                    <div style={{ fontSize: "13px", color: "#6b6560",
                      fontWeight: 300, lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* ── REVIEWS ── */}
          <SectionReveal delay={60}>
            <SectionLabel>{t.reviewsLabel}</SectionLabel>
            <SectionH2 mb="32px">{t.reviewsTitle}</SectionH2>
            <div style={{ display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
              {REVIEWS.map((r, i) => (
                <div key={i} style={{
                  border: "0.5px solid #e8e4de", borderRadius: "14px",
                  padding: "22px", background: "#faf8f4",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor="rgba(26,23,20,0.25)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="#e8e4de"; }}
                >
                  <Stars />
                  <p style={{ fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic", fontSize: "14px", color: "#3a3530",
                    lineHeight: 1.75, margin: "12px 0 18px", fontWeight: 400 }}>
                    "{r.quote}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%",
                      background: r.bg, color: r.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 600, flexShrink: 0 }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: "11px", color: "#9a8f87",
                        display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{r.location}</span>
                        <span style={{ width: 3, height: 3, borderRadius: "50%",
                          background: "#c0b8b0", display: "inline-block" }} />
                        <span style={{ color: r.color }}>{r.product}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>

          {/* ── ABOUT ── */}
          <SectionReveal delay={60}>
            <SectionLabel>the system</SectionLabel>
            <SectionH2 mb="18px">{t.aboutTitle}</SectionH2>
            <p style={{ fontSize: "16px", color: "#6b6560", fontWeight: 300,
              lineHeight: 1.8, maxWidth: "560px" }}>{t.aboutText}</p>
          </SectionReveal>

          {/* ── FAQ ── */}
          <SectionReveal delay={60}>
            <SectionLabel>{t.faqLabel}</SectionLabel>
            <SectionH2 mb="28px">{t.faqTitle}</SectionH2>
            <div>{t.faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}</div>
          </SectionReveal>

          {/* ── FINAL CTA ── */}
          <SectionReveal delay={40}>
            <div style={{ border: "0.5px solid #e8e4de", borderRadius: "16px",
              padding: "48px 36px", textAlign: "center", background: "#f3efe8",
              marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700,
                letterSpacing: "-0.5px", marginBottom: "12px" }}>{t.finalH}</h2>
              <p style={{ fontSize: "15px", color: "#6b6560", fontWeight: 300,
                marginBottom: "28px" }}>{t.finalSub}</p>
              <div style={{ display: "flex", gap: "12px",
                justifyContent: "center", flexWrap: "wrap" }}>
                <Btn onClick={goSolo} bg="#c9502a">Solo Blueprint — $9.99</Btn>
                <Btn onClick={goCouple} bg="#b8893a">Couple Blueprint — $14.99</Btn>
              </div>
            </div>
          </SectionReveal>

          {/* ── FOOTER ── */}
          <footer style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: "16px",
            padding: "28px 0 40px", borderTop: "0.5px solid #e8e4de",
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif",
              fontSize: "15px", fontWeight: 700 }}>
              Korean<span style={{ color: "#c9502a" }}>Blueprint</span>
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
              <a href="mailto:koreanblueprint@gmail.com" style={{ fontSize: "13px", color: "#c9502a", textDecoration: "none", fontWeight: 400 }}>koreanblueprint@gmail.com</a>
              <p style={{ fontSize: "12px", color: "#b0a89e",
                maxWidth: "380px", lineHeight: 1.6, margin: 0 }}>{t.disclaimer}</p>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
