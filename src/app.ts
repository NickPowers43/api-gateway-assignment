import express from 'express'
import {RateLimitError} from "./decorators/ratelimit"
import {IPInfoService} from "./services/IPInfoService/IPInfoService";

const app = express()

const locationService = new IPInfoService()

app.get('/:ip/country', async (req, res) => {

  const address = req.params.ip

  if (!/^\d+\.\d+\.\d+\.\d+$/.test(address)) {
    res.status(400).send('Bad Request: Expected ip to match #.#.#.# format')
    return
  }

  try {
    const response = await locationService.GetCountry(address)
    res.status(200).contentType('text/plain').send(response)
  } catch (e) {
    if (e instanceof RateLimitError) {
      res.sendStatus(503)
    } else if (e instanceof Error) {
      res.sendStatus(500)
    }
  }
})

export default app