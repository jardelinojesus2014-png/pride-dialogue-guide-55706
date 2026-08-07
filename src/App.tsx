import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InactivityReloader } from "@/components/InactivityReloader";
import { SignedStorageUrlBridge } from "@/components/SignedStorageUrlBridge";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ArtesCampanhas from "./pages/ArtesCampanhas";
import Central from "./pages/Central";
import OperadoraDoc from "./pages/OperadoraDoc";
import NotFound from "./pages/NotFound";
import EditorTest from "./pages/__EditorTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <InactivityReloader />
          <SignedStorageUrlBridge />

          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/artes-campanhas" element={<ProtectedRoute><ArtesCampanhas /></ProtectedRoute>} />
            <Route path="/central/:categoryId" element={<ProtectedRoute><Central /></ProtectedRoute>} />
            <Route path="/operadora/:operadoraId" element={<ProtectedRoute><OperadoraDoc /></ProtectedRoute>} />
            <Route path="/__editor-test" element={<EditorTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
