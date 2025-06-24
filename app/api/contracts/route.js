import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const compagnie = searchParams.get("compagnie")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []

    if (status && status !== "all") {
      whereClause += ` AND c.status = $${params.length + 1}`
      params.push(status)
    }

    if (compagnie && compagnie !== "all") {
      whereClause += ` AND c.compagnie ILIKE $${params.length + 1}`
      params.push(`%${compagnie}%`)
    }

    if (search) {
      whereClause += ` AND (c.contract_number ILIKE $${params.length + 1} OR p.first_name ILIKE $${params.length + 1} OR p.last_name ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const contracts = await sql`
      SELECT 
        c.*,
        p.first_name,
        p.last_name,
        p.email,
        p.phone
      FROM contracts c
      LEFT JOIN prospects p ON c.prospect_id = p.id
      ${sql.unsafe(whereClause)}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalResult = await sql`
      SELECT COUNT(*) as total 
      FROM contracts c
      LEFT JOIN prospects p ON c.prospect_id = p.id
      ${sql.unsafe(whereClause)}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur GET contracts:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      prospectId,
      contractNumber,
      productType,
      premiumAmount,
      commissionRate = 0,
      status = "brouillon",
      startDate,
      endDate,
      notes,
      ville,
      dateSignature,
      dateEffet,
      finContrat,
      compagnie,
      cotisationMensuelle,
      cotisationAnnuelle,
    } = data

    if (!prospectId || !contractNumber || !productType || !premiumAmount) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    const newContracts = await sql`
      INSERT INTO contracts (
        prospect_id, contract_number, product_type, premium_amount,
        commission_rate, status, start_date, end_date, notes,
        ville, date_signature, date_effet, fin_contrat, compagnie,
        cotisation_mensuelle, cotisation_annuelle
      )
      VALUES (
        ${prospectId}, ${contractNumber}, ${productType}, ${premiumAmount},
        ${commissionRate}, ${status}, ${startDate}, ${endDate}, ${notes},
        ${ville}, ${dateSignature}, ${dateEffet}, ${finContrat}, ${compagnie},
        ${cotisationMensuelle}, ${cotisationAnnuelle}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newContracts[0],
    })
  } catch (error) {
    console.error("Erreur POST contracts:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
