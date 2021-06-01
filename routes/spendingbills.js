const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/spendingbills') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getSpendingbillAllInfo', Controller.getSpendingbillAllInfo)
/**
 * 参数：

 * 返回：添加
 */
router.post('/addSpendingbill', Controller.addSpendingbill)
/**
 * 参数：

 * 返回：添加账单和球桌
 */
router.post('/addbillandtable', Controller.addbillandtable)
/**
 * 参数：

 * 返回：
 */
// router.post('/updateMemberreserve', Controller.updateMemberreserve)
/**
 * 参数：
 * 返回：修改
 */
router.post('/updateSpendingbill', Controller.updateSpendingbill)
/**
 * 参数：
 * 返回：删除
//  */
router.post('/deleteSpendingbill', Controller.deleteSpendingbill)
// /**
//  * 参数： table_id
//  * 返回：某球桌的预约信息
//  */
// router.post('/getTablereserveInfo', Controller.getTablereserveInfo)


module.exports = router
//将页面暴露出去