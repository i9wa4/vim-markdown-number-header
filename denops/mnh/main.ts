import {
  Denops,
  ensure,
  is,
  open,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async echo(text: unknown): Promise<unknown> {
      ensure(text, is.String);
      return await Promise.resolve(text);
    },

    async test(text: unknown): Promise<unknown> {
      const info = await open(denops, "%");
      return info.bufnr;
    },
  };

  await denops.cmd(
    // `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'echo', [<q-args>])`,
    `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'test', [])`,
  );
};
