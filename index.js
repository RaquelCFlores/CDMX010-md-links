// module.exports = () => {
//   // ...
// };

const axios = require('axios');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
require('colors');

// function convertPath (pathFile) {
//   const isAbsolute = path.isAbsolute(pathFile);
//   console.log(isAbsolute, '<<<<<<<<<<<<< DIME QUE ERES');
//   if (isAbsolute === false){
//       pathFile = path.resolve(pathFile);
//       console.log(pathFile, '<<<<<<<<<<<<<LLEGANDO LEJOS');
//   }else {
//       pathFile = pathFile;
//       console.log(pathFile, '<<<<<<<<<< YA CASI TERMINO');
//   }
// }

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

//-------FUNCIÓN RECURSIVA PARA OBTENER ARCHIVOS MD----------//
function getOnlyMd (pathFile) {  
  let allMds = [];
  const infoPath = fs.statSync(pathFile);
  if (infoPath.isFile()){
    if (getExtension(pathFile) == '.md'){
      allMds.push(pathFile);
    } 
  } else if (infoPath.isDirectory()){
    const readDirectory = readDir(pathFile).map(element => path.join(pathFile, element));
    readDirectory.forEach(joinPath => {
      if (getExtension(joinPath) == '.md'){
        allMds.push(joinPath);
      } else {
        // const newFile = joinPath;
        const again = getOnlyMd (joinPath);
        allMds =allMds.concat(again);
      }
    });
  }  
  return allMds;
}
//------------------------------------------------------------//

//------------------------OOBTENER LINKS---------------------//

function getLinks (arrayPathMds) {
  // console.log(arrayPathMds, '<<<<<<<<VIENDO SI ENTRAN LOS MDS');
  let links = [];
  arrayPathMds.forEach(pathMd => {
    // console.log(pathMd.bgGreen);
    const readMd = readFile(pathMd);
    // const readMd = readFile(pathMd).slice(1, 100);
    // console.log(readMd, '<<<<<<<< LEYENDO MDS');
    const regExp = /\(https*:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}\gi/gm;
    // let regExp = /\bhttps+:\/\/\S+/gi;
    let arrayLinks = readMd.replace(/[{(,)}]/g, '').match(regExp);
    // console.log(arrayLinks, arrayLinks.length, '<<<<<<<VIENDO SI HAY LINKS');
    let  objPathLinks= {
      path: pathMd,
      href: arrayLinks,
      text: "",
    }
    if(arrayLinks === null){ 
      arrayLinks = "El archivo no contiene links";
      objPathLinks ={path: pathMd, href: arrayLinks, text: ""}
      // console.log(objPathLinks);
      // console.log("------------------------------------------------------------------------------");
    } else{
      // console.log("Links del archivo:", objPathLinks);
      // console.log("Cantidad de links: ", objPathLinks.href.length);
      // console.log("------------------------------------------------------------------------------");
      links = links.concat(objPathLinks);
    }
    // console.log('--------------------------------------------------------------------------------');
  });
  return links
}

//------------------------------------------------------------//

//------------------------VALIDAR LINKS----------------------//

function validateLinks (links) { // [{ href, text, path, status, statusText}, ...]
  console.log('LINKSSSS', links)
  let arrayvalidation;
  links.forEach(array => {
      const path = array.path;
      const href = array.href;
      const text = array.text;
      arrayvalidation =  href.map(oneLink => {
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
      // .then(res => { 
      //     console.log(`Links Validados de la ruta ${path}`, res, res.length )
      //     // stats(res);
      //     })
      // .catch(error => console.log("Ocurrio un error:", error))
  });
}



//------------------------------------------------------------//

//---------------------------STATS/TOTAL AND UNIQUE/----------------------------//

function stats (arrayLinks) {
  // arrayLinks = validateLinks().then(arrayLinks => arrayLinks)
  // console.log(arrayLinks, "<<<<<<<<<<<<<<<<<< STATS");
  let totalLinks = [];
  // const okLinks = [];
  // const brokenLinks = [];
  console.log(arrayLinks, '<<<<<<<<<<< QUE ENTRA EN STATS');
  arrayLinks.map(link => {

      const prueba = link.href;
      console.log(prueba, '<<<<<<<<<<<< QUE TRAES AQUÍ LINK');
      prueba.forEach(el => {
        totalLinks.push(el);
      });
      // totalLinks.push(link.href);
      // if (link.status !== 200){
      //     brokenLinks.push(link);
      // }else {
      //     okLinks.push(link);
      // }
  })
  console.log(totalLinks.length, '<<<<<<<<< TOTAL DE LINKS');
  const uniqueLinks = [...new Set(totalLinks)];
  console.log(uniqueLinks.length, '<<<<<<<<<<<<<<<< UNIQUE LINKS');
  const totalUnique = {
    TOTAL : totalLinks.length,
    UNIQUE : uniqueLinks.length
  }

  return totalUnique;
  // console.log("OK Links:", okLinks.length);
  // console.log("BROKEN Links:", brokenLinks.length);
  // console.log("UNIQUE Links:", uniqueLinks.length);
  // console.log("TOTAL Links:", totalLinks.length);
}

//------------------------------------------------------------//

//---------------------------STATS/TOTAL, UNIQUE AND BROKEN/----------------------------//

// function stats (arrayLinks) {
//   // arrayLinks = validateLinks().then(arrayLinks => arrayLinks)
//   // console.log(arrayLinks, "<<<<<<<<<<<<<<<<<< STATS");
//   let totalLinks = [];
//   const okLinks = [];
//   const brokenLinks = [];
//   arrayLinks.forEach(link => {
//       totalLinks.push(link.href);
//       if (link.status !== 200){
//           brokenLinks.push(link);
//       }else {
//           okLinks.push(link);
//       }
//   })
//   const uniqueLinks = [...new Set(totalLinks)];
//   console.log("OK Links:", okLinks.length);
//   console.log("BROKEN Links:", brokenLinks.length);
//   console.log("UNIQUE Links:", uniqueLinks.length);
//   console.log("TOTAL Links:", totalLinks.length);
// }

//-------------------------------------------------------------------------------------//

module.exports = {
  readDir,
  validateLinks,
  stats,
  getLinks,
  getOnlyMd,
  getExtension,
  readFile,
}
