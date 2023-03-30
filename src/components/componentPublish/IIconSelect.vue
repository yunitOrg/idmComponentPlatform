<template>
    <div class="ctrl_box">
        <div>
            <template v-if="value && value.length > 20">
                <a-tooltip :title="value">
                    <a-tag :closable="true" @close="() => delModule()">
                        <svg class="idm-svg-icon" aria-hidden="true">
                            <use :xlink:href="`#${value}`"></use>
                        </svg>{{ `${value.slice(0, 20)}...` }}
                    </a-tag>
                </a-tooltip>
            </template>
            <template v-else-if="value">
                <a-tag :closable="true" @close="() => delModule()">
                    <svg class="idm-svg-icon" aria-hidden="true">
                        <use :xlink:href="`#${value}`"></use>
                    </svg>{{ value }}
                </a-tag>
            </template>
            <a-popover trigger="click" placement="bottomRight" :overlayClassName="'idm_dev_popover'">
                <template #content>
                    <div class="idm-quick-search-popover min-search">
                        <div class="idm-quick-search-input">
                            <input
                                ref="quicksearchinput" v-model="state.searchValue" autocomplete="true" autocorrect="true"
                                placeholder="请输入标识关键词" />
                        </div>
                        <div v-show="state.resultList.length > 0" class="idm-quick-search-results scrollbar_style idm-attr-item-box">
                            <div
                                v-for="(result, index) in list" :key="index" class="idm-attr-item-wrapper"
                                @click="selectModule(result)">
                                <a-tooltip :title="result">
                                    <div class="idm-attr-item-node">
                                        <svg class="idm-svg-icon" aria-hidden="true">
                                            <use :xlink:href="`#${result}`"></use>
                                        </svg>
                                    </div>
                                    <!--是否选中效果-->
                                    <div v-if="result === value" class="check_layer">
                                        <check-outlined />
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                        <div style="text-align: center;"><a-pagination v-model:current="state.current" :pageSize="30" size="small" simple :total="state.resultList.length" /></div>
                    </div>
                </template>
                <a-tag style="borderStyle: dashed; cursor: pointer;">
                    <plus-outlined /> 选择
                </a-tag>
            </a-popover>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CheckOutlined, PlusOutlined } from '@ant-design/icons-vue'
defineProps({
    value: {
        type: String,
        default: ''
    }
})
const state = reactive<any>({
    searchValue: '',
    resultList: [],
    iconList: [],
    current: 1
})
const emit = defineEmits(['update:value'])
watch(() => state.searchValue, () => {
    searchIconMap()
})
const list = computed(() => state.resultList.slice((state.current - 1) * 30, state.current * 30))
onBeforeMount(() => {
    let symbolList: any = []
    document.querySelectorAll('body > svg').forEach((item: any) => {
        if (item.getAttribute('id') !== '__svg__icons__dom__') {
            symbolList = item.childNodes
        }
    })
    symbolList.forEach((item: any) => {
        state.resultList.push(item.getAttribute('id'))
        state.iconList.push(item.getAttribute('id'))
    })
})
// const hasCheck = (pitem: any) => {
//     console.log('hasCheck', pitem)
//     let hasExists = false
//     props.value && props.value.forEach((item) => {
//         if (
//             item === pitem
//         ) {
//             hasExists = true
//         }
//     })
//     return hasExists
// }
const selectModule = (value: any) => {
    emit('update:value', value)
}
const delModule = () => {
    emit('update:value', '')
}
/**
   * 搜索结果
   */
const searchIconMap = () => {
    state.resultList = []
    state.current = 1
    if (state.searchValue === '') {
        state.resultList = state.iconList
        return
    }
    // 名称、别名、类ID、类名、属性名、属性内容
    state.iconList &&
            state.iconList.forEach((item: any) => {
                // 检查id即可
                if (
                    item.indexOf(state.searchValue) > -1
                ) {
                    state.resultList.push(item)
                }
            })
}
// const change = (value: any) => {
//     emit('update:value', value)
// }
</script>

