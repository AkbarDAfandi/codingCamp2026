import fs from 'fs';
import path from 'path';

const filePath = path.resolve('filesystem/notes.txt');

const fileReadCallback = (error, data) => {
    if(error) {
        console.log('Gagal membaca berkas');
        console.log(error);
        return;
    }
    console.log(data);
};
 
fs.readFile(filePath, 'UTF-8', fileReadCallback);
