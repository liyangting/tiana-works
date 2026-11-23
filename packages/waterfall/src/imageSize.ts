export interface WaterfallImageSizeOptions {
  /** 预加载超时时间，默认 3000ms；超时按失败处理。 */
  timeout?: number
  /** 加载失败时的兜底宽高比（width / height）。 */
  fallbackAspectRatio?: number
}

export interface WaterfallImageSize {
  naturalWidth: number
  naturalHeight: number
  aspectRatio: number
  /** CSS 可直接绑定的 `"w / h"` 格式。 */
  aspectRatioText: string
}

const DEFAULT_TIMEOUT = 3000

/** 模块级缓存：同一 src 的并发请求合并，失败结果同样缓存，避免坏图反复请求。 */
const imageSizeCache = new Map<string, Promise<WaterfallImageSize | null>>()

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof Image !== 'undefined'
}

function createFallbackSize(fallbackAspectRatio?: number): WaterfallImageSize | null {
  if (
    typeof fallbackAspectRatio !== 'number' ||
    !Number.isFinite(fallbackAspectRatio) ||
    fallbackAspectRatio <= 0
  ) {
    return null
  }
  return {
    naturalWidth: fallbackAspectRatio,
    naturalHeight: 1,
    aspectRatio: fallbackAspectRatio,
    aspectRatioText: `${fallbackAspectRatio} / 1`,
  }
}

function loadImageSize(
  src: string,
  timeout: number,
  fallbackAspectRatio?: number,
): Promise<WaterfallImageSize | null> {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const finish = (size: WaterfallImageSize | null) => {
      if (settled) return
      settled = true
      if (timer !== null) clearTimeout(timer)
      image.onload = null
      image.onerror = null
      resolve(size ?? createFallbackSize(fallbackAspectRatio))
    }

    timer = setTimeout(() => finish(null), Math.max(0, timeout))

    image.onload = () => {
      const { naturalWidth, naturalHeight } = image
      if (naturalWidth > 0 && naturalHeight > 0) {
        finish({
          naturalWidth,
          naturalHeight,
          aspectRatio: naturalWidth / naturalHeight,
          aspectRatioText: `${naturalWidth} / ${naturalHeight}`,
        })
        return
      }
      finish(null)
    }
    image.onerror = () => finish(null)

    image.src = src
  })
}

/**
 * 读取图片原始尺寸。无 src、非浏览器环境或加载失败时返回 fallback（若提供），否则返回 null。
 */
export function getWaterfallImageSize(
  src: string,
  options: WaterfallImageSizeOptions = {},
): Promise<WaterfallImageSize | null> {
  if (!src || !isBrowser()) {
    return Promise.resolve(createFallbackSize(options.fallbackAspectRatio))
  }

  const cached = imageSizeCache.get(src)
  if (cached) return cached

  const task = loadImageSize(src, options.timeout ?? DEFAULT_TIMEOUT, options.fallbackAspectRatio)
  imageSizeCache.set(src, task)
  return task
}

/**
 * 按展示宽度换算高度；尺寸无效或展示宽度为 0 时返回 null。
 */
export function getWaterfallImageDisplayHeight(
  imageSize: WaterfallImageSize | null | undefined,
  displayWidth: number,
): number | null {
  if (!imageSize) return null
  if (!Number.isFinite(imageSize.aspectRatio) || imageSize.aspectRatio <= 0) return null
  if (!Number.isFinite(displayWidth) || displayWidth <= 0) return null
  return displayWidth / imageSize.aspectRatio
}
