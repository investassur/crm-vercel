"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Mail, MessageSquare, Phone, Send, BarChart3 } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

export default function CampagnesPage() {
  const [campaigns, setCampaigns] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    campaignType: "email",
    status: "brouillon",
    startDate: "",
    endDate: "",
    budget: "",
    targetAudience: {},
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      // Simuler le chargement des campagnes
      const mockCampaigns = [
        {
          id: 1,
          name: "Campagne Santé Senior Printemps 2024",
          description: "Promotion complémentaire santé pour seniors 65+",
          campaign_type: "email",
          status: "active",
          start_date: "2024-03-01",
          end_date: "2024-05-31",
          budget: 5000,
          sent_count: 1250,
          opened_count: 875,
          clicked_count: 156,
          converted_count: 23,
          created_at: "2024-02-15",
        },
        {
          id: 2,
          name: "Obsèques Été 2024",
          description: "Campagne assurance obsèques période estivale",
          campaign_type: "sms",
          status: "terminee",
          start_date: "2024-06-01",
          end_date: "2024-08-31",
          budget: 3000,
          sent_count: 800,
          opened_count: 720,
          clicked_count: 89,
          converted_count: 12,
          created_at: "2024-05-20",
        },
        {
          id: 3,
          name: "Dépendance Automne 2024",
          description: "Sensibilisation assurance dépendance",
          campaign_type: "phone",
          status: "active",
          start_date: "2024-09-01",
          end_date: "2024-11-30",
          budget: 8000,
          sent_count: 450,
          opened_count: 0,
          clicked_count: 0,
          converted_count: 18,
          created_at: "2024-08-25",
        },
      ]
      setCampaigns(mockCampaigns)
    } catch (error) {
      console.error("Erreur chargement campagnes:", error)
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesType = typeFilter === "all" || campaign.campaign_type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "brouillon":
        return "bg-gray-100 text-gray-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "terminee":
        return "bg-blue-100 text-blue-800"
      case "suspendue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <MessageSquare className="w-4 h-4" />
      case "phone":
        return <Phone className="w-4 h-4" />
      default:
        return <Send className="w-4 h-4" />
    }
  }

  const calculateROI = (campaign) => {
    if (!campaign.budget || campaign.budget === 0) return 0
    const revenue = campaign.converted_count * 1500 // Estimation moyenne par conversion
    return (((revenue - campaign.budget) / campaign.budget) * 100).toFixed(1)
  }

  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length
  const completedCampaigns = campaigns.filter((c) => c.status === "terminee").length
  const draftCampaigns = campaigns.filter((c) => c.status === "brouillon").length

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage="campagnes" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Campagnes</h1>
              <p className="text-gray-600 mt-1">Créez et gérez vos campagnes marketing</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Campagne
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Campagnes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actives</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{activeCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-green rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{completedCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="kpi-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Brouillons</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{draftCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
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
                  placeholder="Rechercher une campagne..."
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
                <option value="brouillon">Brouillon</option>
                <option value="active">Active</option>
                <option value="terminee">Terminée</option>
                <option value="suspendue">Suspendue</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="phone">Téléphone</option>
                <option value="courrier">Courrier</option>
              </select>
            </div>
          </div>

          {/* Tableau des campagnes */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CAMPAGNE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TYPE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BUDGET
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PERFORMANCE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(campaign.campaign_type)}
                          <span className="text-sm text-gray-900 capitalize">{campaign.campaign_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{campaign.budget?.toLocaleString()}€</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Envoyés: {campaign.sent_count}</div>
                          <div>Convertis: {campaign.converted_count}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${Number.parseFloat(calculateROI(campaign)) >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {calculateROI(campaign)}%
                        </span>
                      </td>
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
      </main>
    </div>
  )
}
