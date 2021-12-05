import { readFileSync, writeFileSync } from 'fs'
import { transformSync } from 'esbuild'
const Bar = require('progress-barjs')

type Opts = {
  encoding: 'utf8'
  minifyWhitespace?: boolean
  minifyIdentifiers?: boolean
  minifySyntax?: boolean
}

export async function minimization(files: string[], opts: Opts) {
  const { encoding = 'utf8', ...transformOpts } = opts
  const options =
    Object.keys(transformOpts).length > 0 ? transformOpts : { minify: true }
  const filesFiltered = files.filter((f) => f.endsWith('.js'))
  const bar = Bar({
    label: 'Minimize JS',
    info: 'Processing',
    total: filesFiltered.length,
  })
  let i = 0
  let timer = setInterval(async () => {
    const file = filesFiltered[i]
    if (file) {
      const content = readFileSync(file, { encoding })
      const { code } = transformSync(content, options)
      if (code) {
        const c =
          code.search('##!/usr/bin/env') !== -1
            ? code.replaceAll(/\n/g, '')
            : code.trim()
        writeFileSync(file, c, { encoding })
      }
    }
    bar.tick('Tick number ' + i)
    if (bar.complete) {
      clearInterval(timer)
      console.log('\n', `🎉 Files have been minimized with success. 🎉`)
    }
    i++
  }, 100)
}
