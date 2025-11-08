import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Invoice } from "@/lib/types";
import { saveInvoice } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    sellerName: "",
    sellerWallet: "",
    buyerName: "",
    buyerWallet: "",
    agentWallet: "",
    amount: "",
    goodsDescription: "",
    shipmentDetails: "",
    documents: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.buyerWallet || !formData.agentWallet || !formData.amount) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in buyer wallet, agent wallet, and amount",
        variant: "destructive",
      });
      return;
    }

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "AWAITING_BUYER",
      sellerName: formData.sellerName || "Unnamed Seller",
      sellerWallet: formData.sellerWallet,
      buyerName: formData.buyerName || "Unnamed Buyer",
      buyerWallet: formData.buyerWallet,
      agentWallet: formData.agentWallet,
      amount: formData.amount,
      currency: "USDC",
      goodsDescription: formData.goodsDescription || "No description",
      shipmentDetails: formData.shipmentDetails || "No details",
      documents: formData.documents ? formData.documents.split(",").map(d => d.trim()) : [],
      milestones: [],
    };

    saveInvoice(invoice);
    
    toast({
      title: "Invoice Created",
      description: `Invoice ${invoice.invoiceNumber} has been created`,
    });

    navigate("/seller");
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Invoice</h1>
            <p className="text-muted-foreground">Fill in the details to create a new invoice</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Enter the information for this transaction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Supplier Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Supplier Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sellerName">Supplier Name</Label>
                    <Input
                      id="sellerName"
                      name="sellerName"
                      placeholder="Your company name"
                      value={formData.sellerName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerWallet">Supplier Wallet (Beneficiary)</Label>
                    <Input
                      id="sellerWallet"
                      name="sellerWallet"
                      placeholder="0x..."
                      value={formData.sellerWallet}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Buyer Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="buyerName">Buyer Name</Label>
                    <Input
                      id="buyerName"
                      name="buyerName"
                      placeholder="Customer name"
                      value={formData.buyerName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerWallet">Buyer Wallet (Depositor) *</Label>
                    <Input
                      id="buyerWallet"
                      name="buyerWallet"
                      placeholder="0x..."
                      value={formData.buyerWallet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Escrow Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Escrow Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="agentWallet">Agent Wallet *</Label>
                    <Input
                      id="agentWallet"
                      name="agentWallet"
                      placeholder="0x..."
                      value={formData.agentWallet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USDC) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.000001"
                      placeholder="1000.00"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Goods & Shipment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Goods & Shipment</h3>
                <div className="space-y-2">
                  <Label htmlFor="goodsDescription">Goods Description</Label>
                  <Textarea
                    id="goodsDescription"
                    name="goodsDescription"
                    placeholder="Describe the goods being shipped..."
                    value={formData.goodsDescription}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipmentDetails">Shipment Details</Label>
                  <Textarea
                    id="shipmentDetails"
                    name="shipmentDetails"
                    placeholder="Origin, destination, shipping method, ETA..."
                    value={formData.shipmentDetails}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <Label htmlFor="documents">Documents (Optional)</Label>
                <Input
                  id="documents"
                  name="documents"
                  placeholder="Comma-separated document names"
                  value={formData.documents}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  e.g., "Bill of Lading, Packing List, Certificate of Origin"
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/seller")}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}
