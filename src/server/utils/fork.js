import { fork } from 'child_process'
import consola from 'consola'

export default (scriptPath, env = {}) => {
  const child = fork(scriptPath, process.argv.slice(2), { env })

  child.on('close', (code, signal) => {
    consola.debug(`[${scriptPath}] Process exited with code=${code}, signal=${signal}`)
  })

  return child
}
