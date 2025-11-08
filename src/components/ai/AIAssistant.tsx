import { useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAssistantProps {
  onClose: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const AIAssistant = ({ onClose }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you with invoice management, shipment tracking, and contract operations. What would you like to do?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
    const lower = query.toLowerCase();
    
    if (lower.includes("invoice") && lower.includes("create")) {
      return "I can help you create a new invoice. Please go to the Seller dashboard and click 'Create Invoice'. You'll need to provide supplier info, buyer wallet address, goods description, amount, and shipment details.";
    }
    
    if (lower.includes("approve") || lower.includes("deploy")) {
      return "To approve and deploy an escrow contract: 1) Review the invoice details, 2) Click 'Deploy Escrow' to create the contract on Arc Testnet, 3) Approve USDC spending, 4) Deposit funds to lock the contract. Make sure your wallet is connected!";
    }
    
    if (lower.includes("shipment") || lower.includes("track")) {
      return "You can track shipments in the Shipper dashboard. Update milestones as goods move through: Picked Up → In Transit → Customs → Delivered. Each update is timestamped.";
    }
    
    if (lower.includes("contract") || lower.includes("address")) {
      return "Contract addresses are automatically saved when you deploy an escrow. You can find them in the invoice details. Use the Admin panel to perform agent actions (Release/Revert) with your agent key.";
    }

    return "I understand you're asking about " + query + ". Could you provide more details? I can help with invoices, contracts, shipments, and wallet operations.";
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-secondary p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
