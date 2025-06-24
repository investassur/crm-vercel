"use client"

import { useState, useRef } from "react"
import { Upload, Download, FileText, Users, AlertCircle, CheckCircle, X } from "lucide-react"

export default function ImportPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [importResults, setImportResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
      setUploadedFile(file)
      setImportResults(null)
    } else {
      alert("Veuillez sélectionner un fichier CSV ou Excel (.xlsx)")
    }
  }

  const processImport = async () => {
    if (!uploadedFile) return

    setLoading(true)
    try {
      // Simuler le traitement du fichier
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simuler des résultats d'import
      const mockResults = {
        total_rows: 150,
        successful_imports: 142,
        failed_imports: 8,
        duplicates: 5,
        errors: [
          { row: 15, error: "Email invalide: test@invalid" },
          { row: 23, error: "Téléphone manquant" },
          { row: 45, error: "Nom requis" },
          { row: 67, error: "Email déjà existant: duplic@test.com" },
          { row: 89, error: "Format de date invalide" },
        ],
        imported_data: [
          { name: "Jean Dupont", email: "jean.dupont@email.com", phone: "0123456789", status: "Importé" },
          { name: "Marie Martin", email: "marie.martin@email.com", phone: "0987654321", status: "Importé" },
          { name: "Pierre Durand", email: "pierre.durand@email.com", phone: "0147258369", status: "Importé" },
          { name: "Sophie Bernard", email: "sophie.bernard@email.com", phone: "0369258147", status: "Importé" },
          { name: "Luc Moreau", email: "luc.moreau@email.com", phone: "0258147369", status: "Importé" },
        ],
      }

      setImportResults(mockResults)
    } catch (error) {
      console.error("Erreur lors de l'import:", error)
      alert("Erreur lors du traitement du fichier")
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `first_name,last_name,email,phone,company,source,notes
Jean,Dupont,jean.dupont@email.com,0123456789,Entreprise A,Site web,Prospect intéressé
Marie,Martin,marie.martin@email.com,0987654321,Entreprise B,Référencement,Contact commercial
Pierre,Durand,pierre.durand@email.com,0147258369,Entreprise C,Publicité,Demande de devis`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "template_prospects.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import de Données</h1>
          <p className="text-gray-600 mt-1">Importez vos prospects depuis un fichier CSV ou Excel</p>
        </div>
      </div>

      <div className="p-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions d'import</h3>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Formats acceptés: CSV (.csv) et Excel (.xlsx)</li>
                <li>Colonnes requises: first_name, last_name, email</li>
                <li>Colonnes optionnelles: phone, company, source, notes</li>
                <li>Taille maximale: 10 MB</li>
                <li>Encodage recommandé: UTF-8</li>
              </ul>
              <button
                onClick={downloadTemplate}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le modèle</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Sélectionner le fichier</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : uploadedFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                    <p className="text-xs text-green-600">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Glissez-déposez votre fichier ici</p>
                  <p className="text-gray-600 mb-4">ou</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Parcourir les fichiers
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-6">
                <button
                  onClick={processImport}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Lancer l'import</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">2. Résultats de l'import</h2>
            {importResults ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Importés avec succès</p>
                        <p className="text-2xl font-bold text-green-900">{importResults.successful_imports}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Échecs</p>
                        <p className="text-2xl font-bold text-red-900">{importResults.failed_imports}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Errors */}
                {importResults.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-red-800 mb-3">Erreurs détectées:</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                          <span className="font-medium">Ligne {error.row}:</span> {error.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview of imported data */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Aperçu des données importées</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importResults.imported_data.slice(0, 5).map((row, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{row.email}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{row.phone}</td>
                            <td className="px-4 py-2">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importResults.imported_data.length > 5 && (
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 text-center">
                      ... et {importResults.imported_data.length - 5} autres lignes
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Les résultats de l'import s'afficheront ici</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
