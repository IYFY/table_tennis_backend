const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const koajwt = require('koa-jwt') //jwt 验证token

// routes文件
const index = require('./routes/index')
// const users = require('./routes/users')
// const user = require('./routes/user')
// const member = require('./routes/member')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})





// 临时解决跨域问题**********
app.use(async (ctx, next) => {
  // 开发环境设置，生产环境谨慎使用
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  if (ctx.method == 'OPTIONS') {
    ctx.body = '';
    ctx.status = 200;
  } else {
    await next();
  }
});
// **************


// 如果没有token，或者token失效，该中间件会给出对应的错误信息   暂时关闭
app.use(async (ctx, next) => {

  if (ctx.header && ctx.header.authorization) {
    const parts = ctx.header.authorization.split(' ');
    console.log('app传送的token：'+ parts);
  }
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 200;
      ctx.body = {
        code: '1',
        message: '登陆过期，请重新登陆',
        Tokenerr: err.message
      };
    } else {
      throw err;
    }
  })
})
// login不做token验证
app.use(koajwt({
  secret: 'token'
}).unless({
  // path: [/^\/api\/login/]
  // path: [/^\/api\/login$/]
  path: [/^\/api\/\w+\/login/]
}))


// routes

//自带***********
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
//自带***********
// 使用user的路由api
// app.use(user.routes(), user.allowedMethods())
// app.use(member.routes(), member.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
