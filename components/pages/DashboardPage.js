"use client"

import { useState, useEffect } from "react"
import {
  Users,
  FileText,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Mail,
  AlertCircle,
  Database,
  Settings,
} from "lucide-react"
import { api } from "@/lib/api"

export default function DashboardPage() {
  const emptyStats = {
    prospects: {},
    contracts: {},
    tasks: {},
    campaigns: {},
  }
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [warning, setWarning] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    setWarning(null)

    try {
      console.log("Chargement des données du dashboard...")

      // Charger les statistiques du dashboard
      const dashboardResult = await api.dashboard.getStats()
      console.log("Résultat dashboard:", dashboardResult)

      if (dashboardResult.success) {
        if (dashboardResult.data) {
          setStats({ ...emptyStats, ...dashboardResult.data })
        }
        if (dashboardResult.message) {
          setWarning(dashboardResult.message)
        }
      } else {
        console.error("Erreur dans la réponse dashboard:", dashboardResult)
        setError(dashboardResult.error || "Erreur lors du chargement des statistiques")
      }

      // Charger les activités récentes (prospects récents) - seulement si pas d'erreur
      if (dashboardResult.success) {
        try {
          const prospectsResult = await api.prospects.getAll({ limit: 5 })
          console.log("Résultat prospects:", prospectsResult)

          if (prospectsResult.success && prospectsResult.data && Array.isArray(prospectsResult.data)) {
            const activities = prospectsResult.data.map((prospect) => ({
              id: prospect.id || Math.random(),
              type: "prospect",
              title: `Nouveau prospect: ${prospect.first_name || "N/A"} ${prospect.last_name || "N/A"}`,
              time: prospect.created_at || new Date().toISOString(),
              status: prospect.status || "nouveau",
            }))
            setRecentActivities(activities)
          } else {
            console.log("Pas de données prospects ou données non valides")
            setRecentActivities([])
          }
        } catch (activityError) {
          console.error("Erreur lors du chargement des activités:", activityError)
          setRecentActivities([])
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error)
      setError(`Erreur de connexion: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue"
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Date invalide"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité CRM</p>
        </div>
      </div>

      <div className="p-6">
        {/* Warning message */}
        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Configuration requise</h3>
                <p className="text-sm text-yellow-700 mt-1">{warning}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-yellow-600">Configuration</span>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Instructions */}
        {warning && warning.includes("DATABASE_URL") && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <Settings className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions de configuration</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Ajoutez l'intégration Neon à votre projet</li>
                  <li>Configurez la variable DATABASE_URL</li>
                  <li>Exécutez le script de création de base de données</li>
                  <li>Rechargez cette page</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* KPIs Prospects */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prospects</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prospects?.total_prospects ?? 0}</p>
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
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prospects?.nouveaux ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualifiés</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prospects?.qualifies ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Convertis</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prospects?.convertis ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Contrats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contrats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contrats</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.contracts?.total_contrats ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contrats Actifs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.contracts?.actifs ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CA Total</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.contracts?.ca_total)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Commissions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.contracts?.commission_totale)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs Tâches et Campagnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tâches</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tasks?.total_taches ?? 0}</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">À faire</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tasks?.a_faire ?? 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tasks?.en_cours ?? 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En retard</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.tasks?.en_retard ?? 0}</p>
                  </div>
                  <Target className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campagnes</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.campaigns?.total_campagnes ?? 0}</p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actives</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.campaigns?.actives ?? 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Terminées</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.campaigns?.terminees ?? 0}</p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="kpi-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Brouillons</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.campaigns?.brouillons ?? 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h2>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.time)}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      (activity.status ?? "") === "nouveau"
                        ? "bg-blue-100 text-blue-800"
                        : (activity.status ?? "") === "qualifié"
                          ? "bg-yellow-100 text-yellow-800"
                          : (activity.status ?? "") === "converti"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune activité récente</p>
                <p className="text-sm text-gray-400 mt-1">Configurez votre base de données pour voir les activités</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
