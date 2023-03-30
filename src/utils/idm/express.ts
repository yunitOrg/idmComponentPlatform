import cachePool from './cache'
import { each } from 'lodash-es'
const replaceMap = cachePool(200)
const parseMap: any = {}
const rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g
const rimprovePriority = /[+-\?]/
const ruselessSp = /\s*(\.|\|)\s*/g
const rvmKey = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g
const robjectKey = /(\{|\,)\s*([\$\w]+)\s*:/g
const rfilterName = /\|(\w+)/g
const rshortCircuit = /\|\|/g
const rpipeline = /\|(?=\?\?)/
const rfill = /\?\?\d+/g
const rlocalVar = /[$a-zA-Z_][$a-zA-Z0-9_\.]*(\()?/g
const skipMap: any = {
    if: 1,
    else: 1,
    Math: 1,
    Date: 1,
    Number: 1,
    String: 1,
    Boolean: 1,
    Object: 1,
    $event: 1,
    window: 1,
    __vmodel__: 1,
    __local__: 1,
    JSON: 1,
    this: 1,
    true: 1,
    false: 1,
    IDM: 1,
    return: 1,
    __isFlag__: 1,
    __getter__: 1
}
const stringPool: any = {
    map: {}
}
let stringNum = 0
function readExpress(str: string, i?: number, ret?: any): any {
    let open = false
    let counter = 0
    let s = 0
    i = i || 0
    ret = ret || []
    for (let n = str.length; i < n; i++) {
        const c = str.charAt(i)
        if (!open) {
            // 验证表达式开始
            if (c === '[' && str.charAt(i - 1) === '@') {
                open = true
                s = i
            }
        } else {
            if (c === '[') counter++
            if (c === ']') {
                if (counter > 0) {
                    counter--
                    continue
                } else {
                    ret.push(str.slice(s - 1, i + 1))
                    open = false
                    counter = 0
                }
            }
        }
    }
    if (open !== false) return readExpress(str, s + 1, ret)
    return ret
}
function dig(a: any) {
    const key = '??' + stringNum++
    stringPool.map[key] = a
    return key + ' '
}
function fill(a: string) {
    return stringPool.map[a]
}
function customTrim(str: string) {
    str = str.replace(/^\s\s*/, '')
    const ws = /\s/
    let i = str.length
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1)
}
function parseExpress(exp: string) {
    if (!parseMap[exp]) {
        const mat = readExpress(exp)
        stringPool.map = {}
        for (let i = 0, n = mat.length; i < n; i++) {
            const s = mat[i].slice(2, mat[i].length - 1)
            exp = exp.replace(mat[i], function () {
                return '{{' + s + '}}'
            })
        }
        parseMap[exp] = {
            has: mat && mat.length > 0,
            expStr: exp
        }
    }
    return parseMap[exp]
}
function unescapeHTML(html: string) {
    return String(html)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
}

function parseInterpolate(dir: string, openTag: any, closeTag: any, isReplace: boolean) {
    const rlineSp = /\n\r?/g
    let str = customTrim(dir).replace(rlineSp, '')
    const tokens = []
    const exportPools: any = {}
    let count = 0
    do {
        // aaa{{@bbb}}ccc
        let index = str.indexOf(openTag)
        index = index === -1 ? str.length : index
        const value = str.slice(0, index)
        if (/\S/.test(value)) {
            if (isReplace) {
                tokens.push(JSON.stringify(value))
            } else {
                tokens.push(value)
            }
        }
        str = str.slice(index + openTag.length)
        if (str) {
            index = str.indexOf(closeTag)
            const value = str.slice(0, index)
            let expr = unescapeHTML(value)
            if (rimprovePriority) {
                const key = '$$' + count + '$$'
                const v = expr
                expr = '(' + key + ')'
                exportPools[key] = v
                count++
            }
            tokens.push(expr)
            str = str.slice(index + closeTag.length)
        }
    } while (str.length)
    return {
        expr: tokens.join(isReplace ? '+' : ''),
        pools: exportPools
    }
}

function readString(str: string, i: number = 0, ret?: any): Array<any> {
    let end: boolean | string = false
    let s = 0
    ret = ret || []
    for (let n = str.length; i < n; i++) {
        const c = str.charAt(i)
        if (!end) {
            // 判断一个字符串开始必须是"或者'且前面不能带有\转义
            if (c === "'" && str.charAt(i - 1) !== '\\') {
                end = "'"
                s = i
            } else if (c === '"' && str.charAt(i - 1) !== '\\') {
                end = '"'
                s = i
            }
        } else {
            if (c === end && str.charAt(i - 1) !== '\\') {
                ret.push(str.slice(s, i + 1))
                end = false
            }
        }
    }
    if (end !== false) {
        return readString(str, s + 1, ret)
    }
    return ret
}

function addScopeForLocal(str: string) {
    const props = str
    const result = props.replace(rlocalVar, function (el) {
        // 表示函数
        if (el.endsWith('(')) return el
        // 表示属性
        else {
            if (!skipMap[el]) return '__getter__(' + JSON.stringify(el) + ',variable,__isFlag__)'
        }
        return el
    })
    return result
}

function clearString(str: string) {
    const array = readString(str)
    for (let i = 0, n = array.length; i < n; i++) {
        str = str.replace(array[i], dig)
    }
    return str
}

function addScope(expr: string) {
    stringPool.map = {}
    let input = expr.replace(rregexp, function (a, b) {
        return b + dig(a.slice(b.length))
    })
    input = clearString(input)
    input = input
        .replace(rshortCircuit, dig)
        .replace(ruselessSp, '$1')
        .replace(robjectKey, function (_, a, b) {
            return a + dig(b) + ':'
        })
        .replace(rvmKey, '$1__vmodel__.')
        .replace(rfilterName, function (a, b) {
            return '|' + dig(b)
        })
    input = input.replace(/(\)|\])(\.([\w\.\$])+)/g, function (a, b, c) {
        return b + dig(c)
    })
    input = addScopeForLocal(input)
    const filters = input.split(rpipeline)
    let body = filters?.shift()?.replace(rfill, fill)?.trim() || ''
    if (/\?\?\d/.test(body)) {
        body = body.replace(rfill, fill)
    }
    return body
}

