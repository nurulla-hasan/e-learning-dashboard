"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

export default function CustomAddForm() {
  const [conditions, setConditions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const handleAddCondition = () => {
    if (inputValue.trim() !== "") {
      setConditions([...conditions, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleDeleteCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCondition()
    }
  }

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Features</h2>

      {/* Add Condition Form */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a condition..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddCondition}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Conditions ({conditions.length})</h3>

        {conditions.length === 0 ? (
          <p className="text-gray-500 text-center py-4 italic">No conditions added yet</p>
        ) : (
          <ul className="space-y-2">
            {conditions.map((condition, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-800 flex-1">{condition}</span>
                <button
                  onClick={() => handleDeleteCondition(index)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  aria-label={`Delete condition: ${condition}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary */}
      {conditions.length > 0 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Total conditions:</strong> {conditions.length}
          </p>
        </div>
      )}
    </div>
  )
}
