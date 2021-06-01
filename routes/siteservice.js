const router = require('koa-router')() //引入路由函数
const Controller = require('../controller/siteservice') //引入功能逻辑


// 路由中间间，页面路由到／，就是端口号的时候，（网址），页面指引到／

/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getSiteserviceInfo', Controller.getSiteserviceInfo)
/**
 * 参数：table_id,details,service_time,finish_time

 * 返回：添加
 */
router.post('/addSiteservice', Controller.addSiteservice)
/**
 * 参数：service_id,table_id,details,service_time,finish_time
 * 返回：修改
 */
router.post('/deleteSiteservice', Controller.deleteSiteservice)
/**
 * 参数：service_id
 * 返回：删除
 */
router.post('/updateSiteservice', Controller.updateSiteservice)



// router.get('/getall', getall) //测试


module.exports = router
//将页面暴露出去