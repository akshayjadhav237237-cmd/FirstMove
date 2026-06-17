/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base:         '#080A0A',
        card:         '#111318',
        'input':      '#1A1D24',
        'input-bg':   '#1A1D24',
        accent:       '#6C63FF',
        'accent-hover': '#5A52E0',
        primary:      '#F9FAFB',
        secondary:    '#9CA3AF',
        muted:        '#4B5563',
        success:      '#10B981',
        warning:      '#F59E0B',
        danger:       '#EF4444',
        desirability: '#818CF8',
        viability:    '#34D399',
        feasibility:  '#FB923C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
}
