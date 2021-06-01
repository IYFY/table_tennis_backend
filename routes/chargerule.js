const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/chargerule') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getRuleAllInfo', Controller.getRuleAllInfo)
/**
 * 参数：cats_name
 * 返回：添加
 */
router.post('/addRule', Controller.addRule)
/**
 * 参数：cats_id，cats_name
 * 返回：修改
 */
router.post('/updateRule', Controller.updateRule)
/**
 * 参数：cats_id
 * 返回：删除
 */
router.post('/deleteRule', Controller.deleteRule)
/**
 * 参数：
 * 返回：积分
 */
router.get('/getPartARule', Controller.getPartARule)
/**
 * 参数：
 * 返回：计费
 */

router.get('/getPartBRule', Controller.getPartBRule)



module.exports = router
//将页面暴露出去