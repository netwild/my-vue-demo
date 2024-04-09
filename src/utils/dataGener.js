import { fakerZH_CN as faker } from '@faker-js/faker'

/**
 * 生成UUID
 * @returns
 */
function uuid() {
  return faker.string.uuid()
}

/**
 * 生成随机整数
 * @param {*} min 最小
 * @param {*} max 最大
 * @returns
 */
function number(min = 0, max = 100) {
  return faker.number.int({ min, max })
}

/**
 * 生成随机浮点数
 * @param {*} min 最小
 * @param {*} max 最大
 * @param {*} fixed 小数位数
 * @returns
 */
function float(min = 0, max = 1, fixed = 2) {
  return faker.number.float({ min, max, fractionDigits: fixed })
}

/**
 * 按正则生成随机字符串
 * @param {*} reg 模板
 * @returns
 */
function regexp(reg) {
  return faker.helpers.fromRegExp(`${reg}`)
}

/**
 * 按字典生成随机字符串
 * @param {*} chars 字典母表
 * @param {*} len 长度
 * @returns
 */
function string(chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&', len = 20) {
  return faker.string.fromCharacters(chars, len)
}

/**
 * 生成随机单词
 * @returns
 */
function word() {
  return faker.lorem.word()
}

/**
 * 生成随机句子
 * @returns
 */
function sentence() {
  return faker.lorem.sentence()
}

/**
 * 生成随机段落
 * @returns
 */
function paragraphs() {
  return faker.lorem.paragraphs()
}

/**
 * 生成随机文本
 * @returns
 */
function text() {
  return faker.lorem.text()
}

/**
 * 生成姓名
 * @returns
 */
function name() {
  const surname = faker.person.lastName()
  const firstName = faker.person.firstName()
  return `${surname}${firstName}`
}

/**
 * 生成性别
 * @returns
 */
function sex() {
  const maps = ['男', '女']
  return faker.helpers.arrayElement(maps)
}

/**
 * 生成民族
 * @returns
 */
function nation() {
  const maps = ['汉族', '壮族', '满族', '回族', '维吾尔族', '蒙古族']
  return faker.helpers.arrayElement(maps)
}

/**
 * 生成政治面貌
 * @returns
 */
function polStatus() {
  const maps = ['中共党员', '共青团员', '无党派人士', '群众']
  return faker.helpers.arrayElement(maps)
}

/**
 * 生成年龄（18~35）
 * @returns
 */
function age() {
  return faker.number.int({ min: 18, max: 35 })
}

/**
 * 生成出生日期
 * @returns
 */
function birthday() {
  const dt = faker.date.birthdate({ min: 18, max: 35, mode: 'age' })
  return formatDate(dt)
}

/**
 * 生成城市
 * @returns
 */
function city() {
  return faker.location.city()
}

/**
 * 生成地址
 * @returns
 */
function addr() {
  return faker.location.streetAddress({ useFullAddress: true })
}

/**
 * 生成手机号
 * @returns
 */
function mobile() {
  const prefixNum = faker.helpers.arrayElement(['30', '35', '37', '58', '86'])
  const otherNum = faker.number.int({ min: 10000000, max: 99999999 })
  return `1${prefixNum}${otherNum}`
}

/**
 * 生成座机号
 * @returns
 */
function phone() {
  return faker.phone.number()
}

/**
 * 生成Email
 * @returns
 */
function email() {
  return faker.internet.email()
}

/**
 * 生成随机密码
 * @returns
 */
function password(len = 18) {
  return faker.internet.password({ length: len })
}

/**
 * 生成随机IP地址（默认v4）
 * @returns
 */
function ip() {
  return ipv4()
}

/**
 * 生成随机的IPv4地址
 * @returns
 */
function ipv4() {
  return faker.internet.ipv4()
}

/**
 * 生成随机的IPv6地址
 * @returns
 */
function ipv6() {
  return faker.internet.ipv6()
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = (1 + date.getMonth()).toString()
  month = month.padStart(2, '0')
  var day = date.getDate().toString()
  day = day.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default {
  uuid,
  number,
  float,
  regexp,
  string,
  word,
  sentence,
  paragraphs,
  text,
  name,
  sex,
  age,
  birthday,
  city,
  addr,
  nation,
  polStatus,
  mobile,
  phone,
  email,
  password,
  ip,
  ipv4,
  ipv6
}
