import {ratelimit} from "../../../decorators/ratelimit"
import {CountryString, IPInfoServiceLike, IPNotFoundError, IPString} from "../index"
import config from "../../../config"

export default class IPStackService implements IPInfoServiceLike {
  @ratelimit(config.IPSTACK_MAX_CALLS)
  GetCountry(addr: IPString): Promise<CountryString> {
    return fetch(`${config.IPSTACK_API_BASE_URL}${addr}?access_key=${encodeURI(config.IPSTACK_API_KEY)}`)
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
        const country = obj?.country_name
        if (typeof country !== 'string' || !country) {
          throw new IPNotFoundError()
        }
        return country
      })
      .catch(e => {
        throw new IPNotFoundError()
      })
  }
}