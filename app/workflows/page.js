"use client"

import { useState, useEffect } from "react"
import { Plus, Play, Pause, Edit, Trash2, Users, Mail, Calendar, Target, ArrowRight } from "lucide-react"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    setLoading(true)
    try {
      // Simuler des données de workflows
      const mockWorkflows = [
        {
          id: 1,
          name: "Suivi Nouveau Prospect",
          description: "Workflow automatique pour les nouveaux prospects",
          status: "active",
          triggers: ["Nouveau prospect créé"],
          actions: ["Envoyer email de bienvenue", "Assigner à commercial", "Créer tâche de suivi"],
          prospects_count: 45,
          conversion_rate: 23.5,
          created_at: "2024-01-15",
        },
        {
          id: 2,
          name: "Relance Prospects Inactifs",
          description: "Relance automatique des prospects sans activité",
          status: "active",
          triggers: ["Pas d'activité depuis 7 jours"],
          actions: ["Envoyer email de relance", "Créer tâche de rappel"],
          prospects_count: 28,
          conversion_rate: 15.2,
          created_at: "2024-01-10",
        },
        {
          id: 3,
          name: "Onboarding Client",
          description: "Processus d'accueil des nouveaux clients",
          status: "draft",
          triggers: ["Contrat signé"],
          actions: ["Envoyer kit de bienvenue", "Planifier rendez-vous", "Créer dossier client"],
          prospects_count: 0,
          conversion_rate: 0,
          created_at: "2024-01-20",
        },
      ]
      setWorkflows(mockWorkflows)
    } catch (error) {
      console.error("Erreur lors du chargement des workflows:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusToggle = (workflowId) => {
    setWorkflows(
      workflows.map((workflow) =>
        workflow.id === workflowId
          ? { ...workflow, status: workflow.status === "active" ? "paused" : "active" }
          : workflow,
      ),
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Actif"
      case "paused":
        return "En pause"
      case "draft":
        return "Brouillon"
      default:
        return "Inconnu"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Workflows d'Automatisation</h1>
            <p className="text-gray-600 mt-1">Automatisez vos processus de vente et de suivi</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Workflow</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{workflows.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workflows Actifs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {workflows.filter((w) => w.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prospects Traités</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {workflows.reduce((sum, w) => sum + w.prospects_count, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux Conversion Moyen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {workflows.length > 0
                    ? (workflows.reduce((sum, w) => sum + w.conversion_rate, 0) / workflows.length).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mes Workflows</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}
                      >
                        {getStatusText(workflow.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{workflow.description}</p>

                    {/* Triggers */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Déclencheurs:</h4>
                      <div className="flex flex-wrap gap-2">
                        {workflow.triggers.map((trigger, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Actions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {workflow.actions.map((action, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center"
                          >
                            <Mail className="w-3 h-3 mr-1" />
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>{workflow.prospects_count} prospects traités</span>
                      <span>{workflow.conversion_rate}% de conversion</span>
                      <span>Créé le {new Date(workflow.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusToggle(workflow.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        workflow.status === "active"
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title={workflow.status === "active" ? "Mettre en pause" : "Activer"}
                    >
                      {workflow.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setSelectedWorkflow(workflow)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer ce workflow ?")) {
                          setWorkflows(workflows.filter((w) => w.id !== workflow.id))
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
        </div>

        {workflows.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun workflow configuré</h3>
            <p className="text-gray-600 mb-4">Créez votre premier workflow pour automatiser vos processus</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer un workflow
            </button>
          </div>
        )}
      </div>
    </>
  )
}
