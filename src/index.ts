import { writeFile } from 'node:fs/promises'
import process from 'node:process'

import { JSDOM } from 'jsdom'
import { createClient } from '@clickhouse/client'
import { barY, plot, ruleY } from '@observablehq/plot'

// row data structure
export interface IRow {
  partner: string
  year: number
  quarter: number
  value: number
}

(async () => {
  // create virtual document
  const document = new JSDOM(`<!DOCTYPE html>
  <head><meta charset="UTF-8"></head>
  <body></body>`).window.document

  // // create client and query data
  // const client = createClient({
  //   host: process.env.CLICKHOUSE_HOST || 'localhost',
  //   username: process.env.CLICKHOUSE_USER || 'default',
  //   password: process.env.CLICKHOUSE_PASSWORD || 'default',
  //   database: process.env.CLICKHOUSE_DATABASE || 'default',
  // })

  // const query = await client.query({
  //   query: `SELECT
  //     toQuarter(Period) as quarter,
  //     toYear(Period) as year,
  //     Partner as partner,
  //     sum(Price) as value
  //   FROM Sales
  //   WHERE Period >= toDateTime(date_sub(now(), interval 4 year))
  //   GROUP BY partner, year, quarter
  //   ORDER BY partner, year, quarter;`,
  // })

  // const result = await query.json<{
  //   data: {
  //     partner: string
  //     year: number
  //     quarter: number
  //     value: number
  //   }[]
  // }>()

  const result = {
    data: Array.from({ length: 10000 }).map((_, i) => ({
      partner: `Partner ${Math.floor(i / 100)}`,
      year: Math.floor(Math.random() * 4) + 2019,
      quarter: Math.floor(Math.random() * 4) + 1,
      value: Math.floor(Math.random() * 10000) + 1000,
    })),
  }

  // charts data
  const chartsData: IRow[][] = []

  // data is ordered by partner
  // so we can group it in one iteration
  let partner = ''
  for (const item of result.data) {
    if (partner !== item.partner) {
      partner = item.partner
      chartsData.push([])
    }

    chartsData[chartsData.length - 1].push(item)
  }

  // and iterate through creating charts
  const promises = chartsData.map(async (data) => {
    const chart = plot({
      document,
      width: 800,
      height: 600,
      color: {
        scheme: 'tableau10',
        legend: false,
      },
      x: {
        label: 'год',
        tickFormat: 'm',
        paddingOuter: 0.2,
      },
      y: {
        label: 'всего р.',
        type: 'linear',
        tickFormat: 's',
        grid: true,
      },
      fx: {
        label: 'квартал',
      },
      marks: [
        barY(data, {
          x: 'year',
          y: 'value',
          fill: 'year',
          fx: 'quarter',
        }),
        ruleY([0]),
      ],
    })

    return writeFile(`./out/${data[0].partner}.svg`, chart.outerHTML)
  })

  await Promise.all(promises)
})()
