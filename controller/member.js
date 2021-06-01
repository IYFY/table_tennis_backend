// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const member = require('../module/member')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

//数据库操作类
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await member.findOne({
            order: [
                ['member_id', 'DESC']
            ],
            attributes: ['member_id'],
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {

        const { name, pageIndex, pageSize } = data
        return await member.findAndCountAll({
            where: {
                name: {
                    [Op.like]: '%' + name + '%'
                },
                isdeleted: 0
            },
            order: [
                ['member_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize
        })
    }
    // 增加
    static async add(data) {
        return await member.create({
            member_id: await Controller.setId(),
            name: data.name,
            gender: data.gender,
            age: data.age,
            phone: data.phone,
            integration: data.integration
        })
    }
    // 修改
    static async update(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await member.findOne({
            where: { member_id: data.member_id, isdeleted: 0 }
        })
        return await row.update({
            name: data.name,
            gender: data.gender,
            age: data.age,
            phone: data.phone,
            integration: data.integration
        })
    }

    // 删除 软删除
    static async delete(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(id)
        const row = await member.findOne({
            where: { member_id: data.member_id, isdeleted: 0 }
        })
        return await row.update({
            isdeleted: '1'
        })
    }


    
        // 查询全部顾客 id， name 积分
        static async getIdInfo() {
            return await member.findAll({
                where: {
                    isdeleted: 0
                },
                // attributes: ['goods_id', 'goods_name', 'goods_name', 'goods_name'],
                order: [
                    ['member_id', 'asc']
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
                // console.log(JSON.stringify(result))
                // console.log("JSON.stringify(result.table_id)")

                // console.log(Object.keys(result)[0])
                // console.log(result[Object.keys(result)[0]])
                // 获取当天的流水

                // let number = result.member_id.slice(6)
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
        const body = ctx.request.body
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getAllInfo(body).catch(err => { throw err })
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
            if (err == "SequelizeUniqueConstraintError: Validation error") {
                message = '手机号不可重复，请重新输入  '
            } 
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
        // console.log(body)
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

            let message = '修改失败'
            if (err == "SequelizeUniqueConstraintError: Validation error") {
                message = '手机号重复，请重新输入'
            } 
            ctx.status = 200
                ctx.body = {
                    code: '1',
                    message: message,
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
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '删除失败',
                err: err.toString()

            }
            console.log("code: 401,err:" + err)
        }
    }
    // 返回顾客id 名称 积分
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
    // // 提供给积分 控制器   修改积分
    static async updateMemberintegration(data, transaction) {

        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        const row = await member.findOne({
            where: { member_id: data.member_id, isdeleted: 0 }
        })
        console.log("*****提供给积分 控制器 row*******")
        console.log(row.integration) 
        console.log(data) 

        let integration = row.integration
        
        if (data.state == '兑换') {
            // 计算新的库存值
            integration = row.integration - data.swap_integration
        }
        if (data.state == '撤消') {
            // 计算新的库存值
            integration = row.integration + data.swap_integration
        }
        if (data.state == '获取') {
            // 计算新的库存值
            integration = row.integration + data.gain_integration
        }
        // const integration = row.integration - data.swap_integration

        return await row.update({
            integration: integration,
        },{
            // 事务
            transaction
        })
    }

}

module.exports = {
    getMemberAllInfo: Controller.getAllInfo,
    addMember: Controller.add,
    deleteMember: Controller.delete,
    updateMember: Controller.update,

    getMemberIdInfo: Controller.getIdInfo,
    updateMemberintegration: Controller.updateMemberintegration,
};