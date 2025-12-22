'use client'

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface AttendanceData {
  name: string
  value: number
  color: string
}

interface AttendancePieChartProps {
  data: AttendanceData[]
  title: string
}

export default function AttendancePieChart({ data, title }: AttendancePieChartProps) {
  // Calculate total for percentage display
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <h3 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1D23',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            formatter={(value: number) => [`${value}`, 'Count']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{
              color: '#A1A1AA',
              paddingTop: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg text-center"
            style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm" style={{ color: '#A1A1AA' }}>
                {item.name}
              </span>
            </div>
            <p className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
              {item.value}
            </p>
            <p className="text-xs" style={{ color: '#A1A1AA' }}>
              {((item.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
