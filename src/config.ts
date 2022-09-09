
const config = {

  PORT: parseInt(process.env.PORT ?? '80'),

  IPSTACK_API_BASE_URL: process.env.IPSTACK_API_BASE_URL ?? 'http://api.ipstack.com/',
  IPSTACK_API_ACCESS_KEY: process.env.IPSTACK_API_ACCESS_KEY,
  IPSTACK_MAX_CALLS: parseInt(process.env.IPSTACK_MAX_CALLS ?? '100'),

  IPAPI_API_BASE_URL: process.env.IPAPI_API_BASE_URL ?? 'http://ip-api.com/',
  IPAPI_ACCESS_KEY: process.env.IPAPI_ACCESS_KEY,
  IPAPI_MAX_CALLS: parseInt(process.env.IPAPI_MAX_CALLS ?? '100'),

} as const

export default config