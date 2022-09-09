import KeyedDataProvider from "./KeyedDataProvider";

export const MethodCache = Symbol()

/**
 * Prevents the decorated function from being called if it has been called before with the same argument.
 * Note: Caching mechanism is simplistic and does not have a set capacity.
 * Note: If the function returns a promise then the promise will be cached meaning rejections will be cached
 */
export function cached<T extends (arg: any) => any>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  const originalFunc = descriptor.value
  if (typeof originalFunc !== 'function') {
    throw new Error('cache decorator can only be applied to functions')
  } else if (originalFunc.length !== 1) {
    throw new Error('cache decorator can only be applied to functions with one parameter')
  }
  const getState = KeyedDataProvider(MethodCache, () => new Map())

  descriptor.value = function(arg: any) {

    const state = getState(this, propertyKey)

    let output = state.get(arg)
    if (!output) {
      output = originalFunc.apply(this, [arg])
      state.set(arg, output)
    }
    return output
  } as T
}
