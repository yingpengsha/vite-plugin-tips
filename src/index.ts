import path from 'path'
import { Plugin, ResolvedConfig } from 'vite'
import { CLIENT_FILE_ID, CLIENT_RP_ENTRY } from './constants'

export function ViteTips(): Plugin {
  let config: ResolvedConfig
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
        let options = config.server.hmr
        options = options && typeof options !== 'boolean' ? options : {}
        const host = options.host || null
        const protocol = options.protocol || null
        let port
        if (config.server.middlewareMode) {
          if (typeof config.server.hmr === 'object')
            port = config.server.hmr.clientPort || config.server.hmr.port

          port = String(port || 24678)
        }
        else {
          port = String(options.port || config.server.port!)
        }
        let hmrBase = config.base
        if (options.path)
          hmrBase = path.posix.join(hmrBase, options.path)

        if (hmrBase !== '/')
          port = path.posix.normalize(`${port}${hmrBase}`)

        return code
          .replace('__HMR_PROTOCOL__', JSON.stringify(protocol))
          .replace('__HMR_HOSTNAME__', JSON.stringify(host))
          .replace('__HMR_PORT__', JSON.stringify(port))
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
