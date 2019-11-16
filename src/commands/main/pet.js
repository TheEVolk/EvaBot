import { Keyboard } from 'vk-io';
import { Op } from 'sequelize';

class OtherSubcommand {
  name = 'прочее';

  handler(ctx) {
    ctx.builder()
      .text('⬜ Используйте кнопки для навигации.')
      .keyboard(Keyboard.builder()
        .textButton({ label: 'Топ', payload: { command: 'пит топ' } })
        .row()
        .textButton({ label: 'Назад', payload: { command: 'пит' } })
        .oneTime())
      .answer();
  }
}

class TopSubcommand {
  name = 'топ'

  async handler(ctx) {
    const { Pet } = ctx.getPlugin('systems/pets');

    const myPet = await ctx.user.pets.get();
    const myPetPos = myPet && await Pet.count({ where: { rating: { [Op.gte]: myPet.rating } } });

    const pets = await Pet.findAll({ order: [['rating', 'DESC']], limit: 5 });

    ctx.builder()
      .text('📊 Топ 5 питомцев:')
      .lines(pets.map(
        (v, i) => `${i + 1}⃣ [id${v.ownerVkId}|${v.name}]\n— ${v.rating} ед.`
      ))
      .line(myPet && `\n🔼 Ваш №${myPetPos} в топе!`)
      .keyboard(Keyboard.builder()
        .textButton({ label: 'Назад', payload: { command: 'пит' } })
        .oneTime())
      .answer();
  }
}

class PlaySubcommand {
  name = 'играть';

  async handler(ctx) {
    const petsPlugin = ctx.getPlugin('systems/pets');
    const pet = await ctx.user.pets.get();

    const busy = petsPlugin.getBusy(pet.id);
    if (busy) {
      return ctx.answer(busy.data.getText().replace('%petname%', pet.name));
    }

    petsPlugin.createTask(pet.id, 'play', {
      endTime: Date.now() + 300e3
    });

    ctx.builder()
      .lines([
        `🏈 Вы начали играть с ${pet.name}.`,
        '⏳ Это займёт 5 минут реального времени.'
      ])
      .answer();
  }
}

class DuelRequestHandler {
  async accept(ctx, { source, sendResult, peers }) {
    const petsPlugin = ctx.getPlugin('systems/pets');
    const [myPet, enemyPet] = await Promise.all([
      ctx.user.pets.get(),
      source.pets.get()
    ]);

    if (!myPet || !enemyPet) {
      return ctx.answer('⛔ У вас и вашего противника должен быть питомец.');
    }

    if (petsPlugin.getBusy(myPet) || petsPlugin.getBusy(enemyPet)) {
      return ctx.answer('⛔ Ваши питомцы должны быть свободны от дел.');
    }

    petsPlugin.createTask(myPet.id, 'duel', {
      healths: [100, 100],
      lastAttackerId: Math.random() >= 0.5 ? 1 : 0,
      targetId: enemyPet.id,
      peers
    });

    sendResult([`🔥 ${myPet.name} VS ${enemyPet.name}.`, '⚡ Бой начался!']);
  }

  deny(ctx, { source }) {
    ctx.answer('⭕ Вы отклонили приглашение в дуэль.');
    source.send(`⭕ ${ctx.user} отклонил ваше приглашение в дуэль.`);
  }
}

class DuelSubcommand {
  name = 'дуэль';
  arguments = {
    target: { name: 'профиль', type: 'user', notSelf: true }
  };

  init(henta) {
    const reqPlugin = henta.getPlugin('common/req');
    reqPlugin.set('pet-duel', new DuelRequestHandler());
  }

  clear(henta) {
    const reqPlugin = henta.getPlugin('common/req');
    reqPlugin.unset('pet-duel');
  }

