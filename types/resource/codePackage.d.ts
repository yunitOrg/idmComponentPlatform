interface CodePackage {
    classname?: string // 组件包包名
    codeLangue?: string // 组件包语言
    createBy?: string //	创建人
    createTime?: string //	创建日期
    currentCodePath?: string //	代码包解压后的地址
    currentConfigText?: string //	代码包配置文件
    currentRemark?: string //	组件包简介
    currentRunPath?: string //	代码可运行的压缩包地址
    currentVersion?: string //	当前代码包的版本号，也就是最新上传的版本号
    currentZipPath?: string //	代码源码压缩包地址
    giteeUrl?: string //	gitee源码地址
    githubUrl?: string //	github源码地址
    id?: string //	id
    otherUrl?: string //	其他源码地址
    publishOpen?: string //	是否公开，1：公开，0：使用发布范围
    publishRange?: string //	发布范围，多个逗号隔开
    publishRangeName?: string //	发布范围组织中文名称
    status?: string //	发布状态，1标识已发布，0标识未发布
    sysOrgCode?: string //	所属部门
    tags?: string //	组件包标签
    title?: string //	组件包中文名
    updateBy?: string //	更新人
    updateTime?: string //	更新日期
    userId?: string //	用户主键ID
    versionCount?: string //	版本的数量
}
