import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, FileText } from "lucide-react";
import { getInvoices } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Buyer() {
  const navigate = useNavigate();
  const invoices = getInvoices();

  const awaitingApproval = invoices.filter((inv) => 
    inv.status === "AWAITING_BUYER" || inv.status === "DEPLOYED_OPEN"
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      AWAITING_BUYER: "bg-status-warning-bg text-status-warning",
      DEPLOYED_OPEN: "bg-status-info-bg text-status-info",
      LOCKED: "bg-status-success-bg text-status-success",
      RELEASED: "bg-status-success-bg text-status-success",
    };
    return <Badge className={variants[status] || ""}>{status.replace(/_/g, " ")}</Badge>;
  };

  return (
    <MainLayout showWallet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Review and approve invoices</p>
        </div>

        {/* Notifications */}
        <Card className="border-l-4 border-l-status-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-status-warning" />
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
            </div>
            <Badge variant="outline">{awaitingApproval.length}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You have {awaitingApproval.length} invoice{awaitingApproval.length !== 1 ? "s" : ""} awaiting your approval
            </p>
          </CardContent>
        </Card>

        {/* Invoices Awaiting Approval */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices Awaiting Approval</CardTitle>
            <CardDescription>Review and deploy escrow contracts</CardDescription>
          </CardHeader>
          <CardContent>
            {awaitingApproval.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">All caught up!</h3>
                <p className="text-sm text-muted-foreground">No invoices pending approval</p>
              </div>
            ) : (
              <div className="space-y-3">
                {awaitingApproval.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/buyer/invoice/${invoice.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">From: {invoice.sellerName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.goodsDescription}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${invoice.amount} USDC</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Complete invoice history</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No invoices yet
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/buyer/invoice/${invoice.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.sellerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${invoice.amount} USDC</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
