import path from 'path'
import { Plugin, ResolvedConfig } from 'vite'
import { CLIENT_FILE_ID, CLIENT_RP_ENTRY } from './constants'
import { ViteTipsOptions } from './types'

export function ViteTips(rawOptions: Partial<ViteTipsOptions> = {}): Plugin {
  let config: ResolvedConfig
  const options: ViteTipsOptions = {
    connect: rawOptions.connect ?? true,
    update: rawOptions.update ?? true,
    disconnect: rawOptions.disconnect ?? true,
  }

  return {
    name: 'vite-plugin-tips',
    config: () => ({
      optimizeDeps: {
        exclude: ['vite-plugin-tips'],
      },
    }),
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    load(id) {
      if (id.endsWith(CLIENT_FILE_ID))
        return `import '${CLIENT_RP_ENTRY}'`
    },
    transform(code, id) {
      if (id.match(CLIENT_RP_ENTRY)) {
        let HMROptions = config.server.hmr
        HMROptions = HMROptions && typeof HMROptions !== 'boolean' ? HMROptions : {}
        const host = HMROptions.host || null
        const protocol = HMROptions.protocol || null
        let port
        if (config.server.middlewareMode) {
          if (typeof config.server.hmr === 'object')
            port = config.server.hmr.clientPort || config.server.hmr.port

          port = String(port || 24678)
        }
        else {
          port = String(HMROptions.port || config.server.port!)
        }
        let hmrBase = config.base
        if (HMROptions.path)
          hmrBase = path.posix.join(hmrBase, HMROptions.path)

        if (hmrBase !== '/')
          port = path.posix.normalize(`${port}${hmrBase}`)

        return code
          .replace('__HMR_PROTOCOL__', JSON.stringify(protocol))
          .replace('__HMR_HOSTNAME__', JSON.stringify(host))
          .replace('__HMR_PORT__', JSON.stringify(port))
          .replace('__TIPS_OPTION_CONNECT__', Boolean(options.connect).toString())
          .replace('__TIPS_OPTION_UPDATE__', Boolean(options.update).toString())
          .replace('__TIPS_OPTION_DISCONNECT__', Boolean(options.disconnect).toString())
      }
    },
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: {
                type: 'module',
                src: CLIENT_FILE_ID,
              },
              injectTo: 'head-prepend',
            },
          ],
        }
      },
    },
  }
}

export default ViteTips
