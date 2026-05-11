import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth";
import { AuthGuard } from "@/components/auth-guard";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Onboarding from "@/pages/onboarding";
import Discover from "@/pages/discover";
import EventDetail from "@/pages/event-detail";
import Memories from "@/pages/memories";
import MemoryDetail from "@/pages/memory-detail";
import Invites from "@/pages/invites";
import Messages from "@/pages/messages";
import Profile from "@/pages/profile";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/onboarding" component={Onboarding} />

      {/* Protected app routes */}
      <Route path="/discover">
        <AuthGuard><Discover /></AuthGuard>
      </Route>
      <Route path="/event/:id">
        <AuthGuard><EventDetail /></AuthGuard>
      </Route>
      <Route path="/memories">
        <AuthGuard><Memories /></AuthGuard>
      </Route>
      <Route path="/memories/:id">
        <AuthGuard><MemoryDetail /></AuthGuard>
      </Route>
      <Route path="/invites">
        <AuthGuard><Invites /></AuthGuard>
      </Route>
      <Route path="/messages">
        <AuthGuard><Messages /></AuthGuard>
      </Route>
      <Route path="/profile">
        <AuthGuard><Profile /></AuthGuard>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
