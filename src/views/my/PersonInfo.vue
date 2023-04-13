<template>
    <div class="PersonInfo_app page-max-width">
        <div class="header">
            <img v-if="!FormState.centerBackground" class="bg" src="@/assets/images/defaultBg.png" alt="">
            <img v-else class="bg" :src="getBgImageUrl('centerBackground')" alt="">
            <div class="person_header">
                <img v-if="!FormState.userphoto" src="@/assets/images/logo1.png" alt="">
                <img v-else :src="getBgImageUrl('userphoto')" alt="">
                <div class="person_header_button flex_center">
                    <a-upload name="file" :showUploadList="false" :beforeUpload="beforeUpload" @change="e => handleChange(e,'userphoto')">
                        <div class="icon_box pointer"><camera-outlined /></div>
                        <div class="upload_button pointer">修改我的头像</div>
                    </a-upload>
                </div>
            </div>
            <div class="upload_button_block">
                <a-upload name="file" :showUploadList="false" :beforeUpload="beforeUpload" @change="e => handleChange(e,'centerBackground')">
                    <div class="upload_button pointer flex_center">
                        <camera-outlined />
                        <span>编辑封面图片</span>
                    </div>
                </a-upload>
            </div>
        </div>
        <div class="back_block flex_end">
            <div class="pointer" @click="backHome()">
                <span>返回首页</span>
                <right-outlined />
            </div>
        </div>
        <div class="main">
            <div class="form">
                <div class="row flex_start">
                    <div class="label">昵称：</div>
                    <div class="value_box input_box">
                        <AInput v-model:value="FormState.nickname"></AInput>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">一句话介绍自己：</div>
                    <div class="value_box input_box">
                        <ATextarea v-model:value="FormState.saying" :rows="3"></ATextarea>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">居住地：</div>
                    <div class="value_box">
                        <div v-for="(item,index) in FormState.residence" :key="index" class="input_box">
                            <AInput v-model:value="FormState.residence[index]" allowClear></AInput>
                            <div class="button_box">
                                <minus-circle-outlined @click="deleteItem('residence',index)" />
                            </div>
                        </div>
                        <div class="button_box">
                            <a-button @click="addItem('residence')">添加</a-button>
                        </div>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">职业：</div>
                    <div class="value_box select_box">
                        <a-select v-model:value="FormState.businessId" allowClear>
                            <a-select-option v-for="(item,index) in pageState.businessList" :key="index" :value="item.id">{{ item.itemValue }}</a-select-option>
                        </a-select>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">工作经历：</div>
                    <div class="value_box">
                        <div v-for="(item,index) in FormState.jobInfo" :key="index" class="input_box">
                            <AInput v-model:value="FormState.jobInfo[index]"></AInput>
                            <div class="button_box">
                                <minus-circle-outlined @click="deleteItem('jobInfo',index)" />
                            </div>
                        </div>
                        <div class="button_box">
                            <a-button @click="addItem('jobInfo')">添加</a-button>
                        </div>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">教育经历：</div>
                    <div class="value_box">
                        <div v-for="(item,index) in FormState.schoolinfo" :key="index" class="input_box">
                            <AInput v-model:value="FormState.schoolinfo[index]"></AInput>
                            <div class="button_box">
                                <minus-circle-outlined @click="deleteItem('schoolinfo', index)" />
                            </div>
                        </div>
                        <div class="button_box">
                            <a-button @click="addItem('schoolinfo')">添加</a-button>
                        </div>
                    </div>
                </div>
                <div class="row flex_start">
                    <div class="label">个人简介：</div>
                    <div class="value_box input_box">
                        <ATextarea v-model:value="FormState.introduce" :rows="5"></ATextarea>
                    </div>
                </div>
            </div>
            <div class="form_button">
                <a-button type="primary" :loading="pageState.isSaveLoading" size="large" :block="true" @click="save">保存</a-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUserApi } from '@/apis'
