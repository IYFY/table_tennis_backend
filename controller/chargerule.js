// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const chargerule = require('../module/chargerule')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

//数据库操作类  球桌操作
class DBoperation {

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await chargerule.findAndCountAll({
            where: {
                rule_name: {
                    [Op.like]: '%' + name + '%'
                },
            },
            order: [
                ['rule_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        })
    }

    // 增加
    static async add(data) {

        // console.log("data.cats_name")
        // console.log(data.cats_name)
        return await chargerule.create({
            // cats_id: await Controller.setId(),
            rule_name: data.rule_name,
            measure: data.measure,
            price: data.price,
            type: data.type,
            detail: data.detail,
        })
    }
    // 修改
    static async update(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await chargerule.findOne({
            where: { rule_id: data.rule_id }
        })
        return await row.update({
            rule_name: data.rule_name,
            measure: data.measure,
            price: data.price,
            type: data.type,
            detail: data.detail,
            isactivate: data.isactivate,

        })
    }

    // 删除 软删除
    // static async delete(data) {
    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     // const row = await this.getMemberInfo(id)
    //     const row = await chargerule.findOne({
    //         where: { rule_id: data.rule_id }
    //     })
    //     return await row.update({
    //         isdeleted: '1'
    //     })
    // }

    // 真删除 
    static async delete(data) {
        console.log("*******真删除 *********")
        console.log(data)
        return await chargerule.destroy({
            where: {
                rule_id: data.rule_id
            }
        })
    }

    // 查看 积分 部分信息
    static async getPartA() {
        return await chargerule.findAll({
            where: {
                type: '获取积分',
                isactivate: 1
            },
            attributes: ['rule_id', 'rule_name', 'measure', 'price', 'type', 'detail']
        })
    }
    // 查看 球桌收费  部分信息
    static async getPartB() {
        return await chargerule.findAll({
            where: {
                type: '球桌计费',
                isactivate: 1
            },
            attributes: ['rule_id', 'rule_name', 'measure', 'price', 'type', 'detail']
        })
    }

}

//功能处理
class Controller {

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
        // console.log("参数结果：")
        // console.log(body)
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


    // 提供  积分信息 功能
    static async getPartA(ctx) {
        try {
            const result = await DBoperation.getPartA().catch(err => { throw err })
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '查询成功',
                result
            }
        } catch (err) {
            ctx.status = 400
            ctx.body = {
                code: '1',
                message: '查询失败',
                err: err.toString()

            }
        }
    }
    // 提供 球桌计费信息 功能
    static async getPartB(ctx) {
        try {
            const result = await DBoperation.getPartB().catch(err => { throw err })
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '查询成功',
                result
            }
        } catch (err) {
            ctx.status = 400
            ctx.body = {
                code: '1',
                message: '查询失败',
                err: err.toString()

            }
        }
    }
}
module.exports = {
    getRuleAllInfo: Controller.getAllInfo,
    addRule: Controller.add,
    updateRule: Controller.update,
    deleteRule: Controller.delete,

    getPartARule: Controller.getPartA,
    getPartBRule: Controller.getPartB,

};