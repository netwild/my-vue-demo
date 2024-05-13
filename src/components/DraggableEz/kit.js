/*
 * @Author: Z.MingYu
 * @Date: 2024-05-06 08:22:12
 * @Description: 常用底层函数封装
 */

import { v4 as uuidv4 } from 'uuid'

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

function setLocal(key, value) {
  if (isNull(value)) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Error setting localStorage value:', e)
  }
}

function getLocal(key) {
  try {
    const value = localStorage.getItem(key)
    return notEmpty(value) ? JSON.parse(value) : null
  } catch (e) {
    console.error('Error getting localStorage value:', e)
    return null
  }
}

function genUUID() {
  return uuidv4()
}

export default {
  isNull,
  notNull,
  ifNull,
  isEmpty,
  notEmpty,
  ifEmpty,
  deepClone,
  setLocal,
  getLocal,
  genUUID
}
