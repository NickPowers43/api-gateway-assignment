export type IPString = string
export type CountryString = string

export class IPNotFoundError extends Error {}

/**
 * Interface which must be implemented by objects providing IP info services
 */
export interface IPInfoServiceLike {
  GetCountry(addr: IPString): Promise<CountryString>
}

