"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Zap, Play, Pause, BarChart3, Settings } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [triggerFilter, setTriggerFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    triggerType: "prospect_created",
    status: "active",
    conditions: {},
    actions: [],
  })

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const mockWorkflows = [
        {
          id: 1,
          name: "Accueil Nouveau Prospect",
          description: "Workflow automatique pour nouveaux prospects",
          trigger_type: "prospect_created",
          status: "active",
          execution_count: 156,
          success_count: 142,
          created_at: "2024-01-15",
        },
        {
          id: 2,
          name: "Relance Prospect Inactif",
          description: "Relance automatique prospects sans activité",
          trigger_type: "prospect_inactive",
          status: "active",
          execution_count: 89,
          success_count: 76,
          created_at: "2024-02-01",
        },
        {
          id: 3,
          name: "Suivi Post-Signature",
          description: "Actions automatiques après signature contrat",
          trigger_type: "contract_signed",
          status: "inactive",
          execution_count: 23,
          success_count: 23,
          created_at: "2024-02-15",
        },
      ]
      setWorkflows(mockWorkflows)
    } catch (error) {
      console.error("Erreur chargement workflows:", error)
    }
  }

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter
    const matchesTrigger = triggerFilter === "all" || workflow.trigger_type === triggerFilter
    return matchesSearch && matchesStatus && matchesTrigger
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTriggerLabel = (trigger) => {
    switch (trigger) {
      case "prospect_created":
        return "Nouveau prospect"
      case "prospect_inactive":
        return "Prospect inactif"
      case "contract_signed":
        return "Contrat signé"
      case "date_anniversary":
        return "Date anniversaire"
      default:
        return trigger
    }
  }

  const calculateSuccessRate = (workflow) => {
    if (workflow.execution_count === 0) return 0
    return ((workflow.success_count / workflow.execution_count) * 100).toFixed(1)
  }

  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w) => w.status === "active").length
  const inactiveWorkflows = workflows.filter((w) => w.status === "inactive").length
  const totalExecutions = workflows.reduce((sum, w) => sum + w.execution_count, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage="automatisation" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflows & Automatisation</h1>
              <p className="text-gray-600 mt-1">Automatisez vos processus métier</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau Workflow
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalWorkflows}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeWorkflows}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{inactiveWorkflows}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <Pause className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Exécutions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalExecutions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un workflow..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="draft">Brouillon</option>
              </select>

              <select
                value={triggerFilter}
                onChange={(e) => setTriggerFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les déclencheurs</option>
                <option value="prospect_created">Nouveau prospect</option>
                <option value="prospect_inactive">Prospect inactif</option>
                <option value="contract_signed">Contrat signé</option>
                <option value="date_anniversary">Date anniversaire</option>
              </select>
            </div>
          </div>

          {/* Liste des workflows */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WORKFLOW
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DÉCLENCHEUR
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EXÉCUTIONS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TAUX DE SUCCÈS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWorkflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                          <div className="text-sm text-gray-500">{workflow.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getTriggerLabel(workflow.trigger_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}
                        >
                          {workflow.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{workflow.execution_count}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${calculateSuccessRate(workflow)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{calculateSuccessRate(workflow)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowBuilder(true)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Éditeur Visuel */}
        {showBuilder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Éditeur Visuel de Workflow</h2>
                <button onClick={() => setShowBuilder(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Éditeur Visuel</h3>
                  <p className="text-gray-600 mb-6">
                    L'éditeur visuel de workflow sera disponible dans une prochaine version.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-medium text-gray-900 mb-3">Fonctionnalités prévues :</h4>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      <li>• Interface glisser-déposer</li>
                      <li>• Conditions visuelles</li>
                      <li>• Actions configurables</li>
                      <li>• Test en temps réel</li>
                      <li>• Historique des exécutions</li>
                    </ul>
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
