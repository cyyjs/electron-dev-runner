# electron-dev-runner
![LICENSE](https://img.shields.io/github/license/cyyjs/electron-dev-runner)
![npm (scoped)](https://img.shields.io/npm/v/electron-dev-runner)

一个在`Electron`开发环境使用的启动工具。

支持功能：

- 监听主进程文件变化自动重启`electron`
- 支持 `TS` 入口文件启动
- 支持配置自动启动 `Vite`

## Install

```sh
npm install electron-dev-runner -D
# or
yarn add electron-dev-runner - D
```

## Usage

修改`package.json`中`scripts`
```json
{
  "scripts" : {
    "dev": "electron-dev-runner src/main/index.ts --vite"
  }
}
```

## Command Options

```sh
electron-dev-runner <file>
```
参数说明：

- `file`: 主进程启动入口文件；
- `-w`： 要监听的文件夹，默认为主进程启动文件所在的文件夹；例如:`-w src/main`；
- `-o`： `ts`编译输出目录，等同于`ts`的`outDir`， 默认为`dist/main`；
- `-t`：`ts`指定ECMAScript目标版本，等同于`ts`的`target`,默认为`ES5`；
- `-p`：`ts`指定的`tsconfig.json`配置文件或文件夹，如果指定了此参数，`file`
、`-o`和`-t`视为无效。
- `--vite`： 是否默认启动`vite`，如果添加了此参数，会使用`vite`启动渲染进程。


## License
MIT
