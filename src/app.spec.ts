
const app = require('./app').default
const server = app.listen()
const request = require('supertest').agent(server)
const dns = require('dns')

const AWS_SERVICE_API_DOMAIN_AND_COUNTRY = [
  ['quicksight.us-east-1.amazonaws.com', 'United States'],
  ['quicksight.ap-northeast-2.amazonaws.com', 'South Korea'],
  ['quicksight.eu-central-1.amazonaws.com', 'Germany'],
]

describe('Test GetCountry path', () => {

  afterAll(() => {
    server.close()
  })

  test('It should return correct country', async () => {
    const expectedMappings = await Promise.all(AWS_SERVICE_API_DOMAIN_AND_COUNTRY.map(([domain, country]) => {
      return new Promise((res, rej) => {
        return dns.resolve4(domain, (err, addresses) => {
          err ? rej(err) : res([addresses[0], country])
        })
      })
    }))
    await Promise.all(expectedMappings.map(async ([ip, country]) => {
      const res = await request.get(`/${ip}/country`).accept('text/plain')
      expect(res.statusCode).toBe(200)
      expect(res.text).toEqual(country)
    }))
  })

  test('It should reject bad IP', async () => {
    const response = await request.get("/23.2/country")
    expect(response.statusCode).toBe(400)
  })

})
