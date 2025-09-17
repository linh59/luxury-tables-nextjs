
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, LogOut, Crown, User } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import LightDarkModeBtn from '@/components/light-dark-mode-btn';
import AppSidebar from '@/components/app-side-bar';
import LogoutButton from '@/components/auth/logout-button';
import { useProfile } from '@/queries/useAccount';
import UserProfile from '@/components/navigation/user-profile';

export default function ManageLayout({
  children
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {

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
              <UserProfile/>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              
            <LightDarkModeBtn />
              
             <LogoutButton withConfirm/>
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