import { message } from '@/plugins/globalComponents'
import { useUserStore } from '@/store/modules/user'
import { getImagePath } from '@/utils/index.js'
import { toRefs, reactive } from 'vue'
import { CameraOutlined, RightOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const { userInfo } = toRefs<any>(userStore)
// interface FormStateInterface {
//     nickname: string,
//     introduce: string
// }
const FormState:any = reactive({
    nickname: '',
    saying: '',
    residence: [], // 居住地
    businessId: '', // 职业
    jobInfo: [],
    schoolinfo: [],
    introduce: '',
    centerBackground: '',
    userphoto: ''
})
const pageState = reactive({
    businessList: [],
    isSaveLoading: false
})
const getBgImageUrl = (key: string) => {
    return getImagePath(FormState[key])
}
const getbusinessList = () => {
    useUserApi.getbusinessListApi('').then((res) => {
        if (res.success) {
            pageState.businessList = res.result
        }
    }).catch((err) => {
        console.log(err)
    })
}
const addItem = (key: any) => {
    FormState[key].push('')
}
const deleteItem = (key: any, index: number) => {
    FormState[key].splice(index, 1)
}
const save = () => {
    console.log('FormState', FormState)
    pageState.isSaveLoading = true
    useUserApi.editUserInfoApi({
        nickname: FormState.nickname,
        saying: FormState.saying,
        residence: FormState.residence && FormState.residence.length ? FormState.residence.join('|') : '',
        businessId: FormState.businessId,
        jobinfo: JSON.stringify(FormState.jobInfo),
        schoolinfo: JSON.stringify(FormState.schoolinfo),
        introduce: FormState.introduce,
        centerBackground: FormState.centerBackground,
        userphoto: FormState.userphoto
    }).then((res) => {
        pageState.isSaveLoading = false
        if (res.success) {
            message.success(res.message)
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
        pageState.isSaveLoading = false
    })
}
const getUserInfoData = () => {
    console.log('userInfo', userInfo.value)
    FormState.nickname = userInfo.value.nickname
    FormState.saying = userInfo.value.saying
    FormState.businessId = userInfo.value.businessId
    FormState.introduce = userInfo.value.introduce
    FormState.centerBackground = userInfo.value.centerBackground
    FormState.userphoto = userInfo.value.userphoto
    FormState.residence = userInfo.value.residence ? userInfo.value.residence.split('|') : []
    FormState.jobInfo = userInfo.value.jobInfo ? JSON.parse(userInfo.value.jobInfo) : []
    FormState.schoolinfo = userInfo.value.schoolinfo ? JSON.parse(userInfo.value.schoolinfo) : []
    console.log('FormState', FormState)
}
const handleChange = (e: any, key: any) => {
    console.log('handleChange', e)
    const params = {
        file: e.file,
        data: {
            upFileType: 'image'
        }
    }
    useUserApi.uploadFileApi(params).then((res) => {
        if (res.success) {
            message.success(res.message)
            FormState[key] = res.result.filePath
        } else {
            message.error(res.message)
        }
    }).catch((err) => {
        console.log(err)
    })
}
const beforeUpload = (e: any) => {
    console.log('beforeUpload', e)
    return false
}
const backHome = () => {
    router.push({
        name: 'indexPage',
        params: {
            userId: userInfo.value.id
        }
    })
}
getUserInfoData()
getbusinessList()
</script>
<style lang="scss" scoped>
.PersonInfo_app{
    background: white;
    .header{
        height: 292px;
        position: relative;
        .bg{
            width: 100%;
            height: 292px;
            object-fit: cover;
        }
        .person_header{
            width: 160px;
            height: 160px;
            position: absolute;
            bottom: -80px;
            left: 20px;
            border-radius: 50%;
            background-color: white;
            box-shadow: 0px 0px 20px 0px rgba(51,87,130,0.22);
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }
            .person_header_button{
                position: absolute;
                left: 15px;
                top: 15px;
                right: 15px;
                bottom: 15px;
                background-color: rgba(0,0,0,0.3);
                border-radius: 50%;
                .upload_button{
                    color: white;
                }
                .icon_box{
                    text-align: center;
                    color: white;
                    font-size: 20px;
                }
            }
        }
        .upload_button_block{
            position: absolute;
            right: 20px;
            top: 30px;
            .upload_button{
                padding: 6px 15px;
                color: white;
                border: 1px solid ghostwhite;
                border-radius: 4px;
                .anticon{
                    font-size: 20px;
                    margin-right: 5px;
                }
            }
        }
    }
    .main{
        width: 785px;
        margin: 0 auto;
        padding: 20px 0 40px 0;
        .form{
            .row{
                align-items: flex-start;
                padding: 30px 0;
                border-bottom: 1px solid #efefef;
                .label{
                    width: 120px;
                    position: relative;
                    top: 5px;
                    flex-shrink: 0;
                    white-space: nowrap;
                }
                .value_box{
                    width: 100%;
                    .input_box{
                        margin-bottom: 10px;
                        position: relative;
                        .button_box{
                            position: absolute;
                            right: -40px;
                            top: 6px;
                            color: #666;
                        }
                    }
                }
                .select_box{
                    .ant-select{
                        width: 100%;
                    }
                }
            }
        }
        .form_button{
            margin-top: 50px;
        }
    }
    .back_block{
        margin: 10px 0 20px 0;
        padding: 0 20px 0 0;
        text-align: right;
        font-size: 14px;
        color: #1890ff;
    }
}
</style>
