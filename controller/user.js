// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize

//引入数据表模型
const user = require('../module/user')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 



//数据库操作类
class userModule {
    // static async userRegist(data) {
    //     return await user.create({
    //         password: data.password,
    //         mobileNo: data.mobileNo
    //     })
    // }

    // static async getUserInfo(mobileNo) {
    //     return await user.findOne({
    //         where: {
    //             mobileNo
    //         }
    //     })
    // }

    static async getUserAllInfo() {
        return await user.findAll();
    }
    static async getUserInfo(id) {
        return await user.findOne({ 
            where:{ userid: id}});
    }
}

// userModule.getUserAllInfo().then((r) => {
//     console.log('结果：');
//     console.log(JSON.stringify(r))
// })










const tokentool = require('../public/tool/token')

//功能处理
class userController {
    /*
    * 登录功能
    */
    static async login(ctx) {

        if (ctx.header && ctx.header.authorization) {
            const parts = ctx.header.authorization.split(' ');
            console.log('传送的token：'+ parts);
            tokentool.verToken(parts).then(re => {
                console.log(re)
            })

          }


        const body = ctx.request.body
        // const  body  = ctx.query

        console.log("参数结果：")
        console.log(body)
        // ctx.body = {body};
        try {
            const user = await userModule.getUserInfo(body.username);
            console.log("查询结果：")
            console.log(JSON.stringify(user))
            if (!user) {
                ctx.status = 401
                ctx.body = {
                    message: '用户名错误',
                }
                return;
            }
            // 匹配密码是否相等
            if (body.password === user.password) {
                let token = tokentool.addtoke({username:user.username, id:user.userid})

                ctx.status = 200
                ctx.body = {
                    code:'0',
                    message: '登录成功',
                    token
                }
            } else {
                ctx.status = 401
                ctx.body = {
                    message: '密码错误',
                }
            }
        } catch (error) {
              ctx.throw(500)
        }
    }


}
module.exports = userController;