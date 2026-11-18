import { groupBy, map, mergeMap, scan } from 'rxjs'

/**
 * Create a rolling moving-average stream, isolated by device and metric.
 * Each output contains the source reading metadata plus the rolling average.
 * The first output is emitted immediately using the samples received so far.
 */
export function createMovingAverageStream(readings$, windowSize = 10) {
  const size = Number(windowSize)
  if (!Number.isInteger(size) || size < 1 || size > 10000) {
    throw new RangeError('Moving-average window size must be an integer between 1 and 10000.')
  }

  return readings$.pipe(
    groupBy((reading) => `${reading.metadata?.deviceId ?? 'unknown'}::${reading.metadata?.metric ?? 'value'}`),
    mergeMap((deviceMetric$) => deviceMetric$.pipe(
      scan((state, reading) => {
        const nextValues = [...state.values, reading.value]
        if (nextValues.length > size) nextValues.shift()
        const sum = state.sum + reading.value - (state.values.length === size ? state.values[0] : 0)
        return { values: nextValues, sum, latest: reading }
      }, { values: [], sum: 0, latest: null }),
      map(({ values, sum, latest }) => ({
        deviceId: latest.metadata?.deviceId ?? 'unknown',
        metric: latest.metadata?.metric ?? 'value',
        average: sum / values.length,
        rawValue: Number(latest.value),
        sampleCount: values.length,
        windowSize: size,
        unit: latest.unit || '',
        timestamp: latest.timestamp,
        calculatedAt: new Date().toISOString(),
      })),
    )),
  )
}
