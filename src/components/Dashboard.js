import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

export default function Dashboard({ clients }) {
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.statut === "Client").length
  const prospects = clients.filter((c) => c.statut === "Prospect").length
  const inactiveClients = clients.filter((c) => c.statut === "Inactif").length

  const stats = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Clients Actifs",
      value: activeClients,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      title: "Prospects",
      value: prospects,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
    {
      title: "Clients Inactifs",
      value: inactiveClients,
      icon: UserX,
      color: "bg-red-500",
    },
  ]

  const recentClients = clients.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)).slice(0, 5)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité CRM</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Clients récents */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Clients récents</h2>
        </div>
        <div className="p-6">
          {recentClients.length > 0 ? (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {client.prenom} {client.nom}
                    </h3>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-sm text-gray-600">{client.entreprise}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.statut === "Client"
                          ? "bg-green-100 text-green-800"
                          : client.statut === "Prospect"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.statut}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(client.dateCreation).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucun client enregistré</p>
          )}
        </div>
      </div>
    </div>
  )
}
