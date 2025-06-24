"use client"

import { Home, Users, UserPlus, Settings, BarChart3 } from "lucide-react"

export default function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "clients", label: "Clients", icon: Users },
    { id: "add-client", label: "Nouveau client", icon: UserPlus },
    { id: "analytics", label: "Analyses", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">InvestAssur CRM</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                currentPage === item.id ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
