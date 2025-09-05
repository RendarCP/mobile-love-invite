import React, { useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GuestMessage {
  id: number;
  name: string;
  message: string;
  date: string;
}

// 샘플 메시지 데이터
const sampleMessages: GuestMessage[] = [
  {
    id: 1,
    name: "김**",
    message: "정말 축하드려요! 행복한 결혼생활 되시길 바라겠습니다 💕",
    date: "2024-12-20",
  },
  {
    id: 2,
    name: "이**",
    message:
      "드디어 결혼하시는군요! 두 분 모두 축하합니다. 새로운 시작을 응원할게요!",
    date: "2024-12-19",
  },
  {
    id: 3,
    name: "박**",
    message:
      "오랜 연애 끝에 결실을 맺게 되어 정말 기쁩니다. 평생 행복하세요 ❤️",
    date: "2024-12-18",
  },
];

export default function GuestBook() {
  const [messages, setMessages] = useState<GuestMessage[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;

    setIsSubmitting(true);

    // 새 메시지 추가 (실제로는 서버에 전송)
    const message: GuestMessage = {
      id: messages.length + 1,
      name: newMessage.name,
      message: newMessage.message,
      date: new Date().toISOString().split("T")[0],
    };

    setTimeout(() => {
      setMessages((prev) => [message, ...prev]);
      setNewMessage({ name: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* 메시지 작성 버튼 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            축하 메시지 남기기
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-text-primary">
              축하 메시지
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                성함
              </label>
              <input
                type="text"
                value={newMessage.name}
                onChange={(e) =>
                  setNewMessage((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary focus:border-transparent"
                placeholder="이름을 입력해주세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                축하 메시지
              </label>
              <textarea
                value={newMessage.message}
                onChange={(e) =>
                  setNewMessage((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-primary focus:border-transparent resize-none"
                placeholder="따뜻한 축하 메시지를 남겨주세요"
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-rose-primary hover:bg-rose-secondary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "등록 중..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  메시지 등록
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* 메시지 목록 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {messages.map((msg) => (
          <Card key={msg.id} className="bg-cream-primary/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-text-primary text-sm">
                  {msg.name}
                </span>
                <span className="text-xs text-text-secondary">{msg.date}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {msg.message}
              </p>
              <div className="flex items-center mt-2">
                <Heart className="w-3 h-3 text-rose-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">아직 등록된 축하 메시지가 없습니다.</p>
          <p className="text-xs mt-1">첫 번째 축하 메시지를 남겨주세요!</p>
        </div>
      )}
    </div>
  );
}
