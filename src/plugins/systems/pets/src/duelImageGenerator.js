const nodeCanvas = require('canvas')

nodeCanvas.registerFont('./res/font/bork-display.otf', { family: 'Bork Display' })

function drawRotatedImage(context, image, x, y, w, h, degrees) {
  context.save();
  context.translate(x+w/2, y+h/2);
  context.rotate(degrees*Math.PI/180.0);
  context.translate(-x-w/2, -y-h/2);
  context.drawImage(image, x, y, w, h);
  context.restore();
}

async function generate(winner, looser) {
  const backgroundImage = await nodeCanvas.loadImage(`./res/img/petDuel.png`) 
  const winnerImage = await nodeCanvas.loadImage(`./res/img/pets/${winner.type}/${winner.variety}.png`)
  const looserImage = await nodeCanvas.loadImage(`./res/img/pets/${looser.type}/${looser.variety}.png`)
  
  const canvas = nodeCanvas.createCanvas(1200, 750) 
  const context = canvas.getContext('2d') 
  
  context.drawImage(backgroundImage, 0, 0) 
  context.drawImage(winnerImage, 70, 310, 400, 400)

  drawRotatedImage(context, looserImage, 1200 - 470, 310, 400, 400, 90)

  context.textAlign = 'center' 
  context.shadowOffsetX = 3 
  context.shadowOffsetY = 3 
  context.shadowBlur = 5 
  context.shadowColor = 'black' 
  context.fillStyle = 'white' 
  context.font = `50px Bork Display` 
  context.fillText(winner.name, 270, 700)
  context.fillText(looser.name, 1200 - 270, 700)
  
  return canvas
}

module.exports = { generate }