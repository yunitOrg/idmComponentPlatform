import express from './express'
import cachePool from './cache'
export const IDM = {
    isUnDef: function (obj: any) {
        return obj === undefined || obj === null
    },
    cachePool,
    express
}
