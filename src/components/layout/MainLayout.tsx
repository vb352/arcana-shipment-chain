import { ReactNode, useState } from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { WalletButton } from "@/components/wallet/WalletButton";

interface MainLayoutProps {
  children: ReactNode;
  showWallet?: boolean;
}

export const MainLayout = ({ children, showWallet = false }: MainLayoutProps) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showAI, setShowAI] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-accent" />
            <span className="text-xl font-bold text-foreground">SupplyChain</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {showWallet && <WalletButton />}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAI(!showAI)}
              className="gap-2"
            >
              AI Assistant
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">({user?.role})</span>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        <main className="flex-1 p-4 md:p-6">{children}</main>
        
        {showAI && (
          <aside className="w-96 border-l bg-card">
            <AIAssistant onClose={() => setShowAI(false)} />
          </aside>
        )}
      </div>
    </div>
  );
};
