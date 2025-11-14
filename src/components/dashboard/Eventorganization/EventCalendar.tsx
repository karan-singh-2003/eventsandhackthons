"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 9))
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const days = []
  const totalCells = firstDayOfMonth(currentDate) + daysInMonth(currentDate)

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfMonth(currentDate)) {
      days.push(null)
    } else {
      days.push(i - firstDayOfMonth(currentDate) + 1)
    }
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentDate(new Date(selectedYear, monthIndex, 1))
    setShowMonthYearPicker(false)
  }

  const handleYearChange = (direction: "prev" | "next") => {
    setSelectedYear((prev) => (direction === "prev" ? prev - 1 : prev + 1))
  }

  return (
    <Card className="p-6 bg-white">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
            onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
          >
            {monthName}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth} className="border-border bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="border-border bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showMonthYearPicker && (
          <div className="border-t border-border pt-4 pb-4 mb-4">
            {/* Year selector */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleYearChange("prev")}
                className="border-border bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold text-foreground">{selectedYear}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleYearChange("next")}
                className="border-border bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    py-2 px-3 rounded-md text-sm font-medium transition-colors
                    ${
                      currentDate.getMonth() === index && currentDate.getFullYear() === selectedYear
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }
                  `}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center rounded-md text-sm font-medium
                ${
                  day === null
                    ? ""
                    : day === 9
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 cursor-pointer text-foreground"
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
