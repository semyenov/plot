import { writeFile } from 'node:fs/promises'

import { JSDOM } from 'jsdom'
import { barY, plot, ruleY } from '@observablehq/plot'

export interface IRow {
  partner: string
  year: number
  quarter: number
  value: number
}

export async function generateCharts(result: { data: IRow[] }): Promise<void> {
  const document = new JSDOM(`<!DOCTYPE html>
  <head><meta charset="UTF-8"></head>
  <body></body>`).window.document

  const chartsData: IRow[][] = []
  let currentPartner = ''
  for (const item of result.data) {
    if (currentPartner !== item.partner) {
      currentPartner = item.partner
      chartsData.push([])
    }

    chartsData[chartsData.length - 1].push(item)
  }

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
}
