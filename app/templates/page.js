"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Mail, FileText, MessageCircle, Send } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [previewData, setPreviewData] = useState({
    prenom: "Jean",
    nom: "Dupont",
    age: "65",
    produit: "Assurance Santé Senior",
    cotisation: "200",
  })

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    content: "",
    category: "general",
    variables: [],
    isActive: true,
  })

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const mockTemplates = [
        {
          id: 1,
          name: "Bienvenue Nouveau Prospect",
          subject: "Bienvenue chez AssurCRM - Votre protection senior",
          content: `<h2>Bonjour {{prenom}} {{nom}},</h2>
<p>Merci de votre intérêt pour nos solutions d'assurance dédiées aux seniors.</p>
<p>Nous vous contacterons dans les 24h pour vous présenter nos offres adaptées à vos besoins.</p>
<p>Cordialement,<br>L'équipe AssurCRM</p>`,
          category: "bienvenue",
          variables: ["prenom", "nom", "age", "ville"],
          is_active: true,
          created_at: "2024-01-15",
        },
        {
          id: 2,
          name: "Relance Prospect",
          subject: "N'oubliez pas votre demande d'assurance senior",
          content: `<h2>Bonjour {{prenom}},</h2>
<p>Nous n'avons pas eu de nouvelles suite à votre demande concernant {{produit}}.</p>
<p>Nos conseillers restent à votre disposition pour répondre à vos questions.</p>
<p>Contactez-nous au 01 23 45 67 89</p>`,
          category: "relance",
          variables: ["prenom", "produit", "date_demande"],
          is_active: true,
          created_at: "2024-01-20",
        },
        {
          id: 3,
          name: "Devis Personnalisé",
          subject: "Votre devis personnalisé AssurCRM",
          content: `<h2>Bonjour {{prenom}} {{nom}},</h2>
<p>Veuillez trouver ci-joint votre devis personnalisé pour {{produit}}.</p>
<p><strong>Cotisation mensuelle : {{cotisation}}€</strong></p>
<p>Ce devis est valable 30 jours. N'hésitez pas à nous contacter pour toute question.</p>`,
          category: "devis",
          variables: ["prenom", "nom", "produit", "cotisation", "validite"],
          is_active: true,
          created_at: "2024-02-01",
        },
      ]
      setTemplates(mockTemplates)
    } catch (error) {
      console.error("Erreur chargement templates:", error)
    }
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category) => {
    switch (category) {
      case "bienvenue":
        return <Mail className="w-4 h-4" />
      case "relance":
        return <MessageCircle className="w-4 h-4" />
      case "devis":
        return <FileText className="w-4 h-4" />
      case "suivi":
        return <Send className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "bienvenue":
        return "bg-green-100 text-green-800"
      case "relance":
        return "bg-orange-100 text-orange-800"
      case "devis":
        return "bg-blue-100 text-blue-800"
      case "suivi":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const replaceVariables = (content, data) => {
    let result = content
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, data[key])
    })
    return result
  }

  const commonVariables = [
    "{{prenom}}",
    "{{nom}}",
    "{{email}}",
    "{{telephone}}",
    "{{age}}",
    "{{ville}}",
    "{{produit}}",
    "{{cotisation}}",
    "{{date}}",
    "{{agent}}",
  ]

  const totalTemplates = templates.length
  const bienvenueTemplates = templates.filter((t) => t.category === "bienvenue").length
  const relanceTemplates = templates.filter((t) => t.category === "relance").length
  const devisTemplates = templates.filter((t) => t.category === "devis").length

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage="templates" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates Email</h1>
              <p className="text-gray-600 mt-1">Gérez vos modèles d'emails personnalisés</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau Template
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalTemplates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bienvenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{bienvenueTemplates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Relance</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{relanceTemplates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Devis</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{devisTemplates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un template..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                <option value="bienvenue">Bienvenue</option>
                <option value="relance">Relance</option>
                <option value="devis">Devis</option>
                <option value="suivi">Suivi</option>
                <option value="remerciement">Remerciement</option>
              </select>
            </div>
          </div>

          {/* Liste des templates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="kpi-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(template.category)}`}>
                      {getCategoryIcon(template.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{template.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedTemplate(template)
                        setShowPreview(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Sujet:</p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 3).map((variable, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                      >
                        {variable}
                      </span>
                    ))}
                    {template.variables.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.variables.length - 3} autres</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {template.is_active ? "Actif" : "Inactif"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(template.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Prévisualisation */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Prévisualisation - {selectedTemplate.name}</h2>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Données de test */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Données de test</h3>
                    <div className="space-y-4">
                      {Object.keys(previewData).map((key) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                          <input
                            type="text"
                            value={previewData[key]}
                            onChange={(e) => setPreviewData({ ...previewData, [key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prévisualisation */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de l'email</h3>
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="border-b border-gray-200 pb-3 mb-4">
                          <p className="text-sm text-gray-600">Sujet:</p>
                          <p className="font-medium">{replaceVariables(selectedTemplate.subject, previewData)}</p>
                        </div>
                        <div
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: replaceVariables(selectedTemplate.content, previewData),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
