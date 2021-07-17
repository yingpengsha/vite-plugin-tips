const template = /** html */ `
<style>
.tip {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px #f0f1f2;
  color: #000000d9;
}
.close {
  position: absolute;
  right: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
<div class="tip">
  <span class="text"></span>
  <span class="close">X</span>
</div>
`

export interface TipOptions {
  message: string
  style?: Partial<CSSStyleDeclaration>
}

export class Tip extends HTMLElement {
  root: ShadowRoot

  constructor(options: TipOptions) {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = template
    this.text(options.message, options.style)
    this.root.querySelector('.close')?.addEventListener('click', () => this.close())
  }

  text(message: string, style: Partial<CSSStyleDeclaration> = {}): void {
    const container: HTMLDivElement = this.root.querySelector('.tip')!
    const textEl: HTMLSpanElement = this.root.querySelector('.text')!

    Object.assign(container.style, style)
    textEl.innerText = message
  }

  close(): void {
    this.parentNode?.removeChild(this)
  }
}

export const COMPONENT_ID = 'vite-plugin-tip'
customElements.define(COMPONENT_ID, Tip)

export function createTip(option: TipOptions) {
  clearTips()
  document.body.appendChild(new Tip(option))
}

export function clearTips() {
  document
    .querySelectorAll(COMPONENT_ID)
    .forEach(n => (n as Tip).close())
}
