import IPStackService from "./vendors/IPStackService";
import IPAPIService from "./vendors/IPAPIService";
import {cached} from "../../decorators/cached";
import {CountryString, IPInfoServiceLike, IPString} from "./index";

export class IPInfoService implements IPInfoServiceLike {

  private readonly serviceVendors = [
    new IPStackService() as IPInfoServiceLike,
    new IPAPIService() as IPInfoServiceLike
  ] as const

  private InvokeVendorMethod<Method extends keyof IPInfoServiceLike>(method: Method, ...args: Parameters<IPInfoServiceLike[Method]>): ReturnType<IPInfoServiceLike[Method]> {
    let lastError: any = null
    for (const service of this.serviceVendors) {
      try {
        return service[method].apply(service, args)
      } catch (e) {
        lastError = e
      }
    }
    throw lastError
  }

  @cached
  GetCountry(addr: IPString): Promise<CountryString> {
    return this.InvokeVendorMethod('GetCountry', addr)
  }
}