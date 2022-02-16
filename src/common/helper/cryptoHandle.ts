import crypto from "crypto";

export const cryptoHandleHmac = (sha, key, option) => {
   return crypto.createHmac(sha, key).update(option).digest('hex')
}