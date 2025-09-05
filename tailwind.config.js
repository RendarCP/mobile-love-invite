/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 모바일 청첩장 컬러 팔레트 (세련된 톤으로 업데이트)
        "rose-primary": "#F4C2C2",
        "rose-secondary": "#D4A4A4",
        "cream-primary": "#FFF8F0",
        "cream-secondary": "#FAF0E6",
        "gold-primary": "#E6B980",
        "gold-secondary": "#D4A647",
        "sage-primary": "#A8B5A0",
        "sage-secondary": "#8FA285",
        "gray-warm": "#F5F5F0",
        "text-primary": "#2D2D2D",
        "text-secondary": "#666666",
      },
      fontFamily: {
        // 한글 폰트 설정
        sans: ["Noto Sans KR", "ui-sans-serif", "system-ui"],
        serif: ["Noto Serif KR", "ui-serif", "serif"],
        // PartialSans 폰트 추가
        partial: ["PartialSans", "Noto Sans KR", "ui-sans-serif", "system-ui"],
      },
      maxWidth: {
        mobile: "480px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
