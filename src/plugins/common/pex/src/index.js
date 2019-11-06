import initUserMethods from './userMethods.js'

export default class {
  constructor (henta) {
    this.henta = henta
  }

  async init (henta) {
    this.roles = await henta.util.loadSettings('pex.json')
    this.fromSlug = {}
    this.roles.forEach(v => { this.fromSlug[v.slug] = v })

    initUserMethods(this)
  }

  get (slug) {
    return this.fromSlug[slug]
  }

  isAllow (roleSlug, right) {
    return this.isRoleAllow(this.fromSlug[roleSlug], right)
  }

  isRoleAllow (role, right) {
    if (role.data.disallow && role.data.disallow.includes(right)) {
      return false
    }

    // Allow all
    if (role.data.allow === true) {
      return true
    }

    console.log(role.data.allow)
    if (role.data.allow && role.data.allow.includes(right)) {
      return true
    }

    if (role.includes) {
      for (const subRoleSlug of role.includes) {
        if (this.isAllow(subRoleSlug, right)) {
          return true
        }
      }
    }

    return false
  }
}