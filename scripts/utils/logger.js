const LEVELS = { info: '📋', success: '✅', warn: '⚠️ ', error: '❌' }

function log(level, msg, data) {
  const ts = new Date().toISOString()
  const prefix = `[${ts}] ${LEVELS[level] ?? '  '}`
  if (data !== undefined) {
    console.log(`${prefix} ${msg}`, data)
  } else {
    console.log(`${prefix} ${msg}`)
  }
}

export const logger = {
  info:    (msg, data) => log('info',    msg, data),
  success: (msg, data) => log('success', msg, data),
  warn:    (msg, data) => log('warn',    msg, data),
  error:   (msg, data) => log('error',   msg, data),
}
