const path = require('path')
const fileUtills = require('../utills/file_utills')
const WebSocket = require('ws')
//创建webSocket服务端的对象，绑定的端口号为9998
const wss = new WebSocket.Server({
    port:9998
})
//服务端开启了监听
module.exports.listen = ()=>{
    //对客户端的连接事件进行监听
    // client代表的是客户端的连接socket对象
    wss.on('connection',client=>{
        console.log('client connected...')
        //对客户端的连接对象进行message事件的监听
        //msg由客户端发给服务端的数据
        client.on('message',async msg=>{
            console.log('client send data to server:' + msg)
            let payload = JSON.parse(msg)
            const action = payload.action
            if(action === 'getData'){
                let filePath = '../data/' + payload.chartName + '.json'
                // payload.chartName //trend seller map rank hotproduct stock
                filePath = path.join(__dirname,filePath)
                const ret = await fileUtills.getFilejsonData(filePath)
                //需要在服务端获取到数据的基础上，增加一个data的字段
                //data所对应的值就是某个json文件的内容
                payload.data = ret
                client.send(JSON.stringify(payload))
            }else{
                //原封不动的将所接受到的数据转发给每一个处于连接状态的客户端
                // wss.clients //所有客户端的连接
                wss.clients.forEach(client=>{
                    client.send(JSON.stringify(payload))
                })
            }
            //由服务端往客户端发送数据
            // client.send('hello socket from backend')
        })
    })
}
