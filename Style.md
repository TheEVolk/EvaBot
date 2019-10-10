# Рекомендации по стилю бота
## Команды

Шаблон простой команды:

    export  default  class {
	  constructor () {
        Object.assign(this, {
          name:  'тест',
	      description:  'быстрая проверка бота',
		  emoji:  '✅'
	    })
      }
      
      handler (ctx) {
	    ctx.answer('✅ Бот работает.')
      }
    }
