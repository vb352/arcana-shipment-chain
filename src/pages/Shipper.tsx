import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin } from "lucide-react";
import { getShipments } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function Shipper() {
  const navigate = useNavigate();
  const shipments = getShipments();

  const activeShipments = shipments.filter(
    (s) => s.currentStatus !== "DELIVERED"
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-status-pending-bg text-status-pending",
      PICKED_UP: "bg-status-info-bg text-status-info",
      IN_TRANSIT: "bg-status-info-bg text-status-info",
      CUSTOMS: "bg-status-warning-bg text-status-warning",
      DELIVERED: "bg-status-success-bg text-status-success",
    };
    return colors[status] || "";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Shipper Dashboard</h1>
          <p className="text-muted-foreground">Track and update shipments</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
              <Truck className="h-4 w-4 text-status-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShipments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shipments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <MapPin className="h-4 w-4 text-status-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {shipments.filter((s) => s.currentStatus === "DELIVERED").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments List */}
        <Card>
          <CardHeader>
            <CardTitle>My Shipments</CardTitle>
            <CardDescription>Track and update shipment milestones</CardDescription>
          </CardHeader>
          <CardContent>
            {shipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Truck className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No shipments assigned</h3>
                <p className="text-sm text-muted-foreground">
                  Shipments will appear here when assigned to you
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="rounded-lg border p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                    onClick={() => navigate(`/shipper/shipment/${shipment.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{shipment.trackingNumber}</p>
                          <Badge className={getStatusColor(shipment.currentStatus)}>
                            {shipment.currentStatus.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Invoice: {shipment.invoiceNumber}</span>
                          <span>•</span>
                          <span>ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {shipment.origin} → {shipment.destination}
                          </span>
                        </div>
                      </div>
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
