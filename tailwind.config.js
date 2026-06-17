/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base:           '#080A0A',
        card:           '#0E1015',
        'card-hover':   '#13161E',
        'input-bg':     '#1A1D24',
        accent:         '#6C63FF',
        'accent-hover': '#5A52E0',
        // Agent colors
        strategist:     '#818CF8',
        risk:           '#F87171',
        devil:          '#FB923C',
        // Scenario colors
        optimistic:     '#10B981',
        pessimistic:    '#EF4444',
        // DVF colors
        desirability:   '#818CF8',
        viability:      '#34D399',
        feasibility:    '#FB923C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'live-pulse': 'live-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
