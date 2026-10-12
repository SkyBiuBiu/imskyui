/* 测试环境补丁：jsdom 未实现 HTMLDialogElement，为 vitest 提供最小 polyfill，
   使基于原生 <dialog> 的 Modal / Command 可在 jsdom 中测试。 */
if (typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
    this.dispatchEvent(new Event('open'))
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement, returnValue?: string) {
    this.open = false
    this.returnValue = returnValue ?? ''
    this.dispatchEvent(new Event('close'))
  }
}
