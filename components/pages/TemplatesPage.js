"use client"
import { Plus, LayoutTemplate } from "lucide-react"

export default function TemplatesPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates Email</h1>
            <p className="text-gray-600 mt-1">Gérez vos modèles d'emails personnalisés</p>
          </div>
          <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau Template
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-12">
          <LayoutTemplate className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Templates Email</h3>
          <p className="text-gray-600">Module de templates disponible dans la version complète.</p>
        </div>
      </div>
    </>
  )
}
