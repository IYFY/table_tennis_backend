const router = require('koa-router')() //引入路由函数

const Controller = require('../controller/goods') //引入功能逻辑



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getGoodsAllInfo', Controller.getGoodsAllInfo)
/**
 * 参数：goods_name,cats_id,price,goods_stock,warn_stock,issale,isswap,swap_stock,swap_integration,isdeleted

 * 返回：添加
 */
router.post('/addGoods', Controller.addGoods)
/**
 * 参数：goods_id,goods_id,goods_name,cats_id,price,goods_stock,warn_stock,issale,isswap,swap_stock,swap_integration,isdeleted
 * 返回：修改
 */
router.post('/updateGoods', Controller.updateGoods)
/**
 * 参数：goods_id
 * 返回：删除
 */
router.post('/deleteGoods', Controller.deleteGoods)
/**
 * 参数：
 * 返回：可兑换的商品信息
 */
router.get('/getGoodsswpaInfo', Controller.getGoodsswpaInfo)
/**
 * 参数：
 * 返回：可购买的商品信息
 */
router.get('/getGoodssaleInfo', Controller.getGoodssaleInfo)
// router.post('/addSite', addSite)
// router.post('/updateSite', updateSite)
// router.post('/deleteSite', deleteSite)
// router.get('/getSiteIdInfo', getSiteIdInfo)




module.exports = router
//将页面暴露出去