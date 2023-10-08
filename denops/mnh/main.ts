import {
  Denops,
  ensure,
  is,
  open,
  replace,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async addNumber() {
      // get current buffer content
      const bufnr = await denops.call("bufnr") as number;
      const content = (await denops.call(
        "getbufline",
        bufnr,
        1,
        "$"
      )) as string[];

      // add number for headings
      const contentnew: string[] = [];
      for (let i = 0; i < content.length; i++) {
        // TODO: add number
        contentnew[i] = content[i].replace('# ', '## ');
      }

      // replace current buffer content
      await replace(denops, bufnr, contentnew);
    },
  };

  await denops.cmd(
    `command! -nargs=? AddNumber echomsg denops#request('${denops.name}', 'addNumber', [])`
  );
};
