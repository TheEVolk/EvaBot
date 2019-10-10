const nodeCanvas = require('canvas')
const https = require('https')
const fs = require('fs')
const { PhotoAttachment } = require('vk-io')

async function downloadPhoto(url, localPath) {
  const file = fs.createWriteStream(localPath)
  
  await new Promise((resolve, reject) => {
    const request = https.get(url, r => r.pipe(file))
    request.on('end', resolve)

    file.on('finish', () => {
      file.close(resolve)
    })

    request.on('error', reject)
  })
}

module.exports = function (henta) {
  const tempPlugin = henta.getPlugin('common/temp')

  const typeClasses = {
    photo: PhotoAttachment
  }

  const toTypes = {
    canvas: async (photo) => {
      const localPath = tempPlugin.getPath('jpg')
      await downloadPhoto(photo.largePhoto, localPath)
      const image = await nodeCanvas.loadImage(localPath)
      tempPlugin.freePath(localPath)

      const canvas = nodeCanvas.createCanvas(image.width, image.height)
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, image.width, image.height)

      return canvas
    },

    canvasImage: async (photo) => {
      const localPath = tempPlugin.getPath('jpg')
      await downloadPhoto(photo.largePhoto, localPath)
      const image = await nodeCanvas.loadImage(localPath)
      tempPlugin.freePath(localPath)

      return image
    }
  }

  return {
    processAttachments: (ctx, attachments, params, errorStr) => {
      if (!attachments) {
        return
      }

      const msgAttachs = [ ...ctx.msg.attachments ]
      if (ctx.msg.reply_message) {
        msgAttachs.push(...ctx.msg.reply_message.attachments)
      }

      if (ctx.msg.fwd_messages[0]) {
        msgAttachs.push(...ctx.msg.fwd_messages[0].attachments)
      }

      for (const [key, value] of Object.entries(attachments)) {
        const typeClass = typeClasses[value.type]
        const attachment = new typeClass(
          ctx.assert(
            msgAttachs.find(v => !v.busy && v.type === value.type)[value.type],
            errorStr
          ),
          henta.vk.vkLib
        )
        
        params[key] = value.to ? () => toTypes[value.to](attachment) : attachment
      }
    }
  }
}