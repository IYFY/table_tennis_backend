// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置，并获取sequelize对象
const db = require('../config/db')
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型  设置某个具体的数据表模型
const admin = require('../module/admin')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

//数据库操作类
class DBoperation {


    // 返回最大id
    static async getMaxid() {
        return await admin.findOne({
            order: [
                ['admin_id', 'DESC']
            ],
            attributes: ['admin_id'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {

        const { name, pageIndex, pageSize } = data
        return await admin.findAndCountAll({
            where: {
                admin_name: {
                    [Op.like]: '%' + name + '%'
                },
                isdeleted: 0
            },
            attributes: {
                // 排除密码，不返回密码
                exclude: ['password']

            },
            order: [
                ['admin_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        })
    }

    // 增加
    static async add(data) {

        // console.log("data.cats_name")
        // console.log(data.cats_name)
        return await admin.create({
            // cats_id: await Controller.setId(),
            admin_id: await Controller.setId(),
            admin_name: data.admin_name,
            gender: data.gender,
            phone: data.phone,
            password: data.password,

        })
    }
    // 修改
    static async update(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await admin.findOne({
            where: { admin_id: data.admin_id }
        })
        return await row.update({
            admin_name: data.admin_name,
            gender: data.gender,
            phone: data.phone,
            password: data.password,
        })
    }

    // 删除 软删除
    static async delete(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(id)
        const row = await admin.findOne({
            where: { admin_id: data.admin_id }
        })
        return await row.update({
            isdeleted: '1'
        })
    }

    // 真删除 
    // static async delete(data) {
    //     console.log("*******真删除 *********")
    //     console.log(data)
    //     return await chargerule.destroy({
    //         where: {
    //             rule_id: data.rule_id
    //         }
    //     })
    // }
    // 手机登录账号
    static async getInfAtOphone(data) {
        return await admin.findOne({
            where: { phone: data }
        });
    }

    // id查询
    static async getInfAtId(data) {
        return await admin.findOne({
            where: { admin_id: data.admin_id, }
        });
    }


    // 修改密码
    static async updatePassword(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await admin.findOne({
            where: { admin_id: data.admin_id }
        })
        return await row.update({
            password: data.newpwd,
        })
    }
}

// userModule.getUserAllInfo().then((r) => {
//     console.log('结果：');
//     console.log(JSON.stringify(r))
// })

const tokentool = require('../public/tool/token')

//功能处理
class Controller {


    // 自带设置编码功能，不提供导出
    static async setId() {
        // id格式：6位 YYMMdd + length位 当天的流水 ，一共6+length位
        let id
        const length = 3
        const date = new Date().toISOString().slice(2, 10).replace(/\-/g, '')
        try {
            const result = await DBoperation.getMaxid().catch(err => { throw err })
            if (result) {
                // console.log(JSON.stringify(result.table_id))
                // 获取当天的流水
                // let number = result.table_id.slice(6)
                let number = result[Object.keys(result)[0]].slice(6)
                // 当天的流水 + 1
                number = parseInt(number) + 1;
                id = date + (Array(length).join("0") + number).slice(-length)
            } else {
                id = date + (Array(length).join("0") + "1").slice(-length)
            }
            return id
        } catch (err) {
            console.log(err)
        }
    }


    //分页功能
    static async getAllInfo(ctx) {
        const data = ctx.request.body
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getAllInfo(data).catch(err => { throw err })
            // console.log('数据库成功结果：' + JSON.stringify(result))
            // 成功返回结果
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '查询成功',
                result
            }
        } catch (err) {
            console.log("数据库成功结果" + err)
            ctx.status = 400
            ctx.body = {
                code: '1',
                message: '查询失败',
                err: err.toString()
            }

        }
    }


    // 增加功能
    static async add(ctx) {

        const body = ctx.request.body
        // console.log("参数结果：")
        // console.log(body)
        try {
            const result = await DBoperation.add(body).catch(err => {
                // throw new Error('ddddd');
                throw err;
            })
            console.log('成功结果：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '添加成功',
                result
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '添加错误',
                err: err.toString()
            }
            // console.log("code: 400,message:" + ctx.body.message + "err:" + err)
        }
    }

    // 修改功能
    static async update(ctx) {
        const body = ctx.request.body
        // console.log("************")
        console.log(body)
        try {
            const result = await DBoperation.update(body).catch(err => { throw err })
            // console.log('结果：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '修改成功',
                result
            }

        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '修改失败',
                err: err.toString()

            }
            console.log("code: 401,err:" + err)
        }
    }

    // 删除功能 
    static async delete(ctx) {

        const body = ctx.request.body
        console.log("删除功能参数结果：")
        console.log(body)
        try {
            const result = await DBoperation.delete(body).catch(err => { throw err })
            // console.log('结果：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '删除成功',
                result
            }
        } catch (err) {
            ctx.status = 400
            ctx.body = {
                code: '1',
                message: '删除失败',
                err: err.toString()

            }
            console.log("code: 401,err:" + err)
        }
    }

    /*
    * 登录功能
    */
    static async login(ctx) {

        // console.log(ctx)

        //token验证  不需要自己再验证了app文件处已经验证了
        // if (ctx.request.header && ctx.request.header.authorization) {
        //     let tokenErr, res
        //     const parts = ctx.header.authorization.split(' ');
        //     console.log('传送的token：' + parts);
        //     res = await tokentool.verToken(parts).catch(err => {
        //         tokenErr = err.message

        //     })
        //     if (tokenErr) {
        //         ctx.status = 200
        //         ctx.body = {
        //             code: '1',
        //             message: '登录超时，请重新登录',
        //             tokenErr
        //         }
        //         return;
        //     }
        //     if (res) {
        //         // token正确
        //         console.log("**********")
        //         console.log(res)
        //         console.log("**********")
        //     }
        // }

        const body = ctx.request.body
        const phone = body.phone
        const password = body.password
        // const  body  = ctx.query
        console.log("参数结果：")
        console.log(body)
        console.log("*******参数结果*")
        // ctx.body = {body};
        try {
            const result = await DBoperation.getInfAtOphone(phone).catch(err => { throw err })
            console.log("查询结果：")
            console.log(JSON.stringify(result))
            if (!result) {
                ctx.status = 200
                ctx.body = {
                    code: '1',
                    message: '账号错误，请重新输入',
                }
                return;
            }
            // 匹配密码是否相等
            if (password === result.password) {
                const token = tokentool.addtoke({ username: result.admin_name, userid: result.admin_id })

                ctx.status = 200
                ctx.body = {
                    code: '0',
                    message: '登录成功',
                    token,
                    result: {
                        admin_id: result.admin_id,
                        admin_name: result.admin_name,
                        gender: result.gender,
                        phone: result.phone
                    }
                }
            } else {
                ctx.status = 200
                ctx.body = {
                    code: '1',
                    message: '密码错误，请重新输入',
                }
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '发生错误',
                err: err.toString()
            }
        }
    }
    // 修改密码功能
    static async updatePassword(ctx) {
        const body = ctx.request.body
        // console.log("****修改密码功能*******")
        console.log(body)
        try {
            const result = await DBoperation.getInfAtId(body).catch(err => { throw err })
            console.log("查询结果：")
            console.log(JSON.stringify(result))
            if (!result) {
                ctx.status = 200
                ctx.body = {
                    code: '1',
                    message: '密码错误，请重新输入',
                }
                return;
            }
            // 匹配密码是否相等
            if (body.password === result.password) {


                const data = await DBoperation.updatePassword(body).catch(err => { throw err })
                // console.log('结果：' + JSON.stringify(result))
                ctx.status = 200
                ctx.body = {
                    code: '0',
                    message: '密码修改成功',
                    // data
                }
            } else {
                ctx.status = 200
                ctx.body = {
                    code: '1',
                    message: '密码错误失败',
                }
            }
        } catch (err) {
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '发生错误',
                err: err.toString()
            }
        }




    } catch(err) {
        ctx.status = 200
        ctx.body = {
            code: '1',
            message: '修改失败',
            err: err.toString()

        }
        console.log("code: 401,err:" + err)
    }
}



//导出相关功能，给routes文件下的js使用
module.exports = {
    getAdminAllInfo: Controller.getAllInfo,
    addAdmin: Controller.add,
    updateAdmin: Controller.update,
    deleteAdmin: Controller.delete,


    login: Controller.login,
    updatePassword: Controller.updatePassword
};