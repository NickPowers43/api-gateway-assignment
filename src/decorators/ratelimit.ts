import KeyedDataProvider from "./KeyedDataProvider";


export class RateLimitError extends Error {
  constructor() {
    super('call rate limit exceeded');
  }
}

const MINUTE_MS = 60000
const HOUR_MS = 60 * MINUTE_MS

export const RateLimitInfo = Symbol()

/**
 * Prevents the decorated function from being called more than maxPerHour times/hour. Accurate to within 1 minute.
 */
export function ratelimit(maxPerHour: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('ratelimit decorator can only be applied to functions')
    }
    const getState = KeyedDataProvider(RateLimitInfo, () => ({
      handle: null,
      callsInLastHour: 0,
      callsInLastMinute: 0
    }))
    const innerFunc = descriptor.value
    descriptor.value = function (...args) {

      const state = getState(this, propertyKey)

      if (state.callsInLastHour >= maxPerHour) {
        throw new RateLimitError()
      }
      state.callsInLastHour++
      state.callsInLastMinute++
      if (state.handle === null) {
        state.handle = setTimeout(() => {
          state.handle = null
          const callsThisMinute = state.callsInLastMinute
          state.callsInLastMinute = 0
          setTimeout(() => {
            state.callsInLastHour -= callsThisMinute
          }, HOUR_MS)
        }, MINUTE_MS)
      }
      return innerFunc.apply(this, args)
    }
  }

}