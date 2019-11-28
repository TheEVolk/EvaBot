# HENTA Плагин: common/botcmd
Обработчик команд в боте

```js
const botcmdPlugin = henta.getPlugin('common/botcmd');
```

## Установка
Используйте консоль HENTA
```
p-install StandartHentaPlugins/botcmd
```

## Создание команд
Все команды помещаются в папку commands, которую нужно создать в src-директории вашего бота.
Если внутри каталога commands есть подкаталоги, то команды в них обретут поле 'type', которое будет равно имени каталога.

### Простая команда
```js
export default class HelloCommand {
  name = 'привет'; // Имя команды
  aliases = ['здарова', 'хай']; // Алиасы команды
  description = 'моя топ команда'; // Описание команды

  handler(ctx) { // Обработчик команды
    ctx.answer(`🎭 Привет, ${ctx.user.firstName}!`);
  }
}
```

### Подкоманды
Вы можете использовать подкоманды в своём боте:
```js
class OtherSubcommand {
  name = 'прочее';
  aliases = ['другое'];

  handler(ctx) {
    ctx.answer([
      'Ну и на вечерний ужин, мы вам представляем',
      '- Ужик (обжаренный с пельмешками)'
    ]);
  }
}

export default class MenuCommand {
  name = 'привет';
  description = 'меню ресторана';
  subcommands = [
    new OtherSubcommand()
  ]

  handler(ctx) {
    ctx.answer([
      'А на завтрак и обед:',
      '- Кетчуп',
      '- Буузы',
      '- И омлет'
    ]);
  }
}
```

### Аргументы
Можно использовать стандартный парсер аргументов, и даже использовать свои типы.
```js
export default class BWGameCommand {
  name = 'бв';
  description = 'черное/белое';
  arguments = {
    resp: { name: 'ответ', type: 'word' },
    rate: { name: 'ставка', type: 'integer', optional: true }
  };

  handler(ctx) {
    if (ctx.resp === 'черное') {
      ctx.answer([
        'Ну всё, ты проиграл',
        ctx.params.rate && `Так еще и денег оставил, целых ${ctx.params.rate.toLocaleString()}`
      ]);
    }

    ctx.answer('Ты победил, денег не дам');
  }
}
```

> [Список стандатных типов](docs/argumentTypes.md)

### Добавление типов аргументов
Можно использовать стандартный парсер аргументов, и даже использовать свои типы.
```js
// Во время инициализации своего плагина
const { argumentParser } = henta.getPlugin('common/botcmd');

argumentParser.add('nothorse', async data => {
  if (data.word === 'лошадь') {
    return [true, '🤨 Нельзя писать лошадь, ты че не знал?!'];
  }

  return [false, `нелошадь а ${data.word}`];
});
```

### Кэширование
Кэширование сбрасывается после перезапуска бота, помогает значительно сократить нагрузку и ускорить вашего бота.
```js
export default class HelloCommand {
  name = 'привет'; // Имя команды
  aliases = ['здарова', 'хай']; // Алиасы команды
  description = 'моя топ команда'; // Описание команды
  cache = {
    // user или all. Если user, то кэширование индивидуально для каждого пользователя.
    type: 'all',
    // Время жизни значения в миллисекундах.
    ttl: 86400 * 1000
  };

  handler(ctx) { // Обработчик команды
    ctx.answer(`🎭 Привет, кем бы ты не был!`);
  }
}
```