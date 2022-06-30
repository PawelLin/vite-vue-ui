export const isMobile = () => /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)

export const isTruthy = (value: unknown) => !!(value || value === 0)
