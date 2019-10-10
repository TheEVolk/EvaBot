export default async function sendNotification (user, achievement) {
  /* const backgroundImage = await loadImage(`./res/img/achievement.png`)

  const canvas = createCanvas(540, 411)
  const context = canvas.getContext('2d')

  context.drawImage(backgroundImage, 0, 0)

  context.textAlign = 'center'
  context.shadowOffsetX = 3
  context.shadowOffsetY = 3
  context.shadowBlur = 20
  context.shadowColor = 'black'
  context.fillStyle = 'white'

  context.font = `35px bold Bork Display`
  context.fillText('Новое достижение!', 270, 250)

  context.font = `28px Bork Display`
  context.fillText(achievement.title, 270, 330)

  context.font = `18px Bork Display`
  context.fillStyle = 'rgb(200,200,200)'
  context.fillText(achievement.description, 270, 360)
*/
  user.sendBuilder()
    .text(`🎇 Вы открыли новое достижение «${achievement.title}»!`)
    // .attachCanvas(canvas)
    .send()
}
