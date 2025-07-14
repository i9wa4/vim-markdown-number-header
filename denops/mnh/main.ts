import { Denops, replace, vars } from "./deps.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async numberHeader() {
      // get global variables
      const secLevelShift: number = await vars.globals.get(
        denops,
        "mnh_header_level_shift",
        1,
      );

      // get current buffer content
      const bufnr = await denops.call("bufnr") as number;
      const content = (await denops.call(
        "getbufline",
        bufnr,
        1,
        "$",
      )) as string[];

      // number headers
      let secLevel = 0;
      let secLevelPrev = 0;
      let isInsideCodeblock = false;
      let codeBlockDelimiter: string | null = null; // Tracks the type of delimiter (``` or ~~~) for the outermost code block.
                                                   // This helps determine whether the current line is inside or outside a code block.
      const secNumber = [0, 0, 0, 0, 0, 0];
      const contentNew = [];
      for (let i = 0; i < content.length; i++) {
        const line = content[i];
        const match = line.match(/^\s*(```|~~~)/);

        if (match) {
          const currentDelimiter = match[1];
          if (!isInsideCodeblock) {
            // Entering the outermost code block
            isInsideCodeblock = true;
            codeBlockDelimiter = currentDelimiter;
          } else if (currentDelimiter === codeBlockDelimiter) {
            // Exiting the outermost code block
            isInsideCodeblock = false;
            codeBlockDelimiter = null;
          }
          // Keep the delimiter line regardless of nesting level
          contentNew[i] = line;
          continue; // Skip numbering logic for delimiter lines
        }

        // If inside a code block (determined by the outermost delimiter), keep the line as is
        if (isInsideCodeblock) {
          contentNew[i] = content[i];
          continue;
        }

        // calculate the section level (only if not inside a code block)
        if (content[i].match("^#{6,}")) {
          secLevel = 6;
        } else if (content[i].match("^#{5}")) {
          secLevel = 5;
        } else if (content[i].match("^#{4}")) {
          secLevel = 4;
        } else if (content[i].match("^#{3}")) {
          secLevel = 3;
        } else if (content[i].match("^#{2}")) {
          secLevel = 2;
        } else if (content[i].match("^#{1}")) {
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
          const headerContent = content[i].match(/^#+ ?([0-9]*\.)* ?(.*)$/);
          const textContent = headerContent ? headerContent[2] : "";
          contentNew[i] = "#".repeat(secLevel) +
            " " +
            secNumber.slice(secLevelShift, secLevel).join(".") +
            "." +
            (textContent ? " " + textContent : "");
        } else {
          // contentNew[i] = content[i];
          const headerContent = content[i].match(/^#+ ?([0-9]*\.)* ?(.*)$/);
          const textContent = headerContent ? headerContent[2] : "";
          contentNew[i] = "#".repeat(secLevel) +
            (textContent ? " " + textContent : "");
        }
        secLevelPrev = secLevel;
      }

      // replace current buffer content
      await replace(denops, bufnr, contentNew);
    },
  };

  await denops.cmd(
    `command! -nargs=? NumberHeader call denops#request('${denops.name}', 'numberHeader', [])`,
  );
}
