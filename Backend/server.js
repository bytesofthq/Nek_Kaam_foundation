const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');






app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`);
})