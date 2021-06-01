// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const site = require('../module/site')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

//数据库操作类  球桌操作
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await site.findOne({
            order: [
                ['table_id', 'DESC']
            ],
            attributes: ['table_id'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await site.findAndCountAll({
            where: {
                table_name: {
                    [Op.like]: '%' + name + '%'
                },
                isdeleted: 0
            },
            order: [
                ['table_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        })
    }

    // 增加
    static async add(data) {
        // console.log(await Controller.setId())
        return await site.create({
            table_id: await Controller.setId(),
            table_name: data.table_name,
            site: data.site,
            state: data.state,

        })
    }
    // 修改
    static async update(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await site.findOne({
            where: { table_id: data.table_id, isdeleted: 0 }
        })
        return await row.update({
            table_name: data.table_name,
            site: data.site,
            state: data.state,
        })
    }

    // 删除 软删除
    static async delete(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(id)
        const row = await site.findOne({
            where: { table_id: data.table_id, isdeleted: 0 }
        })
        return await row.update({
            isdeleted: '1'
        })
    }

    // 查询状态不是维修中的 id和name 
    static async getIdInfo() {
        return await site.findAll({
            where: {
                [Op.not]: [
                    { state: '维修中' }
                ],
                isdeleted: 0
            },
            attributes: ['table_id', 'table_name'],
            order: [
                ['table_id', 'asc']
            ],
        })
    }
    // 查询状态空置中的 id和name 
    static async getStartIdInfo() {
        return await site.findAll({
            where: {
                state: '空置' ,
                isdeleted: 0
            },
            attributes: ['table_id', 'table_name'],
            order: [
                ['table_id', 'asc']
            ],
        })
    }

}

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
            let message = '添加错误'
            // if (err == "SequelizeUniqueConstraintError: Validation error") {
            //     message = '球桌名称不可重复，请重新输入  '
            // } 
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: message,
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
    // 不是维修中的球桌
    static async getIdInfo(ctx) {
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getIdInfo().catch(err => { throw err })
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
    // 空置中的球桌
    static async getStartIdInfo(ctx) {
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getStartIdInfo().catch(err => { throw err })
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

    // 提供给siteservice 控制器 site修改状态 消费spendingtable修改状态  事务
    static async updateSiteState(data, transaction) {

        console.log("*****提供给siteservice 、spendingtable控制器*******")
        console.log(data)

        // 查询出某个数据行，
        const row = await site.findOne({
            where: { table_id: data.table_id, isdeleted: 0 }
        })
        return await row.update({
            state: data.state,
        },{
            // 事务
            transaction
        })

        // const row = await site.findOne({
        //     where: { table_id: data.table_id, isdeleted: 0 }
        // })
        // return await site.update({
        //     state: data.state,
        // }, {
        //     where: { table_id: data.table_id, isdeleted: 0 },
        //     // 事务
        //     transaction
        // })
    }
}
module.exports = {
    getSiteAllInfo: Controller.getAllInfo,
    addSite: Controller.add,
    updateSite: Controller.update,
    deleteSite: Controller.delete,

    getSiteIdInfo: Controller.getIdInfo,
    getStartSiteIdInfo: Controller.getStartIdInfo,
    updateSiteState: Controller.updateSiteState

};