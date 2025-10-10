import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Tag,
  Repeat,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Subscriptions', href: '/subscriptions', icon: Repeat },
]

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-lg">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <h1 className="text-xl font-bold">Finance</h1>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </nav>
            <Separator className="my-4" />
            <div className="p-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card shadow-sm">
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold">Finance</h1>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
          <Separator />
          <div className="p-4">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 shadow-sm lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Finance</h1>
          <div className="ml-auto">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
