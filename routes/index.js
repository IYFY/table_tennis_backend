// const router = require('koa-router')()
const Router = require('koa-router')

// 公共路径/api
const router = new Router({
  prefix: '/api'
})

router.get('/', async (ctx, next) => {
  'use strict'
  ctx.redirect('api/user/login')
})

// 1、导入子路由
// const user = require('./user')


const admin = require('./admin')
const member = require('./member')
const memberswap = require('./memberswap')
const memberreserve = require('./memberreserve')
const site = require('./site')
const siteservice = require('./siteservice')
const goods_cats = require('./goods_cats')
const goods = require('./goods')
const chargerule = require('./chargerule')
const spendingbills = require('./spendingbills')
const spendinggoods = require('./spendinggoods')
const spendingtable = require('./spendingtable')

// 2、子路由放进父路由

router.use('/admin', admin.routes(), admin.allowedMethods())  //路径/api/admin/..
router.use('/member', member.routes(), member.allowedMethods()) //路径/api/member/..
router.use('/memberswap', memberswap.routes(), memberswap.allowedMethods()) //路径/api/memberswap/..
router.use('/memberreserve', memberreserve.routes(), memberreserve.allowedMethods()) //路径/api/memberreserve/..
router.use('/site', site.routes(), site.allowedMethods()) //路径/api/site/..
router.use('/siteservice', siteservice.routes(), siteservice.allowedMethods()) //路径/api/siteservice/..
router.use('/goodscats', goods_cats.routes(), goods_cats.allowedMethods()) //路径/api/goodscats/.. 
router.use('/goods', goods.routes(), goods.allowedMethods()) //路径/api/goods/.. 
router.use('/chargerule', chargerule.routes(), chargerule.allowedMethods()) //路径/api/chargerule/.. 
router.use('/spendingbills', spendingbills.routes(), spendingbills.allowedMethods()) //路径/api/spendingbills/.. 
router.use('/spendinggoods', spendinggoods.routes(), spendinggoods.allowedMethods()) //路径/api/spendinggoods/.. 
router.use('/spendingtable', spendingtable.routes(), spendingtable.allowedMethods()) //路径/api/spendingtable/.. 



//导出父路由到app中注册
module.exports = router
