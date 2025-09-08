import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  kakaopay?: boolean;
}

// 신랑측 계좌정보
const groomAccounts: AccountInfo[] = [
  {
    relation: "신랑",
    name: "최성욱",
    bank: "신한은행",
    account: "110-123-456789",
    kakaopay: true,
  },
  {
    relation: "신랑",
    name: "최도현",
    bank: "신한은행",
    account: "110-123-456789",
  },
];

// 신부측 계좌정보
const brideAccounts: AccountInfo[] = [
  {
    relation: "국민",
    name: "이하나",
    bank: "국민은행",
    account: "200123-45-678900",
    kakaopay: true,
  },
  {
    relation: "신한",
    name: "이상대",
    bank: "신한은행",
    account: "110-123-456789",
  },
];

export default function MoneyGift() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(text);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const renderAccountCard = (account: AccountInfo, index: number) => (
    <div
      key={index}
      className="bg-white p-4 rounded-lg border border-gray-200 transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 text-sm">{account.bank}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(account.account)}
          className="p-2 h-auto text-gray-600 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
        >
          {copiedAccount === account.account ? (
            <Check className="w-4 h-4 text-green-500 animate-bounce" />
          ) : (
            <Copy className="w-4 h-4 transition-transform duration-200" />
          )}
        </Button>
      </div>
      <div className="text-gray-800 font-mono text-sm mb-1 transition-all duration-200">
        {account.account}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">{account.name}</span>
        {account.kakaopay && (
          <div className="bg-rose-primary text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
            💳 pay
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* 신랑측 계좌번호 아코디언 */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="groom"
                className="border border-gray-200 rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg hover:border-rose-primary/50"
              >
                <AccordionTrigger className="px-4 py-3 text-gray-700 hover:no-underline transition-all duration-200 hover:bg-rose-primary/10 group">
                  <span className="group-hover:text-rose-primary transition-colors duration-200">
                    신랑측 계좌번호
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 overflow-hidden">
                  <div className="space-y-3">
                    {groomAccounts.map((account, index) =>
                      renderAccountCard(account, index)
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* 신부측 계좌번호 아코디언 */}
          <div
            className="animate-slide-up"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="bride"
                className="border border-gray-200 rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg hover:border-rose-primary/50"
              >
                <AccordionTrigger className="px-4 py-3 text-gray-700 hover:no-underline transition-all duration-200 hover:bg-rose-primary/10 group">
                  <span className="group-hover:text-rose-primary transition-colors duration-200">
                    신부측 계좌번호
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 overflow-hidden">
                  <div className="space-y-3">
                    {brideAccounts.map((account, index) =>
                      renderAccountCard(account, index)
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
