const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/goods_cats') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getGoodscatsAllInfo', Controller.getGoodscatsAllInfo)
/**
 * 参数：cats_name
 * 返回：添加
 */
router.post('/addGoodscats', Controller.addGoodscats)
/**
 * 参数：cats_id，cats_name
 * 返回：修改
 */
router.post('/updateGoodscats', Controller.updateGoodscats)
/**
 * 参数：cats_id
 * 返回：删除
 */
router.post('/deleteGoodscats', Controller.deleteGoodscats)
/**
 * 参数：
 * 返回：cats_id，cats_name
 */
router.get('/getPartGoodscats', Controller.getPartGoodscats)



module.exports = router
//将页面暴露出去