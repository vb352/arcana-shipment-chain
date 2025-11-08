import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectWallet, switchToArcTestnet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";

export const WalletButton = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Failed to check connection:", error);
      }
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const addr = await connectWallet();
      await switchToArcTestnet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Arc Testnet",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-status-success-bg px-3 py-1.5">
        <div className="h-2 w-2 rounded-full bg-status-success" />
        <span className="text-sm font-medium">{formatAddress(address)}</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};
