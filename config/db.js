// 1、连接数据库的配置
var Sequelize = require("sequelize")
const Op = Sequelize.Op
var sequelize = new Sequelize('table_tennis_db','root','123456',{
    host:'localhost',
    dialect:'mysql',
    define: {
        timestamp: false
    },
    // 数据库执行日志
    logging: (...msg) => console.log( "Mysql执行的记录日志：[mysql：" 
    + JSON.stringify(msg[0]) + ";内容：" + JSON.stringify(msg[1].instance) 
    + ";类型：" + JSON.stringify(msg[1].type) + "]"),
    timezone: '+08:00'  //设置东八时区
});
// 导出到module文件中被使用
module.exports = {
    sequelize,
    Op
};




    // 记录日志,把日志传送再记录进日志表？？
    // logging: (...msg) => console.log( "Mysql执行的记录日志：" + JSON.stringify(msg))
    // logging: (...msg) => console.log( "Mysql执行的记录日志：[mysql：" + JSON.stringify(msg[0]) + ";内容：" + JSON.stringify(msg[1].instance)+ ";类型：" + JSON.stringify(msg[1].type) + "]"),



    // operatorsAliases:false,
    // dialectOptions:{
    //     //字符集
    //     charset:'utf8mb4',
    //     collate:'utf8mb4_unicode_ci',
    //     supportBigNumbers: true,
    //     bigNumberStrings: true
    // },
    // pool:{
    //     max: 5,
    //     min: 0,
    //     acquire: 30000,
    //     idle: 10000
    // },

// 测试连接数据库
// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch(() => {
//     console.error('Unable to connect to the database:', error);
// })
