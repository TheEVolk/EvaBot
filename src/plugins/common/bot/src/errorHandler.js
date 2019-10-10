export default function handleError (rawContext, err, henta) {
  henta.error(`${err.stack}`)
  /* if (ctx.user.isCan('getErrors')) {
    return ctx.send(e.stack)
  } */

  // this.admin.send([`⚠ ${ctx.user.getUrl()}: ${ctx.msg.text}`, `${e.stack}`])
  // if (ctx.getConfigValue('user_error')) { ctx.send(ctx.getConfigValue('user_error')) }
}
