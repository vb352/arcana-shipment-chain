import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Rocket, CheckCircle, DollarSign, RefreshCw } from "lucide-react";
import { getInvoiceById, saveInvoice } from "@/lib/storage";
import { Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  deployEscrowContract,
  sendTransaction,
  connectWallet,
  switchToArcTestnet,
} from "@/lib/wallet";
import {
  getContractArtifact,
  prepareApprove,
  prepareDeposit,
  getStage,
} from "@/lib/worker-api";

export default function BuyerInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [stage, setStage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const inv = getInvoiceById(id);
      setInvoice(inv);
    }
  }, [id]);

  const refreshStage = async () => {
    if (!invoice?.contractAddress) return;
    try {
      const stageData = await getStage(invoice.contractAddress);
      setStage(stageData.stage);
    } catch (error) {
      console.error("Failed to fetch stage:", error);
    }
  };

  useEffect(() => {
    if (invoice?.contractAddress) {
      refreshStage();
    }
  }, [invoice?.contractAddress]);

  const handleDeploy = async () => {
    if (!invoice) return;

    setIsDeploying(true);
    try {
      await connectWallet();
      await switchToArcTestnet();

      const { abi, bytecode } = await getContractArtifact();
      const contractAddress = await deployEscrowContract(
        abi,
        bytecode,
        invoice.buyerWallet,
        invoice.sellerWallet || invoice.buyerWallet,
        invoice.agentWallet,
        invoice.amount
      );

      const updatedInvoice = {
        ...invoice,
        contractAddress,
        status: "DEPLOYED_OPEN" as const,
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(updatedInvoice);
      setInvoice(updatedInvoice);

      toast({
        title: "Contract Deployed",
        description: `Contract deployed at ${contractAddress}`,
      });
    } catch (error: any) {
      toast({
        title: "Deployment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleApprove = async () => {
    if (!invoice?.contractAddress) return;

    setIsApproving(true);
    try {
      await connectWallet();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const owner = accounts[0];

      const { data, to } = await prepareApprove(
        owner,
        invoice.contractAddress,
        invoice.amount
      );

      await sendTransaction(to, data);

      toast({
        title: "USDC Approved",
        description: "You can now deposit funds",
      });
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!invoice?.contractAddress) return;

    setIsDepositing(true);
    try {
      await connectWallet();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const depositor = accounts[0];

      const { data, to } = await prepareDeposit(invoice.contractAddress, depositor);

      await sendTransaction(to, data);

      const updatedInvoice = {
        ...invoice,
        status: "LOCKED" as const,
        updatedAt: new Date().toISOString(),
      };

      saveInvoice(updatedInvoice);
      setInvoice(updatedInvoice);

      toast({
        title: "Funds Deposited",
        description: "Escrow is now locked",
      });

      refreshStage();
    } catch (error: any) {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (!invoice) {
    return (
      <MainLayout showWallet>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Invoice not found</p>
          <Button className="mt-4" onClick={() => navigate("/buyer")}>
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showWallet>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/buyer")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
          <Badge
            className={
              invoice.status === "LOCKED"
                ? "bg-status-success-bg text-status-success"
                : "bg-status-info-bg text-status-info"
            }
          >
            {invoice.status.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Seller</p>
                <p className="font-medium">{invoice.sellerName}</p>
                {invoice.sellerWallet && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {invoice.sellerWallet}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Buyer (You)</p>
                <p className="font-medium">{invoice.buyerName}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {invoice.buyerWallet}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agent</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {invoice.agentWallet}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">${invoice.amount} USDC</p>
              </div>
            </div>

            {invoice.contractAddress && (
              <div className="rounded-lg border bg-secondary/20 p-4">
                <p className="text-sm font-medium mb-1">Contract Address</p>
                <p className="text-xs font-mono break-all">{invoice.contractAddress}</p>
                {stage && (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-muted-foreground">Stage:</p>
                    <Badge variant="outline">{stage}</Badge>
                    <Button size="sm" variant="ghost" onClick={refreshStage}>
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Goods</p>
              <p className="text-sm">{invoice.goodsDescription}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Shipment</p>
              <p className="text-sm">{invoice.shipmentDetails}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Escrow Actions</CardTitle>
            <CardDescription>Deploy and fund the escrow contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!invoice.contractAddress && (
              <Button
                className="w-full gap-2"
                onClick={handleDeploy}
                disabled={isDeploying}
              >
                <Rocket className="h-4 w-4" />
                {isDeploying ? "Deploying..." : "Deploy Escrow Contract"}
              </Button>
            )}

            {invoice.contractAddress && invoice.status !== "LOCKED" && (
              <>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleApprove}
                  disabled={isApproving}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isApproving ? "Approving..." : "Approve USDC"}
                </Button>

                <Button
                  className="w-full gap-2"
                  onClick={handleDeposit}
                  disabled={isDepositing}
                >
                  <DollarSign className="h-4 w-4" />
                  {isDepositing ? "Depositing..." : "Deposit Funds"}
                </Button>
              </>
            )}

            {invoice.status === "LOCKED" && (
              <div className="rounded-lg border border-status-success bg-status-success-bg/20 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-status-success" />
                <p className="font-medium text-status-success">Funds Locked</p>
                <p className="text-sm text-muted-foreground">
                  Awaiting shipment completion for release
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
