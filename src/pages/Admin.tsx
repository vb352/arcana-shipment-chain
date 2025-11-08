import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { agentRelease, agentRevert } from "@/lib/worker-api";

export default function Admin() {
  const { toast } = useToast();
  const [contractAddress, setContractAddress] = useState("");
  const [evidenceCid, setEvidenceCid] = useState("");
  const [agentKey, setAgentKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRelease = async () => {
    if (!contractAddress || !evidenceCid || !agentKey) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await agentRelease(contractAddress, evidenceCid, agentKey);
      toast({
        title: "Funds Released",
        description: "Transaction submitted successfully",
      });
      
      // Show explorer link
      const explorerUrl = `https://testnet.arcscan.app/tx/${result.txHash}`;
      window.open(explorerUrl, "_blank");
    } catch (error: any) {
      toast({
        title: "Release Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!contractAddress || !evidenceCid || !agentKey) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await agentRevert(contractAddress, evidenceCid, agentKey);
      toast({
        title: "Funds Reverted",
        description: "Transaction submitted successfully",
      });
      
      // Show explorer link
      const explorerUrl = `https://testnet.arcscan.app/tx/${result.txHash}`;
      window.open(explorerUrl, "_blank");
    } catch (error: any) {
      toast({
        title: "Revert Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showWallet>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <Shield className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Agent operations (Release/Revert)</p>
          </div>
        </div>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Agent Actions</CardTitle>
            <CardDescription>
              Perform release or revert operations on escrow contracts. These actions require your agent web key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract Address</Label>
              <Input
                id="contract"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence CID</Label>
              <Textarea
                id="evidence"
                placeholder="QmXXXXXXXXXXXXXXXXXXXXXXX..."
                value={evidenceCid}
                onChange={(e) => setEvidenceCid(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                IPFS CID containing evidence for the decision
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Agent Web Key</Label>
              <Input
                id="key"
                type="password"
                placeholder="Enter your agent key"
                value={agentKey}
                onChange={(e) => setAgentKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your private agent key (X-AGENT-KEY header)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="default"
                className="flex-1 gap-2"
                onClick={handleRelease}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4" />
                Release Funds to Beneficiary
              </Button>
              
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={handleRevert}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Revert Funds to Depositor
              </Button>
            </div>

            <div className="mt-6 rounded-lg border border-status-warning bg-status-warning-bg/20 p-4">
              <div className="flex gap-2">
                <Shield className="h-5 w-5 text-status-warning shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-status-warning">Security Notice</p>
                  <p className="text-xs text-muted-foreground">
                    These operations are irreversible and require proper authorization. Ensure you have verified all contract details and evidence before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://testnet.arcscan.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-secondary/50"
            >
              <span className="text-sm font-medium">Arc Testnet Explorer</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
