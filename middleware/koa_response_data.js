//处理业务逻辑的中间件，读取某个json文件的数据
const path = require('path')
const fileUtills = require('../utills/file_utills')
module.exports = async(ctx,next)=>{
    //根据url
    const url = ctx.request.url // /api/seller ../data/seller.json
    let filePath = url.replace('/api','') // /seller
    filePath = '../data' + filePath + '.json'  //../data/seller.json
    filePath = path.join(__dirname,filePath)
    try{
        const ret = await fileUtills.getFilejsonData(filePath)
        ctx.response.body = ret
    }catch(error){
        const errorMsg = {
            message:'Failed to read, file resource is not exist!',
            status:404
        }
        ctx.response.body = JSON.stringify(errorMsg)
    }
    
    console.log(filePath)
    await next()
}