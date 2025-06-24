"use client"

import { useState, useEffect } from "react"
import { Plus, Users, UserCog, UserCheck, Search, Edit, Eye, Trash2, Shield } from "lucide-react"
import SidebarNavigation from "@/components/SidebarNavigation"

/**
 * Page : Administration des utilisateurs
 * — liste des utilisateurs
 * — filtres (rôle, département, statut)
 * — KPI rapides
 * NB : les données sont simulées côté client pour la démo.
 */
export default function AdministrationPage() {
  /* ------------------------------------------------------------------ */
  /* State & Mock data                                                  */
  /* ------------------------------------------------------------------ */
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Mock utilisateurs
    setUsers([
      {
        id: 1,
        email: "admin@assurcrm.fr",
        first_name: "Admin",
        last_name: "Principal",
        role: "super_admin",
        department: "Direction",
        is_active: true,
        last_login: "2025-06-24T10:30:00Z",
        created_at: "2025-01-01",
      },
      {
        id: 2,
        email: "manager@assurcrm.fr",
        first_name: "Manager",
        last_name: "Commercial",
        role: "manager",
        department: "Commercial",
        is_active: true,
        last_login: "2025-06-24T09:15:00Z",
        created_at: "2025-02-10",
      },
      {
        id: 3,
        email: "agent1@assurcrm.fr",
        first_name: "Jean",
        last_name: "Dupont",
        role: "agent",
        department: "Commercial",
        is_active: true,
        last_login: "2025-06-23T14:45:00Z",
        created_at: "2025-03-18",
      },
      {
        id: 4,
        email: "agent2@assurcrm.fr",
        first_name: "Marie",
        last_name: "Martin",
        role: "agent",
        department: "Support",
        is_active: false,
        last_login: null,
        created_at: "2025-04-01",
      },
    ])
  }, [])

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const getRoleLabel = (role) =>
    ({
      super_admin: "Super-admin",
      admin: "Admin",
      manager: "Manager",
      agent: "Agent",
    })[role] ?? role

  const getRoleColor = (role) =>
    ({
      super_admin: "bg-red-100 text-red-800",
      admin: "bg-purple-100 text-purple-800",
      manager: "bg-blue-100 text-blue-800",
      agent: "bg-green-100 text-green-800",
    })[role] ?? "bg-gray-100 text-gray-800"

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString("fr-FR") : "—")

  const formatLogin = (date) =>
    date
      ? new Date(date).toLocaleDateString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Jamais"

  /* ------------------------------------------------------------------ */
  /* Filters & computed values                                          */
  /* ------------------------------------------------------------------ */
  const filteredUsers = users.filter((u) => {
    const matchSearch = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    const matchDept = departmentFilter === "all" || u.department === departmentFilter
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "inactive" && !u.is_active)

    return matchSearch && matchRole && matchDept && matchStatus
  })

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.is_active).length
  const admins = users.filter((u) => u.role === "admin" || u.role === "super_admin").length
  const agents = users.filter((u) => u.role === "agent").length

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNavigation currentPage="administration" />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration des utilisateurs</h1>
            <p className="text-gray-600">Gérer les comptes et les autorisations</p>
          </div>

          <button className="bg-gradient-purple text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouvel utilisateur
          </button>
        </header>

        <section className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <KpiCard icon={Users} label="Utilisateurs" value={totalUsers} color="bg-gradient-blue" />
            <KpiCard icon={UserCheck} label="Actifs" value={activeUsers} color="bg-gradient-green" />
            <KpiCard icon={Shield} label="Admins" value={admins} color="bg-gradient-purple" />
            <KpiCard icon={UserCog} label="Agents" value={agents} color="bg-gradient-orange" />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="super_admin">Super-admin</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="agent">Agent</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les départements</option>
              <option value="Direction">Direction</option>
              <option value="Commercial">Commercial</option>
              <option value="Support">Support</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Utilisateur</Th>
                    <Th>Rôle</Th>
                    <Th>Département</Th>
                    <Th>Dernière connexion</Th>
                    <Th>Statut</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <Td>
                        <p className="font-medium text-gray-900">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-gray-500">{u.email}</p>
                      </Td>

                      <Td>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(u.role)}`}
                        >
                          {getRoleLabel(u.role)}
                        </span>
                      </Td>

                      <Td>{u.department || "—"}</Td>
                      <Td>{formatLogin(u.last_login)}</Td>

                      <Td>
                        {u.is_active ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Inactif
                          </span>
                        )}
                      </Td>

                      <Td>
                        <div className="flex items-center space-x-2">
                          <IconBtn icon={Eye} color="text-blue-600" />
                          <IconBtn icon={Edit} color="text-green-600" />
                          <IconBtn icon={Trash2} color="text-red-600" />
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------- */
/* Small utility sub-components                                         */
/* -------------------------------------------------------------------- */

const KpiCard = ({ icon: Icon, label, value, color }) => (
  <div className="kpi-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{children}</th>
)

const Td = ({ children }) => <td className="px-6 py-4 whitespace-nowrap">{children}</td>

const IconBtn = ({ icon: Icon, color }) => (
  <button className={`${color} hover:opacity-80 p-1 transition`}>
    <Icon className="w-4 h-4" />
  </button>
)
