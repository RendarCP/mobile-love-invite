// api.ts
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyhriv520n60iaCOvhZC0YbhmIwE6xu6eG5Bt2G4mB9LnfrMEC20jdfqqtCG_mxw9Upfw/exec";
const APP_TOKEN = "CHANGE_ME"; // Code.gs의 SECRET과 일치시켜 간단 검증

export async function writeRow({
  name,
  email,
  msg,
}: {
  name: string;
  email: string;
  msg: string;
}) {
  const body = new URLSearchParams({
    name,
    email,
    msg,
    token: APP_TOKEN, // 파라미터 방식으로 전달 (헤더보다 호환성 좋음)
  });

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      // 헤더로 보내고 싶다면: "X-App-Token": APP_TOKEN
    },
    body,
  });

  // urlencoded면 보통 프리플라이트가 없어 빠르고 간단합니다.
  const data = await res.json(); // Apps Script가 JSON을 반환하도록 구현했음
  if (!data.ok) throw new Error(data.error || "write failed");
}
