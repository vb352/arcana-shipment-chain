import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Globe, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[var(--gradient-hero)] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Secure International Trade
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                Powered by Blockchain
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              BridgeFi revolutionizes cross-border trade with smart contracts, AI-powered verification, 
              and secure USDC escrow on Circle Wallet and Arc Blockchain.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/login")} className="shadow-lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BridgeFi?</h2>
            <p className="text-muted-foreground text-lg">Trusted by exporters and importers worldwide</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Escrow</CardTitle>
                <CardDescription>
                  Secure USDC payments held in smart contract escrow until conditions are met
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Zap className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>AI Verification</CardTitle>
                <CardDescription>
                  Intelligent agents verify trade conditions and facilitate seamless transactions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Global Trade</CardTitle>
                <CardDescription>
                  Connect with suppliers and buyers across borders with instant settlements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <Lock className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Blockchain Security</CardTitle>
                <CardDescription>
                  Built on Arc blockchain with Circle Wallet for maximum security and transparency
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Simple, secure, and transparent trade process</p>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>1. Supplier Uploads Invoice</CardTitle>
                    <CardDescription className="mt-2">
                      Supplier submits invoice details which get recorded on the smart contract, generating a unique transaction ID
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>2. Buyer Deposits Payment</CardTitle>
                    <CardDescription className="mt-2">
                      Buyer uses the transaction ID to deposit USDC payment into secure escrow via Circle Wallet
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>3. AI Agent Verification</CardTitle>
                    <CardDescription className="mt-2">
                      Our AI agent verifies trade conditions, documents, and facilitates the transaction automatically
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 rounded-full p-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>4. Automatic Settlement</CardTitle>
                    <CardDescription className="mt-2">
                      Once verified, smart contract releases payment to supplier - fast, secure, and transparent
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Trade?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join exporters and importers worldwide using BridgeFi for secure international transactions
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/login")}
                className="shadow-lg"
              >
                Start Trading Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
