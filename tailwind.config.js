/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
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
        // 웨딩 테마 색상 추가
        "wedding-primary": "rgb(205 177 134)",
        "beige-primary": "rgb(205 177 134)",
        "beige-secondary": "rgb(168 136 87)",
        "wedding-secondary": "rgb(168 136 87)",
      },
      fontFamily: {
        // Pretendard를 기본 폰트로 설정
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "sans-serif",
        ],
        serif: ["Pretendard Variable", "Pretendard", "ui-serif", "serif"],
        // PartialSans 폰트는 특별한 용도로 유지
        partial: [
          "PartialSans",
          "Pretendard Variable",
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
        ],
      },
      maxWidth: {
        mobile: "480px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-in-out",
        "accordion-down": "accordion-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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
        "accordion-down": {
          from: {
            height: "0",
            opacity: "0",
            transform: "translateY(-10px)",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            height: "0",
            opacity: "0",
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow": {
          textShadow: "2px 2px 6px rgb(178,211,222)",
        },
      });
    },
  ],
};