  async handler(ctx) {
    const petsPlugin = ctx.getPlugin('systems/pets');
    const [myPet, enemyPet] = await Promise.all([
      ctx.user.pets.get(),
      ctx.params.target.pets.get()
    ]);

    if (!myPet || !enemyPet) {
      return ctx.answer('⛔ У вас и вашего противника должен быть питомец.');
    }

    if (petsPlugin.getBusy(myPet) || petsPlugin.getBusy(enemyPet)) {
      return ctx.answer('⛔ Ваши питомцы должны быть свободны от дел.');
    }

    myPet.kind = petsPlugin.getKind(myPet.type);
    const { tip } = ctx.params.target.req.new({
      tag: 'pet-duel',
      text: [
        `${ctx.user} приглашает вашего питомца на дуэль.`,
        `${myPet.kind.emoji} ${myPet.name}`,
        `✨ Рейтинг: ${myPet.rating} ед.`,
        `⚡ Сила: ${myPet.force} ед.`
      ].join('\n'),
      peer: ctx.peerId
    }, ctx.user);

    ctx.answer([
      '⏳ Ожидание ответа оппонента...',
      tip
    ]);
  }
}

export default class PetCommand {
  name = 'пит'
  description = 'твой питомец'
  emoji = '🐾'
  subcommands = [
    new OtherSubcommand(),
    new TopSubcommand(),
    new PlaySubcommand(),
    new DuelSubcommand()
  ];

  init(henta) {
    this.subcommands[3].init(henta);
  }

  clear(henta) {
    this.subcommands[3].clear(henta);
  }

  async handler(ctx) {
    const { getKind } = ctx.getPlugin('systems/pets');

    const pet = await ctx.user.pets.get();
    if (!pet) {
      return ctx.builder()
        .line('🐾 У вас пока нет питомца..')
        .keyboard(Keyboard.builder()
          .textButton({ label: 'Найти питомца', color: 'primary', payload: { command: 'приют' } }))
        .answer();
    }

    pet.kind = getKind(pet.type);

    ctx.builder()
      .lines([
        `${pet.kind.emoji} ${pet.name}`,
        `✨ Рейтинг: ${pet.rating} ед.`,
        `⚡ Сила: ${pet.force} ед.`
      ])
      .keyboard(Keyboard.builder()
        .textButton({ label: 'Прочее', payload: { command: 'пит прочее' } })
        .inline())
      .answer();
  }
}

/*

  async playHandler (ctx) {
    const { play } = ctx.getPlugin('systems/pets')
    const pet = await ctx.user.assertPet(ctx, 'has')

    const gameSession = play.get(pet)
    if (gameSession) {
      return ctx.builder()
        .text(`⏳ До конца игры ${formatDistanceToNow(gameSession.startAt + 300000, { locale: ru })}.`)
        .botcmdButton('Назад', 'пит', 'secondary')
        .answer()
    }

    play.run(pet)

    ctx.builder()
      .lines([
        `🏈 Вы начали играть с ${pet.name}.`,
        '⏳ Это займёт 5 минут реального времени.'
      ])
      .botcmdButton('Назад', 'пит', 'secondary')
      .answer()
  }

  async duelHandler (ctx) {
    const { play, duel, messages } = ctx.getPlugin('systems/pets')
    const pet = await ctx.user.assertPet(ctx, 'has')
    const petType = pet.getType()

    ctx.assert(!play.get(pet), messages.busyErrorGame)
    ctx.assert(!duel.get(pet), messages.busyErrorDuel)

    const { tip } = ctx.params.enemy.createRequest({
      tag: 'pets:duel',
      text: [
        `${ctx.user.r()} вызывает вашего питомца на дуэль.`,
        '',
        `${petType.emoji} ${petType.name} «${pet.name}»:`,
        `⠀⠀✨ Рейтинг: ${pet.rating} ед;`,
        `⠀⠀⚡ Сила: ${pet.force} ед;`
      ].join('\n'),
      peer: ctx.msg.peer_id
    }, ctx.user)

    ctx.builder()
      .lines([`💥 Вы отправили ${ctx.params.enemy.r()} заявку на дуэль.`, tip])
      .botcmdButton('Назад', 'пит', 'secondary')
      .answer()
  }
*/
