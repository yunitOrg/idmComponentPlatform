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

reactive({
    player: null,
    options: null
})
const pageData = reactive<{ player: Object; options: Object }>({
    player: () => {},
    options: {
        controls: true, // 是否显示底部控制栏
        preload: 'auto', // 加载<video>标签后是否加载视频
        autoplay: 'muted', // 静音播放
        // playbackRates: [0.5, 1, 1.5, 2],// 倍速播放
        // width: '',
        height: '600',
        controlBar: {
            // 自定义按钮的位置
            children: [
                {
                    name: 'playToggle'
                },
                {
                    name: 'progressControl'
                },
                {
                    name: 'currentTimeDisplay'
                },
                {
                    name: 'timeDivider'
                },
                {
                    name: 'durationDisplay'
                },

                {
                    name: 'volumePanel', // 音量调整方式横线条变为竖线条
                    inline: false
                },
                {
                    name: 'pictureInPictureToggle'
                },
                {
                    name: 'fullscreenToggle'
                }
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
