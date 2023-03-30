import Axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosInstance, AxiosError } from 'axios'
import { RequestEnum, ResultEnum, ContentTypeEnum, ConfigEnum } from '@/enums/httpEnum'
import qs from 'qs'
import { getToken } from '@/utils/auth'
import { deepMerge } from '@/utils'
import { isString, isFunction } from '@/utils/is'
import { cloneDeep } from 'lodash-es'

export const baseURL = import.meta.env.VITE_BASE_URL
export const uploadUrl = import.meta.env.VITE_UPLOAD_URL

abstract class AxiosTransform {
    /**
     * @description: Process configuration before request
     * @description: Process configuration before request
     */
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

    /**
     * @description: Request successfully processed
     */
    transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any

    /**
     * @description: 请求失败处理
     */
    requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>

    /**
     * @description: 请求之前的拦截器
     */
    // eslint-disable-next-line no-use-before-define
    requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => AxiosRequestConfig

    /**
     * @description: 请求之后的拦截器
     */
    responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

    /**
     * @description: 请求之前的拦截器错误处理
     */
    requestInterceptorsCatch?: (error: Error) => void

    /**
     * @description: 请求之后的拦截器错误处理
     */
    responseInterceptorsCatch?: (error: Error) => void
}

interface CreateAxiosOptions extends AxiosRequestConfig {
    authenticationScheme?: string
    transform?: AxiosTransform
    requestOptions?: RequestOptions
}

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
    /**
     * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
     */
    transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
        const { isTransformResponse, isReturnNativeResponse } = options
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        if (isReturnNativeResponse) {
            return res
        }
        // 不进行任何处理，直接返回
        // 用于页面代码可能需要直接获取code，data，message这些信息时开启
        if (!isTransformResponse) {
            return res.data
        }
        // 错误的时候返回

        const { data } = res
        if (!data) {
            return '[HTTP] Request has no return value'
            // throw new Error('请求出错，请稍候重试')
        }
        //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
        const { code, result, message, success } = data
        // 这里逻辑可以根据项目进行修改
        const hasSuccess = data && Reflect.has(data, 'code') && (code === ResultEnum.SUCCESS || code === 200)
        if (hasSuccess) {
            if (success && message && options.successMessageMode === 'success') {
                // 信息成功提示
            }
            return result
        }

        throw new Error('请求出错，请稍候重试')
    },

    // 请求之前处理config
    beforeRequestHook: (config, options) => {
        const { apiUrl } = options

        if (apiUrl && isString(apiUrl)) {
            config.url = `${apiUrl}${config.url}`
        }
        return config
    },

    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config: Recordable, options) => {
        // 请求之前处理config
        const token = getToken()
        if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
            // jwt token
            config.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token
            config.headers[ConfigEnum.TOKEN] = token
        }
        return config
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res: AxiosResponse<any>) => {
        return res
    },

    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (error: any) => {
        return Promise.reject(error)
    }
}

class VAxios {
    private axiosInstance: AxiosInstance
    private readonly options: CreateAxiosOptions

    constructor(options: CreateAxiosOptions) {
        this.options = options
        this.axiosInstance = Axios.create(options)
        this.setupInterceptors()
    }

    /**
     * @description:  Create axios instance
     */
    private createAxios(config: CreateAxiosOptions): void {
        this.axiosInstance = Axios.create(config)
    }

    private getTransform() {
        const { transform } = this.options
        return transform
    }

    getAxios(): AxiosInstance {
        return this.axiosInstance
    }

    /**
     * @description: Reconfigure axios
     */
    configAxios(config: CreateAxiosOptions) {
        if (!this.axiosInstance) {
            return
        }
        this.createAxios(config)
    }

    /**
     * @description: Set general header
     */
    setHeader(headers: any): void {
        if (!this.axiosInstance) {
            return
        }
        Object.assign(this.axiosInstance.defaults.headers, headers)
    }

