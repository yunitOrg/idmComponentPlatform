<template>
    <div class="manage-list-card">
        <div v-if="props.showCoverImg" class="image-wapper">
            <div v-if="props.onPreviewComponentClick" class="preview-tag cursor-pointer" @click.stop="props.onPreviewComponentClick">预览</div>
            <img object-fit alt="图片加载失败" class="image" :src="getImagePath(props.image) || componentMarketDetault" />
            <div v-if="props.imageName" class="package-bar">{{ componentName }}包：{{ props.imageName }}</div>
            <div v-if="props.typeText" class="type-text">{{ props.typeText }}</div>
        </div>
        <div class="items">
            <div class="title-wapper">
                <div class="title" @click="props.onClick">
                    {{ props.title }} <template v-if="props.class"> / {{ props.class }}</template>
                </div>
                <div v-if="props.codeLangue" class="codeLangue" :style="colorMap[props.codeLangue]">{{ props.codeLangue }}</div>
                <div v-if="props.version" class="version">{{ props.version }}</div>
                <div v-if="!props.open" v-show="props.range" class="org-tag range"><team-outlined />{{ props.range }}</div>
                <div v-else class="org-tag open"><cloud-outlined />公开</div>
            </div>
            <div v-if="props.showContent" class="content text-o-e-2">{{ props.content }}</div>
            <div class="info-wapper">
                <div class="time" v-if="props.objectId">{{ componentName }}{{ objectIdName }}：{{ props.objectId }}</div>
                <div class="time">{{ props.time }}</div>
                <div v-if="props.showStatistics" class="statistics">
                    浏览 {{ props.readNumber }} · 赞 {{ props.praiseNumber }} · 评论 {{ props.commentNumber }} · 收藏 {{ props.collectNumber }}
                </div>
            </div>
            <div class="extra-wapper">
                <a-popover
                    trigger="click"
                    :visible="showVersionList"
                    overlayClassName="manage-list-card-popover-content"
                    placement="bottom"
                    @visibleChange="handleVersionCountClick">
                    <template #content>
                        <div
                            v-for="(item, index) in versionList"
                            :key="item.id"
                            :style="{ cursor: 'pointer', padding: '0 5px', 'margin-bottom': index !== versionList.length - 1 ? '10px' : '' }"
                            @click.stop="props.onVersionClick(item)">
                            {{ item.version || item.codepackageVersion }}
                        </div>
                    </template>
                    <a v-if="props.versionCount" class="versionCount">共有 {{ props.versionCount }} 个版本</a>
                </a-popover>
                <div v-if="props.type" class="type" :class="props.typeClass">{{ props.type }}</div>
                <div class="tags">
                    <template v-if="props.status !== -1">
                        <div class="tag" :class="props.status !== 1 ? 'redColor' : 'grayColor'">{{ props.status === 1 ? '已发布' : '未发布' }}</div>
                    </template>
                    <template v-if="props.tags">
                        <div v-for="(item, index) in props.tags.split(',')" :key="index" class="tag">{{ item }}</div>
                    </template>
                </div>
                <div class="actions">
                    <div class="item" @click.stop="props.onEditClick">编辑</div>
                    <div class="item" @click.stop="props.onViewClick">浏览</div>
                    <div v-if="props.onPreviewComponentClick" class="item" @click.stop="props.onPreviewComponentClick">预览{{ componentName }}</div>
                    <div v-if="props.onUploadVideoClick" class="item" @click.stop="props.onUploadVideoClick">上传视频</div>
                    <div v-if="props.onEditMarkdownClick" class="item" @click.stop="props.onEditMarkdownClick">编辑图文</div>
                    <template v-if="!(props.onCopyClick && props.onDeleteClick)">
                        <div v-if="props.onCopyClick" class="item" @click.stop="props.onCopyClick">复制链接</div>
                        <div v-if="props.onDeleteClick" class="item" style="color: #ff4d4f" @click.stop="props.onDeleteClick">删除</div>
                    </template>
                    <div v-if="props.onCopyClick && props.onDeleteClick" class="item">
                        <a-popover trigger="click" overlayClassName="manage-list-card-popover-content" placement="bottom">
                            <template #content>
                                <div v-if="props.onCopyClick" style="cursor: pointer; margin-bottom: 10px" @click.stop="props.onCopyClick">复制链接</div>
                                <div v-if="props.onDeleteClick" style="cursor: pointer; color: #ff4d4f" @click.stop="props.onDeleteClick">删除</div>
                            </template>
                            <ellipsis-outlined />
                        </a-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { TeamOutlined, EllipsisOutlined, CloudOutlined } from '@ant-design/icons-vue'
