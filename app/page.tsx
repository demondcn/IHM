import { EmployeeSalaryCalculator } from "@/components/employee-salary-calculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Sistema de Cálculo de Salario</h1>
        <EmployeeSalaryCalculator />
      </div>
    </main>
  )
}

