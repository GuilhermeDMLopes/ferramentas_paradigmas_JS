// Arquivo para manipular as informações do terminal para a aplicação

import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from "./index.js";
import listaValidada from './http-validacao.js';

// Valores de argumento, mostra os caminhos de cada processo em execução no terminal.
const caminho = process.argv;
//console.log(caminho) // Retorna o caminho do node e o caminho do cli.js
//Se passarmos o caminho no terminal: node cli.js .arquivos/texto.md
//Podemos pegar o caminho desejado, fazendo:
//console.log(caminho[2]);

//executar no terminal: node cli.js ../arquivos/texto.md 
//pegaArquivo(caminho[2])

//Inicializamos o identificar com uma string vazia para o caso de passar o caminho com arquivo. Com isso, ele não mostra nada
async function imprimeLista(valida, resultado, identificador = "") {
    
    if(valida) {
        console.log(chalk.yellow("lista validada: "), chalk.black.bgGreen(identificador), await listaValidada(resultado))
    } else {
        console.log(chalk.yellow("lista validada: "), chalk.black.bgGreen(identificador), resultado)

    }
}
async function processaTexto(argumentos) {
    const caminho = argumentos[2];
    //A variavel valida vai ser guardada apenas se em argumentos[3] for igual a --valida
    const valida = argumentos[3] === '--valida';    

    try {
        fs.lstatSync(caminho);
    } catch (erro) {
        if(erro.code === "ENOENT") {
            console.log("Arquivo ou diretório não existe")
            return; //Com o return, é apresentado apenas a mensagem do console.log
        }
    }
    
    //Verifica se o caminho é um diretório ou arquivo
    if(fs.lstatSync(caminho).isFile()) {
        const resultado = await pegaArquivo(caminho)
        imprimeLista(valida, resultado)
    } else if(fs.lstatSync(caminho).isDirectory()) {
        //Verifica os arquivos dentro do diretório
        const arquivos = await fs.promises.readdir(caminho)
        arquivos.forEach(async (nomeDoArquivo) => {
            const lista = await pegaArquivo(`${caminho}/${nomeDoArquivo}`)
            //console.log(lista)
            imprimeLista(valida, lista, nomeDoArquivo)
        })
        //console.log(arquivos) //Mostra os arquivos dentro do diretorio
    }
    
}

processaTexto(caminho)

//criamos no package.json, na aba de scripts um comando para executar o arquivo usando npm

