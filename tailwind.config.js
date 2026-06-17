/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas:      '#08090a',
        surface:     '#0a0a0c',
        'surface-2': '#0e0f11',
        'panel-r':   '#06060a',
        card:        '#0a0a0c',
        'card-el':   '#0e0f11',
        'input-bg':  '#0e0f11',
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
