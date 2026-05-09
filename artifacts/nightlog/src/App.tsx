import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
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
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/event/:id" component={EventDetail} />
      <Route path="/memories" component={Memories} />
      <Route path="/memories/:id" component={MemoryDetail} />
      <Route path="/invites" component={Invites} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
