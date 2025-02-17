/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // LCQ Primary Green Palette
          'lcq-green': {
            100: '#c7e4d4',
            200: '#91d0b8',
            300: '#7eb7a1',
            400: '#6bb49a',
            500: '#479178',
            600: '#186750',
            700: '#126444',
            800: '#08503d',
            900: '#034231',
          },
          // UI Colors
          background: {
            primary: '#121212',
            secondary: '#1A1A1A',
            tertiary: '#252525',
          },
          foreground: {
            primary: '#FFFFFF',
            secondary: '#A0A0A0',
            tertiary: '#6B7280',
          },
          border: {
            DEFAULT: '#333333',
            light: '#444444',
          },
          // Status Colors
          status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
          '2xs': '0.625rem', // 10px
        },
        boxShadow: {
          card: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
          'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        },
        borderRadius: {
          'card': '0.75rem',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'slide-up': 'slideUp 0.5s ease-in-out',
          'slide-down': 'slideDown 0.5s ease-in-out',
          'slide-in-right': 'slideInRight 0.5s ease-in-out',
          'slide-in-left': 'slideInLeft 0.5s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          slideUp: {
            '0%': { transform: 'translateY(10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          slideDown: {
            '0%': { transform: 'translateY(-10px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          slideInRight: {
            '0%': { transform: 'translateX(20px)', opacity: 0 },
            '100%': { transform: 'translateX(0)', opacity: 1 },
          },
          slideInLeft: {
            '0%': { transform: 'translateX(-20px)', opacity: 0 },
            '100%': { transform: 'translateX(0)', opacity: 1 },
          },
        },
        transitionTimingFunction: {
          'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
          'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        },
        // Custom spacing
        spacing: {
          '72': '18rem',
          '84': '21rem',
          '96': '24rem',
          '128': '32rem',
        },
        // Specific for code blocks
        typography: (theme) => ({
          DEFAULT: {
            css: {
              code: {
                color: theme('colors.lcq-green.300'),
                fontWeight: '400',
                backgroundColor: theme('colors.background.tertiary'),
                padding: '0.2rem 0.4rem',
                borderRadius: '0.25rem',
                fontFamily: theme('fontFamily.mono'),
                fontSize: '0.875em',
              },
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
              pre: {
                backgroundColor: theme('colors.background.tertiary'),
                padding: theme('spacing.4'),
                borderRadius: theme('borderRadius.md'),
                overflow: 'auto',
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms')({
        strategy: 'class',
      }),
      function ({ addUtilities }) {
        const newUtilities = {
          '.text-gradient': {
            background: 'linear-gradient(to right, var(--tw-gradient-stops))',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
            'text-fill-color': 'transparent',
          },
          '.glass-effect': {
            'background': 'rgba(10, 10, 10, 0.7)',
            'backdrop-filter': 'blur(8px)',
            '-webkit-backdrop-filter': 'blur(8px)',
            'border': '1px solid rgba(255, 255, 255, 0.05)',
          },
        };
        addUtilities(newUtilities, ['responsive', 'hover']);
      },
    ],
  };