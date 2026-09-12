import fs from 'node:fs';
import {build} from 'esbuild';
const result=await build({entryPoints:['src/entry.js'],bundle:true,write:false,minify:true,format:'iife',target:['es2020'],loader:{'.geojson':'json'},legalComments:'inline'});
const html=fs.readFileSync('src/index.html','utf8').replace('/*STYLE*/',()=>fs.readFileSync('src/style.css','utf8')).replace('/*APP*/',()=>result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script'));
fs.writeFileSync('index.html',html);
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);
fs.copyFileSync('node_modules/three/LICENSE','THREE-LICENSE.txt');
console.log('已生成可离线打开的 index.html');
