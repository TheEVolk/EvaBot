import { Keyboard } from 'vk-io';

class OpenSubcommand {
  name = 'инфо';
  arguments = {
    index: { name: 'индекс', type: 'integer' }
  }

  noCaseAnswer (ctx) {
    ctx.builder()
        .line('📦 Этот кейс не найден.')
        .keyboard(Keyboard.builder()
          .textButton({
            label: 'К кейсам',
            color: 'primary',
            payload: {
              command: 'кейс'
            }
          })
          .inline()
        )
        .answer()
  }

  async handler (ctx) {
    const casesPlugin = ctx.getPlugin('bot/cases');
    const cases = await casesPlugin.getCases(ctx.user.vkId);
    const currentCase = cases[ctx.params.index];

    if (!currentCase) {
      return this.noCaseAnswer(ctx);
    }

    ctx.builder()
      .attach(await casesPlugin.imager.get(currentCase.slug))
      .keyboard(Keyboard.builder()
        .textButton({
          label: 'Открыть',
          color: 'primary',
          payload: {
            command: `кейс открыть ${ctx.params.index}`
          }
        })
        .inline()
      )
      .answer()
  }
}

class InfoSubcommand {
  name = 'инфо';
  arguments = {
    index: { name: 'индекс', type: 'integer' }
  }

  noCaseAnswer (ctx) {
    ctx.builder()
        .line('📦 Этот кейс не найден.')
        .keyboard(Keyboard.builder()
          .textButton({
            label: 'К кейсам',
            color: 'primary',
            payload: {
              command: 'кейс'
            }
          })
          .inline()
        )
        .answer()
  }

  async handler (ctx) {
    const casesPlugin = ctx.getPlugin('bot/cases');
    const cases = await casesPlugin.getCases(ctx.user.vkId);
    const currentCase = cases[ctx.params.index];

    if (!currentCase) {
      return this.noCaseAnswer(ctx);
    }

    ctx.builder()
      .attach(await casesPlugin.imager.get(currentCase.slug))
      .keyboard(Keyboard.builder()
        .textButton({
          label: 'Открыть',
          color: 'primary',
          payload: {
            command: `кейс открыть ${ctx.params.index}`
          }
        })
        .inline()
      )
      .answer()
  }
}

export default class CasesCommand {
  name = 'кейс';
  description = 'открытие призов';
  emoji = '📦';
  private = true;

  async handler (ctx) {
    const casesPlugin = ctx.getPlugin('bot/cases');
    const cases = await casesPlugin.getCases(ctx.user.vkId);

    if (!cases) {
      return this.noCasesAnswer(ctx);
    }
    
    ctx.builder()
      .lines(
        '📦 Ваши кейсы:',
        ...cases.map((v, i) => `${i+1} >> ${v.title}.`),
        cases.length === 0 && '>> У вас нет кейсов.',
        '🔢 Введите номер кейса, который вы хотите посмотреть.'
      )
      .keyboard(Keyboard.builder()
          .textButton({
            label: 'Бесплатный кейс',
            color: 'primary',
            payload: {
              command: 'кейс бонус'
            }
          })
          .inline()
        )
        .answer()      
  }
}
