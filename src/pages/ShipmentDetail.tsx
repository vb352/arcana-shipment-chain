import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Package, CheckCircle } from "lucide-react";
import { getShipmentById, saveShipment } from "@/lib/storage";
import { Shipment, ShipmentStatus, Milestone } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const statusFlow: ShipmentStatus[] = [
  "PENDING",
  "PICKED_UP",
  "IN_TRANSIT",
  "CUSTOMS",
  "DELIVERED",
];

export default function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      const ship = getShipmentById(id);
      setShipment(ship);
    }
  }, [id]);

  const handleUpdateStatus = (status: ShipmentStatus) => {
    if (!shipment) return;

    const milestone: Milestone = {
      id: crypto.randomUUID(),
      status,
      timestamp: new Date().toISOString(),
      notes: notes || undefined,
      updatedBy: "Shipper",
    };

    const updatedShipment: Shipment = {
      ...shipment,
      currentStatus: status,
      milestones: [...shipment.milestones, milestone],
    };

    saveShipment(updatedShipment);
    setShipment(updatedShipment);
    setNotes("");

    toast({
      title: "Status Updated",
      description: `Shipment status updated to ${status.replace(/_/g, " ")}`,
    });
  };

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

  const currentIndex = statusFlow.indexOf(shipment?.currentStatus || "PENDING");
  const availableStatuses = statusFlow.slice(currentIndex + 1);

  if (!shipment) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Shipment not found</p>
          <Button className="mt-4" onClick={() => navigate("/shipper")}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/shipper")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{shipment.trackingNumber}</h1>
            <p className="text-muted-foreground">Shipment Details</p>
          </div>
          <Badge className={getStatusColor(shipment.currentStatus)}>
            {shipment.currentStatus.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Shipment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                <p className="font-medium">{shipment.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{shipment.origin}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{shipment.destination}</span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Timeline</CardTitle>
            <CardDescription>Track the journey of your shipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipment.milestones.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No milestones yet
                </p>
              ) : (
                shipment.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          milestone.status === "DELIVERED"
                            ? "bg-status-success text-status-success-bg"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {milestone.status === "DELIVERED" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Package className="h-5 w-5" />
                        )}
                      </div>
                      {idx < shipment.milestones.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {milestone.status.replace(/_/g, " ")}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(milestone.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {milestone.notes && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {milestone.notes}
                        </p>
                      )}
                      {milestone.updatedBy && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updated by: {milestone.updatedBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Update Status */}
        {availableStatuses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
              <CardDescription>Add a new milestone to the shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {availableStatuses.map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    variant={status === "DELIVERED" ? "default" : "outline"}
                  >
                    {status.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
