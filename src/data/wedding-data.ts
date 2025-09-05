/**
 * 웨딩 관련 정적 데이터
 */
import type { WeddingInfo, AccountInfo, DiningInfo } from "@/types/wedding";

// 기본 웨딩 정보
export const weddingInfo: WeddingInfo = {
  groomName: "성욱",
  brideName: "회진",
  weddingDate: new Date("2025-12-27T14:00:00"),
  ceremonyTime: "오후 2시",
  receptionTime: "오후 3시",
  venue: {
    name: "웨딩홀 이름",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    coordinates: {
      lat: 37.5013,
      lng: 127.0394,
    },
    parking: "지하 1-3층 무료 주차 가능 (3시간)",
    transport: [
      {
        type: "subway",
        description: "지하철 2호선 강남역 3번 출구 도보 5분",
        icon: "🚇",
      },
      {
        type: "bus",
        description: "강남역 정류장 하차 (146, 740, 8001)",
        icon: "🚌",
      },
      {
        type: "car",
        description: "네비게이션: 강남구 테헤란로 123",
        icon: "🚗",
      },
    ],
  },
};

// 계좌 정보 (마음 전하는곳)
export const accountsInfo: AccountInfo[] = [
  {
    relation: "신랑",
    name: "성욱",
    bank: "신한은행",
    account: "110-123-456789",
    kakaopay: "010-1234-5678",
  },
  {
    relation: "신부",
    name: "회진",
    bank: "국민은행",
    account: "123-456-789012",
  },
  {
    relation: "신랑아버지",
    name: "아버지 성함",
    bank: "우리은행",
    account: "1002-123-456789",
  },
  {
    relation: "신랑어머니",
    name: "어머니 성함",
    bank: "하나은행",
    account: "123-456789-12345",
  },
  {
    relation: "신부아버지",
    name: "아버지 성함",
    bank: "농협은행",
    account: "123-12-123456",
  },
  {
    relation: "신부어머니",
    name: "어머니 성함",
    bank: "KB국민은행",
    account: "123456-01-123456",
  },
];

// 식당 정보
export const diningInfo: DiningInfo = {
  name: "웨딩홀 레스토랑",
  location: "웨딩홀 2층",
  description: "정성스럽게 준비된 한식 뷔페를 제공합니다.",
  menu: ["한식 뷔페", "각종 전통 음식", "디저트 & 음료", "웨딩케이크"],
  notice:
    "식사 참석 여부를 미리 알려주시면 더욱 좋은 서비스로 모실 수 있습니다.",
};
