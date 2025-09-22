'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

import {
  LayoutDashboard,
  Utensils,
  Users,
  History,
  Store as StoreIcon,
  Settings,
  Crown,
  TableProperties,
  Info
} from 'lucide-react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/routing'; 

export default function AppSidebar() {
  const t = useTranslations();
  const { state } = useSidebar();
  const pathname = usePathname();     // trả về path KHÔNG kèm /en|/vi
  const router = useRouter();         // push/replace sẽ tự thêm locale
  const isCollapsed = state === 'collapsed';

  // const { user } = useAuth();
  // const role = user?.role ?? 'admin';
  const role: 'admin' | 'employee' = 'admin';

  const adminItems = [
    { title: t('sidebar.stores'), url: '/stores', icon: StoreIcon },
    { title: t('sidebar.tables'), url: '/tables', icon: Utensils },
    // { title: t('sidebar.tableManagement'), url: '/table-management', icon: TableProperties },
    // { title: t('sidebar.employees'), url: '/employees', icon: Users },
    { title: t('sidebar.transactions'), url: '/transactions', icon: History },
    { title: t('sidebar.account'), url: '/account', icon: Info },

  ];

  const employeeItems = [
    { title: t('sidebar.tables'), url: '/tables', icon: Utensils },
    { title: t('sidebar.tableManagement'), url: '/table-management', icon: TableProperties },
    { title: t('sidebar.transactions'), url: '/transactions', icon: History }
  ];

  const items = role === 'admin' ? adminItems : employeeItems;

  const handleNavigation = (url: string) => {
    router.push(url); // next-intl sẽ tự prefix theo locale hiện tại
  };

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-luxury-gold flex items-center justify-center">
              <Crown className="h-5 w-5 text-luxury-gold-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-luxury font-semibold text-sidebar-foreground">
                  Luxury Tables
                </span>
                <span className="text-xs text-sidebar-foreground/60">
                  Restaurant Management
                </span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>
            {t('sidebar.administration')}
            {/* {role === 'admin' ? t('sidebar.administration') : t('sidebar.operations')} */}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url; // pathname không kèm locale

                return (
                  <SidebarMenuItem key={item.url}>
                    {/* Cách A: dùng Link để prefetch & giữ semantics */}
                    <Link href={item.url}>
                      <SidebarMenuButton
                        className={`${active
                          ? 'bg-luxury-gold text-luxury-gold-foreground font-medium'
                          : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                          } transition-all duration-200`}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    </Link>

                    {/* Cách B: nếu không muốn Link, dùng onClick
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.url)}
                      className={`${active
                        ? 'bg-luxury-gold text-luxury-gold-foreground font-medium'
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      } transition-all duration-200`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </SidebarMenuButton>
                    */}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
