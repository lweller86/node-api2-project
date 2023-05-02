// require your server and launch it here
const server = require('./api/server')

const Port = 9000

server.listen(Port, () => {
    console.log(`Server running on http://localhost:${Port}`)
})

module.exports = server;
