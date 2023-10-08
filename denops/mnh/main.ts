import {
    Denops,
    ensure,
    is,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async echo(text: unknown): Promise<unknown> {
      ensure(text, is.String);
      return await Promise.resolve(text);
    },
  };

  await denops.cmd(
    `command! -nargs=1 HelloWorldEcho echomsg denops#request('${denops.name}', 'echo', [<q-args>])`,
  );
};
