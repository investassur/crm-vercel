import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []

    if (status) {
      whereClause += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    if (search) {
      whereClause += ` AND (first_name ILIKE $${params.length + 1} OR last_name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const prospects = await sql`
      SELECT 
        id, first_name, last_name, email, phone, age, status, 
        source, notes, ville, date_creation, origine, statut_detail,
        created_at, updated_at
      FROM prospects 
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM prospects ${sql.unsafe(whereClause)}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: prospects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur GET prospects:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      age,
      status = "nouveau",
      source,
      notes,
      ville,
      origine,
      assignedTo,
    } = data

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Prénom et nom requis" }, { status: 400 })
    }

    const newProspects = await sql`
      INSERT INTO prospects (
        first_name, last_name, email, phone, age, status, 
        source, notes, ville, origine, assigned_to, date_creation
      )
      VALUES (
        ${firstName}, ${lastName}, ${email}, ${phone}, ${age}, ${status},
        ${source}, ${notes}, ${ville}, ${origine}, ${assignedTo}, ${new Date()}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newProspects[0],
    })
  } catch (error) {
    console.error("Erreur POST prospects:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
