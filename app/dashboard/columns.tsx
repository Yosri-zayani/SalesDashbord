'use client'

import { ColumnDef } from "@tanstack/react-table"

export type SalesData = {
  Date: string
  HourSlot: string
  Division: string
  Categories: string
  PredictedNetSales: number
}

export const columns: ColumnDef<SalesData>[] = [
  {
    accessorKey: "Date",
    header: "Date",
  },
  {
    accessorKey: "HourSlot",
    header: "Hour Slot",
  },
  {
    accessorKey: "Division",
    header: "Division",
  },
  {
    accessorKey: "Categories",
    header: "Category",
  },
  {
    accessorKey: "PredictedNetSales",
    header: "Predicted Net Sales",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("PredictedNetSales"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
]

