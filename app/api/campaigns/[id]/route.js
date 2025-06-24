import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET - Récupérer une campagne par ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const campaigns = await sql`
      SELECT 
        c.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM campaigns c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = ${id}
    `

    if (campaigns.length === 0) {
      return NextResponse.json({ error: "Campagne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: campaigns[0],
    })
  } catch (error) {
    console.error("Erreur GET campagne:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour une campagne
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updatedCampaigns = await sql`
      UPDATE campaigns 
      SET 
        name = ${data.name || sql`name`},
        description = ${data.description || sql`description`},
        campaign_type = ${data.campaignType || sql`campaign_type`},
        status = ${data.status || sql`status`},
        start_date = ${data.startDate || sql`start_date`},
        end_date = ${data.endDate || sql`end_date`},
        target_audience = ${data.targetAudience ? JSON.stringify(data.targetAudience) : sql`target_audience`},
        budget = ${data.budget || sql`budget`},
        updated_at = ${new Date()}
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedCampaigns.length === 0) {
      return NextResponse.json({ error: "Campagne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCampaigns[0],
    })
  } catch (error) {
    console.error("Erreur PUT campagne:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer une campagne
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const deletedCampaigns = await sql`
      DELETE FROM campaigns WHERE id = ${id}
      RETURNING *
    `

    if (deletedCampaigns.length === 0) {
      return NextResponse.json({ error: "Campagne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Campagne supprimée avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE campagne:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
