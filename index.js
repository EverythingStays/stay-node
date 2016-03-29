const IPFSApi = require('ipfs-api')
const ipfs = IPFSApi('localhost', '5001')
const app = require('express')()
const os = require('os')
const mkdirp = require('mkdirp')
const exec = require('child_process').exec

const tmpdir = os.tmpdir() + '/stay-node'
mkdirp.sync(tmpdir)

const SIZE_LIMIT = 10000000
// Empty PEER_WHITELIST means everyone is allowed to pin
const PEER_WHITELIST = []

const log = (hash, msg) => {
  console.log(hash + ' > ' + msg)
}

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

// 1. Check size of hash contents
// TODO: Check that package.json exists
// 2. Pin contents
// 3. Done!
app.post('/api/pin/add/:hash/:peer_id', (req, res) => {
  const hash = req.params.hash
  const peer_id = req.params.peer_id
  if (!hash || !peer_id) {
    log('None', 'No hash and/or peer_id provided')
    res.sendStatus(400)
    return
  }
  if (PEER_WHITELIST.length > 0 && PEER_WHITELIST.indexOf(peer_id) === -1) {
    log(hash, 'Peer not allowed to pin content')
    res.sendStatus(403)
    return
  }
  log(hash, 'Checking size of hash...')
  ipfs.object.stat(hash, (err, statRes) => {
    if (err) throw new Error(err)
    const hash_size = statRes.CumulativeSize
    if (hash_size > SIZE_LIMIT) {
      res.sendStatus(413)
    } else {
      log(hash, 'Size is ok ('+hash_size+')... Pinning')
      ipfs.pin.add(hash, (err, pinRes) => {
        if (err) throw new Error(err)
        log(hash, 'Pinned!')
        res.sendStatus(200)
      })
    }
  })
})

app.listen(9000)
