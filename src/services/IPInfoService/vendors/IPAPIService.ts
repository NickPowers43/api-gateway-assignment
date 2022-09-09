import {ratelimit} from "../../../decorators/ratelimit"
import {CountryString, IPInfoServiceLike, IPString} from "../index"
import config from "../../../config"

export default class IPAPIService implements IPInfoServiceLike {
  @ratelimit(config.IPAPI_MAX_CALLS)
  GetCountry(addr: IPString): Promise<CountryString> {
    return fetch(`${config.IPAPI_API_BASE_URL}json/${addr}?fields=country`)
      .then(res => res.json())
      .then(obj => {
        return obj.country
      })
  }
}