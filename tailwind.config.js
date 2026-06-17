/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas:      '#050507',
        'left-panel':'#08090b',
        'panel-r':   '#06060a',
        surface:     '#0c0d10',
        'surface-2': '#121318',
        card:        '#0c0d10',
        'card-el':   '#121318',
        'input-bg':  '#121318',
        accent:      '#6C63FF',
        'accent-hover': '#5A52E0',
        // Agent
        strategist:  '#818CF8',
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
