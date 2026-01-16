export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC0A2D',
        },
        gray: {
          dark: '#212121',
          medium: '#666666',
          copy: '#1D1D1D',
          light: '#E0E0E0',
          background: '#EFEFEF',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'subtitle1': ['16px', { lineHeight: '24px', fontWeight: '700' }],
        'subtitle2': ['12px', { lineHeight: '16px', fontWeight: '700' }],
        'body1': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body2': ['10px', { lineHeight: '10px', fontWeight: '400' }],
        'caption': ['8px', { lineHeight: '12px', fontWeight: '400' }],
      },
      boxShadow: {
        'drop': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        'card': '0px 1px 3px 1px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
