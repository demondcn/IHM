"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Car, Calendar, DollarSign, Clock, Bus, MapPin, CheckCircle2, BarChart3 } from "lucide-react"
import { vehicleData, taxRanges } from "@/lib/data"
import VehicleDisplay from "@/components/vehicle-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function VehicleTaxCalculator() {
  // Estado para los valores del formulario
  const [brand, setBrand] = useState("")
  const [line, setLine] = useState("")
  const [model, setModel] = useState("")
  const [price, setPrice] = useState(0)
  const [availableLines, setAvailableLines] = useState<string[]>([])
  const [availableModels, setAvailableModels] = useState<string[]>([])

  // Estado para los descuentos
  const [earlyPayment, setEarlyPayment] = useState(false)
  const [publicService, setPublicService] = useState(false)
  const [registrationTransfer, setRegistrationTransfer] = useState(false)

  // Estado para los resultados y errores
  //esta variable luego se usa _taxAmount
  const [taxAmount, setTaxAmount] = useState<number | null>(null)
  console.log(taxAmount);
  const [finalAmount, setFinalAmount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [calculationDetails, setCalculationDetails] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("vehicle")

  // Actualizar líneas disponibles cuando cambia la marca
  useEffect(() => {
    if (brand) {
      const brandData = vehicleData.find((v) => v.brand === brand)
      if (brandData) {
        setAvailableLines(brandData.lines.map((l) => l.name))
      } else {
        setAvailableLines([])
      }
      setLine("")
      setModel("")
      setPrice(0)
    } else {
      setAvailableLines([])
    }
  }, [brand])

  // Actualizar modelos disponibles cuando cambia la línea
  useEffect(() => {
    if (brand && line) {
      const brandData = vehicleData.find((v) => v.brand === brand)
      if (brandData) {
        const lineData = brandData.lines.find((l) => l.name === line)
        if (lineData) {
          setAvailableModels(lineData.models.map((m) => m.year.toString()))
        } else {
          setAvailableModels([])
        }
      }
      setModel("")
      setPrice(0)
    } else {
      setAvailableModels([])
    }
  }, [brand, line])

  // Actualizar precio cuando cambia el modelo
  useEffect(() => {
    if (brand && line && model) {
      const brandData = vehicleData.find((v) => v.brand === brand)
      if (brandData) {
        const lineData = brandData.lines.find((l) => l.name === line)
        if (lineData) {
          const modelData = lineData.models.find((m) => m.year.toString() === model)
          if (modelData) {
            setPrice(modelData.price)
          } else {
            setPrice(0)
          }
        }
      }
    }
  }, [brand, line, model])

  // Calcular impuesto
  const calculateTax = () => {
    // Validar que todos los campos estén completos
    if (!brand || !line || !model) {
      setError("Por favor complete todos los campos del vehículo.")
      setShowResults(false)
      return
    }

    if (price === 0) {
      setError("No se encontró información de precio para el vehículo seleccionado.")
      setShowResults(false)
      return
    }

    // Encontrar el rango de impuesto aplicable
    const taxRange = taxRanges.find((range) => price > range.min && price <= range.max)

    if (!taxRange) {
      setError("No se pudo determinar el rango de impuesto para este vehículo.")
      setShowResults(false)
      return
    }

    // Calcular impuesto base
    const baseTax = price * (taxRange.percentage / 100)

    // Aplicar descuentos en orden
    let currentTax = baseTax
    const details: string[] = [
      `Valor del vehículo: $${price.toLocaleString()}`,
      `Impuesto base (${taxRange.percentage}%): $${baseTax.toLocaleString()}`,
    ]

    // Descuento por pronto pago (10%)
    if (earlyPayment) {
      const discount = currentTax * 0.1
      details.push(`Descuento por pronto pago (10%): -$${discount.toLocaleString()}`)
      currentTax -= discount
    }

    // Descuento por vehículo de servicio público ($50,000)
    if (publicService) {
      const discount = 50000
      details.push(`Descuento por vehículo de servicio público: -$${discount.toLocaleString()}`)
      currentTax -= discount
      if (currentTax < 0) currentTax = 0
    }

    // Descuento por traslado de registro (5%)
    if (registrationTransfer) {
      const discount = currentTax * 0.05
      details.push(`Descuento por traslado de registro (5%): -$${discount.toLocaleString()}`)
      currentTax -= discount
    }

    details.push(`Impuesto final a pagar: $${currentTax.toLocaleString()}`)

    // Actualizar estado
    setTaxAmount(baseTax)
    setFinalAmount(currentTax)
    setCalculationDetails(details)
    setError(null)
    setShowResults(true)
    setActiveTab("results")
  }

  // Reiniciar formulario
  const resetForm = () => {
    setBrand("")
    setLine("")
    setModel("")
    setPrice(0)
    setEarlyPayment(false)
    setPublicService(false)
    setRegistrationTransfer(false)
    setTaxAmount(null)
    setFinalAmount(null)
    setError(null)
    setCalculationDetails([])
    setShowResults(false)
    setActiveTab("vehicle")
  }

  return (
    <div className="grid gap-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>Vehículo</span>
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Descuentos</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Resultados</span>
            {showResults && (
              <Badge variant="secondary" className="ml-2">
                1
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle" className="mt-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                <CardTitle>Información del Vehículo</CardTitle>
              </div>
              <CardDescription>
                Seleccione las características de su vehículo para calcular el impuesto.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    Marca
                  </Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger id="brand" className="h-12">
                      <SelectValue placeholder="Seleccione una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleData.map((vehicle) => (
                        <SelectItem key={vehicle.brand} value={vehicle.brand}>
                          {vehicle.brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line" className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    Línea
                  </Label>
                  <Select value={line} onValueChange={setLine} disabled={!brand}>
                    <SelectTrigger id="line" className="h-12">
                      <SelectValue placeholder="Seleccione una línea" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLines.map((lineName) => (
                        <SelectItem key={lineName} value={lineName}>
                          {lineName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Modelo (Año)
                  </Label>
                  <Select value={model} onValueChange={setModel} disabled={!line}>
                    <SelectTrigger id="model" className="h-12">
                      <SelectValue placeholder="Seleccione un modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((modelYear) => (
                        <SelectItem key={modelYear} value={modelYear}>
                          {modelYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Valor del Vehículo
                </Label>
                <Input
                  id="price"
                  type="text"
                  value={price > 0 ? `$${price.toLocaleString()}` : ""}
                  readOnly
                  className="bg-gray-50 h-12 text-lg font-medium"
                />
              </div>

              {brand && line && model && <VehicleDisplay brand={brand} line={line} model={model} />}

              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab("discounts")}
                  disabled={!brand || !line || !model}
                  className="mt-4"
                  size="lg"
                >
                  Continuar a Descuentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discounts" className="mt-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <CardTitle>Descuentos Aplicables</CardTitle>
              </div>
              <CardDescription>Seleccione los descuentos que aplican para su vehículo.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                  className={`border-2 transition-all ${earlyPayment ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Pronto Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">10% de descuento si paga antes del 31 de marzo</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="earlyPayment"
                        checked={earlyPayment}
                        onCheckedChange={(checked) => setEarlyPayment(checked === true)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="earlyPayment" className="font-medium">
                        Aplicar descuento
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 transition-all ${publicService ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bus className="h-5 w-5 text-primary" />
                      Servicio Público
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      $50.000 de descuento para vehículos de servicio público
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="publicService"
                        checked={publicService}
                        onCheckedChange={(checked) => setPublicService(checked === true)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="publicService" className="font-medium">
                        Aplicar descuento
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 transition-all ${registrationTransfer ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Traslado de Registro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      5% de descuento por traslado de registro a una nueva ciudad
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="registrationTransfer"
                        checked={registrationTransfer}
                        onCheckedChange={(checked) => setRegistrationTransfer(checked === true)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor="registrationTransfer" className="font-medium">
                        Aplicar descuento
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setActiveTab("vehicle")} size="lg">
                  Volver a Vehículo
                </Button>
                <Button onClick={calculateTax} size="lg" className="gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Calcular Impuesto
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <CardTitle>Resultado del Cálculo</CardTitle>
              </div>
              <CardDescription>Impuesto a pagar por su vehículo.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle className="text-lg">Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showResults ? (
                <div className="space-y-6">
                  {brand && line && model && (
                    <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                      <VehicleDisplay brand={brand} line={line} model={model} />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {brand} {line} {model}
                        </h3>
                        <p className="text-muted-foreground">Valor: ${price.toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Detalles del Cálculo
                    </h3>
                    <div className="space-y-4">
                      {calculationDetails.map((detail, index) => {
                        if (index === calculationDetails.length - 1) {
                          return (
                            <div key={index} className="mt-6 pt-4 border-t">
                              <p className="text-2xl font-bold text-primary">{detail}</p>
                            </div>
                          )
                        }

                        if (detail.includes("Descuento")) {
                          return (
                            <div key={index} className="flex justify-between items-center text-green-600">
                              <span>{detail.split(":")[0]}:</span>
                              <span className="font-medium">{detail.split(":")[1]}</span>
                            </div>
                          )
                        }

                        return (
                          <div key={index} className="flex justify-between items-center">
                            <span>{detail.split(":")[0]}:</span>
                            <span className="font-medium">{detail.split(":")[1]}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {finalAmount !== null && (
                    <div className="bg-primary/10 rounded-lg p-6 border border-primary/20">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-primary mb-2">Total a Pagar</h3>
                        <p className="text-4xl font-bold text-primary">${finalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No hay resultados disponibles</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete la información del vehículo y los descuentos aplicables para calcular el impuesto.
                  </p>
                  <Button onClick={() => setActiveTab("vehicle")}>Ir a Información del Vehículo</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} size="lg">
                Nuevo Cálculo
              </Button>
              {showResults && (
                <Button variant="default" size="lg" className="gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pagar Impuesto
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

