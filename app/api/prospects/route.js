import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    console.log("Prospects API called")

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not configured")
      return NextResponse.json({
        success: true,
        data: [],
        message: "Base de données non configurée",
      })
    }

    // Try to import and use database
    let sql
    try {
      const { neon } = await import("@neondatabase/serverless")
      sql = neon(process.env.DATABASE_URL)
    } catch (importError) {
      console.error("Failed to import database module:", importError)
      return NextResponse.json({
        success: true,
        data: [],
        message: "Module de base de données non disponible",
      })
    }

    // Test database connection
    try {
      await sql`SELECT 1`
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      return NextResponse.json({
        success: true,
        data: [],
        message: "Impossible de se connecter à la base de données",
      })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit")) || 50
    const offset = Number.parseInt(searchParams.get("offset")) || 0

    // Try to fetch prospects
    try {
      const prospects = await sql`
        SELECT 
          id, first_name, last_name, email, phone, company, status, source, created_at, updated_at
        FROM prospects 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `

      return NextResponse.json({
        success: true,
        data: prospects || [],
      })
    } catch (error) {
      console.error("Error fetching prospects:", error.message)
      return NextResponse.json({
        success: true,
        data: [],
        message: "Table 'prospects' non trouvée. Exécutez le script de création de base de données.",
      })
    }
  } catch (error) {
    console.error("Unexpected error in prospects API:", error)
    return NextResponse.json({
      success: true,
      data: [],
      message: `Erreur inattendue: ${error.message}`,
    })
  }
}

export async function POST(request) {
  try {
    console.log("Creating new prospect")

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: "Base de données non configurée",
      })
    }

    let sql
    try {
      const { neon } = await import("@neondatabase/serverless")
      sql = neon(process.env.DATABASE_URL)
    } catch (importError) {
      return NextResponse.json({
        success: false,
        error: "Module de base de données non disponible",
      })
    }

    const body = await request.json()
    const { first_name, last_name, email, phone, company, status, source } = body

    try {
      const result = await sql`
        INSERT INTO prospects (first_name, last_name, email, phone, company, status, source, created_at, updated_at)
        VALUES (${first_name}, ${last_name}, ${email}, ${phone}, ${company}, ${status || "nouveau"}, ${source}, NOW(), NOW())
        RETURNING *
      `

      return NextResponse.json({
        success: true,
        data: result[0],
      })
    } catch (error) {
      console.error("Error creating prospect:", error.message)
      return NextResponse.json({
        success: false,
        error: "Erreur lors de la création du prospect",
      })
    }
  } catch (error) {
    console.error("Unexpected error in prospect creation:", error)
    return NextResponse.json({
      success: false,
      error: "Erreur inattendue",
    })
  }
}
