import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET - Récupérer un prospect par ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const prospects = await sql`
      SELECT * FROM prospects WHERE id = ${id}
    `

    if (prospects.length === 0) {
      return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: prospects[0],
    })
  } catch (error) {
    console.error("Erreur GET prospect:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour un prospect
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updatedProspects = await sql`
      UPDATE prospects 
      SET 
        first_name = ${data.firstName || sql`first_name`},
        last_name = ${data.lastName || sql`last_name`},
        email = ${data.email || sql`email`},
        phone = ${data.phone || sql`phone`},
        age = ${data.age || sql`age`},
        status = ${data.status || sql`status`},
        source = ${data.source || sql`source`},
        notes = ${data.notes || sql`notes`},
        ville = ${data.ville || sql`ville`},
        origine = ${data.origine || sql`origine`},
        assigned_to = ${data.assignedTo || sql`assigned_to`},
        updated_at = ${new Date()}
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedProspects.length === 0) {
      return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedProspects[0],
    })
  } catch (error) {
    console.error("Erreur PUT prospect:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer un prospect
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const deletedProspects = await sql`
      DELETE FROM prospects WHERE id = ${id}
      RETURNING *
    `

    if (deletedProspects.length === 0) {
      return NextResponse.json({ error: "Prospect non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Prospect supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE prospect:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
