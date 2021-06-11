#!/usr/bin/env node

const { run } = require('./index')
const argv = require('argv-parse')
const { getFullPath, getWatchDirectory, checkCommand } = require('./helper')

const args = argv({
  watch: {
    type: 'string',
    alias: 'w'
  },
  vite: {
    type: 'boolean',
    alias: 'vite'
  },
  target: {
    type: 'string',
    alias: 't'
  },
  outDir: {
    type: 'string',
    alias: 'o'
  },
  project: { // tsc build tsconfig.json
    type: 'string',
    alias: 'p'
  }
})
const runFile = args._ && args._[0]
const file = getFullPath(runFile)
const watchDirectory = getWatchDirectory(args.watch, runFile)

if (args.vite) {
  checkCommand('vite')
}
if (file.endsWith('.ts')) {
  checkCommand('tsc')
}

run({
  runFile: file,
  watchDirectory,
  runVite: args.vite
}, args)
