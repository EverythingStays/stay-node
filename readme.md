# stay-node

A mirroring node that you can publish packages to.

# Installation

# Running

`npm start`

```
Starting node...
Connecting to IPFS daemon
Publishing with ID
```

Possible status codes:

400 - Missing hash and/or peer_id
403 - Not allowed
413 - Too big
200 - Ok!


IP:PORT/api/pin/add/$HASH

1. Fetch contents of $HASH
2. Check file-size, reject bigger than 2MB
3. Pin contents
4. Success!
