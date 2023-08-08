#!/usr/bin/env node
import { Command } from 'commander'
import { glob } from 'glob'
import { minimization } from './minimization'

const encoding = 'utf8'
const program = new Command()

async function getFiles(directory: string) {
  const options = program.opts()
  if (directory) {
    const files = glob.sync(`${directory}/**`, {})
    await minimization(files, { encoding, ...options })
  }
}

async function run() {
  program.argument('<directory>', 'your files directory').action(getFiles)
  program.option(
    '-w, --minifyWhitespace',
    'It only removes whitespace characters'
  )
  program.option(
    '-i, --minifyIdentifiers',
    'It only transforms the identifiers'
  )
  program.option('-s, --minifySyntax', 'It only transforms the syntax')
  program.option(
    '-d, --minifyDeclaration',
    'It only transforms the declaration syntax'
  )
  program.option(
    '-b, --banner <banner>',
    'It adds a banner to the top of the js file'
  )
  await program.parseAsync()
}

run()
