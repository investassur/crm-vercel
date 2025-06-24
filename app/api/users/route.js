import { sql } from "@/lib/database"
import { hashPassword } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const department = searchParams.get("department")
    const isActive = searchParams.get("isActive")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []

    if (role && role !== "all") {
      whereClause += ` AND role = $${params.length + 1}`
      params.push(role)
    }

    if (department && department !== "all") {
      whereClause += ` AND department = $${params.length + 1}`
      params.push(department)
    }

    if (isActive !== null && isActive !== "all") {
      whereClause += ` AND is_active = $${params.length + 1}`
      params.push(isActive === "true")
    }

    if (search) {
      whereClause += ` AND (first_name ILIKE $${params.length + 1} OR last_name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const users = await sql`
      SELECT 
        id, email, first_name, last_name, role, department,
        is_active, last_login, created_at, updated_at, pays, code_postal, adresse
      FROM users
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM users ${sql.unsafe(whereClause)}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur GET users:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { email, password, firstName, lastName, role = "agent", department, pays, codePostal, adresse } = data

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const newUsers = await sql`
      INSERT INTO users (
        email, password_hash, first_name, last_name, role,
        department, pays, code_postal, adresse
      )
      VALUES (
        ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${role},
        ${department}, ${pays}, ${codePostal}, ${adresse}
      )
      RETURNING id, email, first_name, last_name, role, department, is_active, created_at
    `

    return NextResponse.json({
      success: true,
      data: newUsers[0],
    })
  } catch (error) {
    console.error("Erreur POST users:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
