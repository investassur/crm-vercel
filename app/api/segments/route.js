import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const segments = await sql`
      SELECT 
        s.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM client_segments s
      LEFT JOIN users u ON s.created_by = u.id
      ORDER BY s.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: segments,
    })
  } catch (error) {
    console.error("Erreur GET segments:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, description, criteria, createdBy } = data

    if (!name || !criteria) {
      return NextResponse.json({ error: "Nom et critères requis" }, { status: 400 })
    }

    // Calculer le nombre de prospects correspondant aux critères
    let countQuery = "SELECT COUNT(*) as count FROM prospects WHERE 1=1"

    if (criteria.age_min) {
      countQuery += ` AND age >= ${criteria.age_min}`
    }
    if (criteria.age_max) {
      countQuery += ` AND age <= ${criteria.age_max}`
    }
    if (criteria.status) {
      countQuery += ` AND status = '${criteria.status}'`
    }
    if (criteria.source) {
      countQuery += ` AND source = '${criteria.source}'`
    }

    const countResult = await sql.unsafe(countQuery)
    const prospectCount = countResult[0].count

    const newSegments = await sql`
      INSERT INTO client_segments (
        name, description, criteria, prospect_count, created_by
      )
      VALUES (
        ${name}, ${description}, ${JSON.stringify(criteria)}, ${prospectCount}, ${createdBy}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newSegments[0],
    })
  } catch (error) {
    console.error("Erreur POST segments:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
