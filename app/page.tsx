import VehicleTaxCalculator from "@/components/vehicle-tax-calculator"
import { CarFront } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero section with car background */}
      <div className="relative bg-[url('/car-banner.jpg')] bg-cover bg-center h-[300px] md:h-[400px]">
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <CarFront className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">AutoTax</h1>
          </div>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
            Calcula el impuesto de tu vehículo de manera rápida y sencilla
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <VehicleTaxCalculator />
      </div>
    </main>
  )
}

