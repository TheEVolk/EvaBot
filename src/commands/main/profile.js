import { Op } from 'sequelize'
import { Keyboard } from 'vk-io'

class TopsSubcommand {
  name = 'топ'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  async handler (ctx) {
    const { User } = ctx.getPlugin('common/users');
    const { Pet } = ctx.getPlugin('systems/pets');
    const { SeedsStat, getStat } = ctx.getPlugin('bot/gameSeeds');

    const target = ctx.params.target || ctx.user;

    const pet = await target.pets.get();
    const seedsStat = await getStat(target.vkId);
  
    const balance = await User.count({ where: { money: { [Op.gte]: target.money } } });
    const petPos = pet && await Pet.count({ where: { rating: { [Op.gte]: pet.rating } } });
    const seedsPos = seedsStat && await SeedsStat.count({ where: { count: { [Op.gte]: seedsStat } } });

    const counts = await Promise.all([
      User.count(),
      Pet.count(),
      SeedsStat.count()
    ]);

    target.rating = counts.reduce((acc, v) => acc + v) - balance - (petPos || counts[1]) - (seedsPos || counts[2]);
    target.save()

    ctx.answer([
      `🔼 ${target}:\n`,
      `💳 №${balance} по балансу.`,
      pet ? `🐾 №${petPos} по питомцу.` : '⭕ Нет в питомцах.',
      seedsStat ? `🌻 №${seedsPos} по семечкам.` : '⭕ Нет в семечках.',
      `\n⭐ Рейтинг: ${target.rating} ед.`
    ])
  }
}

export default class ProfileCommand {
  name = 'профиль'
  description = 'информация о игроке'
  emoji = '👤'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true }
  }

  subcommands = [
    new TopsSubcommand()
  ];

  async handler (ctx) {
    const { briefNumber } = ctx.getPlugin('systems/moneys')

    const target = ctx.params.target || ctx.user
    ctx.user.achievements.unlockIf('itsMe', target === ctx.user)

    const { list, Achievement } = ctx.getPlugin('systems/achievements')
    const unlockedCount = await Achievement.count({ where: { vkId: ctx.user.vkId } })
    const job = target.jobs.get()

    ctx.builder()
      .lines([
        `👀 ${target}:`,
        target.role !== 'user' && `🔑 ${target.pex.get().title}.`,
        `💳 ${target.moneys.getLocaled()} бит.`,
        job && `💼 ${job.name} [${briefNumber(job.salary)}].`,
        `🏅 Ачивок: ${unlockedCount}/${list.length} шт.`,
        `⚡ LVL: ${target.level} (${target.lvl.getProgress()}%).`,
        target.rating && `⭐ Рейтинг: ${target.rating} ед.`,
        !target.rating && target === ctx.user && '\nВведите `профиль топ`, чтобы пересчитать рейтинг.'
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: 'Топ', payload: { command: `профиль топ id${target.vkId}` } })
        .inline()
      )
      .answer()
  }
}