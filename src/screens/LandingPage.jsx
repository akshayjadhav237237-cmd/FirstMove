import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "motion/react";
import Navbar from "../components/Navbar";

/* ─── CONSTANTS ─────────────────────────────── */

const FEATURES = [
  {
    num: "01",
    title: "Multi-Agent Debate.",
    bullets: [
      "Lead Strategist maps out the execution path",
      "Risk Analyst identifies critical bottlenecks",
      "Devil's Advocate challenges weak assumptions",
      "Real-time collaborative simulation",
    ],
    link: "#try-it",
  },
  {
    num: "02",
    title: "Socratic Alignment.",
    bullets: [
      "Dynamic context-aware questioning",
      "Identifies hidden plan gaps in minutes",
      "Refines business models interactively",
      "Zero generic boilerplate templates",
    ],
    link: "#try-it",
  },
  {
    num: "03",
    title: "Actionable Blueprints.",
    bullets: [
      "DVF (Desirability, Viability, Feasibility) analysis",
      "Granular weekly timeline & milestones",
      "Optimistic & pessimistic scenario planning",
      "Clear 'First Move' priority action item",
    ],
    link: "#try-it",
  },
];

const PHASES = [
  {
    branch: "action/submit",
    phase: "PHASE 01",
    dates: "Step 01",
    title: "Submit Your Idea",
    desc: "Describe your concept in plain English. FirstMove initializes three specialized AI agents to analyze the feasibility.",
  },
  {
    branch: "action/question",
    phase: "PHASE 02",
    dates: "Step 02",
    title: "Socratic Refinement",
    desc: "Answer targeted Socratic questions generated in real-time. Uncover hidden bottlenecks and build consensus.",
  },
  {
    branch: "action/blueprint",
    phase: "PHASE 03",
    dates: "Step 03",
    title: "Executable Blueprint",
    desc: "Get a complete, de-risked strategic plan, assumptions checklist, and your exact priority first move.",
  },
];

const DIFFS = [
  {
    id: "01",
    label: "// VALIDATION SPEED",
    minus: "Weeks of customer interviews and manual market research with high bias.",
    plus: "Three AI agents stress-test your idea in parallel in under 3 minutes.",
  },
  {
    id: "02",
    label: "// FEEDBACK QUALITY",
    minus: "Safe, generic advice from friends or online templates that hide major risks.",
    plus: "Brutally honest Socratic critique and assumptions-based risk mapping.",
  },
  {
    id: "03",
    label: "// ACTION LEVEL",
    minus: "50-page business plans that sit in a drawer and get outdated immediately.",
    plus: "Dynamic, interactive bento dashboard with a clear, prioritized 'First Move'.",
  },
  {
    id: "04",
    label: "// FRAMEWORK METHOD",
    minus: "Unstructured guessing and unstructured brainstorm sessions.",
    plus: "Grounded in Desirability, Viability, and Feasibility (DVF) frameworks.",
  },
];

const STATS = [
  { end: 48, suffix: "", label: "critical assumptions tested" },
  { end: 100, suffix: "%, ", label: "coverage of risks" },
  { end: 3, suffix: "", label: "AI debate agents" },
];

