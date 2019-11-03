import git from 'simple-git/promise';

class CommitSubcommand {
  name = 'commit';
  right = 'git';
  arguments = {
    msg: { name: 'Сообщение', type: 'string' }
  }

  async handler (ctx) {
    const repo = git(`/home/bots/eva`);
    await repo.add('./*');
    const res = await repo.commit(ctx.params.msg);
    ctx.answer('Изменений: ' + res.summary.changes.toLocaleString('ru'));
  }
}

class PushSubcommand {
  name = 'push';
  right = 'git';

  async handler (ctx) {
    const repo = git(`/home/bots/eva`);
    const res = await repo.push();
    console.log(res)
    ctx.answer('Изменений: ');
  }
}

export default class GitCommand {
  name = 'git';
  description = 'github';
  right = 'git';
  subcommands = [
    new CommitSubcommand(),
    new PushSubcommand()
  ];

  handler (ctx) {
    ctx.answer('abc');
  }
}