import { Suspense } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SuccessContent from "@/components/SuccessContent/SuccessContent";

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
