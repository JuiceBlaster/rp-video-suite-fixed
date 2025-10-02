import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Camera, 
  FileText, 
  Image, 
  Film, 
  Clapperboard, 
  CheckCircle, 
  Video, 
  Scissors,
  Home,
  Settings,
  Moon,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useApp } from '../contexts/AppContext'

interface LayoutProps {
  children: ReactNode
}

const navigationItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/manifesto', icon: Camera, label: 'Photographer Manifesto' },
  { path: '/foundation', icon: FileText, label: 'Project Foundation' },
  { path: '/assets', icon: Image, label: 'Final Image Assets' },
  { path: '/keyframes', icon: Film, label: 'Key Frames' },
  { path: '/storyboard', icon: Clapperboard, label: 'Key Frame Storyboard' },
  { path: '/approved', icon: CheckCircle, label: 'Approved Storyboard' },
  { path: '/video', icon: Video, label: 'Video Key Frames' },
  { path: '/scene', icon: Scissors, label: 'Scene Builder' }
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { state } = useApp()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">RP Video Suite</h1>
          {state.currentProject && (
            <p className="text-sm text-muted-foreground mt-1">
              {state.currentProject.name}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {navigationItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              {state.loading && (
                <p className="text-sm text-muted-foreground">Processing...</p>
              )}
            </div>
            
            {state.error && (
              <div className="bg-destructive/10 text-destructive px-3 py-1 rounded-md text-sm">
                {state.error}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
