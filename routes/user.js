const router = require('koa-router')() //引入路由函数
const userController = require('../controller/user') //引入功能逻辑


// 路由中间间，页面路由到／，就是端口号的时候，（网址），页面指引到／

// router.get('/user/info', userControl.info)
// router.post('/user/logout', userControl.logout)
//密码登陆

router.post('/login', userController.login)
router.post('/api/home', userController.login)

// 增加返回表单页面的路由  测试作用****************
router.get('/user/login', async(ctx, next)=>{
  ctx.response.body = 
  `
    <form action="/api/login" method="post">
      <input name="username" type="text" placeholder="请输入用户名：ikcamp"/> 
      <br/>
      <input name="password" type="text" placeholder="请输入密码：123456"/>
      <br/> 
      <button>GoGoGo</button>
    </form>
  `
})
// *****************

module.exports = router
//将页面暴露出去