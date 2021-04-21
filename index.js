const axios = require('axios');
const fs = require('fs');
const { resolve } = require('path');
const path = require('path');
require('colors');

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
        const again = getOnlyMd (joinPath);
        allMds =allMds.concat(again);
      }
    });
  }  
  return allMds;
}
//------------------------------------------------------------//

//------------------------OBTENER LINKS---------------------//

function getLinks (arrayPathMds) {
  let links = [];
  arrayPathMds.forEach((pathMd) => {
    const readMd = readFile(pathMd);
    const regExp = /\(https*:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}\gi/gm;
    // let regExp = /\bhttps+:\/\/\S+/gi;
    let arrayLinks = readMd.replace(/[{(,)}]/g, '').match(regExp);
    let objPathLinks = {};
    if(arrayLinks !== null){ 
      arrayLinks.forEach(link => {
        objPathLinks= {
          path: pathMd,
          href: link,
          text: "",
        }
        links = links.concat(objPathLinks);
      })
    }else {
      objPathLinks ={
        path: pathMd,
        href: 'No se encontraron links'
      }
      links = links.concat(objPathLinks);
    }
    
    // if(arrayLinks === null){ 
    //     arrayLinks = "El archivo no contiene links";
    //     objPathLinks ={path: pathMd, href: arrayLinks}
    //     // links = links.concat(objPathLinks);
    //     // console.log(objPathLinks, 'pruebaaaaaaaaaa');
    //   } else {
    //     arrayLinks.forEach(link => {
    //       objPathLinks= {
    //         path: pathMd,
    //         href: link,
    //         text: "",
    //       }
    //       links = links.concat(objPathLinks);
    //     })
    //   }
  });
  return links;
}

//------------------------------------------------------------//

//------------------------VALIDAR LINKS----------------------//

function validateLinks (links) {
  let arrayvalidation =  links.map(oneLink => {
      return axios.get(oneLink.href)
          .then(response => {
              return {
                  path: oneLink.path,
                  href: response.config.url,
                  text: oneLink.text,
                  status: response.status,
                  statusText: response.statusText,
              }
              })
              .catch(error => {
                  if (error.response) {
                      return {
                          path: oneLink.path,
                          href: error.response.config.url,
                          text: oneLink.text,
                          status: error.response.status,
                          statusText: error.response.statusText,
                      }
                  } else if (error.request) {
                      return {
                          path: oneLink.path,
                          href: error.request._currentUrl,
                          status: "Sin status",
                          statusText: "No se recibio respuesta",
                      }
                  } else {
                      return {
                          path: oneLink.path,
                          href: error.response.config.url,
                          error: "A ocurrido un error en la petición",
                          
                      }
                  }
                })
                
  });
  return Promise.all(arrayvalidation);
}

//------------------------------------------------------------//

//---------------------------STATS/TOTAL AND UNIQUE/----------------------------//

function stats (arrayLinks) {
  let totalLinks = [];
  arrayLinks.map(link => {
    totalLinks.push(link.href);
  })
  const uniqueLinks = [...new Set(totalLinks)];
  const totalUnique = {
    TOTAL : totalLinks.length,
    UNIQUE : uniqueLinks.length
  }
  return totalUnique;
}

//------------------------------------------------------------//

//---------------------------STATS/TOTAL, UNIQUE AND BROKEN/----------------------------//

function statsValidate (arrayLinks) {
  let totalLinks = [];
  const okLinks = [];
  const brokenLinks = [];
  arrayLinks.forEach(link => {
      totalLinks.push(link.href);
      if (link.status !== 200){
          brokenLinks.push(link);
      }else {
          okLinks.push(link);
      }
  })
  const uniqueLinks = [...new Set(totalLinks)];
  console.log("OK Links:", okLinks.length);
  console.log("BROKEN Links:", brokenLinks.length);
  console.log("UNIQUE Links:", uniqueLinks.length);
  console.log("TOTAL Links:", totalLinks.length);
}

//-------------------------------------------------------------------------------------//

module.exports = {
  readDir,
  validateLinks,
  stats,
  getLinks,
  getOnlyMd,
  getExtension,
  readFile,
  statsValidate,
}
