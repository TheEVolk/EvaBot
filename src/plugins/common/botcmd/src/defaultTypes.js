export default function loadDefaultTypes (parser) {
  // Integer
  parser.add('integer', data => {
    const value = parseInt(data.arg)

    if (data.argument.positive && value <= 0) {
      return [true, 'botcmd:numberNotPositive']
    }

    if (data.argument.negative && value >= 0) {
      return [true, 'botcmd:numberNotNegative']
    }

    if (data.argument.natural && value < 0) {
      return [true, 'botcmd:numberNotNatural']
    }

    if (data.argument.natural === false && value > 0) {
      return [true, 'botcmd:numberNotNonNatural']
    }

    return [false, value]
  })

  // String
  parser.add('string', data => {
    const words = data.ctx.text.split(' ')
    words.splice(0, data.index + 1)
    const str = words.join(' ')

    if (data.argument.max && str.length > data.argument.max) {
      return [true, 'botcmd:stringMax']
    }

    if (data.argument.minn && str.length < data.argument.min) {
      return [true, 'botcmd:stringMin']
    }

    return [false, str]
  })
}
