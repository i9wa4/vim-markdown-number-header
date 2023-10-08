import {
  Denops,
  ensure,
  is,
  open,
  replace,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async addNumber(): Promise<void> {
      // get current buffer content
      const bufnr = await denops.call("bufnr") as number;
      const content = (await denops.call(
        "getbufline",
        bufnr,
        1,
        "$"
      )) as string[];

      // add number for headings
      const secNumber: string[] = [0, 0, 0, 0, 0, 0];
      const contentNew: string[] = [];
      for (let i = 0; i < content.length; i++) {
        if (content[i].match('^#')) {
          contentNew[i] = "header!" + content[i]
        } else {
          contentNew[i] = content[i]
        }
      }

      // replace current buffer content
      await replace(denops, bufnr, contentNew);
    },
  };

  await denops.cmd(
    `command! -nargs=? AddNumber echomsg denops#request('${denops.name}', 'addNumber', [])`
  );
};
