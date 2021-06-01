// 2、创建模型
module.exports = function(sequelize,DataTypes){
    // 创建user数据表模型
    return sequelize.define(
        // user 模型名称 表
        'user',
        // 表项 模型属性
        {
            userid:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,  //allowNull 默认为 true
                // autoIncrement: true
            },
            username:{
                type: DataTypes.STRING,
                allowNull: false,
                field: 'username'
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false,
                field: 'password'
            },
            isdeleted:{
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'isdeleted'
            }
        },
        // 模型属性
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

