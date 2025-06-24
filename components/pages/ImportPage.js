"use client"
import { Upload } from "lucide-react"

export default function ImportPage() {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import de Données</h1>
            <p className="text-gray-600 mt-1">Importez vos prospects et contrats depuis Excel/CSV</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-12">
          <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Import de Données</h3>
          <p className="text-gray-600">Module d'import disponible dans la version complète.</p>
        </div>
      </div>
    </>
  )
}
