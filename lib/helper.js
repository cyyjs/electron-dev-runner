const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const shell = require('shelljs')

const DEFAULT_OUT_DIR = 'dist/main'
const DEFAULT_TARGET = 'ES5'

// callback error
const errMsg = (msg) => {
  shell.echo(chalk.red(msg))
  shell.exit(9)
}

// get startup file
const getFullPath = (file) => {
  if (!file) {
    return errMsg('error: Missing main process entry file!')
  }

  let filePath = path.resolve(process.cwd(), file)
  if (!filePath.endsWith('.js') && !filePath.endsWith('.ts')) {
    filePath += '.js'
  }

  const hasFile = fs.existsSync(filePath)
  if (!hasFile) {
    return errMsg(`error: [${file}] is not find!`)
  }
  return filePath
}

// get watch directory
const getWatchDirectory = (watchFile = '', startFild = '') => {
  let dirPath = path.resolve(process.cwd(), watchFile)
  if (!watchFile) {
    dirPath = path.resolve(process.cwd(), startFild, '..')
  }
  const hasPath = fs.existsSync(dirPath)
  if (!hasPath) {
    return errMsg(`error: watch directory [${dirPath}] is not find!`)
  }
  return dirPath
}

// check command for installation
const checkCommand = (command) => {
  if (!shell.which(command)) {
    return errMsg(`error: ${command} is not install!`)
  }
}

// typescript compile
const tsc = (runFile, opt = {}) => {
  const outDir = path.resolve(process.cwd(), opt.outDir || DEFAULT_OUT_DIR)
  const target = opt.target || DEFAULT_TARGET
  let execStr = `tsc ${runFile} --moduleResolution Node --removeComments true -t ${target} --outDir ${outDir}`
  const project = opt.project
  if (project) {
    const fullTsconfigPath = path.resolve(process.cwd(), project)
    if (!fs.existsSync(fullTsconfigPath)) {
      return errMsg(`error: [${project}] is not find!`)
    }
    execStr = `tsc -p ${project}`
  }
  return new Promise((resolve) => {
    shell.exec(execStr, (code, stdout, stderr) => {
      if (code) {
        return errMsg(`error: ${stderr || stdout}`)
      }
      const realPath = getCompiledFilePath(runFile, opt)
      resolve(realPath)
    })
  })
}

// Gets the compiled file path
const getCompiledFilePath = (runFile, opt = {}) => {
  let file = runFile.split('/').slice(-1)[0]
  file = file.replace(/\.ts$/, '.js')
  return path.resolve(process.cwd(), opt.outDir || DEFAULT_OUT_DIR, file)
}

module.exports = {
  getFullPath,
  getWatchDirectory,
  checkCommand,
  tsc,
  getCompiledFilePath
}
