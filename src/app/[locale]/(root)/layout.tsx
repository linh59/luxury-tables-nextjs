
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Crown, User } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import LightDarkModeBtn from '@/components/light-dark-mode-btn';
import AppSidebar from '@/components/app-side-bar';

export default async function ManageLayout({
  children
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {

// export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, logout } = useAuth();

//   if (!user) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-luxury-gold" />
                {/* {user.role === 'admin' ? (
                  <Crown className="h-5 w-5 text-luxury-gold" />
                ) : (
                  <User className="h-5 w-5 text-muted-foreground" />
                )} */}
                {/* <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {user.role === 'admin' ? t('header.administrator') : user.storeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email || user.username}
                  </span>
                </div> */}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              
            <LightDarkModeBtn />
              
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button> */}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
