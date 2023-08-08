import { readFileSync, writeFileSync } from 'fs'
import { transformSync } from 'esbuild'
import { createMinifier } from 'dts-minify'
import * as ts from 'typescript'
const Bar = require('progress-barjs')
const minifier = createMinifier(ts)

type Opts = {
  encoding: 'utf8'
  minifyWhitespace?: boolean
  minifyIdentifiers?: boolean
  minifySyntax?: boolean
  minifyDeclaration?: boolean
  banner?: string
}

export async function minimization(files: string[], opts: Opts) {
  const { encoding = 'utf8', minifyDeclaration, ...transformOpts } = opts
  const options =
    Object.keys(transformOpts).length > 0 ? transformOpts : { minify: true }
  const filesFiltered = files.filter(
    (f) => f.endsWith('.js') || (minifyDeclaration && f.endsWith('.d.ts'))
  )
  const bar = Bar({
    label: 'Minimize JS',
    info: 'Processing',
    total: filesFiltered.length,
  })
  let i = 0
  let timer = setInterval(async () => {
    const file = filesFiltered[i]
    if (file) {
      const isDeclarationFile = minifyDeclaration && file.endsWith('.d.ts')
      const content = readFileSync(file, { encoding })
      const { code } = isDeclarationFile
        ? { code: minifier.minify(content) }
        : transformSync(content, options)
      if (code) {
        let c =
          code.search('##!/usr/bin/env') !== -1
            ? code.replaceAll(/\n/g, '')
            : code.trim()
        if (isDeclarationFile) c = c.replaceAll('#!/usr/bin/env node', '')
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
