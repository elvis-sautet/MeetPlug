/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'meetplug': {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          success: '#10B981',
          danger: '#EF4444',
          dark: '#1F2937',
          light: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
  prefix: 'mp-',
}
