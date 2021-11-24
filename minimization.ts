import { readFileSync, writeFileSync } from 'fs'
import { transform } from 'esbuild'
const Bar = require('progress-barjs')

type Opts = {
  encoding: 'utf8'
}

export async function minimization(files: string[], opts: Opts) {
  const { encoding = 'utf8' } = opts
  const filesFiltered = files.filter(
    (f) => f.endsWith('.js') || f.endsWith('.json')
  )
  const bar = Bar({
    label: 'Minimize JS',
    info: 'Processing',
    total: filesFiltered.length,
  })
  let i = 0
  let timer = setInterval(async () => {
    const file = filesFiltered[i]
    const loader = file?.endsWith('js') ? 'js' : 'json'
    if (file) {
      const content = readFileSync(file, { encoding })
      const { code } = await transform(content, {
        loader,
        minify: true,
      })
      code && writeFileSync(file, code.replaceAll(/\n/g, ''), { encoding })
    }
    bar.tick('Tick number ' + i)
    if (bar.complete) {
      clearInterval(timer)
      console.log('\n', `🎉 Files have been minimized with success. 🎉`)
    }
    i++
  }, 100)
}
