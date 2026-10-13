/**
 * 版本信息单一来源。
 *
 * 以 package.json 为唯一事实来源，此处仅在构建期注入常量；
 * 发版时只需改 package.json 一处，pnpm check:version 会校验二者是否同步。
 */
export const VERSION = '1.4.0'

/** 展示用短版本号（徽章、标签页文案用） */
export const VERSION_SHORT = `v${VERSION.split('.')[0]}.${VERSION.split('.')[1]}`

/** 组件与工具总数，口径为 ui.tsx 的 export function 数量（含 hooks） */
export const COMPONENT_COUNT = 66