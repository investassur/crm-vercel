const API_BASE_URL = "/api"

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    // Merge default + caller-supplied options
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    }

    // Serialise body when we’ve been given an object
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)

      // ---- Non-OK responses (4xx / 5xx) -------------------------------
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API ${response.status}:`, errorText)
        return {
          success: false,
          status: response.status,
          error: errorText || `HTTP ${response.status}`,
        }
      }

      // ---- Parse JSON if available --------------------------------------
      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const parsed = await response.json()
        return { success: true, data: parsed }
      }

      // ---- Fallback for non-JSON responses ------------------------------
      const text = await response.text()
      console.error("Non-JSON response:", text)
      return {
        success: false,
        error: "La réponse du serveur n'est pas au format JSON",
        body: text,
      }
    } catch (err) {
      console.error("API Request failed:", err)
      return { success: false, error: err.message || "Erreur inconnue" }
    }
  }

  // Dashboard
  dashboard = {
    getStats: () => this.request("/dashboard/stats"),
  }

  // Prospects
  prospects = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return this.request(`/prospects${queryString ? `?${queryString}` : ""}`)
    },
    getById: (id) => this.request(`/prospects/${id}`),
    create: (data) => this.request("/prospects", { method: "POST", body: data }),
    update: (id, data) => this.request(`/prospects/${id}`, { method: "PUT", body: data }),
    delete: (id) => this.request(`/prospects/${id}`, { method: "DELETE" }),
  }

  // Contrats
  contracts = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return this.request(`/contracts${queryString ? `?${queryString}` : ""}`)
    },
    getById: (id) => this.request(`/contracts/${id}`),
    create: (data) => this.request("/contracts", { method: "POST", body: data }),
    update: (id, data) => this.request(`/contracts/${id}`, { method: "PUT", body: data }),
    delete: (id) => this.request(`/contracts/${id}`, { method: "DELETE" }),
  }

  // Tâches
  tasks = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return this.request(`/tasks${queryString ? `?${queryString}` : ""}`)
    },
    getById: (id) => this.request(`/tasks/${id}`),
    create: (data) => this.request("/tasks", { method: "POST", body: data }),
    update: (id, data) => this.request(`/tasks/${id}`, { method: "PUT", body: data }),
    delete: (id) => this.request(`/tasks/${id}`, { method: "DELETE" }),
  }

  // Campagnes
  campaigns = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return this.request(`/campaigns${queryString ? `?${queryString}` : ""}`)
    },
    getById: (id) => this.request(`/campaigns/${id}`),
    create: (data) => this.request("/campaigns", { method: "POST", body: data }),
    update: (id, data) => this.request(`/campaigns/${id}`, { method: "PUT", body: data }),
    delete: (id) => this.request(`/campaigns/${id}`, { method: "DELETE" }),
  }

  // Utilisateurs
  users = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString()
      return this.request(`/users${queryString ? `?${queryString}` : ""}`)
    },
    getById: (id) => this.request(`/users/${id}`),
    create: (data) => this.request("/users", { method: "POST", body: data }),
    update: (id, data) => this.request(`/users/${id}`, { method: "PUT", body: data }),
    delete: (id) => this.request(`/users/${id}`, { method: "DELETE" }),
  }

  // Authentification
  auth = {
    login: (credentials) => this.request("/auth/login", { method: "POST", body: credentials }),
    register: (userData) => this.request("/auth/register", { method: "POST", body: userData }),
    getPermissions: () => this.request("/auth/permissions"),
  }
}

export const api = new ApiClient()
