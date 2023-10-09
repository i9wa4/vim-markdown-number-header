import {
  Denops,
  open,
  replace,
  vars,
} from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async numberHeader(): Promise<unknown> {
      // get current buffer content
      const bufnr = await denops.call("bufnr") as number;
      const content = (await denops.call(
        "getbufline",
        bufnr,
        1,
        "$"
      )) as string[];

      // number headers
      let secLevelShift: number =
        await vars.globals.get(denops, "mnh_header_level_shift", 1);
      let secLevel: number = 0;
      let secLevelPrev: number = 0;
      const secNumber: string[] = [0, 0, 0, 0, 0, 0];
      const contentNew: string[] = [];
      for (let i = 0; i < content.length; i++) {
        // calculate the section level
        if (content[i].match('^#{6,}')) {
          secLevel = 6;
        } else if (content[i].match('^#{5}')) {
          secLevel = 5;
        } else if (content[i].match('^#{4}')) {
          secLevel = 4;
        } else if (content[i].match('^#{3}')) {
          secLevel = 3;
        } else if (content[i].match('^#{2}')) {
          secLevel = 2;
        } else if (content[i].match('^#{1}')) {
          secLevel = 1;
        } else {
          // this line is not a header
          contentNew[i] = content[i];
          continue;
        }

        // calculate the section number
        secNumber[secLevel - 1]++;
        if (secLevel < secLevelPrev) {
          secNumber.fill(0, secLevel);
        }

        // add/modify the section number
        if (secLevel > secLevelShift) {
          contentNew[i] =
            "#".repeat(secLevel)
            + " "
            + secNumber.slice(secLevelShift, secLevel).join(".")
            + "."
            + content[i].replace(/^#+ ?([0-9]\.)* /, " ");
        } else {
          contentNew[i] = content[i];
        }
        secLevelPrev = secLevel;
      }

      // replace current buffer content
      await replace(denops, bufnr, contentNew);
      return "The numbers for the headings have been added/modified.";
    },
  };

  await denops.cmd(
    `command! -nargs=? NumberHeader echomsg denops#request('${denops.name}', 'numberHeader', [])`
  );
};
