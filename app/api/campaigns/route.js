import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []

    if (status && status !== "all") {
      whereClause += ` AND c.status = $${params.length + 1}`
      params.push(status)
    }

    if (type && type !== "all") {
      whereClause += ` AND c.campaign_type = $${params.length + 1}`
      params.push(type)
    }

    if (search) {
      whereClause += ` AND (c.name ILIKE $${params.length + 1} OR c.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const campaigns = await sql`
      SELECT 
        c.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM campaigns c
      LEFT JOIN users u ON c.created_by = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM campaigns c ${sql.unsafe(whereClause)}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur GET campaigns:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      name,
      description,
      campaignType = "email",
      status = "brouillon",
      startDate,
      endDate,
      targetAudience,
      budget,
      createdBy,
    } = data

    if (!name || !createdBy) {
      return NextResponse.json({ error: "Nom et créateur requis" }, { status: 400 })
    }

    const newCampaigns = await sql`
      INSERT INTO campaigns (
        name, description, campaign_type, status, start_date,
        end_date, target_audience, budget, created_by
      )
      VALUES (
        ${name}, ${description}, ${campaignType}, ${status}, ${startDate},
        ${endDate}, ${JSON.stringify(targetAudience)}, ${budget}, ${createdBy}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newCampaigns[0],
    })
  } catch (error) {
    console.error("Erreur POST campaigns:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
