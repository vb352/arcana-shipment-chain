import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "./lib/auth";
import Login from "./pages/Login";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import Shipper from "./pages/Shipper";
import Admin from "./pages/Admin";
import CreateInvoice from "./pages/CreateInvoice";
import SellerInvoiceDetail from "./pages/SellerInvoiceDetail";
import BuyerInvoiceDetail from "./pages/BuyerInvoiceDetail";
import ShipmentDetail from "./pages/ShipmentDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to={`/${getCurrentUser()?.role}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/seller"
            element={
              <ProtectedRoute>
                <Seller />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/invoice/new"
            element={
              <ProtectedRoute>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/invoice/:id"
            element={
              <ProtectedRoute>
                <SellerInvoiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer"
            element={
              <ProtectedRoute>
                <Buyer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/invoice/:id"
            element={
              <ProtectedRoute>
                <BuyerInvoiceDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipper"
            element={
              <ProtectedRoute>
                <Shipper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipper/shipment/:id"
            element={
              <ProtectedRoute>
                <ShipmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
