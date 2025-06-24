import { getUserFromToken } from "./auth.js"

export function withAuth(handler) {
  return async (req, res) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token manquant" })
      }

      const token = authHeader.substring(7)
      const user = await getUserFromToken(token)

      if (!user) {
        return res.status(401).json({ error: "Token invalide" })
      }

      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(500).json({ error: "Erreur serveur" })
    }
  }
}

export function withRole(roles) {
  return (handler) =>
    withAuth(async (req, res) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Accès refusé" })
      }
      return handler(req, res)
    })
}
