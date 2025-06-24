import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedUser = searchParams.get("assignedUser")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []

    if (status && status !== "all") {
      whereClause += ` AND t.status = $${params.length + 1}`
      params.push(status)
    }

    if (priority && priority !== "all") {
      whereClause += ` AND t.priority = $${params.length + 1}`
      params.push(priority)
    }

    if (assignedUser && assignedUser !== "all") {
      whereClause += ` AND t.assigned_user = $${params.length + 1}`
      params.push(assignedUser)
    }

    if (search) {
      whereClause += ` AND (t.title ILIKE $${params.length + 1} OR t.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

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
      ${sql.unsafe(whereClause)}
      ORDER BY 
        CASE WHEN t.due_date < CURRENT_DATE THEN 0 ELSE 1 END,
        t.due_date ASC,
        t.priority DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const totalResult = await sql`
      SELECT COUNT(*) as total FROM tasks t ${sql.unsafe(whereClause)}
    `

    const total = Number.parseInt(totalResult[0].total)

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Erreur GET tasks:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { title, description, dueDate, priority = "medium", status = "todo", assignedUser, prospectId, notes } = data

    if (!title) {
      return NextResponse.json({ error: "Titre requis" }, { status: 400 })
    }

    const newTasks = await sql`
      INSERT INTO tasks (
        title, description, due_date, priority, status,
        assigned_user, prospect_id, notes
      )
      VALUES (
        ${title}, ${description}, ${dueDate}, ${priority}, ${status},
        ${assignedUser}, ${prospectId}, ${notes}
      )
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: newTasks[0],
    })
  } catch (error) {
    console.error("Erreur POST tasks:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
