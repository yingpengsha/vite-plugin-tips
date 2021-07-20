import { Plugin } from 'vite'
import { ViteTipsOptions } from './src/types'

declare module 'vite-plugin-tips' {
  export function ViteTips(options?: ViteTipsOptions): Plugin
  export default function ViteTips(options?: ViteTipsOptions): Plugin
}
