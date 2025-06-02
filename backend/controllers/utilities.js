const fs = require('fs');
exports.readData = (relativeFilePath) => {
    let data= {};
    try{
        data = JSON.parse(fs.readFileSync(relativeFilePath, 'utf8'));
        return data;
    }catch(error){
        return error.mesage;
    }
}