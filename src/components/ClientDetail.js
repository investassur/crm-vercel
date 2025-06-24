"use client"

import { useState } from "react"
import { ArrowLeft, Edit, Save, X, Trash2 } from "lucide-react"

export default function ClientDetail({ client, onUpdateClient, onDeleteClient, onBack }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    email: client?.email || "",
    telephone: client?.telephone || "",
    entreprise: client?.entreprise || "",
    statut: client?.statut || "Prospect",
    notes: client?.notes || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onUpdateClient(client.id, formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      entreprise: client.entreprise,
      statut: client.statut,
      notes: client.notes,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      onDeleteClient(client.id)
    }
  }

  if (!client) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Client non trouvé</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.prenom} {client.nom}
            </h1>
            <p className="text-gray-600 mt-2">Détails du client</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              {isEditing ? (
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{client.prenom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{client.nom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{client.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{client.telephone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
              {isEditing ? (
                <input
                  type="text"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{client.entreprise}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              {isEditing ? (
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Client">Client</option>
                  <option value="Inactif">Inactif</option>
                </select>
              ) : (
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    client.statut === "Client"
                      ? "bg-green-100 text-green-800"
                      : client.statut === "Prospect"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {client.statut}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            {isEditing ? (
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notes sur le client..."
              />
            ) : (
              <p className="text-gray-900 py-2 min-h-[100px] bg-gray-50 rounded-lg p-3">
                {client.notes || "Aucune note"}
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Client créé le {new Date(client.dateCreation).toLocaleDateString("fr-FR")} à{" "}
              {new Date(client.dateCreation).toLocaleTimeString("fr-FR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
