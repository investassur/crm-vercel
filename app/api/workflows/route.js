import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let whereClause = "WHERE 1=1"
    const params = []

    if (status && status !== "all") {
      whereClause += ` AND w.status = $${params.length + 1}`
      params.push(status)
    }

    if (search) {
      whereClause += ` AND (w.name ILIKE $${params.length + 1} OR w.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const workflows = await sql`
      SELECT 
        w.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM workflows w
      LEFT JOIN users u ON w.created_by = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY w.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: workflows,
    })
  } catch (error) {
    console.error("Erreur GET workflows:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, description, triggerType, triggerConditions = {}, actions = [], status = "active", createdBy } = data

    if (!name || !triggerType) {
      return NextResponse.json({ error: "Nom et type de déclencheur requis" }, { status: 400 })
    }

    const newWorkflows = await sql`
      INSERT INTO workflows (
        name, description, trigger_type, trigger_conditions, actions, status, created_by
      )
      VALUES (
        ${name}, ${description}, ${triggerType}, ${JSON.stringify(triggerConditions)}, 
        ${JSON.stringify(actions)}, ${status}, ${createdBy}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newWorkflows[0],
    })
  } catch (error) {
    console.error("Erreur POST workflows:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
