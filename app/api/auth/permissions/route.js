import { getUserFromToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await getUserFromToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    // Permissions par défaut selon le rôle
    let permissions = {}

    switch (user.role) {
      case "super_admin":
        permissions = { all: true }
        break
      case "admin":
        permissions = {
          prospects: { read: true, write: true, delete: true },
          contracts: { read: true, write: true, delete: true },
          tasks: { read: true, write: true, delete: true },
          campaigns: { read: true, write: true, delete: true },
          users: { read: true, write: true, delete: false },
          reports: { read: true, write: false, delete: false },
        }
        break
      case "manager":
        permissions = {
          prospects: { read: true, write: true, delete: false },
          contracts: { read: true, write: true, delete: false },
          tasks: { read: true, write: true, delete: false },
          campaigns: { read: true, write: true, delete: false },
          reports: { read: true, write: false, delete: false },
        }
        break
      case "agent":
        permissions = {
          prospects: { read: true, write: true, delete: false },
          contracts: { read: true, write: false, delete: false },
          tasks: { read: true, write: true, delete: false },
          campaigns: { read: true, write: false, delete: false },
        }
        break
      default:
        permissions = {}
    }

    // Fusionner avec les permissions personnalisées si elles existent
    if (user.permissions && typeof user.permissions === "object") {
      permissions = { ...permissions, ...user.permissions }
    }

    return NextResponse.json({
      success: true,
      permissions,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erreur permissions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
