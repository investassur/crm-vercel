import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sql } from "./database.js"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email, password) {
  try {
    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, role, is_active
      FROM users 
      WHERE email = ${email} AND is_active = true
    `

    if (users.length === 0) {
      return { success: false, message: "Utilisateur non trouvé" }
    }

    const user = users[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: "Mot de passe incorrect" }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Créer une session
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${user.id}, ${token}, ${new Date(Date.now() + 24 * 60 * 60 * 1000)})
    `

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    return { success: false, message: "Erreur serveur" }
  }
}

export async function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null

    const users = await sql`
      SELECT id, email, first_name, last_name, role, is_active, permissions
      FROM users 
      WHERE id = ${decoded.userId} AND is_active = true
    `

    return users.length > 0 ? users[0] : null
  } catch (error) {
    return null
  }
}
