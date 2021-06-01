// 3、编写操作，功能
const { QueryTypes, DataTypes } = require('sequelize');
//引入db配置
const db = require('../config/db')
//引入sequelize对象
const sequelize = db.sequelize
const Op = db.Op

//引入数据表模型   ****
const goods_cats = require('../module/goods_cats')(sequelize, DataTypes)
const goods = require('../module/goods')(sequelize, DataTypes)

// //自动创建表
// user.sync({ force: false }); 

// 1
//建立表关联关系  当前表（siteservice）的字段： table_id 关联表（site）的字段id
// site.hasMany(siteservice,{foreignKey: 'table_id', sourceKey: 'table_id'});


goods.belongsTo(goods_cats, { as: 'goods_cats', foreignKey: 'cats_id', targetKey: 'cats_id' });

//数据库操作类  球桌操作
class DBoperation {

    // 返回最大id
    static async getMaxid() {
        return await goods.findOne({
            order: [
                ['goods_id', 'DESC']
            ],
            attributes: ['goods_id'],
            // 使用sequelize 的 findOne 、findAll、findAndCountAll 
            // 查询返回的结果都是经过sequelize 格式化过的
            // 我们可已使用 raw 属性来直接获取数据结果
            raw: true,
        })
    }

    // 分页查询,和name模糊查询
    static async getAllInfo(data) {
        const { name, pageIndex, pageSize } = data
        return await goods.findAndCountAll({
            where: {
                goods_name: {
                    [Op.like]: '%' + name + '%'
                },
                isdeleted: 0
            },
            include: [
                {
                    model: goods_cats,
                    as: 'goods_cats',
                    where: {
                        isdeleted: 0,
                    }
                }
            ],
            order: [
                ['goods_id', 'asc']
            ],
            limit: pageSize,
            offset: (pageIndex - 1) * pageSize,
            // raw: true
        })
    }

    // 增加
    static async add(data) {
        // console.log(await Controller.setId())
        return await goods.create({
            goods_id: await Controller.setId(),
            goods_name: data.goods_name,
            cats_id: data.cats_id,
            price: data.price,
            goods_stock: data.goods_stock,
            warn_stock: data.warn_stock,
            issale: data.issale,
            isswap: data.isswap,
            swap_stock: data.swap_stock,
            swap_integration: data.swap_integration
        })
    }
    // 修改
    static async update(data) {

        console.log("******************8this.editForm")
        console.log(data)

        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(data.id)
        const row = await goods.findOne({
            where: { goods_id: data.goods_id, isdeleted: 0 }
        })
        return await row.update({
            goods_name: data.goods_name,
            cats_id: data.cats_id,
            price: data.price,
            goods_stock: data.goods_stock,
            warn_stock: data.warn_stock,
            issale: data.issale,
            isswap: data.isswap,
            swap_stock: data.swap_stock,
            swap_integration: data.swap_integration
        })
    }

    // 删除 软删除
    static async delete(data) {
        // 查询出某个数据行，再根据该数据行修改数据达到软删除
        // const row = await this.getMemberInfo(id)
        const row = await goods.findOne({
            where: { goods_id: data.goods_id, isdeleted: 0 }
        })
        return await row.update({
            isdeleted: '1'
        })
    }

    // 查询状态上架， 可兑换 的 商品
    static async getIdInfo() {
        return await goods.findAll({
            where: {
                issale: 1,
                isswap: 1,
                // [Op.not]: [
                //     { state: '维修中' }
                // ],
                isdeleted: 0
            },
            // attributes: ['goods_id', 'goods_name', 'goods_name', 'goods_name'],
            order: [
                ['goods_id', 'asc']
            ],
        })
    }
    // 查询状态上架， 的 商品
    static async getsaleIdInfo() {
        return await goods.findAll({
            where: {
                issale: 1,
                // isswap: 1,
                // [Op.not]: [
                //     { state: '维修中' }
                // ],
                isdeleted: 0
            },
            // attributes: ['goods_id', 'goods_name', 'goods_name', 'goods_name'],
            order: [
                ['goods_id', 'asc']
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
        // 可兑换
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
    // 上架
    static async getsaleIdInfo(ctx) {
        try {
            //调用数据操作类的方法
            const result = await DBoperation.getsaleIdInfo().catch(err => { throw err })
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
    // // 提供给兑换 控制器   修改商品、兑换库存
    static async updateGoodsstock(data, transaction) {

        // 查询出某个数据行，
        const row = await goods.findOne({
            where: { goods_id: data.goods_id, isdeleted: 0 }
        })
        console.log("*****提供给兑换 控制器 row*******")
        console.log(row.goods_stock) 
        console.log(row.swap_stock) 
        console.log(data) 
        let goodsstock = row.goods_stock
        let swapstock = row.swap_stock
        if (data.state == '兑换') {
            // 计算新的库存值
            goodsstock = row.goods_stock - data.swap_count
            swapstock = row.swap_stock - data.swap_count
        }
        if (data.state == '撤消') {
            console.log("#######撤消###########")
            // 计算新的库存值
            goodsstock = row.goods_stock + data.swap_count
            swapstock = row.swap_stock + data.swap_count
        }

        // 计算新的库存值
        // const goodsstock = row.goods_stock - data.swap_count
        // const swapstock = row.swap_stock - data.swap_count
        console.log("##################")
        console.log(goodsstock)
        console.log(swapstock)

        return await row.update({
            goods_stock: goodsstock,
            swap_stock: swapstock,
        }, {
            // 事务
            transaction
        })
    }
    //  提供给消费商品 控制器   修改商品库存
    static async updateGoodsstockB(data, transaction) {

        // 查询出某个数据行，
        const row = await goods.findOne({
            where: { goods_id: data.goods_id, isdeleted: 0 }
        })
        console.log("*****提供给商品 控制器 row*******")
        console.log(row.goods_stock) 
        // console.log(row.swap_stock) 
        console.log(data) 

        let goodsstock = row.goods_stock
        // let swapstock = row.swap_stock
        if (data.state == '购买') {
            // 计算新的库存值
            goodsstock = row.goods_stock - data.goods_count
            // swapstock = row.swap_stock - data.swap_count
        }
        if (data.state == '撤消') {
            console.log("#######撤消###########")
            // 计算新的库存值
            goodsstock = row.goods_stock + data.goods_count
            // swapstock = row.swap_stock + data.swap_count
        }

        // 计算新的库存值
        // const goodsstock = row.goods_stock - data.swap_count
        // const swapstock = row.swap_stock - data.swap_count
        console.log("##################")
        console.log(goodsstock)
        // console.log(swapstock)

        return await row.update({
            goods_stock: goodsstock,
            // swap_stock: swapstock,
        }, {
            // 事务
            transaction
        })
    }
}
module.exports = {
    getGoodsAllInfo: Controller.getAllInfo,
    addGoods: Controller.add,
    updateGoods: Controller.update,
    deleteGoods: Controller.delete,

    getGoodsswpaInfo: Controller.getIdInfo,
    getGoodssaleInfo: Controller.getsaleIdInfo,
    
    updateGoodsstock: Controller.updateGoodsstock,
    updateGoodsstockB: Controller.updateGoodsstockB,
};