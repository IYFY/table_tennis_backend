const router = require('koa-router')() //引入路由函数
//引入功能逻辑
const Controller = require('../controller/member') 



/**
 * 参数：name, pageIndex, pageSize
 * 返回：分页数据，数据条数
 */
router.post('/getMemberAllInfo', Controller.getMemberAllInfo)
/**
 * 参数：name,gender,age,phone,integration
 * 返回：添加顾客
 */

router.post('/addMember', Controller.addMember)
/**
 * 参数：id,name,gender,age,phone,integration
 * 返回：修改顾客
 */
router.post('/updateMember', Controller.updateMember)
/**
 * 参数：id
 * 返回：删除顾客
 */
router.post('/deleteMember', Controller.deleteMember)

/**
 * 参数：
 * 返回：id, name, 积分
 */
router.get('/getMemberIdInfo', Controller.getMemberIdInfo)
// router.post('/addmember', addMember)
// router.post('/deletemember', deleteMember)
// router.post('/updatemember', updateMember)
// router.post('/getmemberInfo', getMemberInfo)
// router.post('/getmembertoid', getmembertoid)


module.exports = router
//将页面暴露出去