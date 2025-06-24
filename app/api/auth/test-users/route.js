import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    // Récupérer tous les utilisateurs de test
    const users = await sql`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        department,
        is_active,
        created_at
      FROM users 
      WHERE email LIKE '%@premunia.com' OR email LIKE '%@premunia.fr'
      ORDER BY role DESC, last_name
    `

    return NextResponse.json({
      success: true,
      data: {
        users,
        count: users.length,
        credentials: {
          message: "Mot de passe par défaut pour tous les utilisateurs : premunia2024",
          roles: {
            super_admin: "Accès complet à toutes les fonctionnalités",
            admin: "Accès administratif avec restrictions",
            manager: "Gestion des prospects et contrats",
            agent: "Accès limité selon le département",
          },
        },
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs de test:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des utilisateurs de test",
      },
      { status: 500 },
    )
  }
}
