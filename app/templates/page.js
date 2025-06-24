"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Mail, Eye, Copy, Send } from "lucide-react"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      // Simuler des données de templates
      const mockTemplates = [
        {
          id: 1,
          name: "Email de Bienvenue",
          subject: "Bienvenue chez Premunia - Votre partenaire assurance",
          category: "Onboarding",
          content: `
            <h2>Bienvenue chez Premunia !</h2>
            <p>Cher {{first_name}},</p>
            <p>Nous sommes ravis de vous accueillir parmi nos clients. Notre équipe est à votre disposition pour vous accompagner dans tous vos besoins d'assurance.</p>
            <p>Votre conseiller dédié : {{assigned_to}}</p>
            <p>Cordialement,<br>L'équipe Premunia</p>
          `,
          usage_count: 45,
          created_at: "2024-01-15",
          updated_at: "2024-01-20",
        },
        {
          id: 2,
          name: "Relance Prospect",
          subject: "Votre projet d'assurance - Suivi personnalisé",
          category: "Relance",
          content: `
            <h2>Votre projet d'assurance</h2>
            <p>Bonjour {{first_name}},</p>
            <p>J'espère que vous allez bien. Je me permets de revenir vers vous concernant votre projet d'assurance {{insurance_type}}.</p>
            <p>Avez-vous eu l'occasion de réfléchir à notre proposition ? Je reste à votre disposition pour répondre à toutes vos questions.</p>
            <p>Cordialement,<br>{{assigned_to}}</p>
          `,
          usage_count: 32,
          created_at: "2024-01-10",
          updated_at: "2024-01-18",
        },
        {
          id: 3,
          name: "Confirmation Rendez-vous",
          subject: "Confirmation de votre rendez-vous - {{appointment_date}}",
          category: "Rendez-vous",
          content: `
            <h2>Confirmation de rendez-vous</h2>
            <p>Bonjour {{first_name}},</p>
            <p>Je vous confirme notre rendez-vous prévu le {{appointment_date}} à {{appointment_time}}.</p>
            <p>Lieu : {{appointment_location}}</p>
            <p>N'hésitez pas à me contacter si vous avez des questions.</p>
            <p>À bientôt,<br>{{assigned_to}}</p>
          `,
          usage_count: 28,
          created_at: "2024-01-12",
          updated_at: "2024-01-22",
        },
      ]
      setTemplates(mockTemplates)
    } catch (error) {
      console.error("Erreur lors du chargement des templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Onboarding":
        return "bg-green-100 text-green-800"
      case "Relance":
        return "bg-yellow-100 text-yellow-800"
      case "Rendez-vous":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDuplicate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copie)`,
      usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates Email</h1>
            <p className="text-gray-600 mt-1">Gérez vos modèles d'emails personnalisés</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Template</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Templates</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{templates.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisations Totales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {templates.reduce((sum, t) => sum + t.usage_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Template le Plus Utilisé</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {templates.length > 0
                    ? templates.reduce((prev, current) => (prev.usage_count > current.usage_count ? prev : current))
                        .name
                    : "Aucun"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Catégories</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {[...new Set(templates.map((t) => t.category))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Copy className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}
                    >
                      {template.category}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Objet:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{template.subject}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Aperçu:</p>
                  <div
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: template.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{template.usage_count} utilisations</span>
                  <span>Modifié le {new Date(template.updated_at).toLocaleDateString("fr-FR")}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Aperçu</span>
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
                        setTemplates(templates.filter((t) => t.id !== template.id))
                      }
                    }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun template configuré</h3>
            <p className="text-gray-600 mb-4">Créez votre premier template d'email personnalisé</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un template
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Aperçu: {previewTemplate.name}</h3>
                <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Objet:</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{previewTemplate.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Contenu:</p>
                <div
                  className="prose max-w-none bg-gray-50 p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
