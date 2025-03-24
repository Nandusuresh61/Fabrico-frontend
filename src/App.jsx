import { BrowserRouter, Route, Routes } from "react-router"
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from "./routes/AdminRoutes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "../src/components/ui/Tooltip";
import { Toaster } from "../src/components/ui/Toaster";
import { Toaster as Sonner } from "sonner"
import AddProductForm from "./pages/admin/Product/AddProductForm";


import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleConfig } from "./configuration";

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GoogleOAuthProvider clientId={googleConfig.web.client_id}>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<UserRoutes />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </BrowserRouter>
          </GoogleOAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  )
}

export default App