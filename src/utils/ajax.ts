import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import env from './env'

@Injectable()
export class Ajax {
  constructor(private readonly configService: ConfigService) {}

  async get(path) {
    const binanceBaseUrl = this.configService.get(env.BINANCE_BASE_URL)
    return await axios
      .get(`${binanceBaseUrl}${path}`)
      .then((result) => result.data)
      .catch((err) => err)
  }

  async post(path, body) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const binanceBaseUrl = this.configService.get(env.BINANCE_BASE_URL)
    return await axios
      .post(`${binanceBaseUrl}${path}`, body, { headers })
      .then((result) => result.data)
      .catch((err) => err)
  }

  async postApiKey(path, keys) {
    const url = this.configService.get(env.BINANCE_BASE_URL)
    const result = await axios
      .post(`${url}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-MBX-APIKEY': keys['akey'],
        },
      })
      .then((res) => 'res: ' + JSON.stringify(res))
      .catch((error) => console.log('error: ' + JSON.stringify(error)))
    return result
  }

  async put(path, body) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    const binanceBaseUrl = this.configService.get(env.BINANCE_BASE_URL)
    return await axios
      .put(`${binanceBaseUrl}${path}`, body, { headers })
      .then((result) => result.data)
      .catch((err) => err)
  }

  async delete(path) {
    const binanceBaseUrl = this.configService.get(env.BINANCE_BASE_URL)
    return await axios
      .put(`${binanceBaseUrl}${path}`)
      .then((result) => result.data)
      .catch((err) => err)
  }
}
