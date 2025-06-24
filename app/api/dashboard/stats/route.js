import { NextResponse } from "next/server"

// Default stats structure
const defaultStats = {
  prospects: { total_prospects: 0, nouveaux: 0, qualifies: 0, convertis: 0, ce_mois: 0 },
  contracts: { total_contrats: 0, actifs: 0, ca_total: 0, commission_totale: 0, ce_mois: 0 },
  tasks: { total_taches: 0, a_faire: 0, en_cours: 0, en_retard: 0 },
  campaigns: { total_campagnes: 0, actives: 0, terminees: 0, brouillons: 0 },
  monthlyPerformance: [],
  sourceDistribution: [],
  topCompanies: [],
}

export async function GET(request) {
  try {
    console.log("Dashboard stats API called")

    // Check if DATABASE_URL is properly configured
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl || databaseUrl === "your_neon_database_url_here" || !databaseUrl.startsWith("postgresql://")) {
      console.warn("DATABASE_URL not properly configured:", databaseUrl)
      return NextResponse.json({
        success: true,
        data: defaultStats,
        message: "Base de données non configurée - veuillez configurer DATABASE_URL dans les variables d'environnement",
      })
    }

    // Try to import and use database
    let sql
    try {
      const { neon } = await import("@neondatabase/serverless")
      sql = neon(databaseUrl)
    } catch (importError) {
      console.error("Failed to import database module:", importError)
      return NextResponse.json({
        success: true,
        data: defaultStats,
        message: "Module de base de données non disponible - vérifiez l'installation de @neondatabase/serverless",
      })
    }

    // Test database connection
    try {
      await sql`SELECT 1`
      console.log("Database connection successful")
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      return NextResponse.json({
        success: true,
        data: defaultStats,
        message: "Impossible de se connecter à la base de données - vérifiez votre URL de connexion",
      })
    }

    // Initialize stats with defaults
    const stats = { ...defaultStats }
    const warnings = []

    // Try to get prospect stats
    try {
      const prospectResult = await sql`
        SELECT 
          COUNT(*) as total_prospects,
          COUNT(CASE WHEN status = 'nouveau' THEN 1 END) as nouveaux,
          COUNT(CASE WHEN status = 'qualifié' THEN 1 END) as qualifies,
          COUNT(CASE WHEN status = 'converti' THEN 1 END) as convertis,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as ce_mois
        FROM prospects
      `
      if (prospectResult && prospectResult[0]) {
        stats.prospects = {
          total_prospects: Number.parseInt(prospectResult[0].total_prospects) || 0,
          nouveaux: Number.parseInt(prospectResult[0].nouveaux) || 0,
          qualifies: Number.parseInt(prospectResult[0].qualifies) || 0,
          convertis: Number.parseInt(prospectResult[0].convertis) || 0,
          ce_mois: Number.parseInt(prospectResult[0].ce_mois) || 0,
        }
      }
    } catch (error) {
      console.error("Error fetching prospect stats:", error.message)
      warnings.push("Table 'prospects' non trouvée")
    }

    // Try to get contract stats
    try {
      const contractResult = await sql`
        SELECT 
          COUNT(*) as total_contrats,
          COUNT(CASE WHEN status = 'actif' THEN 1 END) as actifs,
          COALESCE(SUM(CASE WHEN status = 'actif' THEN premium_amount ELSE 0 END), 0) as ca_total,
          COALESCE(SUM(CASE WHEN status = 'actif' THEN commission_amount ELSE 0 END), 0) as commission_totale,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as ce_mois
        FROM contracts
      `
      if (contractResult && contractResult[0]) {
        stats.contracts = {
          total_contrats: Number.parseInt(contractResult[0].total_contrats) || 0,
          actifs: Number.parseInt(contractResult[0].actifs) || 0,
          ca_total: Number.parseFloat(contractResult[0].ca_total) || 0,
          commission_totale: Number.parseFloat(contractResult[0].commission_totale) || 0,
          ce_mois: Number.parseInt(contractResult[0].ce_mois) || 0,
        }
      }
    } catch (error) {
      console.error("Error fetching contract stats:", error.message)
      warnings.push("Table 'contracts' non trouvée")
    }

    // Try to get task stats
    try {
      const taskResult = await sql`
        SELECT 
          COUNT(*) as total_taches,
          COUNT(CASE WHEN status = 'todo' THEN 1 END) as a_faire,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as en_cours,
          COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 1 END) as en_retard
        FROM tasks
      `
      if (taskResult && taskResult[0]) {
        stats.tasks = {
          total_taches: Number.parseInt(taskResult[0].total_taches) || 0,
          a_faire: Number.parseInt(taskResult[0].a_faire) || 0,
          en_cours: Number.parseInt(taskResult[0].en_cours) || 0,
          en_retard: Number.parseInt(taskResult[0].en_retard) || 0,
        }
      }
    } catch (error) {
      console.error("Error fetching task stats:", error.message)
      warnings.push("Table 'tasks' non trouvée")
    }

    // Try to get campaign stats
    try {
      const campaignResult = await sql`
        SELECT 
          COUNT(*) as total_campagnes,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as actives,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as terminees,
          COUNT(CASE WHEN status = 'draft' THEN 1 END) as brouillons
        FROM campaigns
      `
      if (campaignResult && campaignResult[0]) {
        stats.campaigns = {
          total_campagnes: Number.parseInt(campaignResult[0].total_campagnes) || 0,
          actives: Number.parseInt(campaignResult[0].actives) || 0,
          terminees: Number.parseInt(campaignResult[0].terminees) || 0,
          brouillons: Number.parseInt(campaignResult[0].brouillons) || 0,
        }
      }
    } catch (error) {
      console.error("Error fetching campaign stats:", error.message)
      warnings.push("Table 'campaigns' non trouvée")
    }

    const response = {
      success: true,
      data: stats,
    }

    if (warnings.length > 0) {
      response.message = `Tables manquantes: ${warnings.join(", ")}. Exécutez le script de création de base de données.`
    }

    console.log("Dashboard stats response prepared successfully")
    return NextResponse.json(response)
  } catch (error) {
    console.error("Unexpected error in dashboard stats:", error)

    // Always return a valid response, never throw
    return NextResponse.json({
      success: true,
      data: defaultStats,
      message: `Erreur inattendue: ${error.message}. Données par défaut affichées.`,
    })
  }
}
