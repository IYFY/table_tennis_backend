// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');

//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const site = require('../module/site')(sequelize, DataTypes)
const siteservice = require('../module/siteservice')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 
// 1
//建立表关联关系  当前表（siteservice）的字段： table_id 关联表（site）的字段id
// site.hasMany(siteservice,{foreignKey: 'table_id', sourceKey: 'table_id'});

siteservice.belongsTo(site, { as: 'site', foreignKey: 'table_id', targetKey: 'table_id' });

//site数据操作
const { updateSiteState } = require('./site');

//数据库操作类  球桌维护记录维护操作
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await siteservice.findOne({
            order: [
                ['service_id', 'DESC']
            ],
            attributes: ['service_id'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await siteservice.findAndCountAll({
            where: {
            },
            include: [
                {
                    model: site,
                    as: 'site',
                    where: {
                        table_name: {
                            [Op.like]: '%' + name + '%'
                        },
                        isdeleted: 0,
                    }
                }
            ],
            order: [
                ['service_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            // raw: true
        })
    }

    // 增加
    static async add(data, transaction) {
        // console.log("****************")
        // console.log(data)
        // console.log(transaction)
        // console.log("****************")
        return await siteservice.create({
            service_id: await Controller.setId(),
            table_id: data.table_id,
            details: data.details,
            service_time: new Date(),
            // finish_time: data.finish_time,

        }, {
            transaction
        })
    }
    // 修改
    static async update(data) {

        console.log("******************8this.editForm")
        console.log(data)

        // 查询出某个数据行，再根据该数据行修改数据
        // const row = await this.getMemberInfo(data.id)
        const row = await siteservice.findOne({
            where: { service_id: data.service_id }
        })
        return await row.update({
            finish_time: new Date()
        })
    }

    // 真删除 
    static async delete(data) {
        console.log("****************")
        console.log(data)
        return await siteservice.destroy({
            where: {
                service_id: data.service_id
            }
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
        // 建立事务对象
        const transaction = await sequelize.transaction();
        try {
            // console.log('成功结果1：' )
            //增加维修
            const result = await DBoperation.add(body, transaction)
            // console.log('成功结果2：' + JSON.stringify(result))
            // 修改球桌状态
            // body['state'] = '维修中'
            body.state = '维修中'
            await updateSiteState(body, transaction)
            // console.log('成功结果3：' + JSON.stringify(result))
            await transaction.commit();
            // console.log('成功结果4：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '添加成功',
                result
            }
        } catch (err) {
            // 事务失败，进行回滚
            await transaction.rollback();
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '添加错误',
                err: err.toString()
            }

        }
    }

    // 修改功能
    static async update(ctx) {
        const body = ctx.request.body
        // console.log("************")
        console.log(body)

        // 建立事务对象
        const transaction = await sequelize.transaction();

        try {


            const result = await DBoperation.update(body).catch(err => { throw err })
            // console.log('结果：' + JSON.stringify(result))

            // 修改球桌状态
            // body['state'] = '维修中'
            body.state = '空置'
            await updateSiteState(body, transaction)
            // console.log('成功结果3：' + JSON.stringify(result))
            await transaction.commit();

            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '修改成功',
                result
            }

        } catch (err) {
            // 事务失败，进行回滚
            await transaction.rollback();
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


    // // 提供给siteservice 控制器 site修改状态
    // static async updateSiteState(data) {

    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     const row = await siteservice.findOne({
    //         where: { table_id: data.table_id, isdeleted: 0 }
    //     })
    //     return await row.update({
    //         state: data.state,
    //     })
    // }
}

module.exports = {
    getSiteserviceInfo: Controller.getAllInfo,
    addSiteservice: Controller.add,
    updateSiteservice: Controller.update,
    deleteSiteservice: Controller.delete,
};