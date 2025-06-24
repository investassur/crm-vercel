import { sql } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

// GET - Récupérer un utilisateur par ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const users = await sql`
      SELECT 
        id, email, first_name, last_name, role, department,
        is_active, last_login, created_at, updated_at, pays, code_postal, adresse
      FROM users 
      WHERE id = ${id}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: users[0],
    })
  } catch (error) {
    console.error("Erreur GET utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updateData = {
      email: data.email || sql`email`,
      first_name: data.firstName || sql`first_name`,
      last_name: data.lastName || sql`last_name`,
      role: data.role || sql`role`,
      department: data.department || sql`department`,
      is_active: data.isActive !== undefined ? data.isActive : sql`is_active`,
      pays: data.pays || sql`pays`,
      code_postal: data.codePostal || sql`code_postal`,
      adresse: data.adresse || sql`adresse`,
      updated_at: new Date(),
    }

    // Si un nouveau mot de passe est fourni, le hasher
    if (data.password) {
      updateData.password_hash = await hashPassword(data.password)
    }

    const updatedUsers = await sql`
      UPDATE users 
      SET 
        email = ${updateData.email},
        first_name = ${updateData.first_name},
        last_name = ${updateData.last_name},
        role = ${updateData.role},
        department = ${updateData.department},
        is_active = ${updateData.is_active},
        pays = ${updateData.pays},
        code_postal = ${updateData.code_postal},
        adresse = ${updateData.adresse},
        updated_at = ${updateData.updated_at}
        ${data.password ? sql`, password_hash = ${updateData.password_hash}` : sql``}
      WHERE id = ${id}
      RETURNING id, email, first_name, last_name, role, department, is_active, created_at, updated_at
    `

    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedUsers[0],
    })
  } catch (error) {
    console.error("Erreur PUT utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const deletedUsers = await sql`
      DELETE FROM users WHERE id = ${id}
      RETURNING id, email, first_name, last_name
    `

    if (deletedUsers.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
