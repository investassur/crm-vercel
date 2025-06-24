import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Titre et description requis" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `
Analysez cette proposition de fonctionnalité pour un CRM d'assurance spécialisé dans le courtage senior :

Titre: ${title}
Description: ${description}

Fournissez une analyse structurée au format JSON avec les éléments suivants :
{
  "priorite": "Haute/Moyenne/Basse",
  "complexite": "Simple/Moyenne/Complexe",
  "valeurMetier": "Description de la valeur métier",
  "considerationsTechniques": ["Liste des considérations techniques"],
  "recommandations": ["Liste de recommandations"],
  "risques": ["Liste des risques identifiés"],
  "beneficesAssurance": ["Bénéfices spécifiques au secteur de l'assurance"],
  "conformite": "Considérations de conformité réglementaire",
  "estimationTemps": "Estimation en jours/semaines",
  "score": "Note sur 10"
}

Répondez uniquement avec le JSON, sans texte supplémentaire.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Nettoyer la réponse pour extraire le JSON
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    try {
      const analysis = JSON.parse(text)
      return NextResponse.json({
        success: true,
        analysis,
      })
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError)
      return NextResponse.json({
        success: false,
        error: "Erreur de parsing de la réponse IA",
        rawResponse: text,
      })
    }
  } catch (error) {
    console.error("Erreur analyse IA:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
