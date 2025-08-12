import { COLOR_1, COLOR_2, COLOR_5 } from '@/constants/chart.constant'
import { useGetDashboardQuery } from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const BasicLine = () => {
  const [chartData, setChartData] = useState([
    { name: 'Canjes realizados', data: [] },
    { name: 'Canjes activos', data: [] },
    { name: 'Nuevos Canjes', data: [] },
  ])
  const [months, setMonths] = useState([])
  const { data } = useGetDashboardQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (data?.personalInfo?.metadataKanjesByMonth) {
      const sortedDataByMonth = [
        ...data.personalInfo.metadataKanjesByMonth,
      ].sort((a, b) => new Date(a.date) - new Date(b.date))

      const newDataExchange = [
        { name: 'Canjes realizados', data: [] },
        { name: 'Canjes activos', data: [] },
        { name: 'Nuevos Canjes', data: [] },
      ]

      const uniqueMonths = sortedDataByMonth.map((item) => {
        const date = new Date(item.date)
        const month = date.toLocaleString('default', { month: 'short' })
        return `${month}-${date.getFullYear().toString().substr(-2)}`
      })

      sortedDataByMonth.forEach((item) => {
        newDataExchange[0].data.push(item.kanjesCompleted ?? 0)
        newDataExchange[1].data.push(item.kanjesActives ?? 0)
        newDataExchange[2].data.push(item.newKanjes ?? 0)
      })

      setChartData(newDataExchange)
      setMonths([...new Set(uniqueMonths)])
    } else {
      setChartData([
        { name: 'Canjes realizados', data: [0] },
        { name: 'Canjes activos', data: [0] },
        { name: 'Nuevos Canjes', data: [0] },
      ])
      setMonths(['No meses disponibles'])
    }
  }, [data])

  return (
    <Chart
      options={{
        chart: {
          type: 'line',
          zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        colors: [COLOR_2, COLOR_1, COLOR_5],
        xaxis: {
          categories: months.length > 0 ? months : ['No meses disponibles'],
        },
      }}
      series={chartData}
      height={300}
      type="line"
    />
  )
}

export default BasicLine
