// 2、创建模型
module.exports = function(sequelize,DataTypes){
    // 创建member数据表模型
    return sequelize.define(
        // member 模型名称 表
        'member',
        // 表项 模型属性
        {
            member_id:{
                // type: DataTypes.INTEGER(10).UNSIGNED.ZEROFILL, 
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                // autoIncrement: true
            },
            name:{
                type: DataTypes.STRING,
                allowNull: false,
              
            },
            gender:{
                type: DataTypes.STRING,
                allowNull: false,
                
            },
            age:{
                type: DataTypes.INTEGER,
                allowNull: false,
                
            },
            phone:{
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
                
            },
            integration:{
                type: DataTypes.INTEGER,
                allowNull: false,
                
            },
            isdeleted:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
           
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
            timestamps: false,
            // 默认作用域
            defaultScope: {
                attributes: {
                    // 排除密码，不返回密码,是否删除
                    // exclude: ['password','isdeleted']
                    exclude: ['isdeleted']
                }
            }
        }
    );
}