const WordRevealParagraph = () => {
  const containerRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);
    const handler = (e) => setPrefersReduced(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const content = [
    { text: "We", italic: false, green: false },
    { text: "are", italic: false, green: false },
    { text: "startup", italic: false, green: false },
    { text: "thinkers,", italic: false, green: false },
    { text: "\n", italic: false, green: false },
    { text: "building", italic: true, green: true },
    { text: "for", italic: true, green: true },
    { text: "speed.", italic: true, green: true },
    { text: "\n", italic: false, green: false },
    { text: "We", italic: false, green: false },
    { text: "empower", italic: false, green: false },
    { text: "founders", italic: false, green: false },
    { text: "\n", italic: false, green: false },
    { text: "to", italic: false, green: false },
    { text: "debate,", italic: false, green: false },
    { text: "de-risk,", italic: false, green: false },
    { text: "\n", italic: false, green: false },
    { text: "and", italic: false, green: false },
    { text: "execute", italic: false, green: false },
    { text: "their", italic: false, green: false },
    { text: "startup", italic: false, green: false },
    { text: "ideas.", italic: false, green: false },
  ];

  const wordCount = content.filter((w) => w.text !== "\n").length;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
      );

      const revealed = Math.floor(scrollProgress * wordCount * 1.8);
      setRevealedCount(Math.min(revealed, wordCount));
    };

    const container = document.getElementById("landing-page-root");
    const target = container || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      target.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [wordCount]);

  let wordIndex = 0;

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "80vh",
        padding: "80px 40px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: "20vh",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.25em 0.35em",
            lineHeight: 1.05,
          }}
        >
          {content.map((word, i) => {
            if (word.text === "\n") {
              return <div key={i} style={{ width: "100%" }} />;
            }

            const currentIndex = wordIndex++;
            const isRevealed = prefersReduced ? true : currentIndex < revealedCount;

            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                style={{
                  display: "inline-block",
                  fontFamily: word.italic ? "Georgia, serif" : "'Clash Display', sans-serif",
                  fontWeight: word.italic ? 400 : 700,
                  fontStyle: word.italic ? "italic" : "normal",
                  fontSize: "clamp(32px, 5vw, 76px)",
                  color: word.green ? "#39ff7a" : "#f0ffe8",
                  letterSpacing: "-0.02em",
                  willChange: "opacity, transform",
                }}
              >
                {word.text}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ScrollFadeParagraph = ({ text, fontSize = "17px", fontWeight = 300, delay = 0, simultaneous = false }) => {
  const containerRef = useRef(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.88;
      const end = windowHeight * 0.22;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      timeout = setTimeout(() => {
        if (simultaneous) {
          setRevealedCount(progress > 0.4 ? words.length : 0);
        } else {
          setRevealedCount(Math.floor(progress * words.length));
        }
      }, delay);
    };

    const container = document.getElementById("landing-page-root");
    const target = container || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      target.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [words.length, delay, simultaneous]);

  return (
    <div ref={containerRef} style={{ display: "block" }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize,
            fontWeight,
            lineHeight: 1.75,
            color: i < revealedCount ? "rgba(240,237,230,0.88)" : "rgba(240,237,230,0.13)",
            transition: simultaneous ? "color 0.6s ease" : "color 0.45s ease",
            display: "inline",
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

const lines = [
  "Three AI agents debate your idea in parallel.",
  "You get the plan, the risks,",
  "and the one thing to do first.",
];

const HeroText = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-10% 0px",
  });

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "24px",
        marginBottom: "24px",
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <motion.p
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15 * i,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.92)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            {line}
          </motion.p>
        </div>
      ))}
    </div>
  );
};

const HeroHeadline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-10% 0px",
  });

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.h1
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{
          display: "block",
          fontFamily:
            "'Helvetica Now Display', 'Helvetica Neue', 'Helvetica', 'Arial Black', Arial, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(40px, 8.5vw, 135px)",
          lineHeight: 0.8,
          color: "#f5f0e8",
          letterSpacing: "-0.03em",
          margin: 0,
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        FIRSTMOVE
        <span
          style={{
            position: "absolute",
            top: "0.05em",
            left: "100%",
            marginLeft: "8px",
            fontSize: "0.35em",
            color: "#00FF41",
            lineHeight: 1,
          }}
        >
          *
        </span>
      </motion.h1>
    </div>
  );
};

const FeatureBullets = ({ bullets }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-10% 0px",
  });

  return (
    <ul
      ref={ref}
      style={{
        listStyle: "none",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {bullets.map((b, i) => (
        <li
          key={b}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            fontWeight: 300,
            color: "rgba(240,237,230,0.7)",
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "rgba(240,237,230,0.5)", flexShrink: 0, marginTop: "2px" }}>✓</span>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1 * i,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                margin: 0,
                color: "rgba(240,237,230,0.7)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              {b}
            </motion.p>
          </div>
        </li>
      ))}
    </ul>
  );
};

function StartButton({ onStart }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "16px",
        background: hovered ? "#f0f0f0" : "#ffffff",
        color: "#000000",
        fontFamily: "'Clash Display', sans-serif",
        fontWeight: 600,
        fontSize: "17px",
        letterSpacing: "-0.01em",
        padding: "10px 10px 10px 28px",
        borderRadius: "100px",
        border: "none",
        cursor: "pointer",
        textDecoration: "none",
        transition: "background 0.2s ease",
      }}
    >
      Analyze My Idea
      <span
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 11H18M18 11L12 5M18 11L12 17"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

