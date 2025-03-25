import TaxRangeEditor from "@/components/tax-range-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Settings, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Panel de Administración
          </h1>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Volver a la calculadora
            </Link>
          </Button>
        </div>

        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Configuración de Impuestos</CardTitle>
            <CardDescription>Administre los rangos y porcentajes de impuestos para los vehículos.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaxRangeEditor />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

