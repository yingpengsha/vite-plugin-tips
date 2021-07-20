> This project has been included in [awesome-vite](https://github.com/vitejs/awesome-vite).

# vite-plugin-tips

Provide better development server status tips on the page.

![tips](https://user-images.githubusercontent.com/37143265/126253070-83618ae6-bb85-44f9-b6c3-fba0f4faabe0.png)

## Collection of tip

![screenshot](https://user-images.githubusercontent.com/37143265/126061915-60eedf40-8a54-4837-9816-0d93c4a11b50.png)

## Usage

### Install

```bash
$ npm install vite-plugin-tips -D
```

### configuration

```js
import viteTips from 'vite-plugin-tips'

export default {
  plugins: [
    viteTips()
  ]
}
```

## Options

```ts
interface Options {
  // Whether to enable relevant tips. Default is enabled.
  connect?: boolean
  update?: boolean
  disconnect?: boolean
}
```

## License

[MIT](LICENSE)
