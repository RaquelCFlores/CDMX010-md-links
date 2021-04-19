const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { url } = require('inspector');
require('colors');

const rutaAbsolutaFiles = path.resolve('./files');
console.log(rutaAbsolutaFiles.yellow);

// function readDir (path) {
//     const readDirectory = fs.readdirSync(path);
//     readDirectory.forEach(file => {
//         const rutaJoin = path.join(rutaAbsolutaFiles, file);
//         return rutaJoin;  
//     });
//     // return rutaJoin;
// }

function readDir (path) {
    const readDirectoty = fs.readdirSync(path);
    return readDirectoty;
}

// console.log(readDir('./files'));

function readFile (path) {
    const readOneFile = fs.readFileSync(path, 'utf8');
    // console.log(read.gray);
    return readOneFile;
}

// console.log(readFile('./files/READMETaller.md'));

function getExtension (route) {
    const extension = path.extname(route);
    return extension;
}

// console.log("El archivo es extension: ", getExtension('./files/READMETaller.md'));

function getLinks (data) {
    let regExp = /\bhttps+:\/\/\S+/gi;
    let resultado = data.replace(/[{()}]/g, '').match(regExp);
    if(resultado === null){
        resultado = "El archivo no contiene links";
        return console.log(resultado);
        // return resultado = "El archivo no contiene links";
        
    } else{
        
        return console.log("Links del archivo:", resultado, "Cantidad de links:" , resultado.length);
    // console.log("Cantidad de links: ", resultado.length);
    }
    // return resultado
}

function readFiles () {
    const files = readDir('./files');
    files.forEach( file=> {
        const rutaJoin = path.join(rutaAbsolutaFiles, file);
        // console.log(rutaJoin.green);
        const extension = getExtension(file);
        if (extension === '.md') {
            console.log(rutaJoin.bgGreen);
            const readOneFile = readFile(rutaJoin);
            // console.log(readOneFile.gray);
            console.log("Nombre del archivo:", file.green);
            // console.log(readOneFile.yellow);
            // let links = getLinks(readOneFile);
            getLinks(readOneFile);
            console.log("------------------------------------------------------------------------------")
            // console.log(links);
            // if(links === null){ 
            //     links = "El archivo no contiene links";
            //     console.log(links);
            // } else{
            //     console.log("Links del archivo:", file, links);
            //     console.log("Cantidad de links: ", links.length);
            // }
            // console.log("Cantidad de links: ", links.length);
        }
    });

}

readFiles();


//--------------------------------------------//
statsObj = fs.statSync("./files/READMEDL.md");

console.log(statsObj); 
console.log("Path is file:", statsObj.isFile());
console.log("Path is directory:", statsObj.isDirectory());

// Getting information for a directory
statsObj = fs.statSync("./files");

console.log(statsObj);
console.log("Path is file:", statsObj.isFile());
console.log("Path is directory:", statsObj.isDirectory());

//--------------------------------------------//


// function convertPath (pathFile) {
//     const isAbsolute = path.isAbsolute(pathFile);
//     console.log(isAbsolute, '<<<<<<<<<<<<< DIME QUE ERES');
//     if (isAbsolute === false){
//         pathFile = path.resolve(pathFile);
//         console.log(pathFile, '<<<<<<<<<<<<<LLEGANDO LEJOS');
//     }else {
//         pathFile = pathFile;
//         console.log(pathFile, '<<<<<<<<<< YA CASI TERMINO');
//     }
// }

// convertPath();

  //--------------------------------------------//








