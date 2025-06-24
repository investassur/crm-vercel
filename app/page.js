"use client"

import { useState } from "react"
import SidebarNavigation from "@/components/SidebarNavigation"
import DashboardPage from "@/components/pages/DashboardPage"
import ProspectsPage from "@/components/pages/ProspectsPage"
import ContratsPage from "@/components/pages/ContratsPage"
import TachesPage from "@/components/pages/TachesPage"
import CampagnesPage from "@/components/pages/CampagnesPage"
import RapportsPage from "@/components/pages/RapportsPage"
import SegmentationPage from "@/components/pages/SegmentationPage"
import AutomatisationPage from "@/components/pages/AutomatisationPage"
import TemplatesPage from "@/components/pages/TemplatesPage"
import ImportPage from "@/components/pages/ImportPage"
import AdministrationPage from "@/components/pages/AdministrationPage"

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "prospects":
        return <ProspectsPage />
      case "contrats":
        return <ContratsPage />
      case "taches":
        return <TachesPage />
      case "campagnes":
        return <CampagnesPage />
      case "rapports":
        return <RapportsPage />
      case "segmentation":
        return <SegmentationPage />
      case "automatisation":
        return <AutomatisationPage />
      case "templates":
        return <TemplatesPage />
      case "import":
        return <ImportPage />
      case "administration":
        return <AdministrationPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">{renderCurrentPage()}</main>
    </div>
  )
}
