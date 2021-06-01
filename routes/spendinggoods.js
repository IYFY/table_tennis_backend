const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/spendinggoods') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getSpendinggoodsAllInfo', Controller.getSpendinggoodsAllInfo)
/**
 * 参数：goods_name,cats_id,price,goods_stock,warn_stock,issale,isswap,swap_stock,swap_integration,isdeleted
 * 返回：添加
 */
router.post('/addSpendinggoods', Controller.addSpendinggoods)
/**
 * 参数：goods_id,goods_id,goods_name,cats_id,price,goods_stock,warn_stock,issale,isswap,swap_stock,swap_integration,isdeleted
 * 返回：修改
 */
router.post('/updateSpendinggoods', Controller.updateSpendinggoods)
/**
 * 参数：
 * 返回：撤消商品消费
 */
router.post('/cancelgoods', Controller.cancelgoods)
/**
 * 参数：goods_id
 * 返回：删除
 */
router.post('/deleteSpendinggoods', Controller.deleteSpendinggoods)
/**
 * 参数：
 * 返回：某消费编码的 商品信息
 */
router.post('/getSpendinggoodsInfo', Controller.getSpendinggoodsInfo)
// router.post('/addSite', addSite)
// router.post('/updateSite', updateSite)
// router.post('/deleteSite', deleteSite)
// router.get('/getSiteIdInfo', getSiteIdInfo)




module.exports = router
//将页面暴露出去