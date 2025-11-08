import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle } from "lucide-react";
import { getInvoices } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Seller() {
  const navigate = useNavigate();
  const invoices = getInvoices();

  const inProgress = invoices.filter((inv) => inv.status === "DRAFT");
  const awaitingBuyer = invoices.filter((inv) => inv.status === "AWAITING_BUYER" || inv.status === "DEPLOYED_OPEN");
  const closed = invoices.filter((inv) => inv.status === "RELEASED" || inv.status === "CLOSED");

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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your invoices and track payments</p>
          </div>
          <Button onClick={() => navigate("/seller/invoice/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-status-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgress.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Buyer</CardTitle>
              <FileText className="h-4 w-4 text-status-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{awaitingBuyer.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Closed</CardTitle>
              <CheckCircle className="h-4 w-4 text-status-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closed.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No invoices yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Create your first invoice to get started</p>
                <Button onClick={() => navigate("/seller/invoice/new")}>Create Invoice</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.slice(0, 5).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/seller/invoice/${invoice.id}`)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{invoice.buyerName}</p>
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
