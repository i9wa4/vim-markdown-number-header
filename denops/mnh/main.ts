import {
  Denops,
  ensure,
  is,
  open,
  replace,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async echo(text: unknown): Promise<unknown> {
      ensure(text, is.String);
      return await Promise.resolve(text);
    },

    async debug() {
      const bufnr = await denops.call("bufnr") as number;
      const content = (await denops.call(
        "getbufline",
        bufnr,
        1,
        "$"
      )) as string[];
      const contentnew: string[] = [];
      for (let i = 0; i < content.length; i++) {
        contentnew[i] = content[i].replace('# ', '## ');
      }
      await replace(denops, bufnr, contentnew);
    },
  };

  await denops.cmd(
    `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'echo', [<q-args>])`
  );
  await denops.cmd(
    `command! -nargs=? Debug echomsg denops#request('${denops.name}', 'debug', [])`
  );
};
