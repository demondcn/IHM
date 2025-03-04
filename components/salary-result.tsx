import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BadgeCheck, User, Clock, DollarSign, RotateCcw } from "lucide-react"

interface SalaryResultProps {
  data: {
    cedula: string
    nombre: string
    apellido: string
    telefono: string
    horasTrabajadas: number
    valorHora: number
    salarioTotal: number
    horasNormales: number
    horasExtrasSimples: number
    horasExtrasDobles: number
    valorHorasNormales: number
    valorHorasExtrasSimples: number
    valorHorasExtrasDobles: number
  }
  onReset: () => void
}

export function SalaryResult({ data, onReset }: SalaryResultProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-center mb-4">
        <BadgeCheck className="h-8 w-8 text-accent mr-2" />
        <h3 className="text-xl font-semibold text-primary">Cálculo Completado</h3>
      </div>

      <Card className="bg-muted border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-secondary">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">Información del Empleado</span>
              </div>
              <div className="pl-6 space-y-1">
                <p>
                  <span className="font-medium">Cédula:</span> {data.cedula}
                </p>
                <p>
                  <span className="font-medium">Nombre:</span> {data.nombre} {data.apellido}
                </p>
                <p>
                  <span className="font-medium">Teléfono:</span> {data.telefono}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-secondary">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">Información de Horas</span>
              </div>
              <div className="pl-6 space-y-1">
                <p>
                  <span className="font-medium">Horas Trabajadas:</span> {data.horasTrabajadas}
                </p>
                <p>
                  <span className="font-medium">Valor por Hora:</span> {formatCurrency(data.valorHora)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-center text-secondary">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="font-medium">Desglose del Salario</span>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm border border-primary/10">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Tipo de Hora</div>
                <div className="font-medium text-center">Cantidad</div>
                <div className="font-medium text-right">Valor</div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Horas Normales</div>
                <div className="text-center">{data.horasNormales}</div>
                <div className="text-right">{formatCurrency(data.valorHorasNormales)}</div>
              </div>

              {data.horasExtrasSimples > 0 && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Horas Extras Simples (20%)</div>
                  <div className="text-center">{data.horasExtrasSimples}</div>
                  <div className="text-right">{formatCurrency(data.valorHorasExtrasSimples)}</div>
                </div>
              )}

              {data.horasExtrasDobles > 0 && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Horas Extras Dobles (40%)</div>
                  <div className="text-center">{data.horasExtrasDobles}</div>
                  <div className="text-right">{formatCurrency(data.valorHorasExtrasDobles)}</div>
                </div>
              )}

              <Separator className="my-2" />

              <div className="grid grid-cols-3 gap-2 font-bold">
                <div className="col-span-2">Total a Pagar:</div>
                <div className="text-right text-primary">{formatCurrency(data.salarioTotal)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onReset} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
        <RotateCcw className="mr-2 h-4 w-4" />
        Calcular Nuevo Salario
      </Button>
    </div>
  )
}

