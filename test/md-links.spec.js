const funciones = require('../index');

// describe('mdLinks', () => {

//   it('should...', () => {
//     console.log('FIX ME!');
//   });

// });

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

discribe('readFile', () => {
  it('Debería ')

})

