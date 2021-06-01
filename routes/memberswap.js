const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/memberswap') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getMemberswapAllInfo', Controller.getMemberswapAllInfo)
/**
 * 参数：

 * 返回：添加
 */
router.post('/addMemberswap', Controller.addMemberswap)
/**
 * 参数：

 * 返回：撤消
 */
router.post('/cancelMemberswap', Controller.cancelMemberswap)
/**
 * 参数：
 * 返回：修改
 */
// router.post('/updateMemberswap', Controller.updateMemberswap)
/**
 * 参数：
 * 返回：删除
 */
router.post('/deleteMemberswap', Controller.deleteMemberswap)


module.exports = router
//将页面暴露出去