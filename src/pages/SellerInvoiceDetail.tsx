import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Clock, ExternalLink } from "lucide-react";
import { getInvoiceById } from "@/lib/storage";
import { Invoice } from "@/lib/types";

export default function SellerInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (id) {
      const inv = getInvoiceById(id);
      setInvoice(inv);
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      DRAFT: "bg-status-pending-bg text-status-pending",
      AWAITING_BUYER: "bg-status-info-bg text-status-info",
      DEPLOYED_OPEN: "bg-status-warning-bg text-status-warning",
      LOCKED: "bg-status-success-bg text-status-success",
      RELEASED: "bg-status-success-bg text-status-success",
      CLOSED: "bg-secondary text-secondary-foreground",
    };
    return <Badge className={variants[status] || ""}>{status.replace(/_/g, " ")}</Badge>;
  };

  if (!invoice) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Invoice not found</p>
          <Button className="mt-4" onClick={() => navigate("/seller")}>
            Back to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{invoice.invoiceNumber}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
          {getStatusBadge(invoice.status)}
        </div>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              Created on {new Date(invoice.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier (You)</p>
                <p className="font-medium">{invoice.sellerName}</p>
                {invoice.sellerWallet && (
                  <p className="text-xs text-muted-foreground font-mono">
                    {invoice.sellerWallet}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Buyer</p>
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Contract Address</p>
                  <a
                    href={`https://testnet.arcscan.app/address/${invoice.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View on Explorer
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs font-mono break-all">{invoice.contractAddress}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Goods Description</p>
              <p className="text-sm">{invoice.goodsDescription}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Shipment Details</p>
              <p className="text-sm">{invoice.shipmentDetails}</p>
            </div>

            {invoice.documents.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Documents</p>
                <div className="flex flex-wrap gap-2">
                  {invoice.documents.map((doc, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Info */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoice.status === "DRAFT" && (
                <div className="rounded-lg border border-status-pending bg-status-pending-bg/20 p-4">
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-status-pending shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-status-pending">Draft</p>
                      <p className="text-xs text-muted-foreground">
                        This invoice is still in draft. Submit it to make it visible to the buyer.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {invoice.status === "AWAITING_BUYER" && (
                <div className="rounded-lg border border-status-info bg-status-info-bg/20 p-4">
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-status-info shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-status-info">Awaiting Buyer</p>
                      <p className="text-xs text-muted-foreground">
                        Waiting for buyer to review and deploy the escrow contract.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(invoice.status === "DEPLOYED_OPEN" || invoice.status === "LOCKED") && (
                <div className="rounded-lg border border-status-success bg-status-success-bg/20 p-4">
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-status-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-status-success">
                        {invoice.status === "LOCKED" ? "Funds Locked" : "Contract Deployed"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.status === "LOCKED"
                          ? "Escrow funds are locked. Awaiting shipment completion for release."
                          : "Contract deployed. Waiting for buyer to deposit funds."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {invoice.status === "RELEASED" && (
                <div className="rounded-lg border border-status-success bg-status-success-bg/20 p-4">
                  <div className="flex gap-2">
                    <Clock className="h-5 w-5 text-status-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-status-success">Funds Released</p>
                      <p className="text-xs text-muted-foreground">
                        Payment has been released to your wallet. Transaction complete!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        {invoice.milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Shipment Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoice.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3 text-sm">
                    <span className="font-medium">{milestone.status.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">
                      {new Date(milestone.timestamp).toLocaleString()}
                    </span>
                    {milestone.notes && (
                      <span className="text-muted-foreground">- {milestone.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
