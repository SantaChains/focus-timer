import { BarChart2, Timer } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Timer',
    path: '/',
    icon: Timer,
  },
  {
    title: 'Statistics',
    path: '/statistics',
    icon: BarChart2,
  },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Sidebar for Desktop */}
        <Sidebar className="hidden lg:flex border-r border-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 font-bold text-xl gradient-text">
              <Timer className="h-6 w-6 text-primary" />
              <span>Focus Timer</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          location.pathname === item.path 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2026 Focus Timer
            </div>
          </div>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
          {/* Top Navbar for Mobile/Tablet */}
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 backdrop-blur px-4 md:px-6">
            <SidebarTrigger className="lg:hidden mr-4" />
            <div className="flex-1 lg:hidden">
              <div className="flex items-center gap-2 font-bold text-lg gradient-text">
                <Timer className="h-5 w-5 text-primary" />
                <span>Focus Timer</span>
              </div>
            </div>
            
            {/* Nav links for desktop (if needed elsewhere) or just some actions */}
            <div className="ml-auto flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/SantaChains/focus-timer" target="_blank" rel="noreferrer">
                  <GithubIcon />
                </a>
              </Button>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
            {children}
          </div>

          {/* Bottom Navigation for Mobile Devices (< 1024px) */}
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-t border-border px-4 py-2 flex justify-around items-center h-16">
             {navItems.map((item) => (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className={cn(
                   "flex flex-col items-center justify-center space-y-1 w-full",
                   location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                 )}
               >
                 <item.icon className={cn("h-6 w-6", location.pathname === item.path ? "text-primary" : "text-muted-foreground")} />
                 <span className="text-xs font-medium">{item.title}</span>
               </Link>
             ))}
          </nav>
          {/* Spacer for bottom nav on mobile */}
          <div className="lg:hidden h-16 shrink-0" />
        </main>
      </div>
    </SidebarProvider>
  );
};
