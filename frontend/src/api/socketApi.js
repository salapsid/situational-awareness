import socketIoClient from 'socket.io-client'
const backend_ip = 'localhost';
const backend_port = '8080'; // DEFAULT LISTENING PORT OF BACKEND
const own_namespace = 'frontend_namespace';
let url = 'http://' + backend_ip + ':' + backend_port + '/' + own_namespace
var backendSocket = socketIoClient(url)



const backendSocketOnRoutes=(backendSocket)=>{
    backendSocket.on('connect',()=>{
        console.log("Connected to Frontend")
        setStatus("connected")
        console.log("status:",status)// here the status might still show not connected as setStatus is not synchronous
        

        backendSocket.on('network',(data)=>{
            let jsonData=JSON.parse(data)
            let graph=graphFromBE(jsonData)
            console.log(`jsonDataLength: ${jsonData.length}`)
            setNtwrkData(graph)
        })

        backendSocket.on('data',(data)=>{
            let  jsonData=JSON.parse(data)
            console.log(`data from agent with id:${jsonData.id}`)
            setDataObj(jsonData)
        })
        backendSocket.on('disconnect',()=>{
            backendSocket.removeAllListeners()
        })
       
    
    
    })
}
