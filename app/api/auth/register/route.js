import { sql } from "@/lib/database"
import { hashPassword, generateToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, role = "agent" } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const newUsers = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${role})
      RETURNING id, email, first_name, last_name, role
    `

    const user = newUsers[0]
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erreur registration:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
