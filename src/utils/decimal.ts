/**
 * 数字精度处理工具
 * 基于 decimal.js 提供高精度数字计算
 */

import { Decimal } from 'decimal.js'

/**
 * 配置 Decimal.js 全局设置
 */
Decimal.set({
  precision: 20, // 精度设置为20位
  rounding: Decimal.ROUND_HALF_UP, // 四舍五入
  toExpNeg: -7, // 负指数阈值
  toExpPos: 21, // 正指数阈值
  modulo: Decimal.ROUND_DOWN // 取模运算模式
})

/**
 * 数字精度处理类
 */
export class DecimalUtil {
  /**
   * 创建 Decimal 实例
   * @param value 数值
   * @returns Decimal 实例
   */
  static create(value: Decimal.Value): Decimal {
    return new Decimal(value)
  }

  /**
   * 加法运算
   * @param a 被加数
   * @param b 加数
   * @returns 计算结果
   */
  static add(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).add(b)
  }

  /**
   * 减法运算
   * @param a 被减数
   * @param b 减数
   * @returns 计算结果
   */
  static subtract(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).sub(b)
  }

  /**
   * 乘法运算
   * @param a 被乘数
   * @param b 乘数
   * @returns 计算结果
   */
  static multiply(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).mul(b)
  }

  /**
   * 除法运算
   * @param a 被除数
   * @param b 除数
   * @returns 计算结果
   */
  static divide(a: Decimal.Value, b: Decimal.Value): Decimal {
    return new Decimal(a).div(b)
  }

  /**
   * 格式化为指定小数位数的字符串
   * @param value 数值
   * @param decimalPlaces 小数位数
   * @returns 格式化后的字符串
   */
  static toFixed(value: Decimal.Value, decimalPlaces: number = 2): string {
    return new Decimal(value).toFixed(decimalPlaces)
  }

  /**
   * 格式化为数字（可能丢失精度）
   * @param value 数值
   * @returns 数字
   */
  static toNumber(value: Decimal.Value): number {
    return new Decimal(value).toNumber()
  }

  /**
   * 格式化为字符串
   * @param value 数值
   * @returns 字符串
   */
  static toString(value: Decimal.Value): string {
    return new Decimal(value).toString()
  }

  /**
   * 比较两个数值
   * @param a 数值A
   * @param b 数值B
   * @returns -1: a < b, 0: a = b, 1: a > b
   */
  static compare(a: Decimal.Value, b: Decimal.Value): number {
    return new Decimal(a).cmp(b)
  }

  /**
   * 判断是否相等
   * @param a 数值A
   * @param b 数值B
   * @returns 是否相等
   */
  static equals(a: Decimal.Value, b: Decimal.Value): boolean {
    return new Decimal(a).eq(b)
  }

  /**
   * 判断是否大于
   * @param a 数值A
   * @param b 数值B
   * @returns a > b
   */
  static greaterThan(a: Decimal.Value, b: Decimal.Value): boolean {
    return new Decimal(a).gt(b)
  }

  /**
   * 判断是否大于等于
   * @param a 数值A
   * @param b 数值B
   * @returns a >= b
   */
  static greaterThanOrEqual(a: Decimal.Value, b: Decimal.Value): boolean {
    return new Decimal(a).gte(b)
  }

  /**
   * 判断是否小于
   * @param a 数值A
   * @param b 数值B
   * @returns a < b
   */
  static lessThan(a: Decimal.Value, b: Decimal.Value): boolean {
    return new Decimal(a).lt(b)
  }

  /**
   * 判断是否小于等于
   * @param a 数值A
   * @param b 数值B
   * @returns a <= b
   */
  static lessThanOrEqual(a: Decimal.Value, b: Decimal.Value): boolean {
    return new Decimal(a).lte(b)
  }

  /**
   * 取绝对值
   * @param value 数值
   * @returns 绝对值
   */
  static abs(value: Decimal.Value): Decimal {
    return new Decimal(value).abs()
  }

  /**
   * 向上取整
   * @param value 数值
   * @returns 向上取整结果
   */
  static ceil(value: Decimal.Value): Decimal {
    return new Decimal(value).ceil()
  }

  /**
   * 向下取整
   * @param value 数值
   * @returns 向下取整结果
   */
  static floor(value: Decimal.Value): Decimal {
    return new Decimal(value).floor()
  }

  /**
   * 四舍五入
   * @param value 数值
   * @param decimalPlaces 保留小数位数
   * @returns 四舍五入结果
   */
  static round(value: Decimal.Value, decimalPlaces: number = 0): Decimal {
    return new Decimal(value).toDecimalPlaces(decimalPlaces)
  }

  /**
   * 格式化金额（添加千分位分隔符）
   * @param value 数值
   * @param decimalPlaces 小数位数
   * @param separator 千分位分隔符
   * @returns 格式化后的金额字符串
   */
  static formatMoney(
    value: Decimal.Value,
    decimalPlaces: number = 2,
    separator: string = ','
  ): string {
    const decimal = new Decimal(value)
    const fixed = decimal.toFixed(decimalPlaces)
    const parts = fixed.split('.')
    
    // 添加千分位分隔符
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    
    return parts.join('.')
  }

  /**
   * 计算百分比
   * @param value 数值
   * @param total 总数
   * @param decimalPlaces 小数位数
   * @returns 百分比字符串
   */
  static toPercentage(
    value: Decimal.Value,
    total: Decimal.Value,
    decimalPlaces: number = 2
  ): string {
    if (new Decimal(total).eq(0)) {
      return '0%'
    }
    
    const percentage = new Decimal(value).div(total).mul(100)
    return `${percentage.toFixed(decimalPlaces)}%`
  }
}

/**
 * 导出常用方法的简化版本
 */
export const {
  add,
  subtract,
  multiply,
  divide,
  toFixed,
  toNumber,
  toString,
  compare,
  equals,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  abs,
  ceil,
  floor,
  round,
  formatMoney,
  toPercentage
} = DecimalUtil

/**
 * 导出 Decimal 类
 */
export { Decimal }

/**
 * 默认导出
 */
export default DecimalUtil