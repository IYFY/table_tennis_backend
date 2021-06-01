// 2、创建模型
module.exports = function(sequelize,DataTypes){
    // 创建site数据表模型
    return sequelize.define(
        // site 模型名称 表
        'tennis_tables',
        // 表项 模型属性
        {
            table_id:{
                // type: DataTypes.INTEGER(8).UNSIGNED.ZEROFILL,
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                // autoIncrement: true
                // validate: {
                //     isNull: true
                // }
                // get: function()  {
                //     var table_id = this.getDataValue('table_id');
                //     // 'this' allows you to access attributes of the instance
                //     return table_id + 'get';
                //   },
                //   set:function(id) {
                //     this.setDataValue('table_id', id + 'set');
                //   }
                
            },
            table_name:{
                type: DataTypes.STRING,
                allowNull: false,
                // unique: true
              
            },
            site:{
                type: DataTypes.STRING,
                allowNull: false,
                
            },
            state:{
                type: DataTypes.STRING,
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

