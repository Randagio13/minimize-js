#!/usr/bin/env node
import { Command } from 'commander'
import { readFileSync, statSync, writeFileSync } from 'fs'
import { minify } from 'terser'
import { glob } from 'glob'
const prettyBytes = require('pretty-bytes')

const encoding = 'utf8'
const program = new Command()
program.argument('<directory>', 'your files directory')

program.parse()

const [directory] = program.args
console.log(`args`, directory)

if (directory) {
  const files = glob.sync(`${directory}/**`, {})
  console.log(`search`, files)
  files.forEach(async (file) => {
    if (file.endsWith('.js')) {
      const content = readFileSync(file, { encoding })
      const stats = statSync(file)
      console.log(`fileSize ${file}`, prettyBytes(stats.size))
      const { code } = await minify(content, {
        compress: false,
        mangle: true,
      })
      const minifyStats = statSync(file)
      console.log(`minified ${file}`, prettyBytes(minifyStats.size))
      code && writeFileSync(file, code, { encoding })
    }
  })
}
