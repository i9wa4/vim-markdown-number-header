# vim-markdown-number-header

This is a Vim/Neovim plugin numbering/renumbering markdown headings.

Read [help](doc/markdown-number-header.txt) for details.

## 1. Requirements

- <https://deno.com/>
- <https://github.com/vim-denops/denops.vim>

## 2. Installation

Install as a general Vim/Neovim plugin.

## 3. Usage

Execute the command to add numbers to headers.

```
:NumberHeader
```

Execute the command to remove numbers from headers.

```
:RemoveNumbers
```

If you want to execute the command every time on save .md automatically, write the followings in your vimrc.

```
augroup mnh
  autocmd!
  autocmd BufWritePost *.md execute 'NumberHeader'
augroup END
```

## 4. Limitations

- Only headings up to h6 (`######`) are supported for numbering/renumbering.
