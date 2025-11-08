import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, ShoppingCart, Shield } from "lucide-react";

const roleOptions: { role: UserRole; label: string; icon: any; description: string }[] = [
  { role: "seller", label: "Seller", icon: Package, description: "Create and manage invoices" },
  { role: "buyer", label: "Buyer", icon: ShoppingCart, description: "Approve invoices and deploy escrow" },
  { role: "shipper", label: "Shipper", icon: Truck, description: "Track and update shipments" },
  { role: "admin", label: "Admin", icon: Shield, description: "Agent operations" },
];

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("seller");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    const user = login(email, password, selectedRole);
    toast({
      title: "Welcome!",
      description: `Logged in as ${user.role}`,
    });

    // Navigate to role-specific dashboard
    navigate(`/${selectedRole}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent">
            <Package className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Supply Chain Portal</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(({ role, label, icon: Icon, description }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all ${
                      selectedRole === role
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {roleOptions.find((r) => r.role === selectedRole)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Demo authentication - use any credentials
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
