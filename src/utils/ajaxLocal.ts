import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import env from "./env"

@Injectable()
export class AjaxLocal {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }
    
    async get(path) {
        const binanceBaseUrl = this.configService.get(env.LOCAL_BASE_URL)
        return await axios.get(`${binanceBaseUrl}${path}`).then(result => result.data).catch(err => err)
    }

    async post(path, body, header) {
        const headers = { "Content-Type": "application/x-www-form-urlencoded", client: `${header.apiKey}|${header.secret}` }
        const binanceBaseUrl = this.configService.get(env.LOCAL_BASE_URL)
        return await axios.post(`${binanceBaseUrl}${path}`, body, {headers}).then(result => result.data).catch(err => err)
    }
    
    async put(path, body) {
        const headers = { "Content-Type": "application/x-www-form-urlencoded" }
        const binanceBaseUrl = this.configService.get(env.LOCAL_BASE_URL)
        return await axios.put(`${binanceBaseUrl}${path}`, body, {headers}).then(result => result.data).catch(err => err)
    }
    
    async delete(path) {
        const binanceBaseUrl = this.configService.get(env.LOCAL_BASE_URL)
        return await axios.put(`${binanceBaseUrl}${path}`).then(result => result.data).catch(err => err)
    }
}