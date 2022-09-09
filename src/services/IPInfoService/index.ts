export type IPString = string
export type CountryString = string

/**
 * Interface which must be implemented by objects providing IP info services
 */
export interface IPInfoServiceLike {
  GetCountry(addr: IPString): Promise<CountryString>
}

