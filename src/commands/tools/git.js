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
    console.log(res)
    ctx.answer('OK');
  }
}

export default class GitCommand {
  name = 'git';
  description = 'github';
  right = 'git';
  subcommands = [
    new CommitSubcommand()
  ];

  handler (ctx) {
    ctx.answer('abc');
  }
}