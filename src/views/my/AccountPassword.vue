<template>
    <div class="AccountPassword_app page-max-width">
        <div class="title flex_between">
            <div class="title_left">
                账号与密码
            </div>
            <div class="title_right">
                返回我的首页
            </div>
        </div>
        <div class="form">
            <div class="row flex_between">
                <div class="row_left">密码</div>
                <div class="row_right">
                    <span>存在风险请修改密码</span>
                    <span class="action_button">修改密码</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">手机</div>
                <div class="row_right">
                    <span>18645687896</span>
                    <span class="action_button">修改手机</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">邮箱</div>
                <div class="row_right">
                    <span>56789@qq.com</span>
                    <span class="action_button">修改邮箱</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">登录记录</div>
                <div class="row_right">
                    <span class="action_button">查看记录</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">账号注销</div>
                <div class="row_right">
                    <span class="action_button">立即注销</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">微信</div>
                <div class="row_right">
                    <span class="status_text">未绑定</span>
                    <span class="action_button">绑定</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">钉钉</div>
                <div class="row_right">
                    <span class="status_text">未绑定</span>
                    <span class="action_button">绑定</span>
                </div>
            </div>
            <div class="row flex_between">
                <div class="row_left">GitHub</div>
                <div class="row_right">
                    <span class="status_text">未绑定</span>
                    <span class="action_button">绑定</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
.AccountPassword_app{
    height: 100%;
    padding: 20px 15px;
    background: white;
    .title{
        .title_left{
            font-size: 24px;
            font-weight: 600;
            color: #333;
        }
    }
    .form{
        .row{
            height: 73px;
            padding: 0 0 0 5px;
            font-size: 13px;
            color: #333;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            .row_right{
                .status_text{
                    color: #999;
                }
                .action_button{
                    margin-left: 40px;
                    color: #007fff;
                }
            }
        }
    }
}
</style>
