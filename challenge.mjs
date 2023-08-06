import net from "node:net";

const proxyPort = 3031; 
const host = '0.0.0.0'; 
const mainPort = 3032;
const sensitiveInfo = 'i like big trains and i cant lie';
const proxyServer = net.createServer();

proxyServer.on('connection', (proxyConnection) => {
  const targetedServer = net.createConnection(mainPort, host);
  targetedServer.on('data', (data) => {    
    const modifiedData  = data.toString().replace(sensitiveInfo, ()=>{
        let data = ''
        for(let i = 0; i<sensitiveInfo.length; i++){
            if(sensitiveInfo[i] === " "){
                data += sensitiveInfo[i]
            }else{
                data += "-"
            }
        }
        return data
    });
    proxyConnection.write(modifiedData);
  });

  proxyConnection.on('data', (data) => {
    targetedServer.write(data);
  });

  proxyConnection.on('end', () => {
    targetedServer.end();
  });

  targetedServer.on('error', (err) => {
    console.error('Target Connection Error:', err.message);
    proxyConnection.end();
  });

  proxyConnection.on('error', (err) => {
    console.error('Proxy Connection Error:', err.message);
    targetedServer.end();
  });
});

proxyServer.listen(proxyPort, () => {
  console.log(`Proxy server is running on port ${proxyPort}.`);
});
