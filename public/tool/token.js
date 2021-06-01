
const jwt = require('jsonwebtoken') // 生成token
const serect = 'token';  //密钥，不能丢

// 创建token的代码 expiresIn设置token有效时间
function addtoke(userinfo) {
    const token = jwt.sign({
        id: userinfo.id,
        username: userinfo.user
    }, serect, { expiresIn: '12h' });
    return token;
}
// 解析token的代码 
function verToken(token) {
    return new Promise((resolve, rejece) => {
        try{
            jwt.verify(token.toString().slice(7), serect, function (err, data) {
                if (err) {  rejece(err)  } else { resolve(data);  }
            });
        }catch(err) {
            console.log(err.message)
        }
    })
}


module.exports = { addtoke, verToken }

