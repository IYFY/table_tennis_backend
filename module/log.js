module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        // 日志log数据库表
        'log',
        {
            logid: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            userid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'type'
            },
            operation: {
                type: DataTypes.STRING(1000),
                allowNull: true,
                field: 'operation'
            },
            logdate: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'logdate'
            }
        },
        {
            /**
            * 如果为true，则表示名称和model相同，即user
            * 如果为fasle，mysql创建的表名称会是复数，即users
            * 如果指定的表名称本身就是复数，则形式不变
            */
            freezeTableName:true,
            /**
             *  默认情况下,Sequelize
             * 使用数据类型 DataTypes.DATE 自动向每个模型添加 createdAt 和 updatedAt 字段
             * timestamps: false 参数的模型,可以禁用此行为
             */ 
            timestamps: false
        }
    );
}