    /**
     * @description: Interceptor configuration
     */
    private setupInterceptors() {
        const transform = this.getTransform()
        if (!transform) {
            return
        }
        const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform

        // 请求侦听器配置处理
        this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
            if (requestInterceptors && isFunction(requestInterceptors)) {
                config = requestInterceptors(config, this.options) as InternalAxiosRequestConfig<any>
            }
            return config
        }, undefined)

        // 请求拦截器错误捕获
        requestInterceptorsCatch && isFunction(requestInterceptorsCatch) && this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

        // 响应结果拦截器处理
        this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
            if (responseInterceptors && isFunction(responseInterceptors)) {
                res = responseInterceptors(res)
            }
            return res
        }, undefined)

        // 响应结果拦截器错误捕获
        responseInterceptorsCatch && isFunction(responseInterceptorsCatch) && this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
    }

    /**
     * 文件上传
     */
    // --@updateBy-begin----author:liusq---date:20211117------for:增加上传回调参数callback------
    uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams, callback?: UploadFileCallBack) {
        // -@updateBy-end----author:liusq---date:20211117------for:增加上传回调参数callback------
        const formData = new window.FormData()
        const customFilename = params.name || 'file'

        if (params.filename) {
            formData.append(customFilename, params.file, params.filename)
        } else {
            formData.append(customFilename, params.file)
        }
        if (params.data) {
            Object.keys(params.data).forEach((key) => {
                const value = params.data![key]
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item)
                    })
                    return
                }

                formData.append(key, params?.data?.[key])
            })
        }

        return this.axiosInstance
            .request<T>({
                ...config,
                method: 'POST',
                data: formData,
                headers: {
                    'Content-type': ContentTypeEnum.FORM_DATA,
                    ignoreCancelToken: true
                }
            })
            .then((res: any) => {
                // --@updateBy-begin----author:liusq---date:20210914------for:上传判断是否包含回调方法------
                if (callback?.success && isFunction(callback?.success)) {
                    callback?.success(res?.data)
                    // --@updateBy-end----author:liusq---date:20210914------for:上传判断是否包含回调方法------
                } else if (callback?.isReturnResponse) {
                    // --@updateBy-begin----author:liusq---date:20211117------for:上传判断是否返回res信息------
                    return Promise.resolve(res?.data)
                    // --@updateBy-end----author:liusq---date:20211117------for:上传判断是否返回res信息------
                }
            })
    }

    downloadFile(url: string) {
        window.open(baseURL + url, '_blank')
    }

    // 支持表单数据
    supportFormData(config: AxiosRequestConfig) {
        const headers = config.headers || this.options.headers
        const contentType = headers?.['Content-Type'] || headers?.['content-type']

        if (contentType !== ContentTypeEnum.FORM_URLENCODED || !Reflect.has(config, 'data') || config.method?.toUpperCase() === RequestEnum.GET) {
            return config
        }

        return {
            ...config,
            data: qs.stringify(config.data, { arrayFormat: 'brackets' })
        }
    }

    get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'GET' }, options)
    }

    post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'POST' }, options)
    }

    postForm<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        const headers = {
            'Content-Type': ContentTypeEnum.FORM_DATA
        }
        config.headers = Object.assign(config.headers || {}, headers)
        return this.request({ ...config, method: 'POST' }, options)
    }

    put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'PUT' }, options)
    }

    delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        return this.request({ ...config, method: 'DELETE' }, options)
    }

    deleteForm<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
        const headers = {
            'Content-Type': ContentTypeEnum.FORM_DATA
        }
        config.headers = Object.assign(config.headers || {}, headers)
        return this.request({ ...config, method: 'DELETE' }, options)
    }

    request<T = any>(config: AxiosRequestConfig | any, options?: RequestOptions): Promise<T> {
        let conf: CreateAxiosOptions = cloneDeep(config)
        const transform = this.getTransform()

        const { requestOptions } = this.options

        const opt: RequestOptions = Object.assign({}, requestOptions, options)

        const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
        if (beforeRequestHook && isFunction(beforeRequestHook)) {
            conf = beforeRequestHook(conf, opt)
        }
        conf.requestOptions = opt

        conf = this.supportFormData(conf)

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<any, AxiosResponse<Result>>(conf)
                .then((res: AxiosResponse<Result>) => {
                    if (transformRequestHook && isFunction(transformRequestHook)) {
                        try {
                            const ret = transformRequestHook(res, opt)
                            // zhangyafei---添加回调方法
                            config.success && config.success(res.data)
                            // zhangyafei---添加回调方法
                            resolve(ret)
                        } catch (err) {
                            reject(err || new Error('request error!'))
                        }
                        return
                    }
                    resolve(res as unknown as Promise<T>)
                })
                .catch((e: Error | AxiosError) => {
                    if (requestCatchHook && isFunction(requestCatchHook)) {
                        reject(requestCatchHook(e, opt))
                        return
                    }
                    reject(e)
                })
        })
    }

    /**
     * 【用于评论功能】自定义文件上传-请求
     * @param url
     * @param formData
     */
    uploadMyFile<T = any>(url: string, formData: UploadFileParams) {
        return this.axiosInstance.request<T>({
            url,
            baseURL: uploadUrl,
            method: 'POST',
            data: formData,
            headers: {
                'Content-type': ContentTypeEnum.FORM_DATA,
                ignoreCancelToken: true
            }
        })
    }
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
    return new VAxios(
        deepMerge(
            {
                // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
                // authentication schemes，e.g: Bearer
                // authenticationScheme: 'Bearer',
                authenticationScheme: '',
                timeout: 10 * 1000,
                // 基础接口地址
                baseURL,
                headers: { 'Content-Type': ContentTypeEnum.JSON },
                // 如果是form-data格式
                // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
                // 数据处理方式
                transform,
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    // 需要对返回数据进行处理
                    isTransformResponse: false,
                    // post请求的时候添加参数到url
                    joinParamsToUrl: false,
                    // 格式化提交参数时间
                    formatDate: true,
                    // 异常消息提示类型
                    errorMessageMode: 'message',
                    // 成功消息提示类型
                    successMessageMode: 'success',
                    //  是否加入时间戳
                    joinTime: true,
                    // 忽略重复请求
                    ignoreCancelToken: true,
                    // 是否携带token
                    withToken: true
                }
            },
            opt
        )
    )
}

const http = createAxios()

export { http }
