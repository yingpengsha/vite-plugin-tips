import { clearTips, createTip } from './overlay'

declare const __HMR_PROTOCOL__: string
declare const __HMR_HOSTNAME__: string
declare const __HMR_PORT__: string

const socketProtocol = __HMR_PROTOCOL__ || (location.protocol === 'https:' ? 'wss' : 'ws')
const socketHost = `${__HMR_HOSTNAME__ || location.hostname}:${__HMR_PORT__}`
const socket = new WebSocket(`${socketProtocol}://${socketHost}`, 'vite-hmr')

createTip({
  message: '[vite] connecting...',
  style: {
    backgroundColor: '#ffe58f',
    borderBottom: '1px solid #ffc400',
  },
})

socket.addEventListener('close', async({ wasClean }) => {
  if (wasClean) return
  createTip({
    message: '[vite] server connection lost. polling for restart...',
    style: {
      backgroundColor: '#ffccc7',
      borderBottom: '1px solid #da5e52',
    },
  })
})

socket.addEventListener('message', ({ data }) => {
  if (JSON.parse(data).type === 'connected') {
    createTip({
      message: '[vite] connected...',
      style: {
        backgroundColor: '#b7eb8f',
        borderBottom: '1px solid #7cce3d',
      },
    })
    setTimeout(() => {
      clearTips()
    }, 1000)
  }
})
