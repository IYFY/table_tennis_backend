//引入路由函数
const router = require('koa-router')() 

//引入具体功能逻辑
const Controller = require('../controller/admin') 

/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getAdminAllInfo', Controller.getAdminAllInfo)
/**
 * 参数：
 * 返回：添加
 */
router.post('/addAdmin', Controller.addAdmin)
/**
 * 参数：
 * 返回：修改
 */
router.post('/updateAdmin', Controller.updateAdmin)
/**
 * 参数：
 * 返回：删除
 */
router.post('/deleteAdmin', Controller.deleteAdmin)




/**
 * 参数：phone、password
 * 返回：登录结果
 */
router.post('/login', Controller.login)
/**
 * 参数：id、password
 * 返回：修改密码结果
 */
router.post('/updatePassword', Controller.updatePassword)


module.exports = router
//将子路由api暴露出去，到当前文件index.js中放进父路由使用