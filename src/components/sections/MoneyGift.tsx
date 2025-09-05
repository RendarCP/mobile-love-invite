import { useState } from "react";
import { Copy, Check, CreditCard, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AccountInfo {
  relation: string;
  name: string;
  bank: string;
  account: string;
  kakaopay?: string;
}

const accountsData: AccountInfo[] = [
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
    relation: "신랑 아버지",
    name: "아버지 성함",
    bank: "우리은행",
    account: "1002-123-456789",
  },
  {
    relation: "신랑 어머니",
    name: "어머니 성함",
    bank: "하나은행",
    account: "123-456789-12345",
  },
  {
    relation: "신부 아버지",
    name: "아버지 성함",
    bank: "농협은행",
    account: "123-12-123456",
  },
  {
    relation: "신부 어머니",
    name: "어머니 성함",
    bank: "KB국민은행",
    account: "123456-01-123456",
  },
];

export default function MoneyGift() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(`${type}-${text}`);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gold-primary hover:bg-gold-secondary text-white">
          <Gift className="w-4 h-4 mr-2" />
          계좌번호 보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-text-primary">
            마음 전하는 곳
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {accountsData.map((account, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-gold-primary" />
                    <span>{account.relation}</span>
                    <span className="text-text-secondary text-sm">
                      ({account.name})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {/* 은행 계좌 */}
                    <div className="bg-gray-warm p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-text-primary">
                          {account.bank}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(account.account, "bank")
                          }
                          className="p-1 h-auto"
                        >
                          {copiedAccount === `bank-${account.account}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-text-secondary" />
                          )}
                        </Button>
                      </div>
                      <p className="text-text-secondary font-mono text-sm">
                        {account.account}
                      </p>
                      <p className="text-text-primary font-medium text-sm mt-1">
                        {account.name}
                      </p>
                    </div>

                    {/* 카카오페이 (있는 경우) */}
                    {account.kakaopay && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">
                            카카오페이
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(account.kakaopay!, "kakao")
                            }
                            className="p-1 h-auto"
                          >
                            {copiedAccount === `kakao-${account.kakaopay}` ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-text-secondary" />
                            )}
                          </Button>
                        </div>
                        <p className="text-text-secondary font-mono text-sm">
                          {account.kakaopay}
                        </p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-4 text-xs text-text-secondary">
          계좌번호를 터치하시면 복사됩니다
        </div>
      </DialogContent>
    </Dialog>
  );
}
