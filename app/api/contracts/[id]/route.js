import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET - Récupérer un contrat par ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const contracts = await sql`
      SELECT 
        c.*,
        p.first_name,
        p.last_name,
        p.email,
        p.phone
      FROM contracts c
      LEFT JOIN prospects p ON c.prospect_id = p.id
      WHERE c.id = ${id}
    `

    if (contracts.length === 0) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: contracts[0],
    })
  } catch (error) {
    console.error("Erreur GET contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour un contrat
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updatedContracts = await sql`
      UPDATE contracts 
      SET 
        prospect_id = ${data.prospectId || sql`prospect_id`},
        contract_number = ${data.contractNumber || sql`contract_number`},
        product_type = ${data.productType || sql`product_type`},
        premium_amount = ${data.premiumAmount || sql`premium_amount`},
        commission_rate = ${data.commissionRate || sql`commission_rate`},
        status = ${data.status || sql`status`},
        start_date = ${data.startDate || sql`start_date`},
        end_date = ${data.endDate || sql`end_date`},
        notes = ${data.notes || sql`notes`},
        ville = ${data.ville || sql`ville`},
        date_signature = ${data.dateSignature || sql`date_signature`},
        date_effet = ${data.dateEffet || sql`date_effet`},
        fin_contrat = ${data.finContrat || sql`fin_contrat`},
        compagnie = ${data.compagnie || sql`compagnie`},
        cotisation_mensuelle = ${data.cotisationMensuelle || sql`cotisation_mensuelle`},
        cotisation_annuelle = ${data.cotisationAnnuelle || sql`cotisation_annuelle`},
        updated_at = ${new Date()}
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedContracts.length === 0) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedContracts[0],
    })
  } catch (error) {
    console.error("Erreur PUT contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer un contrat
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const deletedContracts = await sql`
      DELETE FROM contracts WHERE id = ${id}
      RETURNING *
    `

    if (deletedContracts.length === 0) {
      return NextResponse.json({ error: "Contrat non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Contrat supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE contrat:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
