const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { url } = require('inspector');
require('colors');

const rutaAbsolutaFiles = path.resolve('./files');
console.log(rutaAbsolutaFiles.yellow);

function readDir (path) {
    const readDirectoty = fs.readdirSync(path);
    return readDirectoty;
}

function readFile (path) {
    const readOneFile = fs.readFileSync(path, 'utf8');
    return readOneFile;
}

function getExtension (route) {
    const extension = path.extname(route);
    return extension;
}

function getLinks (data) {
    // let regExp = /https?:\/\/[a-zA-Z\.\/-]+/gm
    let regExp = /\(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}\gi/gm;
    // let regExp = /\bhttps+:\/\/\S+/gi;
    let resultado =data.replace(/[{()}]/g, '').match(regExp);
    // let resultado =data.replace(/[{()}]/g, '').match(regExp);
    // return [{ HREF, TEXT, PATH}]
    return resultado
}

function validateLinks (links) { // [{ href, text, path, status, statusText}, ...]
    links.forEach(array => {
        const path = array.path;
        const href = array.href;
        const text = array.text;
        let arrayvalidation =  href.map(oneLink => {
        return axios.get(oneLink)
            .then(response => {
                return {
                    path: path,
                    href: response.config.url,
                    text: text,
                    status: response.status,
                    statusText: response.statusText,
                }
                })
                .catch(error => {
                    if (error.response) {
                        return {
                            path: path,
                            href: error.response.config.url,
                            text: text,
                            status: error.response.status,
                            statusText: error.response.statusText,
                        }
                    } else if (error.request) {
                        return {
                            path: path,
                            href: error.request._currentUrl,
                            status: "Sin status",
                            statusText: "No se recibio respuesta",
                        }
                    } else {
                        return {
                            path: path,
                            href: error.response.config.url,
                            error: "A ocurrido un error en la petición",
                            
                        }
                    }
                })
    });

    return Promise.all(arrayvalidation)
        .then(res => { 
            console.log(`Links Validados de la ruta ${path}`, res, res.length )
            stats(res);
            })
        .catch(error => console.log("Ocurrio un error:", error))
    });
    
}

// function stats (arrayLinks) {
//     // arrayLinks = validateLinks().then(arrayLinks => arrayLinks)
//     // console.log(arrayLinks, "<<<<<<<<<<<<<<<<<< STATS");
//     let totalLinks = [];
//     const okLinks = [];
//     const brokenLinks = [];
//     arrayLinks.forEach(link => {
//         totalLinks.push(link.href);
//         if (link.status !== 200){
//             brokenLinks.push(link);
//         }else {
//             okLinks.push(link);
//         }
//     })
//     const uniqueLinks = [...new Set(totalLinks)];
//     console.log("OK Links:", okLinks.length);
//     console.log("BROKEN Links:", brokenLinks.length);
//     console.log("UNIQUE Links:", uniqueLinks.length);
//     console.log("TOTAL Links:", totalLinks.length);
// }

function stats (links) {
    arrayLinks = validateLinks(links).then(res => console.log(res));
    // console.log(arrayLinks, "<<<<<<<<<<<<<<<<<< STATS");
    // let totalLinks = [];
    // const okLinks = [];
    // const brokenLinks = [];
    // arrayLinks.forEach(link => {
    //     totalLinks.push(link.href);
    //     if (link.status !== 200){
    //         brokenLinks.push(link);
    //     }else {
    //         okLinks.push(link);
    //     }
    // })
    // const uniqueLinks = [...new Set(totalLinks)];
    // console.log("OK Links:", okLinks.length);
    // console.log("BROKEN Links:", brokenLinks.length);
    // console.log("UNIQUE Links:", uniqueLinks.length);
    // console.log("TOTAL Links:", totalLinks.length);
}


// stats();

function readFiles () {
    const files = readDir('./files');
    let links = []
    files.forEach( file=> {
        const rutaJoin = path.join(rutaAbsolutaFiles, file);
        const extension = getExtension(file);
        if (extension === '.md') {
            console.log(rutaJoin.bgGreen);
            const readOneFile = readFile(rutaJoin);
            console.log("Nombre del archivo:", file.green);
            let newLinks = getLinks(readOneFile); // [{ link, text, path}]
            let prueba = {
                path: rutaJoin,
                href: newLinks,
                text: "",
            }
            if(newLinks === null){ 
                newLinks = "El archivo no contiene links";
                prueba ={path: rutaJoin, href: newLinks, text: ""}
                console.log(prueba);
                console.log("------------------------------------------------------------------------------");
            } else{
                console.log("Links del archivo:", prueba);
                console.log("Cantidad de links: ", prueba.href.length);
                console.log("------------------------------------------------------------------------------");
                links = links.concat(prueba)
            }
        }


        //PUEDE IR AQUÍ LO DE LA CLI


    });
    return links;
}

const links = readFiles();
validateLinks(links);

// validateLinks(links)
//     .then(response => console.log(stats(response)))
//     .catch(error => console.log(error));

// function mdLinks(path, option) {

    
// }


module.exports = () => {
    readDir,
    validateLinks,
    stats,
    readFiles,
    getLinks,
    getExtension,
    readFile
}
