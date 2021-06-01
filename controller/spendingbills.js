// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****



const admin = require('../module/admin')(sequelize, DataTypes)
const member = require('../module/member')(sequelize, DataTypes)
const spendingbills = require('../module/spendingbills')(sequelize, DataTypes)

const spendinggoods = require('../module/spendinggoods')(sequelize, DataTypes)
const spendingtable = require('../module/spendingtable')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

// 1
//建立表关联关系  当前表（siteservice）的字段： table_id 关联表（site）的字段id


spendingbills.hasMany(spendinggoods,{ as: 'spendinggoods',foreignKey: 'bill_code', sourceKey: 'bill_code'});
spendingbills.hasMany(spendingtable,{ as: 'spendingtable',foreignKey: 'bill_code', sourceKey: 'bill_code'});

spendingbills.belongsTo(admin, { as: 'admin', foreignKey: 'operator', targetKey: 'admin_id' });
spendingbills.belongsTo(member, { as: 'member', foreignKey: 'member_id', targetKey: 'member_id' });


// goods 的数据操作
// const { updateGoodsstock } = require('./goods')
const { updateMemberintegration } = require('./member')
const { addtable } = require('./spendingtable')
const { updateState } = require('./memberreserve')

//数据库操作类  操作
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await spendingbills.findOne({
            order: [
                ['bill_code', 'DESC']
            ],
            attributes: ['bill_code'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await spendingbills.findAndCountAll({
            where: {
            },
            include: [
                {
                    model: member,
                    as: 'member',
                    where: {
                        name: {
                            [Op.like]: '%' + name + '%'
                        },
                        // isdeleted: 0,
                    }
                },
                {
                    model: admin,
                    as: 'admin',
                    where: {
                        // isdeleted: 0,
                    },
                    attributes: {
                        // 排除密码，不返回密码
                        exclude: ['password']
        
                    },
                },
                {
                    model: spendinggoods,
                    as: 'spendinggoods',
                    required: false,
                    where: {
                        // name: {
                        //     [Op.like]: '%' + name + '%'
                        // },
                        // isdeleted: 0,
                    }
                },
                {
                    model: spendingtable,
                    as: 'spendingtable',
                    required: false,
                    where: {
                        // name: {
                        //     [Op.like]: '%' + name + '%'
                        // },
                        // isdeleted: 0,
                    }
                }
            ],
            order: [
                ['bill_code', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            // raw: true
        })
    }

    // 增加
    static async add(data, transaction) {
        // console.log(await Controller.setId())
        return await spendingbills.create({

            bill_code: await Controller.setId(),
            member_id: data.member_id,
            gross_amount: 0,
            gain_integration: 0,
            creation_time: new Date(),
            // pay_time: data.member_id,
            operator: data.operator,
            
            // reserve_id: await Controller.setId(),
            // member_id: data.member_id,
            // table_id: data.table_id,
            // reserve_time: data.reserve_time,
            // // reserve_duration: data.reserve_duration,
            // reserve_state: '预约中',
        }, {
            transaction
        })
    }
    // 修改
    static async update(data, transaction) {

        console.log("******************8this.editForm")
        console.log(data)

        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await spendingbills.findOne({
            where: { bill_code: data.bill_code }
        })
        return await row.update({
            // member_id: data.member_id,
            gross_amount: data.gross_amount,
            gain_integration: data.gain_integration,
            // creation_time: new Date(),
            pay_time: new Date(),
     
        }, {
            transaction
        })
    }

    // 删除 软删除
    // static async delete(data) {
    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     // const row = await this.getMemberInfo(id)
    //     const row = await memberswap.findOne({
    //         where: { goods_id: data.goods_id, isdeleted: 0 }
    //     })
    //     return await row.update({
    //         isdeleted: '1'
    //     })
    // }


    // 真删除 
    static async delete(data, transaction) {
        console.log("****************")
        console.log(data)
        return await spendingbills.destroy({
            where: {
                bill_code: data.bill_code
            }
        }, {
            transaction
        })
    }

    // 预约表的某个球桌信息
    // static async getTablereserveInfo(data) {
    //     // const { name, pageIndex, pageSize } = data
    //     return await memberreserve.findAll({
    //         where: {
    //             // reserve_state: '预约中'
    //         },
    //         include: [
    //             {
    //                 model: member,
    //                 as: 'member',
    //                 where: {
    //                     // name: {
    //                     //     [Op.like]: '%' + name + '%'
    //                     // },
    //                     // isdeleted: 0,
    //                 }
    //             },
    //             {
    //                 model: site,
    //                 as: 'site',
    //                 where: {
    //                     table_id: data.table_id
    //                     // isdeleted: 0,
    //                 }
    //             }
    //         ],
    //         order: [
    //             ['reserve_time', 'asc']
    //         ],
    //         // limit: pageSize,
    //         // offset: (pageIndex - 1) * pageSize,
    //         // raw: true
    //     })
    // }
}


//功能处理
class Controller {

    // 自带设置编码功能，不提供导出
    static async setId() {
        // id格式：6位 YYMMdd + length位 当天的流水 ，一共6+length位
        let id
        const length = 4
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

    // 增加账单功能
    static async add(ctx) {

        const body = ctx.request.body
        console.log("增加参数结果：")
        console.log(body)
        // body.state = '兑换'

        // 建立事务对象
        // const transaction = await sequelize.transaction();
        try {
            const result = await DBoperation.add(body).catch(err => { throw err })
            // console.log('成功结果1：' + JSON.stringify(result))
            // await updateGoodsstock(body, transaction)
            // console.log('成功结果2：' + JSON.stringify(result))
            // await updateMemberintegration(body, transaction)
            // console.log('成功结果3：' + JSON.stringify(result))
            // await transaction.commit();
            // console.log('成功结果4：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '添加成功',
                result
            }
        } catch (err) {
            // 事务失败，进行回滚
            // await transaction.rollback();
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '添加错误',
                err: err.toString()
            }
            // console.log("code: 400,message:" + ctx.body.message + "err:" + err)
        }
    }

    // 增加账单功能并消费球桌的功能
    static async addbillandtable(ctx) {

        const body = ctx.request.body
        console.log("增加账单功能并消费球桌参数结果：")
        console.log(body)


        // 建立事务对象
        // const transaction = await sequelize.transaction();
        try {
            const result = await DBoperation.add(body).catch(err => { throw err })
            // console.log('成功结果1：' + JSON.stringify(result))
            if(result) {
                console.log("result")
                console.log(result)
                body.bill_code = result.bill_code
                console.log("增加账单功能并消费球桌参数结果：")
                // 添加球桌消费
                await addtable(body) 
                
                // 完成预约状态修改
                await updateState(body)
               

            }
            
            // console.log('成功结果2：' + JSON.stringify(result))
            // await updateMemberintegration(body, transaction)
            // console.log('成功结果3：' + JSON.stringify(result))
            // await transaction.commit();
            // console.log('成功结果4：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '添加成功',
                result
            }
        } catch (err) {
            // 事务失败，进行回滚
            // await transaction.rollback();
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '添加错误',
                err: err.toString()
            }
            // console.log("code: 400,message:" + ctx.body.message + "err:" + err)
        }
    }
    

    修改功能
    static async update(ctx) {
        const body = ctx.request.body
        // console.log("************")
        console.log(body)
        body.state = '获取'
        // 建立事务对象
        const transaction = await sequelize.transaction();
        try {
            const result = await DBoperation.update(body, transaction).catch(err => { throw err })
            // console.log('结果：' + JSON.stringify(result))

            await updateMemberintegration(body, transaction)
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

    static async getTablereserveInfo(ctx) {
        console.log('getTablereserveInfo :')
        console.log(ctx.request.body)

        const data = ctx.request.body
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getTablereserveInfo(data).catch(err => { throw err })
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

    // // 提供给siteservice 控制器 site修改状态
    // static async updateSiteState(data) {

    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     const row = await goods.findOne({
    //         where: { table_id: data.table_id, isdeleted: 0 }
    //     })
    //     return await row.update({
    //         state: data.state,
    //     })
    // }
}
module.exports = {
    getSpendingbillAllInfo: Controller.getAllInfo,
    addSpendingbill: Controller.add,
    updateSpendingbill: Controller.update,
    deleteSpendingbill: Controller.delete,

    addbillandtable: Controller.addbillandtable
    // getTablereserveInfo: Controller.getTablereserveInfo

};