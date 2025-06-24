import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let whereClause = "WHERE 1=1"
    const params = []

    if (category && category !== "all") {
      whereClause += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      whereClause += ` AND (name ILIKE $${params.length + 1} OR subject ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const templates = await sql`
      SELECT 
        t.*,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM email_templates t
      LEFT JOIN users u ON t.created_by = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY t.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error("Erreur GET templates:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, subject, content, category = "general", variables = [], isActive = true, createdBy } = data

    if (!name || !subject || !content) {
      return NextResponse.json({ error: "Nom, sujet et contenu requis" }, { status: 400 })
    }

    const newTemplates = await sql`
      INSERT INTO email_templates (
        name, subject, content, category, variables, is_active, created_by
      )
      VALUES (
        ${name}, ${subject}, ${content}, ${category}, ${JSON.stringify(variables)}, ${isActive}, ${createdBy}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newTemplates[0],
    })
  } catch (error) {
    console.error("Erreur POST templates:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
