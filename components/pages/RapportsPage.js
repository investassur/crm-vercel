"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, FileText, Download } from "lucide-react"

export default function RapportsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("30days")
  const [dashboardData, setDashboardData] = useState({})
  const [aiInsights, setAiInsights] = useState("")
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [dateRange])

  const loadDashboardData = async () => {
    const mockData = {
      prospects: {
        total: 156,
        nouveaux: 23,
        qualifies: 45,
        convertis: 12,
        evolution: [
          { mois: "Jan", count: 12 },
          { mois: "Fév", count: 19 },
          { mois: "Mar", count: 25 },
          { mois: "Avr", count: 18 },
          { mois: "Mai", count: 32 },
          { mois: "Jun", count: 28 },
        ],
      },
      contrats: {
        total: 89,
        actifs: 76,
        ca_total: 245000,
        commission_totale: 36750,
        evolution: [
          { mois: "Jan", ca: 35000 },
          { mois: "Fév", ca: 42000 },
          { mois: "Mar", ca: 38000 },
          { mois: "Avr", ca: 45000 },
          { mois: "Mai", ca: 52000 },
          { mois: "Jun", ca: 48000 },
        ],
      },
      sources: [
        { source: "Site Web", count: 45, percentage: 35 },
        { source: "Publicité", count: 38, percentage: 30 },
        { source: "Recommandation", count: 25, percentage: 20 },
        { source: "Autres", count: 19, percentage: 15 },
      ],
    }
    setDashboardData(mockData)
  }

  const generateAIInsights = async () => {
    setLoadingInsights(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockInsights = `
## 📊 Analyse des Performances - Période ${dateRange}

### 🎯 Points Clés
- **Taux de conversion**: 7.7% (12 convertis sur 156 prospects)
- **CA moyen par contrat**: 2,753€
- **Source la plus performante**: Site Web (35% des prospects)

### 📈 Tendances Observées
1. **Croissance prospects**: +15% vs période précédente
2. **Pic d'activité**: Mai avec 32 nouveaux prospects
3. **Tranche d'âge dominante**: 65-70 ans (29% des prospects)

### 💡 Recommandations
1. **Optimiser le site web**: Source principale, investir dans le SEO
2. **Cibler 65-70 ans**: Segment le plus réceptif
3. **Améliorer conversion**: Taux actuel de 7.7% peut être optimisé

### 🔮 Prédictions
- **Objectif Q3**: 180 prospects (+15%)
- **CA prévisionnel**: 280K€ (+14%)
- **Focus recommandé**: Assurance dépendance (marché en croissance)
      `

      setAiInsights(mockInsights)
    } catch (error) {
      console.error("Erreur génération insights:", error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const exportReport = (format) => {
    alert(`Export ${format} en cours...`)
  }

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "prospects", label: "Prospects", icon: Users },
    { id: "contrats", label: "Contrats", icon: FileText },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "ai-insights", label: "Insights IA", icon: BarChart3 },
  ]

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports & Analytics</h1>
            <p className="text-gray-600 mt-1">Analysez vos performances et tendances</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="1year">1 an</option>
            </select>
            <button
              onClick={() => exportReport("PDF")}
              className="bg-gradient-purple text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Onglets */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Vue d'ensemble */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* KPIs principaux */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="kpi-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.prospects?.total || 0}</p>
                        <p className="text-sm text-green-600 mt-1">+15% vs période précédente</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contrats Actifs</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.contrats?.actifs || 0}</p>
                        <p className="text-sm text-green-600 mt-1">+8% vs période précédente</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">CA Total</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {(dashboardData.contrats?.ca_total || 0).toLocaleString()}€
                        </p>
                        <p className="text-sm text-green-600 mt-1">+12% vs période précédente</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="kpi-card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Commissions</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {(dashboardData.contrats?.commission_totale || 0).toLocaleString()}€
                        </p>
                        <p className="text-sm text-green-600 mt-1">+10% vs période précédente</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphiques */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Évolution prospects */}
                  <div className="kpi-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Évolution des Prospects</h3>
                    <div className="flex items-end space-x-2 h-48">
                      {dashboardData.prospects?.evolution?.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-blue rounded-t-lg"
                            style={{ height: `${(data.count / 35) * 100}%` }}
                          />
                          <span className="text-xs text-gray-600 mt-2">{data.mois}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Répartition par source */}
                  <div className="kpi-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par Source</h3>
                    <div className="space-y-4">
                      {dashboardData.sources?.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                    ? "bg-green-500"
                                    : index === 2
                                      ? "bg-orange-500"
                                      : "bg-purple-500"
                              }`}
                            />
                            <span className="text-sm text-gray-700">{source.source}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  index === 0
                                    ? "bg-blue-500"
                                    : index === 1
                                      ? "bg-green-500"
                                      : index === 2
                                        ? "bg-orange-500"
                                        : "bg-purple-500"
                                }`}
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
              </div>
            )}

            {/* Insights IA */}
            {activeTab === "ai-insights" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Analyse IA de vos Performances</h3>
                  <button
                    onClick={generateAIInsights}
                    disabled={loadingInsights}
                    className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <BarChart3 className="w-5 h-5" />
                    {loadingInsights ? "Génération..." : "Générer Insights"}
                  </button>
                </div>

                {loadingInsights && (
                  <div className="kpi-card p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">L'IA analyse vos données...</p>
                  </div>
                )}

                {aiInsights && !loadingInsights && (
                  <div className="kpi-card p-6">
                    <div className="prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: aiInsights
                            .replace(/\n/g, "<br>")
                            .replace(/###/g, "<h3>")
                            .replace(/##/g, "<h2>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    </div>
                  </div>
                )}

                {!aiInsights && !loadingInsights && (
                  <div className="kpi-card p-8 text-center">
                    <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Insights IA</h3>
                    <p className="text-gray-600 mb-6">
                      Obtenez une analyse intelligente de vos performances avec des recommandations personnalisées.
                    </p>
                    <button
                      onClick={generateAIInsights}
                      className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg"
                    >
                      Commencer l'analyse
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Autres onglets - contenu simplifié */}
            {activeTab !== "overview" && activeTab !== "ai-insights" && (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rapport {tabs.find((t) => t.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600">Contenu détaillé disponible dans la version complète.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
