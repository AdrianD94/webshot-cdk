const express = require('express');
const os = require('os');

const PORT = 8094;
const app = express();

app.get('/', (req,res) => {
    return res.status(200).json({
        message: `Hello from ${os.hostname}`
    })
})

app.listen(PORT, ()=>console.log(`Server started at port ${PORT}`))