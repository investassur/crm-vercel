import { authenticateUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    const result = await authenticateUser(email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    console.error("Erreur login:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
