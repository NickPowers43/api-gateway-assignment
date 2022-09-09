import {ratelimit} from "../../../decorators/ratelimit"
import {CountryString, IPInfoServiceLike, IPString} from "../index"
import config from "../../../config"

export default class IPStackService implements IPInfoServiceLike {
  @ratelimit(config.IPSTACK_MAX_CALLS)
  GetCountry(addr: IPString): Promise<CountryString> {
    return fetch(`${config.IPSTACK_API_BASE_URL}${addr}?access_key=${encodeURI(config.IPSTACK_API_KEY)}`)
      .then(res => res.json())
      .then(obj => {
        return obj.country_name
      })
  }
}