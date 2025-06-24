"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, CheckSquare, Clock, AlertTriangle, Calendar } from "lucide-react"

export default function TachesPage() {
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Appeler M. Dupont",
        description: "Rappel pour présentation produits seniors",
        due_date: "2025-06-25",
        priority: "high",
        status: "todo",
        prospect_name: "Jean Dupont",
        assigned_user: "Agent 1",
      },
      {
        id: 2,
        title: "Envoyer devis Marie Martin",
        description: "Préparer devis personnalisé complémentaire santé",
        due_date: "2025-06-26",
        priority: "medium",
        status: "todo",
        prospect_name: "Marie Martin",
        assigned_user: "Agent 1",
      },
      {
        id: 3,
        title: "RDV Sophie Bernard",
        description: "Rendez-vous signature contrat obsèques",
        due_date: "2025-06-27",
        priority: "high",
        status: "in_progress",
        prospect_name: "Sophie Bernard",
        assigned_user: "Agent 2",
      },
      {
        id: 4,
        title: "Suivi Pierre Durand",
        description: "Appel de suivi satisfaction client",
        due_date: "2025-07-01",
        priority: "low",
        status: "todo",
        prospect_name: "Pierre Durand",
        assigned_user: "Agent 2",
      },
      {
        id: 5,
        title: "Relance Françoise Petit",
        description: "Relance téléphonique suite demande info",
        due_date: "2025-06-23",
        priority: "medium",
        status: "todo",
        prospect_name: "Françoise Petit",
        assigned_user: "Agent 1",
      },
    ]
    setTasks(mockTasks)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.prospect_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  const totalTasks = tasks.length
  const todoTasks = tasks.filter((t) => t.status === "todo").length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
  const overdueTasks = tasks.filter((t) => isOverdue(t.due_date) && t.status !== "completed").length

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Tâches</h1>
            <p className="text-gray-600 mt-1">Organisez et suivez vos tâches quotidiennes</p>
          </div>
          <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle Tâche
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tâches</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À faire</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{todoTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{inProgressTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En retard</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{overdueTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
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
                placeholder="Rechercher une tâche..."
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
              <option value="todo">À faire</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        {/* Tableau des tâches */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TÂCHE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PROSPECT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ÉCHÉANCE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRIORITÉ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASSIGNÉ À
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.prospect_name}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(task.due_date).toLocaleDateString("fr-FR")}</div>
                      {isOverdue(task.due_date) && task.status !== "completed" && (
                        <div className="text-xs text-red-600 font-medium">En retard</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.assigned_user}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
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
    </>
  )
}
