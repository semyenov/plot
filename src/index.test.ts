import { writeFile } from 'node:fs/promises'

import { generateCharts } from '.'

import type { IRow } from '.'


// Mock the writeFile function
jest.mock('node:fs/promises', () => ({
  writeFile: jest.fn(),
}))

describe('generateCharts', () => {
  it('should generate charts and write them to files', async () => {
    // Mock the result.data
    const result = {
      data: [
        { partner: 'partner1', year: 2021, quarter: 1, value: 100 },
        { partner: 'partner1', year: 2021, quarter: 2, value: 200 },
        { partner: 'partner2', year: 2021, quarter: 1, value: 150 },
        { partner: 'partner2', year: 2021, quarter: 2, value: 250 },
      ] as IRow[],
    }

    // Call the generateCharts function
    await generateCharts(result)

    // Assert that the writeFile function was called with the correct arguments
    expect(writeFile).toHaveBeenCalledTimes(2)
    expect(writeFile).toHaveBeenCalledWith(
      './out/partner1.svg',
      expect.any(String),
    )
    expect(writeFile).toHaveBeenCalledWith(
      './out/partner2.svg',
      expect.any(String),
    )
  })
})
