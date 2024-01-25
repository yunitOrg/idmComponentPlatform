<template>
    <div class="video_box">
        <video ref="videoPlayer" class="video-js vjs-16-9" poster="../assets/images/component-market-default.jpg">
            <source :src="`static/video/demo.mp4`" type="video/mp4" />
        </video>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import Video from 'video.js'
import 'video.js/dist/video-js.min.css'
// 加载中文
import zhcn from 'video.js/dist/lang/zh-CN.json'
// 使用中文
Video.addLanguage('zh-CN', zhcn)

reactive({
    player: null,
    options: null
})

const props = defineProps({
    videoId: {
        type: String,
        default: ''
    }
})
console.log(props.videoId)
const pageData = reactive<{ player: Object; options: Object }>({
    player: () => {},
    options: {
        controls: true, // 是否显示底部控制栏
        preload: 'auto', // 加载<video>标签后是否加载视频
        autoplay: false, // 静音播放muted
        playbackRates: [0.5, 1, 1.5, 2, 2.5],
        // width: '',
        height: '600',
        language: 'zh-CN',
        durationDisplay: true, // 总时间
        controlBar: {
            // 设置控制条组件
            /* 使用children的形式可以控制每一个控件的位置，以及显示与否 */
            children: [
                { name: 'playToggle' }, // 播放按钮
                { name: 'currentTimeDisplay' }, // 当前已播放时间
                { name: 'progressControl' }, // 播放进度条
                { name: 'durationDisplay' }, // 总时间
                {
                    // 倍数播放
                    name: 'playbackRateMenuButton',
                    playbackRates: [0.5, 1, 1.5, 2, 2.5]
                },
                {
                    name: 'pictureInPictureToggle' // 画中画
                },
                {
                    name: 'volumePanel', // 音量控制
                    inline: false // 不使用水平方式
                },
                { name: 'FullscreenToggle' } // 全屏
            ]
        }
    }
})

const videoPlayer = ref()

onMounted(() => {
    pageData.player = Video(videoPlayer.value, pageData.options, function onPlayerReady() {
        // console.log('onPlayerReady', this)
    })
})
</script>
<style scoped lang="scss">
::v-deep .video-js {
    .vjs-control-bar {
        .vjs-current-time,
        .vjs-duration {
            display: block;
        }
    }
}
</style>
