
const {cached} = require("./cached")

describe('cached decorator', () => {

  let jFunc: ReturnType<typeof jest.fn>
  let obj: Class

  class Class {
    @cached
    method(arg) {
      return jFunc(arg)
    }
  }

  beforeEach(() => {
    jFunc = jest.fn().mockImplementation((arg) => arg)
    obj = new Class()
  })

  test('It should relay single argument', () => {

    obj.method('a')
    expect(jFunc).toHaveBeenCalledWith('a')

  })

  test('It should not call again with same params', () => {

    obj.method('a')
    expect(jFunc).toHaveBeenCalledTimes(1)
    expect(jFunc).toHaveBeenLastCalledWith('a')
    obj.method('a')
    expect(jFunc).toHaveBeenCalledTimes(1)

  })

  test('It should call again if params are different', () => {

    const aRes = obj.method('a')
    expect(jFunc).toHaveBeenCalledTimes(1)
    expect(jFunc).toHaveBeenLastCalledWith('a')
    const bRes = obj.method('b')
    expect(jFunc).toHaveBeenCalledTimes(2)
    expect(jFunc).toHaveBeenLastCalledWith('b')
    expect(obj.method('a')).toEqual(aRes)
    expect(jFunc).toHaveBeenCalledTimes(2)
    expect(obj.method('b')).toEqual(bRes)
    expect(jFunc).toHaveBeenCalledTimes(2)

  })

})
