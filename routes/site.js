const router = require('koa-router')() //引入路由函数
// const {getSiteInfo, addSite,deleteSite,updateSite,getSiteIdInfo} = require('../controller/site') //引入功能逻辑
const Controller = require('../controller/site') //引入功能逻辑


// 路由中间间，页面路由到／，就是端口号的时候，（网址），页面指引到／

/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getSiteAllInfo', Controller.getSiteAllInfo)
/**
 * 参数：table_name,site,state,
 * 返回：添加
 */
router.post('/addSite', Controller.addSite)
/**
 * 参数：table_id, table_name,site,state,
 * 返回：添加
 */
router.post('/updateSite', Controller.updateSite)
/**
 * 参数：table_id
 * 返回：删除
 */
router.post('/deleteSite', Controller.deleteSite)
/**
 * 参数：
 * 返回：状态不是维修中的球桌id ，name
 */
router.get('/getSiteIdInfo', Controller.getSiteIdInfo)
/**
 * 参数：
 * 返回：状态空置的球桌id ，name
 */
router.get('/getStartSiteIdInfo', Controller.getStartSiteIdInfo)

// router.post('/getSiteInfo', getSiteInfo)
// router.post('/addSite', addSite)
// router.post('/updateSite', updateSite)
// router.post('/deleteSite', deleteSite)





module.exports = router
//将页面暴露出去