function HeroVideoCard() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = "/hero-bg.mp4";
    video.load();
    video.play().catch(() => {});
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#0a0f0a",
        borderRadius: "inherit",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) saturate(0.75)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,10,5,0.25)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ position: "absolute", bottom: 36, left: 36, zIndex: 3 }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#ffffff",
            lineHeight: 1.2,
            letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          Debate. De-risk. Execute.
        </p>
      </div>
    </div>
  );
}

function HeroBgVideoCard() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sources = [
      "/hero-bg.mp4",
      "https://res.cloudinary.com/dbqsqrctz/video/upload/q_auto,f_auto/v1781474639/hero_eogjwi.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    ];

    let idx = 0;

    const tryNext = () => {
      if (idx >= sources.length) return;
      video.src = sources[idx++];
      video.load();
      video.play().catch(() => {});
    };

    video.onerror = () => tryNext();
    tryNext();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export default function LandingPage({ onStart }) {
  const statsRef = useRef(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            ro.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    document.querySelectorAll(".sr").forEach((el) => ro.observe(el));

    return () => {
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFired(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsRef.current]);

  useEffect(() => {
    if (!statsRef.current) return;
    const rect = statsRef.current.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setFired(true);
    }
  }, []);

  useEffect(() => {
    if (!fired) return;
    const targets = STATS.map((s) => s.end);
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setCounts(targets.map((v) => Math.round(v * e)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [fired]);

  const eyebrow = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: "rgba(240,237,230,0.35)",
    textTransform: "uppercase",
  };

  return (
    <div
      id="landing-page-root"
      className="scrollable-screen w-full h-full bg-black overflow-y-auto"
      style={{ background: "#000000" }}
    >
      <main style={{ background: "#000000", overflowX: "hidden" }}>
        {/* Bezel frame wrapper */}
        <div
          style={{
            background: "#000000",
            padding: "24px",
            minHeight: "100vh",
            borderRadius: "40px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Floating inline navbar */}
          <Navbar onTryIt={onStart} />

          <section
            style={{
              position: "relative",
              borderRadius: "40px",
              overflow: "hidden",
              height: "calc(100vh - 48px)",
              background: "#0a0a0a",
              zIndex: 10000,
            }}
          >
            <HeroBgVideoCard />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.15) 100%)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "-0.15em",
                left: "0px",
                zIndex: 15,
                maxWidth: "65%",
              }}
            >
              <HeroHeadline />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "80px",
                right: "60px",
                maxWidth: "340px",
                textAlign: "left",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <HeroText />

              <StartButton onStart={onStart} />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "32px",
                right: "60px",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  ...eyebrow,
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  color: "rgba(245,240,232,0.35)",
                }}
              >
                scroll
              </span>
              <span
                style={{
                  color: "rgba(245,240,232,0.35)",
                  fontSize: "13px",
                  animation: "bounce 2.2s ease-in-out infinite",
                }}
              >
                ↓
              </span>
            </div>
          </section>
        </div>

        <div
          style={{
            width: "100%",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(57,255,122,0.2), transparent)",
            margin: "0 auto",
          }}
        />

        {/* SECTION 2 — MISSION / ABOUT */}
        <section id="about" style={{ background: "#000000", padding: "80px 0" }}>
          <div
            style={{
              background: "radial-gradient(ellipse at center, #1e1e1e 0%, #0d0d0d 100%)",
              borderRadius: "24px",
              maxWidth: "900px",
              margin: "0 auto",
              padding: "80px 60px",
              boxShadow: "0 0 80px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            <div className="sr" style={{ ...eyebrow, marginBottom: "56px", display: "block" }}>
              [ FIRSTMOVE ]
            </div>

            <WordRevealParagraph />

            <div style={{ maxWidth: "640px", margin: "0 auto 48px", textAlign: "center" }}>
              <ScrollFadeParagraph
                text="Over a validation cycle, you collaborate with three specialized AI agents to uncover hidden bottlenecks. Together, we foster a new generation of conscious founders that bridge insight with action — pushing the boundaries of what early-stage startups can achieve."
                fontSize="17px"
                fontWeight={300}
              />
            </div>

            <div style={{ maxWidth: "640px", margin: "0 auto 48px", textAlign: "center" }}>
              <ScrollFadeParagraph
                text="Multi-agent decision intelligence for conscious builders."
                fontSize="17px"
                fontWeight={300}
                simultaneous
              />
            </div>

            <div style={{ maxWidth: "640px", margin: "0 auto 48px", textAlign: "center" }}>
              <ScrollFadeParagraph
                text="Built on Socratic methodology. Powered by Gemini."
                fontSize="17px"
                fontWeight={300}
                simultaneous
              />
            </div>
          </div>
        </section>

        {/* SECTION 3 — FEATURES BENTO GRID */}
        <section id="agents" style={{ background: "#000000", padding: "0 60px 100px" }}>
          <div className="sr" style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                fontSize: "clamp(30px, 4vw, 52px)",
                color: "#f0ede6",
                letterSpacing: "0.01em",
                marginBottom: "10px",
              }}
            >
              Decision intelligence for conscious builders.
            </h2>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "17px",
                fontWeight: 300,
                color: "#6b8cba",
              }}
            >
              Built on Socratic methodology. Powered by Gemini.
            </p>
          </div>

          <div className="sr sr-d1 features-grid">
            <div
              className="bento-card"
              style={{
                background: "#0a0f0a",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                minHeight: "420px",
              }}
            >
              <HeroVideoCard />
            </div>

            {FEATURES.map((feat, i) => (
              <div
                key={feat.num}
                className="bento-card"
                style={{
                  background: "#121212",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "36px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: "420px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
                        border: "1px solid rgba(255,255,255,0.05)",
                        position: "relative",
                      }}
                    >
                      <img
                        src={
                          i === 0
                            ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=96&q=80"
                            : i === 1
                            ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=96&q=80"
                            : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=96&q=80"
                        }
                        alt={feat.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "grayscale(1) brightness(0.65) contrast(1.3)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {feat.num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 700,
                      fontSize: "28px",
                      color: "#ffffff",
                      letterSpacing: "0.01em",
                      marginTop: "28px",
                      marginBottom: "20px",
                      lineHeight: "1.2",
                    }}
                  >
                    {feat.title}
                  </h3>

                  <FeatureBullets bullets={feat.bullets} />

                  <a
                    href={feat.link}
                    onClick={(e) => {
                      e.preventDefault();
                      onStart();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      marginTop: "36px",
                      transition: "color 0.2s, transform 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    Try it now ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — TIMELINE */}
        <section
          id="how-it-works"
          style={{
            background: "#000000",
            padding: "100px 60px",
            borderTop: "1px solid rgba(240,237,230,0.05)",
            position: "relative",
            zIndex: 10000,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              className="sr"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "64px",
                gap: "40px",
              }}
            >
              <div>
                <div style={{ ...eyebrow, marginBottom: "16px", display: "block" }}>
                  [ DECISION JOURNEY 2026 ]
                </div>
                <h2
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: "#f0ede6",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  Your{" "}
                  <em
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontWeight: 300,
                    }}
                  >
                    Journey.
                  </em>
                </h2>
              </div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "rgba(240,237,230,0.38)",
                  maxWidth: "360px",
                  lineHeight: 1.7,
                  marginTop: "8px",
                }}
              >
                A structured validation framework. Stress-test your startup concept from initial
                description to target assumptions and execute your first move.
              </p>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(240,237,230,0.08)",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                {PHASES.map((phase, i) => (
                  <div key={phase.phase} className={`sr sr-d${i + 1}`}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: `1px solid ${i === 0 ? "#f0ede6" : "rgba(240,237,230,0.18)"}`,
                        background: i === 0 ? "rgba(240,237,230,0.06)" : "#080808",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: i === 0 ? "#f0ede6" : "rgba(240,237,230,0.25)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid rgba(240,237,230,0.09)",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        marginBottom: "20px",
                      }}
                    >
                      <span style={{ color: "rgba(240,237,230,0.3)", fontSize: "11px" }}>⎇</span>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "11px",
                          color: "rgba(240,237,230,0.35)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {phase.branch}
                      </span>
                    </div>

                    <div
                      style={{
                        background: "#111110",
                        border: "1px solid rgba(240,237,230,0.07)",
                        borderRadius: "12px",
                        padding: "24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "14px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "rgba(240,237,230,0.3)",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {phase.phase}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: "10px",
                            color: "rgba(240,237,230,0.2)",
                          }}
                        >
                          {phase.dates}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontWeight: 600,
                          fontSize: "18px",
                          color: "#f0ede6",
                          marginBottom: "10px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {phase.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "13px",
                          fontWeight: 300,
                          color: "rgba(240,237,230,0.38)",
                          lineHeight: 1.65,
                        }}
                      >
                        {phase.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — DIFF (FULL WIDTH) */}
        <section
          style={{
            background: "#000000",
            borderTop: "1px solid rgba(240,237,230,0.05)",
            padding: "100px 60px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              className="sr"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "64px",
                gap: "40px",
              }}
            >
              <div>
                <div style={{ ...eyebrow, marginBottom: "16px", display: "block" }}>
                  [ SYSTEM COMPARATIVES ]
                </div>
                <h2
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: "#f0ede6",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  Why FirstMove is{" "}
                  <em
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontWeight: 300,
                    }}
                  >
                    Different.
                  </em>
                </h2>
              </div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "rgba(240,237,230,0.38)",
                  maxWidth: "380px",
                  lineHeight: 1.7,
                  marginTop: "8px",
                }}
              >
                Compare FirstMove's validation model with generic advisors. We prioritize Socratic
                stress-testing over theoretical templates.
              </p>
            </div>

            <div
              className="sr sr-d1"
              style={{
                borderTop: "1px solid rgba(240,237,230,0.07)",
                borderLeft: "1px solid rgba(240,237,230,0.07)",
                borderRight: "1px solid rgba(240,237,230,0.07)",
                borderRadius: "12px 12px 0 0",
                background: "rgba(240,237,230,0.02)",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ color: "rgba(240,237,230,0.25)", fontSize: "13px" }}>≡</span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  color: "rgba(240,237,230,0.28)",
                  letterSpacing: "0.04em",
                }}
              >
                startup.validation.diff
              </span>
            </div>

            <div
              className="sr sr-d2"
              style={{
                border: "1px solid rgba(240,237,230,0.07)",
                borderRadius: "0 0 12px 12px",
                overflow: "hidden",
              }}
            >
              {DIFFS.map((diff, i) => (
                <div
                  key={diff.id}
                  style={{
                    padding: "36px 28px",
                    borderBottom: i < DIFFS.length - 1 ? "1px solid rgba(240,237,230,0.05)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "12px",
                        color: "rgba(240,237,230,0.18)",
                      }}
                    >
                      {diff.id}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "12px",
                        color: "rgba(240,237,230,0.35)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {diff.label}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0",
                      borderLeft: "2px solid rgba(255,80,80,0.4)",
                      marginBottom: "8px",
                      padding: "11px 20px",
                      background: "rgba(255,80,80,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "rgba(255,120,120,0.75)",
                      }}
                    >
                      − {diff.minus}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      borderLeft: "2px solid rgba(57,255,122,0.4)",
                      padding: "11px 20px",
                      background: "rgba(57,255,122,0.05)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: "rgba(57,255,122,0.8)",
                      }}
                    >
                      + {diff.plus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="sr sr-d3"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 24px",
                border: "1px solid rgba(240,237,230,0.07)",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                background: "rgba(240,237,230,0.01)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#39ff7a", fontSize: "10px" }}>⎇</span>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "11px",
                    color: "rgba(240,237,230,0.25)",
                  }}
                >
                  UTF-8 · diffmode
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(240,237,230,0.15)",
                }}
              >
                line 1-20 of 20
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 6 — STATS */}
        <section
          ref={statsRef}
          style={{
            background: "#000000",
            borderTop: "1px solid rgba(240,237,230,0.05)",
            padding: "80px 60px",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
          >
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    borderLeft: i > 0 ? "1px solid rgba(240,237,230,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(52px, 7vw, 88px)",
                      color: "#f0ede6",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: "10px",
                    }}
                  >
                    {counts[i]}
                    {stat.suffix}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "rgba(240,237,230,0.3)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* SECTION 7 — TERMS ACCORDION + FOOTER */}
        <TermsAccordion />

        <footer
          style={{
            background: "#000000",
            borderTop: "1px solid rgba(240,237,230,0.06)",
            padding: "64px 60px 0",
            position: "relative",
            zIndex: 10000,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "48px",
              maxWidth: "1200px",
              margin: "0 auto",
              paddingBottom: "64px",
              borderBottom: "1px solid rgba(240,237,230,0.06)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#f0ede6",
                  marginBottom: "16px",
                }}
              >
                FIRSTMOVE
                <span style={{ color: "#39ff7a" }}>*</span>
              </div>
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "rgba(240,237,230,0.32)",
                  lineHeight: 1.7,
                  maxWidth: "220px",
                }}
              >
                Empowering the next generation of founders through Socratic AI debate and
                assumption-based risk validation.
              </p>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,230,0.38)",
                  marginBottom: "20px",
                }}
              >
                Quick Links
              </div>
              {[
                { label: "Try It", href: "#try-it" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Agents", href: "#agents" },
                { label: "About", href: "#about" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href === "#try-it") {
                      onStart();
                    } else {
                      const el = document.getElementById(link.href.substring(1));
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{
                    display: "block",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(240,237,230,0.45)",
                    textDecoration: "none",
                    marginBottom: "12px",
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,230,0.45)")}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,230,0.38)",
                  marginBottom: "20px",
                }}
              >
                Community
              </div>
              <a
                href="https://github.com/akshayjadhav237237-cmd/FirstMove"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "rgba(240,237,230,0.45)",
                  textDecoration: "none",
                  marginBottom: "12px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,230,0.45)")}
              >
                GitHub Repository
              </a>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(240,237,230,0.38)",
                  marginBottom: "20px",
                }}
              >
                Contact Us
              </div>
              <a
                href="mailto:akshayjadhav237237@gmail.com"
                style={{
                  display: "block",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "rgba(240,237,230,0.45)",
                  textDecoration: "none",
                  marginBottom: "12px",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ede6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,237,230,0.45)")}
              >
                Email Support
              </a>
            </div>
          </div>

          <div
            style={{
              maxWidth: "1200px",
              margin: "48px auto 0",
              padding: "24px 0 40px",
              borderTop: "1px solid rgba(240,237,230,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "12px",
                color: "rgba(240,237,230,0.25)",
              }}
            >
              &copy; 2026 FirstMove Project. All rights reserved.
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "12px",
                color: "rgba(240,237,230,0.25)",
              }}
            >
              Open Source
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function TermsAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      num: "01",
      title: "Socratic debate framework.",
      content:
        "Our debate model uses a multi-agent critique cycle, derived from classic Socratic questioning to expose Desirability, Viability, and Feasibility (DVF) gaps.",
    },
    {
      num: "02",
      title: "Grounded agent personas.",
      content:
        "The Lead Strategist, Risk Analyst, and Devil's Advocate draw on custom personas to simulate distinct market viewpoints and prevent single-perspective bias.",
    },
    {
      num: "03",
      title: "Gemini LLM context window.",
      content:
        "Analyzing your concept uses local memory context or secure API endpoints. No user data, intellectual property, or code is ever shared or stored.",
    },
    {
      num: "04",
      title: "Assumption-driven execution.",
      content:
        "FirstMove is built on assumption-first development. Identifying and testing critical path assumptions prevents founders from building the wrong product.",
    },
  ];

  const eyebrow = {
    fontFamily: "'Space Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.18em",
    color: "rgba(240,237,230,0.35)",
    textTransform: "uppercase",
  };

  return (
    <section
      style={{
        background: "#080808",
        padding: "100px 60px",
        borderTop: "1px solid rgba(240,237,230,0.05)",
        position: "relative",
        zIndex: 10000,
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div className="sr" style={{ marginBottom: "56px", textAlign: "center" }}>
          <span style={eyebrow}>[ METHODOLOGY & AGENTS ]</span>
          <h2
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#f0ede6",
              letterSpacing: "-0.02em",
              marginTop: "12px",
            }}
          >
            Validation Rules &amp;{" "}
            <em
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              Guidelines.
            </em>
          </h2>
        </div>

        <div
          className="sr sr-d1"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.num}
                style={{
                  background: "#111110",
                  border: "1px solid rgba(240,237,230,0.06)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "13px",
                        color: isOpen ? "#39ff7a" : "rgba(240,237,230,0.25)",
                      }}
                    >
                      {item.num}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: "18px",
                        color: "#f0ede6",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span
                    style={{
                      color: "rgba(240,237,230,0.4)",
                      fontSize: "20px",
                      fontFamily: "monospace",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease",
                    padding: isOpen ? "0 28px 28px 76px" : "0 28px 0 76px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      color: "rgba(240,237,230,0.45)",
                    }}
                  >
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
