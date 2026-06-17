/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas:      '#09090b',
        'left-panel':'#0c0c0e',
        'panel-r':   '#0a0a0c',
        surface:     '#18181b',
        'surface-2': '#202023',
        card:        '#18181b',
        'card-el':   '#202023',
        'input-bg':  '#202023',
        accent:      '#7C3AED',
        'accent-hover': '#6D28D9',
        // Agent
        strategist:  '#7C3AED',
        risk:        '#F87171',
        devil:       '#FB923C',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        mono:  ["'Berkeley Mono'", "'Fira Code'", "'JetBrains Mono'", 'monospace'],
      },
      letterSpacing: {
        'display': '-0.04em',
      },
    },
  },
  plugins: [],
}
