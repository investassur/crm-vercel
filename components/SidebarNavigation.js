"use client"

import { useState } from "react"
import {
  Home,
  Users,
  FileText,
  CheckSquare,
  Mail,
  BarChart3,
  Target,
  Zap,
  LayoutTemplate,
  Upload,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function SidebarNavigation({ currentPage, onPageChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "prospects", label: "Prospects", icon: Users },
    { id: "contrats", label: "Contrats", icon: FileText },
    { id: "taches", label: "Tâches", icon: CheckSquare },
    { id: "campagnes", label: "Campagnes", icon: Mail },
    { id: "rapports", label: "Rapports", icon: BarChart3 },
    { id: "segmentation", label: "Segmentation", icon: Target },
    { id: "automatisation", label: "Automatisation", icon: Zap },
    { id: "templates", label: "Templates Email", icon: LayoutTemplate },
    { id: "import", label: "Import Données", icon: Upload },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} bg-gradient-purple text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">AssurCRM</h1>
              <p className="text-sm text-white/70">Courtage Senior</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => onPageChange?.(item.id)}
                className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-start"} px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? "bg-white/20 text-white shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-white/70">admin@assurcrm.fr</p>
              </div>
            </div>
          )}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Déconnexion">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
