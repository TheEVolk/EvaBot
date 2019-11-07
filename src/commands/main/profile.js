import { Op } from 'sequelize';
import { Keyboard } from 'vk-io';

class TopsSubcommand {
  name = 'топ'
  arguments = {
    target: { name: 'игрок', type: 'user', optional: true },
    graph: { name: 'график', type: 'word', optional: true }
  }

  async handler(ctx) {
    const { User } = ctx.getPlugin('common/users');
    const { Pet } = ctx.getPlugin('systems/pets');
    const { SeedsStat, getStat } = ctx.getPlugin('bot/gameSeeds');

    const target = ctx.params.target || ctx.user;

    const [pet, seedsStat] = await Promise.all([
      target.pets.get(),
      getStat(target.vkId)
    ]);

    const [
      balancePos,
      petPos,
      seedsPos,
      levelPos
    ] = await Promise.all([
      User.count({ where: { money: { [Op.gte]: target.money } } }),
      pet && Pet.count({ where: { rating: { [Op.gte]: pet.rating } } }),
      seedsStat && SeedsStat.count({ where: { count: { [Op.gte]: seedsStat } } }),
      User.count({
        where: {
          [Op.or]: [
            { level: { [Op.gt]: ctx.user.level } },
            { level: ctx.user.level, score: { [Op.gt]: ctx.user.score } }
          ]
        }
      })
    ]);

    const [
      usersCount,
      petsCount,
      seedsStatsCount
    ] = await Promise.all([
      User.count(),
      Pet.count(),
      SeedsStat.count()
    ]);

    const getBalls = (max, curr) => max - (curr || max);

    target.rating = [
      getBalls(usersCount, balancePos), // Balance
      getBalls(petsCount, petPos), // Pets
      getBalls(seedsStatsCount, seedsPos), // Seeds
      getBalls(usersCount, levelPos + 1) // Level
    ].reduce((acc, v) => acc + v);

    target.save();

    const jsonData = {
      type: 'radar',
      data: {
        labels: ['Баланс', 'Питомец', 'Семечки', 'Уровень'],
        datasets: [
          {
            label: target.getFullName(),
            data: [
              getBalls(usersCount, balancePos) / usersCount,
              getBalls(petsCount, petPos) / petsCount,
              getBalls(seedsStatsCount, seedsPos) / seedsStatsCount,
              getBalls(usersCount, levelPos + 1) / usersCount
            ],
            backgroundColor: 'green'
          }
        ]
      }
    };

    ctx.builder()
      .photo(ctx.params.graph === 'график' && `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(jsonData))}`)
      .lines([
        `🔼 ${target}:\n`,
        `💳 №${balancePos} по балансу.`,
        `⚡ №${levelPos + 1} по уровню.`,
        pet ? `🐾 №${petPos} по питомцу.` : '⭕ Нет в питомцах.',
        seedsStat ? `🌻 №${seedsPos} по семечкам.` : '⭕ Нет в семечках.',
        `\n⭐ Рейтинг: ${target.rating} ед.`
      ])
      .answer();
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

  async handler(ctx) {
    const { briefNumber } = ctx.getPlugin('systems/moneys');

    const target = ctx.params.target || ctx.user;
    ctx.user.achievements.unlockIf('itsMe', target === ctx.user);

    const { list, Achievement } = ctx.getPlugin('systems/achievements');
    const unlockedCount = await Achievement.count({ where: { vkId: ctx.user.vkId } });
    const job = target.jobs.get();

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
        .inline())
      .answer();
  }
}
