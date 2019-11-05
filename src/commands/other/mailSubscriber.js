import { Keyboard } from 'vk-io';

function makeButtons (ctx, buttons) {
  const keyboard = Keyboard.builder();
  buttons.forEach(v => keyboard.textButton({
    label: v[0],
    payload: { command: v[1] },
    color: v[2] && 'primary'
  }));

  keyboard.inline(ctx.clientInfo.inline_keyboard === true);
  keyboard.oneTime();

  return keyboard;
}

class ChangeSubcommand {
  name = 'сменить';
  arguments = {
    slug: { name: 'тип', type: 'word' }
  };

  async handler (ctx) {
    const { categories } = ctx.getPlugin('common/allmail');
    // const { briefNumber } = ctx.getPlugin('mybot/moneys');

    const category = categories.find(v => v.slug === ctx.params.slug);
    if (!category) {
      return ctx.answer('📛 Такая подписка не существует.');
    }

    const isSubscribed = await ctx.user.allmain.is(category.slug)

    if (isSubscribed) {
      ctx.user.allmain.unsubscribe(category.slug)

      ctx.builder()
        .text(`💔 Вы отписались от <<${category.title}>>`)
        .keyboard(makeButtons(ctx, [
          ['Назад', 'рассылка', true]
        ]))
        .answer()
    } else {
      ctx.user.allmain.subscribe(category.slug)

      ctx.builder()
        .lines([
          `${category.emoji} Вы подписались на <<${category.title}>>`,
          // `💸 За каждое полученное сообщение вы будете получать ${briefNumber(category.bonus)} бит!`
        ])
        .keyboard(makeButtons(ctx, [
          ['Назад', 'рассылка', true]
        ]))
        .answer()
    }
  }
}

export default class MailSumscriberCommand {
  name = 'рассылка';
  description = 'управление рассылкой';
  emoji = '📣';
  subcommands = [
    new ChangeSubcommand()
  ];

  async handler (ctx) {
    const { categories } = ctx.getPlugin('common/allmail')
    const subscribes = await ctx.user.allmain.getSubscribes()
    console.log(subscribes)

    const keyboard = Keyboard.builder()
      .inline(ctx.clientInfo.inline_keyboard === true)
      .oneTime();

    categories.forEach(v =>
      keyboard.textButton({
        label: `${v.title}`,
        color: subscribes.includes(v.slug) ? 'positive' : 'negative',
        payload: { command: `рассылка сменить ${v.slug}` }
      }).row()
    )

    ctx.builder()
      .text('✉ Категории рассылок:')
      .keyboard(keyboard)
      .answer();
  }
}