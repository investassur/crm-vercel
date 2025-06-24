"use client"
import { Zap, Plus } from "lucide-react"

export default function AutomatisationPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflows & Automatisation</h1>
            <p className="text-gray-600 mt-1">Automatisez vos processus métier</p>
          </div>
          <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau Workflow
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatisation Avancée</h3>
          <p className="text-gray-600">Module d'automatisation disponible dans la version complète.</p>
        </div>
      </div>
    </>
  )
}