<style lang="scss" scoped>
.idm-quick-search,.idm-quick-search-popover{
    position: fixed;
    width: 580px;
    top: 8%;
    left: 50%;
    margin-left: -290px;
    z-index: 19920326;
    padding: 15px;
    border-radius: 3px;
    &.min-search{
        position: relative;
        width: 300px;
        top: initial;
        left: initial;
        padding:0;
        margin-left: 0px;
        .idm-quick-search-input{
            input{
                width: 100%;
                font-size: 14px;
                background: none;
                padding: 5px;
                border: 1px solid #ccc;
                &:focus{
                    outline: none;
                }
                &::placeholder{
                    font-size: 14px;
                }
            }
        }
        .idm-quick-search-results{
            margin-top: 10px;
        }
    }
    .idm-quick-search-input{
        input{
            width: 100%;
            padding-right: 15px;
            font-size: 20px;
            border: none;
            background: none;
            &:focus{
                outline: none;
            }
            &::placeholder{
                font-size: 20px;
            }
        }
    }
    .idm-quick-search-close{
        position: absolute;
        right: 10px;
        top: 10px;
        opacity: 0.6;
        cursor: pointer;
        &:hover{
            opacity: 1;
        }
    }
    .idm-quick-search-results{
        margin-top: 20px;
        max-height: 400px;
        overflow-y: auto;
        .idm-quick-search-result-item-wrapper{
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 48px;
            overflow: hidden;
            font-size: 12px;
            white-space: nowrap;
            border-radius: 3px;
            cursor: pointer;
            .idm-quick-search-result-item-type{
                display: inline-block;
                text-align: center;
                width: 36px;
                min-width: 36px;
                height: 36px;
                padding: 7px;
                margin-right: 10px;
                margin-left: 5px;
                border-radius: 3px;
            }
            .idm-quick-search-result-item-cbox{
                flex-grow: 2;
                padding-right: 10px;
            }
            .idm-quick-search-result-item-title-wrapper{
                display: flex;
                justify-content: space-between;
                .idm-quick-search-result-item-name{
                    font-size: 14px;
                }
                .idm-quick-search-result-item-version{
                    font-size: 12px;
                }
            }
            .idm-quick-search-result-item-content{
                font-size: 12px;
            }
            .check_layer{
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: hsla(0,0%,100%,.7);
                border: 2px solid #1890ff;
                color: #1890ff;
                .check_icon{
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    font-size: 20px;
                    margin-top: -10px;

                }
            }
        }
        &.idm-attr-item-box{
            display: flex;
            flex-wrap:wrap;
            .idm-attr-item-wrapper{
                position: relative;
                width: 48px;
                height: 48px;
                cursor: pointer;
                .idm-attr-item-node{
                    text-align: center;
                    color: #666;
                    .idm-svg-icon{
                        font-size: 26px;
                        max-height: 26px;
                        width: 26px;
                        margin-top: 11px;
                        fill: currentColor;
                    }
                }
                .check_layer{
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 5px;
                    background-color: hsla(0,0%,100%,.7);
                    border: 2px solid #1890ff;
                    color: #1890ff;
                    .check_icon{
                        position: absolute;
                        right: 1px;
                        bottom: 0px;
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .idm-svg-icon{
        font-size: 22px;
        max-height: 22px;
        width: 22px;
        margin-top: 0px;
        fill: currentColor;
    }
}
.idm_dev_popover,.idm_dev_modal{
    .vc-sketch{
        padding: 0px;
        background: transparent;
        border-radius: 0px;
        box-shadow: none;
    }
    .vc-sketch-field .vc-input__input {
        background: transparent;
        width: 100%;
    }
    &.upload_popover{
        width: 600px;
        // height: 440px;
        .idm-ant-popover-content,.idm-ant-popover-inner,.idm-ant-popover-inner>div,.idm-ant-popover-inner-content,.idm-ant-spin-nested-loading,.idm-ant-spin-container,.idm-ant-spin-container>span{
            height: 100%;
        }
        .uploadimg_box_title{
            font-size: 18px;
            padding: 15px 0px 5px 0px
        }
        .uploadimg_box_resource_box{
            display: flex;
            flex-wrap: wrap;
            max-height: 200px;
            overflow: auto;
            >*{
                margin: 0 10px 10px 0;
                border: 1px solid transparent;
                cursor: pointer;
                transition: all linear 0.2s;
                &:hover,&.active{
                    border-color: #1890ff;
                }
            }
        }
        .cropper-icon{
            font-size: 20px;
            max-height: 20px;
            width: 20px;
            color: #1890ff;
            fill: currentColor;
        }
        .cropper_opbox_out{
            display: flex;
            justify-content: space-between;
            height: 40px;
            padding-top: 5px;
            >div{
                >*{
                    margin-left: 0px;
                }
                >* + *{
                    margin-left: 10px;
                }
            }
        }
    }
    &.idm_dev_page_popover{
        .idm-ant-popover-inner-content{
            padding: 0;
        }
    }
    .idm-page-select-popover{
        width: 700px;
        min-height: 500px;
        .idm-ant-tabs-bar{
            margin-bottom: 0;
        }
        .idm-page-select-search{
            display: flex;
            padding-top: 12px;
            margin: 0 16px;
            &>*{
                margin-right: 10px;
            }
        }
        .idm-page-select-content{
            height: 400px;
            margin: 10px 16px 0;
            overflow-y: auto;
            .idm-page-select-content-item{
                padding: 10px 0;
                &+.idm-page-select-content-item{
                    border-top: 1px solid #CCC;
                }
                .idm-psc-item-inner{
                    display: flex;
                    cursor: pointer;
                    position: relative;
                    .idm-psc-item-inner-image{
                        height: 88px;
                        width: 140px;
                        flex-shrink: 0;
                        position: relative;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                        div{
                            display: none;
                            position: absolute;
                            top: 50%;
                            margin-top: -13px;
                            left: 50%;
                            margin-left: -43px;
                            cursor: pointer;
                            height: 26px;
                            line-height: 26px;
                            border-radius: 13px;
                            padding: 0px 15px;
                            background-color: rgba(0,0,0,.6);
                            color: white;
                            font-size: 14px;
                            &:hover{
                                background-color: rgba(0,0,0,.8);
                            }
                        }
                    }
                    .idm-psc-item-inner-title{
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                        padding: 5px 10px;
                        label{
                            margin-right: 20px;
                        }
                        .idm-ant-tag-has-color {
                            border-color: transparent !important;
                        }
                        .idm-ant-tag-blue {
                            color: #1890ff !important;
                            background: #e6f7ff !important;
                            border-color: #91d5ff !important;
                        }
                    }
                    .idm-psc-item-inner-desc{
                        font-size: 13px;
                        padding: 5px 10px;
                        height: 46px;
                        overflow: hidden;
                    }
                    .idm-psc-item-inner-recomment{
                        font-size: 12px;
                        padding: 5px 10px;
                    }
                    border: 1px solid transparent;
                    &:hover{
                        .idm-psc-item-inner-image{
                            div{
                                display: block;
                            }
                        }
                        .rb-select-icon{
                            display: block;
                        }
                    }
                    &.active{
                        .rb-select-icon{
                            display: block;
                        }
                    }
                    .rb-select-icon{
                        fill: currentColor;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        font-size: 30px;
                        display: none;
                    }
                }
            }
        }
        .idm-page-select-result{
            min-height: 50px;
            box-shadow: 0px -5px 5px rgba(0,0,0,0.06);
            display: flex;
            justify-content: space-between;
            padding: 10px;
            align-items: center;
            .idm-ant-tag{
                margin-bottom: 8px;
            }
        }
        .idm-ant-tag{
            background: transparent;
        }
    }
    .idm-datasourcefiled-select-box{
        width: 400px;
        min-height: 400px;
        .idm-datasourcefiled-select-jsonbox{
            height: 400px;
            margin: 10px 0;
            overflow-y: auto;
        }
    }
    .idmcore-json-theme {
        background: transparent;
        white-space: nowrap;
        color: #525252;
        font-size: 14px;
        font-family: Consolas, Menlo, Courier, monospace;

        .jv-ellipsis {
          color: #999;
          background-color: #eee;
          display: inline-block;
          line-height: 0.9;
          font-size: 0.9em;
          padding: 0px 4px 2px 4px;
          border-radius: 3px;
          vertical-align: 2px;
          cursor: pointer;
          user-select: none;
        }
        .jv-button { color: #49b3ff }
        .jv-key {
             color: #111111;
            cursor: pointer;
            text-decoration: underline;
            &:hover{
                opacity: 0.8;
            }
        }
        .jv-item {
          &.jv-array { color: #111111 }
          &.jv-boolean { color: #fc1e70 }
          &.jv-function { color: #067bca }
          &.jv-number { color: #fc1e70 }
          &.jv-number-float { color: #fc1e70 }
          &.jv-number-integer { color: #fc1e70 }
          &.jv-object { color: #111111 }
          &.jv-undefined { color: #e08331 }
          &.jv-string {
            color: #42b983;
            word-break: break-word;
            white-space: normal;
          }
        }
        .jv-code {
            padding: 0;
          .jv-toggle {
            &:before {
              padding: 0px 2px;
              border-radius: 2px;
            }
            &:hover {
              &:before {
                background: #eee;
              }
            }
          }
        }
    }
    &.idm_dev_hoverlayer_popover{
        .idm-ant-divider-horizontal{
            margin: 0;
        }
        .idm-ant-popover-inner-content{
            padding: 0;
        }
        .idm-hoverlayer-menuitem{
            cursor: pointer;
            height: 32px;
            line-height: 32px;
            padding: 0px 15px;
            transition: all linear 0.2s;
            &.ihm-flex-layout{
                display: flex;
                justify-content: center;
                align-items: center;
                .ihm-fl-color-check{
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 10px;
                    text-align: center;
                    line-height: 24px;
                    &.black-block{
                        background-color: #000000;
                        color:#FFFFFF;
                    }
                    &.white-block{
                        background-color: #FFFFFF;
                        color:#000000;
                        border: 1px solid #ddd;
                    }
                }
            }
        }

    }
}
.scrollbar_style{
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        min-height: 28px;
        border-radius: 4px;
        background-color:#cccccc;
    }
    &::-webkit-scrollbar-track-piece,&::-webkit-scrollbar-corner {
        background-color: transparent;
    }
}
.ctrl_box {
  .idm-svg-icon{
    font-size: 14px;
    max-height: 14px;
    width: 14px;
    color: #1890ff;
    fill: currentColor;
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 5px;
  }
}

</style>
