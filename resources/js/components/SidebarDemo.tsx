"use client"

import {
  CalendarIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  BarChart3Icon,
  FileTextIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items for the sidebar
const mainMenuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: HomeIcon,
  },
  {
    title: "Users",
    url: "#",
    icon: UsersIcon,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3Icon,
  },
  {
    title: "Reports",
    url: "#",
    icon: FileTextIcon,
  },
]

const secondaryMenuItems = [
  {
    title: "Inbox",
    url: "#",
    icon: InboxIcon,
  },
  {
    title: "Calendar",
    url: "#",
    icon: CalendarIcon,
  },
  {
    title: "Search",
    url: "#",
    icon: SearchIcon,
  },
  {
    title: "Settings",
    url: "#",
    icon: SettingsIcon,
  },
]

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">X</span>
              </div>
              <span className="font-semibold">Xoo Loyalty</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 items-center justify-between px-4 border-b">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>
          
          <main className="p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Welcome to Xoo Loyalty</h2>
              <p className="text-muted-foreground mb-6">
                This is a demo of the sidebar component. You can toggle it using the button in the header or press Ctrl+B (or Cmd+B on Mac).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <p className="text-3xl font-bold text-primary">1,234</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">$45,678</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="font-semibold mb-2">Orders</h3>
                  <p className="text-3xl font-bold text-blue-600">567</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
