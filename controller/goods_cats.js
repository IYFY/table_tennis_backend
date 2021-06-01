// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const goods_cats = require('../module/goods_cats')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

//数据库操作类  球桌操作
class DBoperation {

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await goods_cats.findAndCountAll({
            where: {
                cats_name: {
                    [Op.like]: '%' + name + '%'
                },
                isdeleted: 0
            },
            order: [
                ['cats_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        })
    }

    // 增加
    static async add(data) {

        console.log("data.cats_name")
        console.log(data.cats_name)
        return await goods_cats.create({
            // cats_id: await Controller.setId(),
            cats_name: data.cats_name,

        })
    }
    // 修改
    static async update(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await goods_cats.findOne({
            where: { cats_id: data.cats_id, isdeleted: 0 }
        })
        return await row.update({
            cats_name: data.cats_name,

        })
    }

    // 删除 软删除
    static async delete(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(id)
        const row = await goods_cats.findOne({
            where: { cats_id: data.cats_id, isdeleted: 0 }
        })
        return await row.update({
            isdeleted: '1'
        })
    }

    // 查看id，name 部分信息
    static async getPart() {
        return await goods_cats.findAll({
            where: {
                isdeleted: 0
            },
            attributes: ['cats_id', 'cats_name']
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

    // 软删除功能 
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


    // 提供给goods 页面 功能
    static async getPart(ctx) {
        try {
            const result = await DBoperation.getPart().catch(err => {throw err})
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '查询成功',
                result
            }
        }catch(err) {
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
    getGoodscatsAllInfo: Controller.getAllInfo,
    addGoodscats: Controller.add,
    updateGoodscats: Controller.update,
    deleteGoodscats: Controller.delete,

    getPartGoodscats: Controller.getPart,

};