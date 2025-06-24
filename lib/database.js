import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL environment variable is not set")
}

export const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

// Fonction utilitaire pour gérer les erreurs de base de données
export async function executeQuery(query, params = []) {
  if (!sql) {
    return {
      success: false,
      error: "Base de données non configurée - DATABASE_URL manquant",
    }
  }

  try {
    const result = await sql(query, params)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error.message }
  }
}

// Fonction pour vérifier la connexion à la base de données
export async function testConnection() {
  if (!sql) {
    console.warn("Database not configured")
    return false
  }

  try {
    await sql`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Fonction pour vérifier si une table existe
export async function tableExists(tableName) {
  if (!sql) return false

  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}
