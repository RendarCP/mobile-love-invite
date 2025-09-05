/**
 * 웨딩 관련 타입 정의
 */

// 기본 웨딩 정보
export interface WeddingInfo {
  groomName: string;
  brideName: string;
  weddingDate: Date;
  venue: VenueInfo;
  ceremonyTime: string;
  receptionTime: string;
}

// 장소 정보
export interface VenueInfo {
  name: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parking: string;
  transport: TransportInfo[];
}

// 교통편 정보
export interface TransportInfo {
  type: "subway" | "bus" | "car";
  description: string;
  icon: string;
}

// 참석 체크 관련
export interface AttendanceForm {
  side: "groom" | "bride";
  name: string;
  phone: string;
  attendeeCount: number;
  mealOption: "yes" | "no" | "undecided";
  message?: string;
}

// 계좌 정보 (마음 전하는곳)
export interface AccountInfo {
  relation:
    | "신랑"
    | "신부"
    | "신랑아버지"
    | "신랑어머니"
    | "신부아버지"
    | "신부어머니";
  name: string;
  bank: string;
  account: string;
  kakaopay?: string;
}

// 갤러리 이미지
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

// 식당 정보
export interface DiningInfo {
  name: string;
  location: string;
  description: string;
  menu: string[];
  notice: string;
}

// 카운트다운 타이머
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// 업로드된 사진
export interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  uploadedAt: Date;
  uploaderName?: string;
}

// 캘린더 날짜
export interface CalendarDate {
  date: number;
  isToday: boolean;
  isWeddingDay: boolean;
  isCurrentMonth: boolean;
}
