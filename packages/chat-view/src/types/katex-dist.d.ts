// cspell:ignore katex Katex

declare module 'katex/dist/katex.mjs' {
  interface KatexRenderOptions {
    readonly displayMode?: boolean
    readonly throwOnError?: boolean
  }

  interface KatexModule {
    renderToString(value: string, options?: KatexRenderOptions): string
  }

  const katex: KatexModule
  export default katex
}
