const chalk = require('chalk')
const chokidar = require('chokidar')
const shell = require('shelljs')
const { tsc } = require('./helper')
const currentPath = process.cwd() + '/'

let electronRestart = false
let electronProcess = null
let vueProcess = null
function getTime () {
  const now = new Date()
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
}

function printChangeLog (eventType, filename) {
  console.log(chalk.green(getTime() + ' [Electron] ' + eventType + ':' + filename))
}

/**
 * 监听electron文件变化，重启app
 */
function watchFile (watchDirectory, runFile = '', opt) {
  chokidar.watch(watchDirectory).on('change', (filename) => {
    if (electronRestart) {
      return
    }
    electronRestart = true
    if (electronProcess && electronProcess.pid) {
      process.kill(electronProcess.pid)
    }
    electronProcess = undefined
    printChangeLog('change', filename.replace(currentPath, ''))
    startElectron(runFile, opt)
    console.log(chalk.green(getTime() + ' [Electron] restart'))
  })
}

function startVue () {
  return new Promise((resolve, reject) => {
    if (vueProcess && vueProcess.pid) {
      process.kill(vueProcess.pid)
    }
    vueProcess = shell.exec('vite', { async: true })
    vueProcess.stdout.on('data', data => {
      const str = data.toString()
      if (str.includes('server running')) {
        resolve(1)
      }
    })
    vueProcess.on('close', () => {
      process.exit()
    })
  })
}

function startElectron (runFile = '', opt) {
  needTsc(runFile, opt).then((runFilePath) => {
    electronProcess = shell.exec(`NODE_ENV=development electron ${runFilePath}`, { async: true })
    electronRestart = false
    if (electronProcess) {
      const { stdout, stderr } = electronProcess
      stdout.on('data', data => {
        console.log(chalk.green(data.toString()))
      })
      stderr.on('data', data => {
        console.log(chalk.red(data.toString()))
      })
      electronProcess.on('close', () => {
        if (!electronRestart) process.exit()
      })
    }
  })
}

function needTsc (runFile, opt) {
  const isTsFile = runFile.endsWith('.ts')
  if (isTsFile) {
    return tsc(runFile, opt)
  }
  return Promise.resolve(runFile)
}

function run ({ runFile, watchDirectory, runVite }, opt) {
  watchFile(watchDirectory, runFile, opt)
  if (runVite) {
    startVue().then(() => {
      startElectron(runFile, opt)
    })
  } else {
    startElectron(runFile, opt)
  }
}

module.exports = {
  run
}
