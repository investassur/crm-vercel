import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

// GET - Récupérer une tâche par ID
export async function GET(request, { params }) {
  try {
    const { id } = params

    const tasks = await sql`
      SELECT 
        t.*,
        p.first_name as prospect_first_name,
        p.last_name as prospect_last_name,
        u.first_name as assigned_first_name,
        u.last_name as assigned_last_name
      FROM tasks t
      LEFT JOIN prospects p ON t.prospect_id = p.id
      LEFT JOIN users u ON t.assigned_user = u.id
      WHERE t.id = ${id}
    `

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: tasks[0],
    })
  } catch (error) {
    console.error("Erreur GET tâche:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PUT - Mettre à jour une tâche
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()

    const updatedTasks = await sql`
      UPDATE tasks 
      SET 
        title = ${data.title || sql`title`},
        description = ${data.description || sql`description`},
        due_date = ${data.dueDate || sql`due_date`},
        priority = ${data.priority || sql`priority`},
        status = ${data.status || sql`status`},
        assigned_user = ${data.assignedUser || sql`assigned_user`},
        prospect_id = ${data.prospectId || sql`prospect_id`},
        notes = ${data.notes || sql`notes`},
        updated_at = ${new Date()}
      WHERE id = ${id}
      RETURNING *
    `

    if (updatedTasks.length === 0) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedTasks[0],
    })
  } catch (error) {
    console.error("Erreur PUT tâche:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer une tâche
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const deletedTasks = await sql`
      DELETE FROM tasks WHERE id = ${id}
      RETURNING *
    `

    if (deletedTasks.length === 0) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Tâche supprimée avec succès",
    })
  } catch (error) {
    console.error("Erreur DELETE tâche:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
