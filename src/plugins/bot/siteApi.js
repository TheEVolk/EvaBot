const Koa = require('koa')
const Router = require('koa-router')
const io = require('socket.io')()

class SiteApiPlugin {
  constructor (henta) {
    this.henta = henta
    this.app = new Koa()
    this.router = new Router()

    this.stats = { }
  }

  async start ({ getPlugin, hookManager }) {
    const onlinePlugin = getPlugin('mybot/online')
    const usersPlugin = getPlugin('common/users')
    const hentadminPlugin = getPlugin('common/hentadmin')

    const updateStats = async () => {
      this.stats = {
        online: onlinePlugin.getOnline(),
        users: await usersPlugin.User.count(),
        avgTime: Math.floor(hentadminPlugin.avgResponseTime)
      }

      io.emit('stats', this.stats)
    }

    //hookManager.add('bot_process_end', updateStats)

    io.on('get-stats', (socket) => socket.emit('stats', this.stats))

    //io.listen(3520)
    
    await updateStats()
  }
}

module.exports = SiteApiPlugin
