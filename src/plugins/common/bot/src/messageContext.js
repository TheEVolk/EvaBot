import createMessageBuilder from './messageBuilder/creator'

function answer (response) {
  if (this.answered) {
    throw Error('На это сообщение бот уже вернул ответ.')
  }

  this.answered = true
  const messageBuilder = createMessageBuilder(response)
  messageBuilder.setContext({
    peerId: this.peerId,
    vk: this.henta.vk
  })

  return messageBuilder.send()
}

function send (response) {
  const messageBuilder = createMessageBuilder(response)
  messageBuilder.setContext({
    peerId: this.peerId,
    vk: this.henta.vk
  })

  return messageBuilder.send()
}

function builder (response) {
  const messageBuilder = createMessageBuilder(response)
  messageBuilder.setContext({
    peerId: this.peerId,
    vk: this.henta.vk
  })

  messageBuilder.answer = () => {
    this.answer(messageBuilder)
  }

  return messageBuilder
}

function getPayloadValue (field) {
  return this.messagePayload && this.messagePayload[field]
}

export default function applyContextMethods (ctx, henta) {
  ctx.answer = answer
  ctx.send = send
  ctx.builder = builder
  ctx.henta = henta
  ctx.getPlugin = henta.getPlugin
  ctx.getPayloadValue = getPayloadValue
  ctx.vk = henta.vk
  ctx.api = henta.vk.api
}
