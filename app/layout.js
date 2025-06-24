import "./globals.css"

export const metadata = {
  title: "AssurCRM - Courtage Senior",
  description: "CRM pour courtiers en assurance spécialisés seniors",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
