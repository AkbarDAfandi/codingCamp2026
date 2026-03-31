import fs from 'fs';
import path from 'path';

const inputPath = path.resolve('stream/input.txt');
const outputPath = path.resolve('stream/output.txt');

const readableStream = fs.createReadStream(inputPath, {
    highWaterMark: 15 
});

const writableStream = fs.createWriteStream(outputPath);

readableStream.on('readable', () => {
    try {
        let chunk;
        while ((chunk = readableStream.read()) !== null) {
            writableStream.write(`${chunk}\n`);
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat membaca:', error.message);
    }
});

readableStream.on('end', () => {
    writableStream.end();
    console.log('Proses penyalinan teks selesai.');
});