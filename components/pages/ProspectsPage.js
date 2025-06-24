"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, Users, UserCheck, Star, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"
import ProspectModal from "@/components/modals/ProspectModal"

export default function ProspectsPage() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })

  useEffect(() => {
    loadProspects()
  }, [searchTerm, statusFilter, sourceFilter, pagination.page])

  const loadProspects = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        source: sourceFilter !== "all" ? sourceFilter : undefined,
      }

      const result = await api.prospects.getAll(params)
      if (result.success) {
        setProspects(result.data)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des prospects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      try {
        const result = await api.prospects.delete(id)
        if (result.success) {
          loadProspects()
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const handleEdit = (prospect) => {
    setSelectedProspect(prospect)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedProspect(null)
  }

  const handleModalSave = () => {
    loadProspects()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "nouveau":
        return "bg-blue-100 text-blue-800"
      case "qualifié":
        return "bg-yellow-100 text-yellow-800"
      case "en_negociation":
        return "bg-orange-100 text-orange-800"
      case "converti":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "nouveau":
        return "Nouveau"
      case "qualifié":
        return "Qualifié"
      case "en_negociation":
        return "En négociation"
      case "converti":
        return "Converti"
      default:
        return status
    }
  }

  const getSourceLabel = (source) => {
    switch (source) {
      case "site_web":
        return "Site Web"
      case "publicité":
        return "Publicité"
      case "recommandation":
        return "Recommandation"
      default:
        return source || "-"
    }
  }

  const totalProspects = pagination.total
  const nouveauxProspects = prospects.filter((p) => p.status === "nouveau").length
  const prospectsQualifies = prospects.filter((p) => p.status === "qualifié").length
  const prospectsConvertis = prospects.filter((p) => p.status === "converti").length

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Prospects</h1>
            <p className="text-gray-600 mt-1">Gérez vos prospects et suivez leur progression</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2"
          >
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
              </div>
              <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convertis</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{prospectsConvertis}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
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
                placeholder="Rechercher un prospect..."
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
              <option value="nouveau">Nouveau</option>
              <option value="qualifié">Qualifié</option>
              <option value="en_negociation">En négociation</option>
              <option value="converti">Converti</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Toutes les sources</option>
              <option value="site_web">Site Web</option>
              <option value="publicité">Publicité</option>
              <option value="recommandation">Recommandation</option>
            </select>
          </div>
        </div>

        {/* Tableau des prospects */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PROSPECT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CONTACT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ÂGE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SOURCE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DATE CRÉATION
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prospects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-purple rounded-full flex items-center justify-center text-white font-medium mr-3">
                            {prospect.first_name?.charAt(0) || ""}
                            {prospect.last_name?.charAt(0) || ""}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prospect.first_name} {prospect.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{prospect.email || "-"}</div>
                        <div className="text-sm text-gray-500">{prospect.phone || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{prospect.age || "-"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(prospect.status)}`}
                        >
                          {getStatusLabel(prospect.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getSourceLabel(prospect.source)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {prospect.created_at ? new Date(prospect.created_at).toLocaleDateString("fr-FR") : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(prospect)}
                            className="text-green-600 hover:text-green-900 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prospect.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProspectModal
        isOpen={showModal}
        onClose={handleModalClose}
        prospect={selectedProspect}
        onSave={handleModalSave}
      />
    </>
  )
}
