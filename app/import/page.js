"use client"

import { useState } from "react"
import { Upload, Download, FileText, Users, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState("prospects")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [importResult, setImportResult] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Vérifier le type de fichier
    const allowedTypes = [".csv", ".xlsx", ".xls"]
    const fileExtension = "." + file.name.split(".").pop().toLowerCase()

    if (!allowedTypes.includes(fileExtension)) {
      alert("Type de fichier non supporté. Utilisez CSV, XLSX ou XLS.")
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    try {
      // Simuler la lecture du fichier et l'aperçu
      const mockPreview = [
        { firstName: "Jean", lastName: "Dupont", email: "jean.dupont@email.com", phone: "0123456789", age: "65" },
        { firstName: "Marie", lastName: "Martin", email: "marie.martin@email.com", phone: "0987654321", age: "68" },
        { firstName: "Pierre", lastName: "Durand", email: "pierre.durand@email.com", phone: "0156789123", age: "70" },
        { firstName: "Sophie", lastName: "Bernard", email: "sophie.bernard@email.com", phone: "0147258369", age: "67" },
        { firstName: "Claude", lastName: "Moreau", email: "claude.moreau@email.com", phone: "0198765432", age: "72" },
      ]

      setPreviewData(mockPreview)
    } catch (error) {
      console.error("Erreur lecture fichier:", error)
      alert("Erreur lors de la lecture du fichier")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImport = async () => {
    if (!uploadedFile) return

    setIsUploading(true)

    try {
      // Simuler l'import
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("importType", activeTab)

      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult = {
        success: 4,
        errors: 1,
        total: 5,
        details: [
          { row: 1, status: "success", data: { firstName: "Jean", lastName: "Dupont" } },
          { row: 2, status: "success", data: { firstName: "Marie", lastName: "Martin" } },
          { row: 3, status: "error", error: "Email déjà existant", data: { firstName: "Pierre", lastName: "Durand" } },
          { row: 4, status: "success", data: { firstName: "Sophie", lastName: "Bernard" } },
          { row: 5, status: "success", data: { firstName: "Claude", lastName: "Moreau" } },
        ],
      }

      setImportResult(mockResult)
    } catch (error) {
      console.error("Erreur import:", error)
      alert("Erreur lors de l'import")
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = (type) => {
    const templates = {
      prospects: "prenom,nom,email,telephone,age,ville\nJean,Dupont,jean.dupont@email.com,0123456789,65,Paris\n",
      contrats:
        "numero_contrat,prospect_id,type_produit,montant_prime,taux_commission\nCNT-2024-001,1,Assurance Santé,2400,15\n",
    }

    const blob = new Blob([templates[type]], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `template_${type}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const sourcesProspects = [
    "Site Web",
    "Publicité Google",
    "Facebook Ads",
    "Recommandation",
    "Salon professionnel",
    "Partenaire",
    "Télémarketing",
    "Courrier",
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage="import" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Import de Données</h1>
              <p className="text-gray-600 mt-1">Importez vos prospects et contrats depuis Excel/CSV</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Onglets */}
          <div className="bg-white rounded-2xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("prospects")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "prospects"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Prospects</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("contrats")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "contrats"
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Contrats</span>
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Zone d'upload */}
              <div className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Glissez votre fichier ici ou cliquez pour sélectionner
                  </h3>
                  <p className="text-gray-600 mb-4">Formats supportés: CSV, XLSX, XLS (max 10MB)</p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg cursor-pointer inline-flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Sélectionner un fichier
                  </label>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                          <p className="text-sm text-blue-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={handleImport}
                        disabled={isUploading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {isUploading ? "Import en cours..." : "Importer"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Aperçu des données */}
              {previewData.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu des données (5 premières lignes)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(previewData[0]).map((key) => (
                            <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {previewData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Résultats d'import */}
              {importResult && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats de l'import</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-green-900">{importResult.success}</p>
                          <p className="text-sm text-green-600">Succès</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-red-900">{importResult.errors}</p>
                          <p className="text-sm text-red-600">Erreurs</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-blue-900">{importResult.total}</p>
                          <p className="text-sm text-blue-600">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Détails ligne par ligne</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {importResult.details.map((detail, index) => (
                        <div
                          key={index}
                          className={`px-4 py-3 border-b border-gray-100 ${
                            detail.status === "success" ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {detail.status === "success" ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                              )}
                              <span className="text-sm font-medium">
                                Ligne {detail.row}: {detail.data.firstName} {detail.data.lastName}
                              </span>
                            </div>
                            {detail.error && <span className="text-sm text-red-600">{detail.error}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Templates et aide */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Templates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates CSV</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => downloadTemplate("prospects")}
                      className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Template Prospects</span>
                      </div>
                      <span className="text-sm text-gray-500">CSV</span>
                    </button>

                    <button
                      onClick={() => downloadTemplate("contrats")}
                      className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Template Contrats</span>
                      </div>
                      <span className="text-sm text-gray-500">CSV</span>
                    </button>
                  </div>
                </div>

                {/* Sources prospects */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources de prospects</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">Sources prédéfinies disponibles :</p>
                    <div className="flex flex-wrap gap-2">
                      {sourcesProspects.map((source, index) => (
                        <span
                          key={index}
                          className="inline-flex px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
