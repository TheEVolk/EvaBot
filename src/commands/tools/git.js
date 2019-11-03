import git from 'simple-git/promise';

class CommitSubcommand {
  name = 'commit';
  right = 'git';
  arguments = {
    msg: { name: 'Сообщение', type: 'string' }
  }

  async handler (ctx) {
    const repo = git(`/home/bots/eva`);
    const res = await repo.add('.');
    const res2 = await repo.commit(ctx.params.msg);
    console.log(res)
    ctx.answer('Изменений: ' + res2.summary.changes.toLocaleString('ru'));
  }
}

class PushSubcommand {
  name = 'push';
  right = 'git';

  async handler (ctx) {
    const repo = git(`/home/bots/eva`);
    await repo.push('origin', 'master');
    ctx.answer('SUCCESS');
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