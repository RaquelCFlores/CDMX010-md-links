#!/urs/bin/env nodo

const path = require('path');
require('colors');
const { getOnlyMd, validateLinks, stats, getLinks} = require('./index');

//---------------------CLI--------------------//
const process = require('process');

// const args = process.argv.slice(2);
// console.log(args, "<<<<<<<<<< ARGUMENTOS");
const pathFile = process.argv[2];
// console.log(pathFile, "<<<<<<<<<<< RUTA INGRESADA");

const findOption = (defaultOption, shortOption) => process.argv.findIndex((option) => option == shortOption || option == defaultOption);

const validateOptionIndex = findOption('--validate', '--v');
const statsOptionIndex = findOption('--stats', '--s');


const options = {
    validate: validateOptionIndex > 0,
    stats: statsOptionIndex > 0,
}

// console.log(options, "<<<<<<<<<<<<<< OBJETO DE OPCIONES");

//--------------------------------------------//

function mdLinks(pathFile, options) {
    // console.log(options, '<<<<<<<<<<<< VIENDO QUE ENTRA EN OPTIONS');
    const rutaAbsolutaFiles = path.resolve(pathFile);
    const pathMd = getOnlyMd(rutaAbsolutaFiles);
    // let links = [];
    // let links =  getLinks(pathMd);
      // console.log(pathMd, '<<<<<<< RESULTADO DE GETONLYMD');
    
      // const links = getLinks(pathMd);
      // console.log(links, '<<<<<<<< RESULTADO DE GETLINKS (ARRAY DE OBJETOS)');
    
      if (pathMd == ''){
        console.log(`La ruta ${pathFile} no contiene archivos MD`);
      } else {
        // console.log(pathMd, '<<<<<<< RESULTADO DE GETONLYMD');
        let links = getLinks(pathMd);
        // console.log(links, '<<<<<<<< RESULTADO DE GETLINKS (ARRAY DE OBJETOS)');
        
        if (options.validate && options.stats) {
          console.log("VAS A VALIDAR Y TENER STATS AQUÍ");
    
    
          // return validateLinks (links).then( res )
        } else if (options.validate) {
          console.log("VAS A VALIDAR AQUÍ");
          console.log(links, "linksssssssssssssssssss")
        //   return validateLinks(links).then(res => console.log(res))
        //   return Promise.all(validateLinks(links))
        //         .then(res => console.log('PROMESA', res))
        // //.then(res => console.log('RESSS', res))
        //  // console.log (validateLinks(links), '<<<<<<<<<<< VALIDATELINKS');
        //   //   .then( res )
        } else if (options.stats) {
          console.log("VAS A TENER STATS AQUÍ");
          const statsTotalUnique = stats(links);
          console.log(statsTotalUnique);
        }else {
          console.log(links);
        }
    }
  }
  
  mdLinks(pathFile, options);
