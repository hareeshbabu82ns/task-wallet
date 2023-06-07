/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#74c0fc",
        secondary: "#1864ab",
        "bg-primary": "#212529",
        "bg-primary-light": "#343a40",
        "text-primary": "#f8f9fa",
        "border-primary": "#343a40",
      },
      boxShadow: {
        "shadow-primary": "6px 6px 13px #0f1113,-6px -6px 16px #33393f",
        "shadow-primary-sm": "4px 4px 13px #181b1e, -4px -4px 13px #33393f",
        "shadow-form-input":
          "inset 3px 3px 11px #181b1e,inset -3px -3px 11px #2a2f34",
        "shadow-form-autofill":
          "inset 4px 150px 11px #181b1e,inset -0px -0px 11px #2a2f34",
      },
    },
  },
  plugins: [],
};
