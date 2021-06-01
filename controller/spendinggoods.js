// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const goods = require('../module/goods')(sequelize, DataTypes)
const spendinggoods = require('../module/spendinggoods')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

// 1
//建立表关联关系  当前表（siteservice）的字段： table_id 关联表（site）的字段id
// site.hasMany(siteservice,{foreignKey: 'table_id', sourceKey: 'table_id'});


spendinggoods.belongsTo(goods, { as: 'goods', foreignKey: 'goods_id', targetKey: 'goods_id' });

// goods 的数据操作
const { updateGoodsstockB } = require('./goods')


//数据库操作类  球桌操作
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await spendinggoods.findOne({
            order: [
                ['goods_bill', 'DESC']
            ],
            attributes: ['goods_bill'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await spendinggoods.findAndCountAll({
            where: {
            },
            include: [
                {
                    model: goods,
                    as: 'goods',
                    where: {
                        goods_name: {
                            [Op.like]: '%' + name + '%'
                        },
                        // isdeleted: 0,
                    }
                }
            ],
            order: [
                ['goods_bill', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            // raw: true
        })
    }

    // 增加
    static async add(data, transaction) {
        // console.log(await Controller.setId())
        return await spendinggoods.create({
            goods_bill: await Controller.setId(),
            bill_code: data.bill_code,
            goods_id: data.goods_id,
            goods_count: data.goods_count,
            amount: data.amount,
        }, {
            transaction
        })
    }
    // 修改
    static async update(data) {

        console.log("******************8this.editForm")
        console.log(data)

        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await spendinggoods.findOne({
            where: { goods_bill: data.goods_bill }
        })
        return await row.update({
            bill_code: data.bill_code,
            goods_id: data.goods_id,
            goods_count: data.goods_count,
        })
    }

    // 删除 软删除
    // static async delete(data) {
    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     // const row = await this.getMemberInfo(id)
    //     const row = await goods.findOne({
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
        return await spendinggoods.destroy({
            where: {
                goods_bill: data.goods_bill
            }
        }, {
            transaction
        })
    }

    // 查询  某个消费编码的  商品
    static async getIdInfo(data) {
        console.log("查询  某个消费编码的  商品")
        console.log(data)
        return await spendinggoods.findAll({
            where: {
                bill_code: data.bill_code
            },
            include: [
                {
                    model: goods,
                    as: 'goods',
                    // where: {
                    //     goods_name: {
                    //         [Op.like]: '%' + name + '%'
                    //     },
                    //     // isdeleted: 0,
                    // }
                }
            ],
            // attributes: ['goods_id', 'goods_name', 'goods_name', 'goods_name'],
            order: [
                ['goods_bill', 'asc']
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

    // 增加功能
    static async add(ctx) {

        const body = ctx.request.body
        console.log("购买商品的请求参数结果：")
        console.log(body)
        body.state = '购买'

        // 建立事务对象
        const transaction = await sequelize.transaction();
        try {
            const result = await DBoperation.add(body, transaction)
            await updateGoodsstockB(body, transaction)
            await transaction.commit();

            console.log('成功结果：' + JSON.stringify(result))

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
            // console.log("code: 400,message:" + ctx.body.message + "err:" + err)
        }
    }

    // 取消购买商品功能
    static async cancel(ctx) {

        const body = ctx.request.body
        console.log("取消购买商品功能 参数结果：")
        console.log(body)
        body.state = '撤消'
        // 建立事务对象
        const transaction = await sequelize.transaction();
        try {
            // const result = await DBoperation.add(body, transaction)
            // console.log('成功结果1：')
            // await DBoperation.delete(body, transaction)
            console.log('成功结果2：')
            await updateGoodsstockB(body, transaction)
            console.log('成功结果3：')

            const result = await DBoperation.delete(body, transaction)
            await transaction.commit();
            // console.log('成功结果4：' + JSON.stringify(result))
            ctx.status = 200
            ctx.body = {
                code: '0',
                message: '取消购买成功',
                result
            }
        } catch (err) {
            // 事务失败，进行回滚
            await transaction.rollback();
            ctx.status = 200
            ctx.body = {
                code: '1',
                message: '取消购买失败',
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
    // 查询某个编码的商品
    static async getIdInfo(ctx) {
        const body = ctx.request.body
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getIdInfo(body).catch(err => { throw err })
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
    // 提供给兑换 控制器修改库存
    // static async updateGoodsstock(data, transaction) {

    //     // 查询出某个数据行，再根据该数据行修改数据达到软删除
    //     const row = await goods.findOne({
    //         where: { goods_id: data.goods_id, isdeleted: 0 }
    //     })
    //     console.log("*****提供给兑换 控制器 row*******")
    //     console.log(row.goods_stock)
    //     console.log(row.swap_stock)
    //     console.log(data)
    //     let goodsstock = row.goods_stock
    //     let swapstock = row.swap_stock
    //     if (data.state == '兑换') {
    //         // 计算新的库存值
    //         goodsstock = row.goods_stock - data.swap_count
    //         swapstock = row.swap_stock - data.swap_count
    //     }
    //     if (data.state == '撤消') {
    //         console.log("#######撤消###########")
    //         // 计算新的库存值
    //         goodsstock = row.goods_stock + data.swap_count
    //         swapstock = row.swap_stock + data.swap_count
    //     }

    //     // 计算新的库存值
    //     // const goodsstock = row.goods_stock - data.swap_count
    //     // const swapstock = row.swap_stock - data.swap_count
    //     console.log("##################")
    //     console.log(goodsstock)
    //     console.log(swapstock)

    //     return await row.update({
    //         goods_stock: goodsstock,
    //         swap_stock: swapstock,
    //     }, {
    //         // 事务
    //         transaction
    //     })
    // }
}
module.exports = {
    getSpendinggoodsAllInfo: Controller.getAllInfo,
    addSpendinggoods: Controller.add,
    cancelgoods: Controller.cancel,
    updateSpendinggoods: Controller.update,
    deleteSpendinggoods: Controller.delete,

    getSpendinggoodsInfo: Controller.getIdInfo,

   

};