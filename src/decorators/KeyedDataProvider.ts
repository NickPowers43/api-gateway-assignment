/**
 * Helpful utility for decorators that need a function to help store any per-instance related state. this[storeSym] is
 * used to store entries for each unique property that needs state
 *
 * Note: values stored in this way must be mutated internally since this only provides values
 *
 * @returns a function which can be called with a reference to the class instance whose property was decorated and the
 * name/key of the property. It will then provide the value already stored on obj or create a default value and return
 * it
 */
export default function KeyedDataProvider<T extends {}>(storeSym: symbol, defaultFactory: () => T): (obj: any, key: string) => T {
  return function(obj: any, key: string) {
    let state = obj[storeSym]
    if (!state) {
      state = {}
      obj[storeSym] = state
    }
    state = state[key]
    if(!state) {
      state = defaultFactory()
      obj[storeSym][key] = state
    }
    return state as T
  }
}