import { getImagePath } from '@/utils'
import { componentMarketDetault } from '@/assets/images'
const colorMap: any = {
    Vue: {
        color: '#389e0d',
        background: '#f6ffed',
        borderColor: '#b7eb8f'
    },
    React: {
        color: '#096dd9',
        background: '#e6f7ff',
        borderColor: '#91d5ff'
    },
    jQuery: {
        color: '#cf1322',
        background: '#fff1f0',
        borderColor: '#ffa39e'
    },
    JavaScript: {
        color: '#d46b08',
        background: '#fff7e6',
        borderColor: '#ffd591'
    },
    其它: {
        color: '#08979c',
        background: '#e6fffb',
        borderColor: '#87e8de'
    }
}
const props = defineProps({
    componentName: {
        type: String,
        default: '组件'
    },
    objectIdName: {
        type: String,
        default: 'ID'
    },
    typeClass: {
        type: String,
        default: ''
    },
    objectId: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: -1
    },
    showCoverImg: {
        type: Boolean,
        default: true
    },
    showContent: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    class: {
        type: String,
        default: ''
    },
    codeLangue: {
        type: String,
        default: ''
    },
    version: {
        type: String,
        default: ''
    },
    open: {
        type: [Boolean, Number],
        default: true
    },
    range: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    time: {
        type: String,
        default: ''
    },
    showStatistics: {
        type: Boolean,
        default: true
    },
    readNumber: {
        type: Number,
        default: 0
    },
    praiseNumber: {
        type: Number,
        default: 0
    },
    commentNumber: {
        type: Number,
        default: 0
    },
    collectNumber: {
        type: Number,
        default: 0
    },
    versionCount: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: ''
    },
    typeText: {
        type: String,
        default: ''
    },
    tags: {
        type: String,
        default: ''
    },
    imageName: {
        type: String,
        default: ''
    },
    onClick: {
        type: Function,
        default() {
            return () => {}
        }
    },
    getVersionList: {
        type: Function,
        default() {
            return () => {}
        }
    },
    onVersionClick: {
        type: Function,
        default() {
            return () => {}
        }
    },
    onEditClick: {
        type: Function,
        default() {
            return () => {}
        }
    },
    onCopyClick: {
        type: Function,
        default: undefined
    },
    onViewClick: {
        type: Function,
        default() {
            return () => {}
        }
    },
    onDeleteClick: {
        type: Function,
        default: undefined
    },
    onPreviewComponentClick: {
        type: Function,
        default: undefined
    },
    onUploadVideoClick: {
        type: Function,
        default: undefined
    },
    onEditMarkdownClick: {
        type: Function,
        default: undefined
    }
})
const versionList = ref<any[]>([])
const showVersionList = ref(false)
const handleVersionCountClick = async (visible: boolean) => {
    if (visible) {
        const res = await props.getVersionList()
        if (res.success) {
            versionList.value = res.result
            showVersionList.value = true
        }
    } else {
        showVersionList.value = false
    }
}
</script>
<style lang="scss">
.manage-list-card {
    padding: 20px 5px;
    border-bottom: 1px solid rgb(230, 230, 230);
    display: flex;
    align-items: center;
    .image-wapper {
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 20px;
        flex-shrink: 1;
        width: 210px;
        .preview-tag {
            position: absolute;
            top: 6px;
            right: 6px;
            border-radius: 10px;
            background: rgba($color: #000000, $alpha: 0.3);
            color: #fff;
            font-size: 12px;
            padding: 2px 10px;
            display: none;
        }
        .package-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            color: #fff;
            font-size: 12px;
            height: 0;
            padding: 0;
            line-height: 25px;
            box-sizing: border-box;
            transition: height 0.2s;
            // background: linear-gradient(180deg,
            //         rgba(255, 255, 255, 0.4),
            //         rgba(150, 150, 150, 0.3));
            background: rgba($color: #000000, $alpha: 0.3);
        }
        .type-text {
            position: absolute;
            bottom: 0;
            right: 0;
            background: rgba($color: #000000, $alpha: 0.3);
            color: #fff;
            font-size: 12px;
            line-height: 25px;
            padding: 0 10px;
            border-radius: 5px 0 0 0;
        }
        .image {
            display: block;
            overflow: hidden;
            width: 100%;
            height: 118px;
            object-fit: cover;
        }
        &:hover {
            .preview-tag {
                display: block;
            }
            .package-bar {
                height: 25px;
                padding: 2px 5px;
            }
        }
    }
    .items {
        width: 0;
        flex-grow: 1;
        flex-shrink: 1;
        .title-wapper {
            display: flex;
            width: 100%;
            flex-wrap: nowrap;
            align-items: center;
            margin-bottom: 10px;
            .title {
                cursor: pointer;
                margin-right: 30px;
                font-size: 16px;
                color: #333;
                line-height: 24px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &:hover {
                    opacity: 0.8;
                    transition: opacity 0.3s;
                }
            }
            .codeLangue {
                margin-right: 15px;
                box-sizing: border-box;
                border: 1px solid;
                line-height: 22px;
                padding: 0 7px;
                font-size: 14px;
                border-radius: 5px;
            }

            .version {
                box-sizing: border-box;
                margin-right: 15px;
                color: #666666;
                border: 1px solid #dbd9d9;
                font-size: 14px;
                border-radius: 5px;
                padding: 0 7px;
                line-height: 22px;
            }
            .org-tag {
                box-sizing: border-box;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 22px;
                padding: 0 7px;
                font-size: 14px;
                border-radius: 5px;
                > span {
                    margin-right: 5px;
                }
            }
            .range {
                color: #096dd9;
                border: 1px solid #91d5ff;
                background-color: #e6f7ff;
            }
            .open {
                color: #389e0d;
                border: 1px solid #b7eb8f;
                background-color: #f6ffed;
            }
        }
        .content {
            color: #666;
            font-size: 14px;
            line-height: 22px;
            min-height: 22px;
            margin-bottom: 10px;
            // text-indent: 2em;
        }
        .info-wapper {
            display: flex;
            margin-bottom: 10px;
            color: #999;
            font-size: 14px;
            line-height: 22px;
            .time {
                margin-right: 40px;
            }
        }
        .extra-wapper {
            display: flex;
            margin-top: 10px;
            align-items: center;
            .versionCount {
                margin-right: 20px;
            }
            .type {
                margin-right: 20px;
                font-size: 12px;
                line-height: 20px;
                padding: 0 5px;
                border-radius: 5px;
                border: 1px solid #40a9ff;
                color: #40a9ff;
                font-family: Arial, Helvetica, sans-serif;
                &.red{
                    border-color: red;
                    color: red;
                }
                &.yellow{
                    border-color: #ffc53d;
                    color: #ffc53d;
                }

            }
            .tags {
                flex: 1;
                display: flex;
                .tag {
                    margin-right: 10px;
                    font-size: 12px;
                    line-height: 20px;
                    padding: 0 5px;
                    border-radius: 3px;
                    border: 1px solid #ddd;
                    color: #40a9ff;
                    &.redColor{
                        color: red;
                    }
                    &.grayColor{
                        color: gray;
                    }
                }
            }
            .actions {
                display: flex;
                align-items: center;
                margin-right: 5px;
                .item {
                    cursor: pointer;
                    margin-left: 20px;
                    font-size: 14px;
                    line-height: 20px;
                    &:hover {
                        opacity: 0.8;
                        transition: opacity 0.3s;
                    }
                }
            }
        }
    }
}
.manage-list-card-popover-content {
    .ant-popover-inner-content {
        padding: 12px 16px;
        div {
            text-align: center;
            font-size: 14px;
            &:hover {
                opacity: 0.8;
                transition: opacity 0.3s;
            }
        }
    }
}
</style>
