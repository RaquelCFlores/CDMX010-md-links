#!/urs/bin/env nodo

const path = require('path');
require('colors');
const { getOnlyMd, validateLinks, stats, getLinks, statsValidate} = require('./index');

//---------------------CLI--------------------//
const process = require('process');
const pathFile = process.argv[2];

const findOption = (defaultOption, shortOption) => process.argv.findIndex((option) => option == shortOption || option == defaultOption);

const validateOptionIndex = findOption('--validate', '--v');
const statsOptionIndex = findOption('--stats', '--s');

const options = {
    validate: validateOptionIndex > 0,
    stats: statsOptionIndex > 0,
}

//--------------------------------------------//

function mdLinks(pathFile, options) {
    const rutaAbsolutaFiles = path.resolve(pathFile);
    const pathMd = getOnlyMd(rutaAbsolutaFiles);
    
    if (pathMd == ''){
        console.log(`La ruta ${pathFile} no contiene archivos MD`);
    } else {
        let links = getLinks(pathMd);
        
        if (options.validate && options.stats) {
            console.log("A continuación se muestran las estadísticas de los links validados:");
            return validateLinks(links).then(res => statsValidate(res));

        } else if (options.validate) {
            console.log("A continuación se muestran las validaciones solicitadas");
            return validateLinks(links).then(res => console.log(res));

        } else if (options.stats) {
            console.log(`Estas son las estadisticas de ${pathMd}`);
            const statsTotalUnique = stats(links);
            console.log('ESTADISTICAS:',statsTotalUnique);
        }else {
            console.log(`Estas son los links de ${pathMd}`);
            console.log(links);
        }
    }
}

mdLinks(pathFile, options);
