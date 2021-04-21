const funciones = require('../index');

const directory = [
  'ArchivoPrueba.md',
  'file_2',
  'READMEDL.md',
  'READMETaller.md',
  'README_DL.txt'
];

describe('readDir', () => {
  it('Debería ser una función', () => {
    expect(typeof funciones.readDir).toBe('function')
  });
  it('Debería leer un directorio', () =>{
    expect(funciones.readDir('./files')).toEqual(directory)
  });
});

const file = `Repo para practicar`;

describe('readFile', () => {
  it('Debería ser una función', () => {
    expect(typeof funciones.readFile).toBe('function')
  });
  it('Debería leer el archivo', () => {
    expect(funciones.readFile('./files/READMETaller.md')).toEqual(file)
  });
});

describe('getExtension', () => {
  it('Debería ser una función', () => {
    expect(typeof funciones.getExtension).toBe('function')
  });
  it('Debería obtener la extensión de un archivo', () => {
    expect(funciones.getExtension('./files/READMETaller.md')).toEqual('.md')
  });
});

const getMds = [
  'files\\ArchivoPrueba.md',
  'files\\file_2\\READMECF.md',
  'files\\file_2\\READMEDL.md',
  'files\\file_2\\READMERS.md',
  'files\\READMEDL.md',
  'files\\READMETaller.md'
];

describe('getOnlyMd', () => {
  it('Debería ser una función', () => {
    expect(typeof funciones.getOnlyMd).toBe('function')
  });
  it('Debería obtener archivos con extensión .md', () => {
    expect(funciones.getOnlyMd('./files')).toEqual(getMds)
  });
});

const arrayEntrada = [
  'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md'
];

const links = [
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#Semantics_in_HTML',
    text: ''
  },
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n',
    text: ''
  },
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#Semantics_in_HTML',
    text: ''
  }
];

describe('getLinks', () => {
  it('Debería ser una función', () => {
    expect(typeof funciones.getLinks).toBe('function')
  });
  it('Debería obtener un array de objetos de links', () => {
    expect(funciones.getLinks(arrayEntrada)).toEqual(links)
  });
});

const arrayStats= [
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#Semantics_in_HTML',
    text: ''
  },
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n',
    text: ''
  },
  {
    path: 'C:\\Users\\HP-1\\Developer\\Laboratoria\\CDMX010-md-links\\files\\ArchivoPrueba.md',
    href: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#Semantics_in_HTML',
    text: ''
  }
];

const exitStats = { TOTAL: 3, UNIQUE: 2 };



describe('stats', () => {
  it('Debería ser una función', () =>{
    expect(typeof funciones.stats).toBe('function')
  });
  it('Debería mostrar un conteo de links total y links unicos', () => {
    expect(funciones.stats(arrayStats)).toEqual(exitStats)
  });
});

