import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import DashboardContent from "@/components/DashboardContent/DashboardContent";

export const metadata = {
  title: "Mi Panel — GamesCoaching",
  description: "Gestiona tus sesiones de coaching, accede a tus videollamadas y revisa tu historial.",
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9898b0" }}>Cargando...</div>}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
