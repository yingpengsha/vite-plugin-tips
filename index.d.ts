import { Plugin } from 'vite'

declare module 'vite-plugin-tips' {
  export function ViteTips(): Plugin
  export default function ViteTips(): Plugin
}
