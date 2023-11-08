import { Plugin } from 'vite'
import { ViteTipsOptions as InnerViteTipsOptions } from './src/types'


export type ViteTipsOptions = Partial<InnerViteTipsOptions>
export function ViteTips(options?: ViteTipsOptions): Plugin
