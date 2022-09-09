
jest.useFakeTimers()

const {ratelimit, RateLimitError} = require("./ratelimit")

describe('ratelimit decorator', () => {

  let jFunc: ReturnType<typeof jest.fn>
  let obj: Class

  class Class {
    @ratelimit(3)
    method(...args) {
      jFunc(...args)
    }
  }

  beforeEach(() => {
    jFunc = jest.fn()
    obj = new Class()
  })

  test('It should relay arguments', () => {

    obj.method('a', 'b', 'c')
    expect(jFunc).toHaveBeenCalledWith('a', 'b', 'c')

  })

  test('It should call original method', () => {

    obj.method()
    expect(jFunc).toHaveBeenCalledTimes(1)

  })

  test('It should fail after limit reached', () => {

    obj.method()
    obj.method()
    obj.method()
    expect(() => obj.method()).toThrow()
    expect(jFunc).toHaveBeenCalledTimes(3)

  })

  test('It should not call more than 3 times/hr', () => {

    const advanceByMinutes = amount => jest.advanceTimersByTime(amount * 60 * 1000)

    obj.method()
    obj.method()

    advanceByMinutes(30)

    obj.method()
    expect(() => obj.method()).toThrow()

    advanceByMinutes(31)

    obj.method()
    obj.method()
    expect(() => obj.method()).toThrow()

    advanceByMinutes(30)

    obj.method()
    expect(() => obj.method()).toThrow()

    advanceByMinutes(61)

    obj.method()
    obj.method()
    obj.method()
    expect(() => obj.method()).toThrow()

  })

})
