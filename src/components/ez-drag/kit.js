function isNull(val) {
  return val === null || val === undefined
}

function notNull(val) {
  return !isNull(val)
}

function ifNull(val, def) {
  return isNull(val) ? def : val
}

function isEmpty(val) {
  if (isNull(val)) return true
  return /^\s*$/.test(val)
}

function notEmpty(val) {
  return !isEmpty(val)
}

function ifEmpty(val, def) {
  return isEmpty(val) ? def : val
}

function deepClone(obj) {
  if (isNull(obj)) return null
  return JSON.parse(JSON.stringify(obj))
}

export default {
  isNull,
  notNull,
  ifNull,
  isEmpty,
  notEmpty,
  ifEmpty,
  deepClone
}
