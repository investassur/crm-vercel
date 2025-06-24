"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2, FileText, DollarSign, Calendar, Building } from "lucide-react"

export default function ContratsPage() {
  const [contracts, setContracts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    const mockContracts = [
      {
        id: 1,
        contract_number: "CNT-2024-001",
        prospect_name: "Claude Moreau",
        product_type: "Assurance Santé Senior",
        premium_amount: 2400,
        commission_amount: 360,
        status: "actif",
        compagnie: "Malakoff Humanis",
        start_date: "2024-01-15",
        end_date: "2024-12-31",
      },
      {
        id: 2,
        contract_number: "CNT-2024-002",
        prospect_name: "Sophie Bernard",
        product_type: "Assurance Obsèques",
        premium_amount: 1200,
        commission_amount: 240,
        status: "en_cours",
        compagnie: "Allianz",
        start_date: "2024-06-01",
        end_date: "2025-05-31",
      },
      {
        id: 3,
        contract_number: "CNT-2024-003",
        prospect_name: "Pierre Durand",
        product_type: "Assurance Dépendance",
        premium_amount: 3600,
        commission_amount: 648,
        status: "actif",
        compagnie: "AXA",
        start_date: "2024-03-01",
        end_date: "2025-02-28",
      },
    ]
    setContracts(mockContracts)
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.prospect_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.product_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesCompany = companyFilter === "all" || contract.compagnie === companyFilter

    return matchesSearch && matchesStatus && matchesCompany
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800"
      case "en_cours":
        return "bg-yellow-100 text-yellow-800"
      case "suspendu":
        return "bg-orange-100 text-orange-800"
      case "expire":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalContracts = contracts.length
  const activeContracts = contracts.filter((c) => c.status === "actif").length
  const totalCA = contracts.reduce((sum, c) => sum + c.premium_amount, 0)
  const totalCommissions = contracts.reduce((sum, c) => sum + c.commission_amount, 0)

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Contrats</h1>
            <p className="text-gray-600 mt-1">Suivez vos contrats et commissions</p>
          </div>
          <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau Contrat
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="kpi-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contrats</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalContracts}</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{activeContracts}</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCA.toLocaleString()}€</p>
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
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCommissions.toLocaleString()}€</p>
              </div>
              <div className="w-12 h-12 bg-gradient-purple rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
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
                placeholder="Rechercher un contrat..."
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
              <option value="actif">Actif</option>
              <option value="en_cours">En cours</option>
              <option value="suspendu">Suspendu</option>
              <option value="expire">Expiré</option>
            </select>

            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Toutes les compagnies</option>
              <option value="Malakoff Humanis">Malakoff Humanis</option>
              <option value="Allianz">Allianz</option>
              <option value="AXA">AXA</option>
            </select>
          </div>
        </div>

        {/* Tableau des contrats */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CONTRAT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CLIENT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRODUIT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRIME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    COMMISSION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contract.contract_number}</div>
                        <div className="text-sm text-gray-500">{contract.compagnie}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contract.prospect_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contract.product_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contract.premium_amount.toLocaleString()}€</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{contract.commission_amount.toLocaleString()}€</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}
                      >
                        {contract.status}
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
    </>
  )
}
