/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            colors: {
                // Pablo Honey album cover color palette
                pablo: {
                    yellow: '#F2A704',        // Bright yellow - primary accent
                    cream: '#EAC986',         // Light yellow/cream - secondary
                    orange: '#C77017',        // Dark orange/brown - dark accent
                    blue: '#6484AC',          // Cool blue-gray - complementary
                    beige: '#CFC2B6',         // Very light beige/gray - subtle
                },
                primary: {
                    DEFAULT: '#F2A704',       // Bright yellow as primary
                    dark: '#C77017',          // Dark orange for hover/active states
                    light: '#EAC986',         // Cream for lighter variants
                },
                secondary: {
                    DEFAULT: '#6484AC',       // Blue-gray as secondary
                    dark: '#4a6a8a',
                },
            },
        },
    },
    plugins: [],
}

