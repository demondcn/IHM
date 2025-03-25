"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { taxRanges } from "@/lib/data"
import { Plus, Trash2, Settings2 } from "lucide-react"

export default function TaxRangeEditor() {
  const [ranges, setRanges] = useState([...taxRanges])
  const [newRange, setNewRange] = useState({ min: 0, max: 0, percentage: 0 })

  const handleAddRange = () => {
    if (newRange.min >= 0 && newRange.max > newRange.min && newRange.percentage > 0) {
      setRanges([...ranges, newRange])
      setNewRange({ min: 0, max: 0, percentage: 0 })
    }
  }

  const handleRemoveRange = (index: number) => {
    const updatedRanges = [...ranges]
    updatedRanges.splice(index, 1)
    setRanges(updatedRanges)
  }

  const handleUpdateRange = (index: number, field: string, value: number) => {
    const updatedRanges = [...ranges]
    updatedRanges[index] = { ...updatedRanges[index], [field]: value }
    setRanges(updatedRanges)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Editar Rangos de Impuestos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Rangos de Impuestos</DialogTitle>
          <DialogDescription>Modifique los rangos y porcentajes de impuestos para los vehículos.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Valor Mínimo</TableHead>
                <TableHead>Valor Máximo</TableHead>
                <TableHead>Porcentaje</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranges.map((range, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="number"
                      value={range.min}
                      onChange={(e) => handleUpdateRange(index, "min", Number(e.target.value))}
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={range.max === Number.POSITIVE_INFINITY ? 999999999 : range.max}
                      onChange={(e) =>
                        handleUpdateRange(
                          index,
                          "max",
                          Number(e.target.value) === 999999999 ? Number.POSITIVE_INFINITY : Number(e.target.value),
                        )
                      }
                      min={range.min + 1}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={range.percentage}
                      onChange={(e) => handleUpdateRange(index, "percentage", Number(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRange(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="min">Mínimo</Label>
            <Input
              id="min"
              type="number"
              value={newRange.min}
              onChange={(e) => setNewRange({ ...newRange, min: Number(e.target.value) })}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Máximo</Label>
            <Input
              id="max"
              type="number"
              value={newRange.max}
              onChange={(e) => setNewRange({ ...newRange, max: Number(e.target.value) })}
              min={newRange.min + 1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentage">Porcentaje</Label>
            <Input
              id="percentage"
              type="number"
              value={newRange.percentage}
              onChange={(e) => setNewRange({ ...newRange, percentage: Number(e.target.value) })}
              min="0"
              step="0.1"
            />
          </div>
          <Button onClick={handleAddRange}>
            <Plus className="h-4 w-4 mr-2" /> Añadir
          </Button>
        </div>

        <DialogFooter>
          <Button type="submit">Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

