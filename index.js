const tls = require('tls')
const { Block } = require('bitcoinjs-lib')

let socket

socket = tls.connect({
  port: process.env.ELECTRUM_SERVER_PORT,
  host: process.env.ELECTRUM_SERVER_ADDRESS,
  rejectUnauthorized: false
}, () => {
  socket.on('data', (data) => {
    let json = data.toString()
    let info = JSON.parse(json)

    console.log('-----------------------')
    console.log(`local date: ${new Date()}`)

    if (info.result) {
      console.log(`height: ${info.result.height}`)

      decodeBlock(info.result.hex)
    } else if (info.params) {
      console.log(`height: ${info.params[0].height}`)

      decodeBlock(info.params[0].hex)
    }
  })

  socket.write('{"id": "blk", "method": "blockchain.headers.subscribe"}\n')
})

const decodeBlock = hex => {
  const block = Block.fromHex(hex)

  const timestamp = new Date(block.timestamp * 1000)
  console.log(`timestamp: ${timestamp}`)
  console.log(`version: 0x${block.version.toString(16)}`)
  console.log(`bits: 0x${block.bits.toString(16)}`)
  console.log(`nonce: 0x${block.nonce.toString(16)}`)
  printBuffer(block.prevHash, 'previous hash')
  printBuffer(block.merkleRoot, 'merkle root')
}

const printBuffer = (buffer, label) => {
  let formatted = buffer.reverse().toString('hex')

  console.log(`${label}: ${formatted}`)
}
