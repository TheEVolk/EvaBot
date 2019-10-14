import initBotcmdType from './botcmdType'
import initUserMethods from './userMethods'

export default class {
  constructor (henta) {
    this.henta = henta
  }

  init (henta) {
    initBotcmdType(this)
    initUserMethods(this)
  }

  briefNumber (number) {
    let suffix = ''
    if (Math.abs(number) >= 1e9) {
      number /= 1e9
      suffix = 'млрд'
    } else if (Math.abs(number) >= 1e6) {
      number /= 1e6
      suffix = 'млн'
    } else {
      while (Math.abs(number) >= 1e3) {
        number /= 1e3
        suffix += 'к'
      }
    }

    return `${Number(number.toFixed(1))}${suffix}`
  }
}
