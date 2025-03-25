"use client"

import Image from "next/image"

interface VehicleDisplayProps {
  brand: string
  line: string
  model: string
}

export default function VehicleDisplay({ brand, line, model }: VehicleDisplayProps) {
  // Obtener la imagen del vehículo según la marca y línea
  const getVehicleImage = () => {
    // En un caso real, tendríamos imágenes específicas para cada vehículo
    // Aquí usamos imágenes genéricas basadas en la marca

    const brandLower = brand.toLowerCase()

    if (brandLower.includes("mazda")) {
      return "/cars/mazda.jpg"
    } else if (brandLower.includes("peugeot")) {
      return "/cars/peugeot.jpg"
    } else if (brandLower.includes("toyota")) {
      return "/cars/toyota.jpg"
    } else if (brandLower.includes("renault")) {
      return "/cars/renault.jpg"
    } else if (brandLower.includes("chevrolet")) {
      return "/cars/chevrolet.jpg"
    } else if (brandLower.includes("mercedes")) {
      return "/cars/mercedes.jpg"
    } else {
      return "/cars/default-car.jpg"
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border shadow-sm">
      <div className="relative h-[200px] w-full">
        <Image
          src={getVehicleImage() || "/placeholder.svg"}
          alt={`${brand} ${line} ${model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 bg-slate-50">
        <p className="text-sm font-medium text-center">
          {brand} {line} {model}
        </p>
      </div>
    </div>
  )
}

