import {ratelimit} from "../../../decorators/ratelimit"
import {CountryString, IPInfoServiceLike, IPNotFoundError, IPString} from "../index"
import config from "../../../config"

export default class IPAPIService implements IPInfoServiceLike {
  @ratelimit(config.IPAPI_MAX_CALLS)
  GetCountry(addr: IPString): Promise<CountryString> {
    return fetch(`${config.IPAPI_API_BASE_URL}json/${addr}?fields=country`)
      .then(res => {
        if (res.ok) {
          return res.json()
        } else if (res.status === 404) {
          throw new IPNotFoundError()
        } else {
          throw new Error(`something went wrong fetching info about IP ${addr}`)
        }
      })
      .then(obj => {
        const country = obj?.country
        if (typeof country !== 'string' || !country) {
          throw new IPNotFoundError()
        }
        return country
      })
  }
}