import { readFileSync } from 'fs'
import { exec } from 'child_process'

test('Minimize lib directory', async () => {
  const script = `node ./lib/minimization.js lib`
  await exec(script)
  const result = readFileSync('lib/minimization.js', { encoding: 'utf8' })
  const expected = [expect.stringMatching(/\n/g)]
  expect([result]).not.toEqual(expect.arrayContaining(expected))
})

test('Minimize lib directory with declaration files', async () => {
  const script = `node ./lib/minimization.js lib -d`
  await exec(script)
  const result = readFileSync('lib/minimization.d.ts', { encoding: 'utf8' })
  const expected = [expect.stringMatching(/\n/g)]
  expect([result]).not.toEqual(expect.arrayContaining(expected))
})
