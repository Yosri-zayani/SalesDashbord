'use client'

import { useState, useEffect } from 'react'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DataTable } from './date-table'
import { ColumnDef } from '@tanstack/react-table'
interface SalesData {
  Date: string
  PredictedNetSales: number
}
const columns: ColumnDef<SalesData, any>[] = [
    {
      header: 'Date',
      accessorFn: (row) => row.Date, // Ensure an accessor function or key is set
      id: 'date',
    },
    {
      header: 'Predicted Net Sales',
      accessorFn: (row) => row.PredictedNetSales,
      id: 'predictedNetSales',
    },
  ];

export default function Dashboard() {
  const [startDate, setStartDate] = useState<Date>(parseISO('2024-10-19'))
  const [endDate, setEndDate] = useState<Date>(parseISO('2025-01-19'))
  const [division, setDivision] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [data, setData] = useState<SalesData[]>([])

  useEffect(() => {
    fetchData()
  }, [startDate, endDate, division, category])

  const fetchData = async () => {
    const res = await fetch(`/api/sales?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}&division=${division}&category=${category}`)
    const jsonData = await res.json()
    setData(jsonData)
  }

  const resetFilters = () => {
    setStartDate(parseISO('2024-10-19'))
    setEndDate(parseISO('2025-01-19'))
    setDivision('')
    setCategory('')
  }

  const totalSales = data.reduce((sum, item) => sum + item.PredictedNetSales, 0)
  const averageSales = totalSales / data.length || 0

  const chartData = data.reduce<Record<string, { date: string; sales: number }>>((acc, item) => {
    const date = item.Date.split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, sales: 0 }
    }
    acc[date].sales += item.PredictedNetSales
    return acc
  }, {})

  return (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="range"
              selected={{ from: startDate, to: endDate }}
              onSelect={(range) => {
                if (range?.from) setStartDate(startOfDay(range.from))
                if (range?.to) setEndDate(endOfDay(range.to))
              }}
              disabled={(date) => date < parseISO('2024-10-19') || date > parseISO('2025-01-19')}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={division} onValueChange={setDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All divisions">All Divisions</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Delivery">Delivery</SelectItem>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Garniture">Garniture</SelectItem>
                <SelectItem value="Nourriture">Nourriture</SelectItem>
                <SelectItem value="Ingrédients mix">Ingrédients mix</SelectItem>
                <SelectItem value="Dogs">Dogs</SelectItem>
                <SelectItem value="Boissons alcolisées">Boissons alcolisées</SelectItem>
                <SelectItem value="Boissons non alcool">Boissons non alcool</SelectItem>
                <SelectItem value="Burgers">Burgers</SelectItem>
                <SelectItem value="Frites">Frites</SelectItem>
                <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                <SelectItem value="QR CODE">QR CODE</SelectItem>
                <SelectItem value="MISC">MISC</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSales.toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{averageSales.toFixed(2)} €</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Object.values(chartData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Detailed Data</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>    
  )
}

