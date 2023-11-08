import { Plugin } from 'vite'
import { ViteTipsOptions } from './src/types'

export type { ViteTipsOptions }
export function ViteTips(options?: ViteTipsOptions): Plugin
