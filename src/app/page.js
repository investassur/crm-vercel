"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, UserCheck, TrendingUp, Phone, Mail, Plus } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

export default function DashboardPage() {
  const [prospects, setProspects] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // Charger les données du dashboard
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Simuler le chargement des données
      const mockProspects = [
        {
          id: 1,
          firstName: "Premunia",
          lastName: "Pro1",
          status: "nouveau",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          firstName: "Premunia",
          lastName: "Pro",
          status: "nouveau",
          createdAt: new Date().toISOString(),
        },
      ]

      const mockTasks = [
        {
          id: 1,
          title: "Appeler M. Dupont",
          dueDate: new Date().toISOString(),
          priority: "high",
          status: "todo",
        },
        {
          id: 2,
          title: "Envoyer devis Marie Martin",
          dueDate: new Date().toISOString(),
          priority: "medium",
          status: "todo",
        },
      ]

      const mockActivities = [
        {
          id: 1,
          type: "call",
          description: "Appel avec Jean Durand",
          time: "Il y a 2h",
        },
        {
          id: 2,
          type: "email",
          description: "Email envoyé à Marie Leblanc",
          time: "Il y a 4h",
        },
      ]

      setProspects(mockProspects)
      setTasks(mockTasks)
      setActivities(mockActivities)
    } catch (error) {
      console.error("Erreur chargement dashboard:", error)
    }
  }

  const totalProspects = prospects.length
  const nouveauxProspects = prospects.filter((p) => p.status === "nouveau").length
  const prospectsQualifies = prospects.filter((p) => p.status === "qualifié").length
  const tauxConversion = totalProspects > 0 ? ((prospectsQualifies / totalProspects) * 100).toFixed(1) : 0

  // Données pour le graphique de performance mensuelle
  const performanceData = [
    { mois: "Jan", prospects: 12 },
    { mois: "Fév", prospects: 19 },
    { mois: "Mar", prospects: 25 },
    { mois: "Avr", prospects: 18 },
    { mois: "Mai", prospects: 32 },
    { mois: "Jun", prospects: 28 },
  ]

  // Données pour la répartition par source
  const sourceData = [
    { source: "Site Web", percentage: 45, color: "bg-blue-500" },
    { source: "Référencement", percentage: 30, color: "bg-green-500" },
    { source: "Publicité", percentage: 15, color: "bg-orange-500" },
    { source: "Autres", percentage: 10, color: "bg-purple-500" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage="dashboard" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
            </div>
            <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouveau Prospect
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalProspects}</p>
                  <p className="text-sm text-green-600 mt-1">↗ +12% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{nouveauxProspects}</p>
                  <p className="text-sm text-green-600 mt-1">↗ +8% cette semaine</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualifiés</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{prospectsQualifies}</p>
                  <p className="text-sm text-yellow-600 mt-1">— Stable ce mois</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{tauxConversion}%</p>
                  <p className="text-sm text-green-600 mt-1">↗ +2.3% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Mensuelle */}
            <div className="kpi-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Mensuelle</h2>
              <div className="flex items-end space-x-2 h-48">
                {performanceData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-purple rounded-t-lg"
                      style={{ height: `${(data.prospects / 35) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2">{data.mois}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition par Source */}
            <div className="kpi-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Source</h2>
              <div className="space-y-4">
                {sourceData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${source.color}`} />
                      <span className="text-sm text-gray-700">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${source.color}`}
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prospects Récents */}
            <div className="kpi-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Prospects Récents</h2>
              <div className="space-y-4">
                {prospects.slice(0, 3).map((prospect) => (
                  <div key={prospect.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center text-white font-medium">
                      {prospect.firstName.charAt(0)}
                      {prospect.lastName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {prospect.firstName} {prospect.lastName}
                      </p>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {prospect.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tâches à Faire */}
            <div className="kpi-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tâches à Faire</h2>
              <div className="space-y-4">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">Aujourd'hui</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activités Récentes */}
            <div className="kpi-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === "call" ? (
                        <Phone className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Mail className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
