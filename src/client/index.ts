import { ViteTipsOptions } from '../types'
import { clearTips, createTip } from './overlay'
import { errorStyle, successStyle, warnStyle } from './styles'

declare const __HMR_PROTOCOL__: string
declare const __HMR_HOSTNAME__: string
declare const __HMR_PORT__: string
declare const __TIPS_OPTION_CONNECT__: boolean
declare const __TIPS_OPTION_UPDATE__: boolean
declare const __TIPS_OPTION_DISCONNECT__: boolean

const socketProtocol = __HMR_PROTOCOL__ || (location.protocol === 'https:' ? 'wss' : 'ws')
const socketHost = `${__HMR_HOSTNAME__ || location.hostname}:${__HMR_PORT__}`
const socket = new WebSocket(`${socketProtocol}://${socketHost}`, 'vite-hmr')

const tipsOptions: ViteTipsOptions = {
  connect: __TIPS_OPTION_CONNECT__,
  update: __TIPS_OPTION_UPDATE__,
  disconnect: __TIPS_OPTION_DISCONNECT__,
}

const rawConsoleLog = console.log
const rawConsoleError = console.error

function fakeConsoleLog(...data: any[]): void {
  if (typeof data?.[0] === 'string' && (data[0].startsWith('[vite] hot updated') || data[0].startsWith('[vite] css hot updated'))) {
    createTip({
      message: data[0],
      style: successStyle,
    })
    restoreConsole()
    setTimeout(() => {
      clearTips()
    }, 1000)
  }
  rawConsoleLog.apply(console, data)
}

function fakeConsoleError(...data: any[]): void {
  const isHMRFailed = typeof data?.[0] === 'string' && data[0].startsWith('[hmr] Failed to reload')
  const isErrorInFetch = data?.[0] instanceof Error && data[0].stack?.match('fetchUpdate')
  if (isHMRFailed || isErrorInFetch) {
    createTip({
      message: data[0]?.stack || data[0],
      style: errorStyle,
    })
    restoreConsole()
  }
  rawConsoleError.apply(console, data)
}

function restoreConsole() {
  console.log = rawConsoleLog
  console.error = rawConsoleError
}

if (tipsOptions.connect) {
  createTip({
    message: '[vite] connecting...',
    style: warnStyle,
  })
}

if (tipsOptions.disconnect) {
  socket.addEventListener('close', async({ wasClean }) => {
    if (wasClean) return
    createTip({
      message: '[vite] server connection lost. polling for restart...',
      style: errorStyle,
    })
  })
}

socket.addEventListener('message', ({ data }) => {
  switch (JSON.parse(data).type) {
    case 'connected':
      if (tipsOptions.connect) {
        createTip({
          message: '[vite] connected...',
          style: successStyle,
        })
        setTimeout(() => {
          clearTips()
        }, 1000)
      }
      break
    case 'update':
      if (tipsOptions.update) {
        createTip({
          message: '[vite] updating...',
          style: warnStyle,
        })
        console.log = fakeConsoleLog
        console.error = fakeConsoleError
      }
      break
    case 'error':
      if (tipsOptions.update) {
        clearTips()
        restoreConsole()
      }
      break
    default:
      break
  }
})
