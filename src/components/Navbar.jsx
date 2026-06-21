import React from "react";

const HOME_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Agents", href: "#agents" },
  { label: "About", href: "#about" },
  { label: "Try It", href: "#try-it" },
  { label: "GitHub", href: "https://github.com/akshayjadhav237237-cmd/FirstMove" },
];

export default function Navbar({ onTryIt }) {
  const handleClick = (e, link) => {
    if (link.href === "#try-it") {
      e.preventDefault();
      if (onTryIt) onTryIt();
    } else if (link.href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(link.href.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10100,
        display: "inline-flex",
        alignItems: "center",
        gap: "32px",
        background: "#000000",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "none",
        borderRadius: "16px",
        padding: "10px 28px",
        whiteSpace: "nowrap",
        outline: "none",
      }}
    >
      {HOME_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          onClick={(e) => handleClick(e, link)}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            transition: "color 0.18s ease",
            display: "inline-block",
            letterSpacing: "-0.01em",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.75)";
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
