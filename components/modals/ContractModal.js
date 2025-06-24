"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { api } from "@/lib/api"

export default function ContractModal({ isOpen, onClose, contract = null, onSave }) {
  const [formData, setFormData] = useState({
    prospectId: "",
    contractNumber: "",
    productType: "",
    premiumAmount: "",
    commissionRate: "",
    status: "brouillon",
    startDate: "",
    endDate: "",
    notes: "",
    ville: "",
    dateSignature: "",
    dateEffet: "",
    finContrat: "",
    compagnie: "",
    cotisationMensuelle: "",
    cotisationAnnuelle: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (contract) {
      setFormData({
        prospectId: contract.prospect_id || "",
        contractNumber: contract.contract_number || "",
        productType: contract.product_type || "",
        premiumAmount: contract.premium_amount || "",
        commissionRate: contract.commission_rate || "",
        status: contract.status || "brouillon",
        startDate: contract.start_date || "",
        endDate: contract.end_date || "",
        notes: contract.notes || "",
        ville: contract.ville || "",
        dateSignature: contract.date_signature || "",
        dateEffet: contract.date_effet || "",
        finContrat: contract.fin_contrat || "",
        compagnie: contract.compagnie || "",
        cotisationMensuelle: contract.cotisation_mensuelle || "",
        cotisationAnnuelle: contract.cotisation_annuelle || "",
      })
    } else {
      setFormData({
        prospectId: "",
        contractNumber: `CNT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        productType: "",
        premiumAmount: "",
        commissionRate: "",
        status: "brouillon",
        startDate: "",
        endDate: "",
        notes: "",
        ville: "",
        dateSignature: "",
        dateEffet: "",
        finContrat: "",
        compagnie: "",
        cotisationMensuelle: "",
        cotisationAnnuelle: "",
      })
    }
  }, [contract])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let result
      if (contract) {
        result = await api.contracts.update(contract.id, formData)
      } else {
        result = await api.contracts.create(formData)
      }

      if (result.success) {
        onSave()
        onClose()
      } else {
        setError(result.error || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{contract ? "Modifier le contrat" : "Nouveau contrat"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de contrat *</label>
              <input
                type="text"
                required
                value={formData.contractNumber}
                onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Prospect *</label>
              <input
                type="number"
                required
                value={formData.prospectId}
                onChange={(e) => setFormData({ ...formData, prospectId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ID du prospect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de produit *</label>
              <select
                required
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner un produit</option>
                <option value="Assurance Santé Senior">Assurance Santé Senior</option>
                <option value="Assurance Obsèques">Assurance Obsèques</option>
                <option value="Assurance Dépendance">Assurance Dépendance</option>
                <option value="Complémentaire Santé">Complémentaire Santé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compagnie</label>
              <select
                value={formData.compagnie}
                onChange={(e) => setFormData({ ...formData, compagnie: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Sélectionner une compagnie</option>
                <option value="Malakoff Humanis">Malakoff Humanis</option>
                <option value="Allianz">Allianz</option>
                <option value="AXA">AXA</option>
                <option value="Generali">Generali</option>
                <option value="Groupama">Groupama</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prime annuelle (€) *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.premiumAmount}
                onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taux de commission (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cotisation mensuelle (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cotisationMensuelle}
                onChange={(e) => setFormData({ ...formData, cotisationMensuelle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="brouillon">Brouillon</option>
                <option value="actif">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="expire">Expiré</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de signature</label>
              <input
                type="date"
                value={formData.dateSignature}
                onChange={(e) => setFormData({ ...formData, dateSignature: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-purple text-white rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : contract ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
