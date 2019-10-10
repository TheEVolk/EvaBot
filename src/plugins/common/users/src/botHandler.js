export default async function botHandler (ctx, next) {
  ctx.user = await this.get(ctx.senderId)
  await next()

  if (ctx.answered && !ctx.notSaveUser) {
    ctx.user.save()
  }
}
