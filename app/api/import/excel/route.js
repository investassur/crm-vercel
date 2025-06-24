import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const data = await request.json()
    const { fileData, fileName, importType } = data

    if (!fileData || !importType) {
      return NextResponse.json({ error: "Données de fichier et type d'import requis" }, { status: 400 })
    }

    // Simuler le parsing du fichier Excel/CSV
    // Dans un vrai projet, vous utiliseriez une librairie comme xlsx ou csv-parser
    const mockData = [
      {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "0123456789",
        age: 65,
        ville: "Paris",
      },
      {
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
        phone: "0987654321",
        age: 68,
        ville: "Lyon",
      },
    ]

    const importResults = {
      success: 0,
      errors: 0,
      total: mockData.length,
      details: [],
    }

    if (importType === "prospects") {
      for (const row of mockData) {
        try {
          await sql`
            INSERT INTO prospects (first_name, last_name, email, phone, age, ville, status, source)
            VALUES (${row.firstName}, ${row.lastName}, ${row.email}, ${row.phone}, ${row.age}, ${row.ville}, 'nouveau', 'import')
          `
          importResults.success++
          importResults.details.push({
            row: importResults.success,
            status: "success",
            data: row,
          })
        } catch (error) {
          importResults.errors++
          importResults.details.push({
            row: importResults.success + importResults.errors,
            status: "error",
            error: error.message,
            data: row,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      importResults,
    })
  } catch (error) {
    console.error("Erreur import Excel:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
