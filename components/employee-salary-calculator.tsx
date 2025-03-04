"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRound, Clock, Calculator, ArrowRightCircle, ArrowLeftCircle } from "lucide-react"
import { SalaryResult } from "@/components/salary-result"

const employeeFormSchema = z.object({
  cedula: z.string().min(5, {
    message: "La cédula debe tener al menos 5 caracteres.",
  }),
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  telefono: z.string().min(7, {
    message: "El teléfono debe tener al menos 7 caracteres.",
  }),
})

const hoursFormSchema = z.object({
  horasTrabajadas: z.coerce.number().min(1, {
    message: "Debe ingresar al menos 1 hora trabajada.",
  }),
  valorHora: z.coerce.number().min(1, {
    message: "El valor de la hora debe ser mayor a 0.",
  }),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>
type HoursFormValues = z.infer<typeof hoursFormSchema>

interface EmployeeData extends EmployeeFormValues, HoursFormValues {
  salarioTotal: number
  horasNormales: number
  horasExtrasSimples: number
  horasExtrasDobles: number
  valorHorasNormales: number
  valorHorasExtrasSimples: number
  valorHorasExtrasDobles: number
}

export function EmployeeSalaryCalculator() {
  const [activeTab, setActiveTab] = useState("employee")
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)

  const employeeForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
    },
  })

  const hoursForm = useForm<HoursFormValues>({
    resolver: zodResolver(hoursFormSchema),
    defaultValues: {
      horasTrabajadas: 0,
      valorHora: 0,
    },
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onEmployeeSubmit(data: EmployeeFormValues) {
    setActiveTab("hours")
  }

  function onHoursSubmit(data: HoursFormValues) {
    const { horasTrabajadas, valorHora } = data
    const employeeInfo = employeeForm.getValues()

    // Cálculo de horas y salario
    let horasNormales = 0
    let horasExtrasSimples = 0
    let horasExtrasDobles = 0

    if (horasTrabajadas <= 40) {
      horasNormales = horasTrabajadas
    } else if (horasTrabajadas <= 48) {
      horasNormales = 40
      horasExtrasSimples = horasTrabajadas - 40
    } else {
      horasNormales = 40
      horasExtrasSimples = 8
      horasExtrasDobles = horasTrabajadas - 48
    }

    const valorHorasNormales = horasNormales * valorHora
    const valorHorasExtrasSimples = horasExtrasSimples * valorHora * 1.2
    const valorHorasExtrasDobles = horasExtrasDobles * valorHora * 1.4
    const salarioTotal = valorHorasNormales + valorHorasExtrasSimples + valorHorasExtrasDobles

    setEmployeeData({
      ...employeeInfo,
      ...data,
      salarioTotal,
      horasNormales,
      horasExtrasSimples,
      horasExtrasDobles,
      valorHorasNormales,
      valorHorasExtrasSimples,
      valorHorasExtrasDobles,
    })

    setActiveTab("result")
  }

  function resetCalculation() {
    employeeForm.reset()
    hoursForm.reset()
    setEmployeeData(null)
    setActiveTab("employee")
  }

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="text-primary">Cálculo de Salario Semanal</CardTitle>
        <CardDescription>
          Ingrese los datos del empleado y las horas trabajadas para calcular el salario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted">
            <TabsTrigger
              value="employee"
              disabled={activeTab === "result"}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UserRound className="mr-2 h-4 w-4" />
              Datos Personales
            </TabsTrigger>
            <TabsTrigger
              value="hours"
              disabled={!employeeForm.formState.isSubmitSuccessful || activeTab === "result"}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="mr-2 h-4 w-4" />
              Horas Trabajadas
            </TabsTrigger>
            <TabsTrigger
              value="result"
              disabled={!employeeData}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Resultado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee">
            <Form {...employeeForm}>
              <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={employeeForm.control}
                    name="cedula"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cédula</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese la cédula" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese el nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="apellido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese el apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese el teléfono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  Continuar
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="hours">
            <Form {...hoursForm}>
              <form onSubmit={hoursForm.handleSubmit(onHoursSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={hoursForm.control}
                    name="horasTrabajadas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horas Trabajadas</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ingrese las horas trabajadas" {...field} />
                        </FormControl>
                        <FormDescription>Número total de horas trabajadas en la semana</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={hoursForm.control}
                    name="valorHora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor por Hora</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ingrese el valor por hora" {...field} />
                        </FormControl>
                        <FormDescription>Valor a pagar por hora normal de trabajo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("employee")}
                    className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <ArrowLeftCircle className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Calculator className="mr-2 h-4 w-4" />
                    Calcular Salario
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="result">
            {employeeData && <SalaryResult data={employeeData} onReset={resetCalculation} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