export class Express {
    variable: any = {}
    vueComponent: any = {}
    _isVue: boolean = false
    constructor(data?: any) {
        this.variable = {}
        for (const k in data) {
            this.variable[k] = data[k]
        }
    }

    findData(key: string, data: any) {
        data = data || {}
        if (data[key] !== undefined) {
            return data[key]
        } else {
            const arr = key.split('.')
            const count = arr.length
            let i = 0
            let newkey = arr[i]
            if (newkey) {
                while (!data[newkey] && i < count - 1) {
                    newkey += '.' + arr[++i]
                }
            }
            if (data[newkey]) {
                let d = data[newkey]
                const tmp = arr.slice(i + 1)
                for (let i = 0; i < tmp.length; i++) {
                    const t = tmp[i]
                    if (t.endsWith(')') || t.endsWith(']')) {
                        // eslint-disable-next-line no-eval
                        eval('d=d' + '.' + t)
                    } else {
                        d = d[t]
                    }
                }
                return d
            }
        }
    }

    __getter__(key: string, data: any, isFlag: boolean) {
        const r = this.findData(key, data)
        if (isFlag === true) {
            if (IDM.isUnDef(r)) {
                return ''
            }
        }
        return r
    }

    replace(expressStr: string, data: any, isFlag?: boolean): string {
        let fn = replaceMap?.get(expressStr)
        if (!fn) {
            const result = parseExpress(expressStr)
            if (result && result.has) {
                const exp = result.expStr
                const r = parseInterpolate(exp, '{{', '}}', true)
                let str = r.expr
                each(r.pools, (p, k) => {
                    const c = addScope(p)
                    str = str.replace(k, c)
                })
                str = str ? '(' + str + ')' : '""'
                const code = [
                    '\tvar result;',
                    '\ttry{',
                    '\t\twith(__local__){',
                    '\t\t\tresult=' + str + ';',
                    '\t\t}',
                    '\t}catch(ex){',
                    '\t\tconsole.error(ex);',
                    '\t}',
                    '\treturn result;'
                ]
                // eslint-disable-next-line no-new-func
                fn = new Function('__local__', '__isFlag__', code.join('\n'))
                replaceMap?.put(expressStr, fn)
            } else {
                return expressStr
            }
        }
        let obj = Object.create(new Express())
        obj.variable = data || {}
        obj.vueComponent = this._isVue ? this : null
        const s = fn(obj, IDM.isUnDef(isFlag) ? true : isFlag)
        obj.vueComponent = null
        obj = null
        return s
    }
}

export default new Express()
