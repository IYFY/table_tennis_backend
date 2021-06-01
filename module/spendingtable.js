// 2、创建模型
module.exports = function (sequelize, DataTypes) {
    // 创建site service数据表模型
    return sequelize.define(
        // site service 模型名称 表
        'spending_table',

        // 表项 模型属性
        {
            table_bill: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                // autoIncrement: true
            },
            bill_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            table_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            start_time: {
                type: DataTypes.DATE,
                defaultValue: sequelize.NOW,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                defaultValue: sequelize.NOW,
                // allowNull: false,
                get: function () {
                    if(!this.getDataValue('end_time')) {
                        return '';
                    } 
                    return this.getDataValue('end_time');
                },

            },
            duration: {
                type: DataTypes.INTEGER,
                // allowNull: false,
                get: function () {
                    if(!this.getDataValue('duration')) {
                        return 0;
                    } 
                    return this.getDataValue('duration');
                },

            },
            amount: {
                type: DataTypes.FLOAT,
                // allowNull: false,
                get: function () {
                    if(!this.getDataValue('amount')) {
                        return '';
                    } 
                    return this.getDataValue('amount');
                },

            }
        },
        // 模型属性
        {
            /**
            * 如果为true，则表示名称和model相同，即user
            * 如果为fasle，mysql创建的表名称会是复数，即users
            * 如果指定的表名称本身就是复数，则形式不变
            */
            freezeTableName: true,
            /**
             *  默认情况下,Sequelize
             * 使用数据类型 DataTypes.DATE 自动向每个模型添加 createdAt 和 updatedAt 字段
             * timestamps: false 参数的模型,可以禁用此行为
             */
            timestamps: false
        }
    );

}

