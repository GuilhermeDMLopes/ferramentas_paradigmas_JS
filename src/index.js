// Criaremos uma biblioteca node que percorra um arquivo de texto e encontre links
// Lib Chalk do Node que torna os textos do terminal mais interativos (UtiliZAREMOS A VERSÃO 5.0.1)
// comando para baixar Lib Chalk: npm install chalk@5.0.1 --save-exact (vai salvar exatamente a versão pedida)
/*
As Libs do Node podem ser instaladas localmente, ou seja, apenas no projeto que a utilizaremos.
Ou também globalmente (adicionando -g após o npm) em que poderemos reaproveitar em outros projetos.
No entanto, é mais indicado baixar localmente devido a variedade de versões
*/

//Existem 2 tipos de importação
//Diferenças entre eles em: https://www.alura.com.br/artigos/guia-importacao-exportacao-modulos-javascript
//const chalk = require('chalk'); //Este é mais antigo e está caindo em desuso
import chalk from 'chalk'; //Novo meio de importação das versões mais recentes do Node
//Para forçar o JS a utilizar a nova versão de importação. Devemos ir no package.json
//e adicionar a linha "type": "module" abaixo de "main": "index.js"
// Exemplo de uso do chalk
//console.log(chalk.blue('Hello world!'));

// Biblioteca para acessar o file system do computador
import fs from 'fs';

function trataErro(erro) {
    console.log(erro)
    throw new Error(chalk.red(erro.code, 'Não há arquivo no diretorio'));
}

//CODIGO SINCRONO
/*function pegaArquivo(caminhoDoArquivo) {
    const encoding = 'utf-8';
    //Pega um arquivo de um caminho no PC, utilizando encoding utf-8 e mostra o conteúdo dele
    // Lembrando que o "_" é quando não utilizaremos um dos parametros, no caso, substitui o "erro" caso aconteça.
    fs.readFile(caminhoDoArquivo, encoding, (erro, texto) => {
        if(erro) {
            trataErro(erro);
        }
        console.log(chalk.green(texto));
    })
}
*/

// O JS tem 2 formas de usar codigo assincrono

//CODIGO ASSINCRONO COM THEN
/*
function pegaArquivo(caminhoDoArquivo) {
    const encoding = 'urf-8';   
    fs.promises
     .readFile(caminhoDoArquivo, encoding)
     .then((texto) => console.log(chalk.green(texto))) //o .then resolve uma promessa e retorna o texto
     .catch(trataErro)
}
*/

//CODIGO ASSINCRONO COM ASYNC/AWAIT
async function pegaArquivo(caminhoDoArquivo) {
    try {
        const encoding = 'utf-8';
        const texto = await fs.promises.readFile(caminhoDoArquivo, encoding) //Espera resolver para retornar o valor
        //console.log(chalk.green(texto))
        //console.log(extraiLinks(texto)); 
        return extraiLinks(texto);
    } catch(erro) {
        trataErro(erro)
    }
    
}

export default pegaArquivo;
//pegaArquivo('./arquivos/texto.md');
//pegaArquivo('./arquivos/');

/*
Precisaremos criar um regex para capturar os links no arquivo.md
Site regex101.com é possível testar o nosso regex
Regex para pegar tudo que esta entre colchetes, exceto um colchete e que aparecem 1 ou mais vezes:  \[[^[\]]*?\]
Regex para pegar os links dentro dos parenteses após os colchetes: \(https?:\/\/[^\s?#.].[^\s]*\)
 - "\" pega os caracteres especiais do regex como '[]', '()', '/'.
 - \s pega todo o espaço em branco
 - ^ é negação
 - []* pega de 1 ou mais ocorrencias

No entanto, ele pega todos de uma vez. Nossa lib deve conseguir acessar e testar um link por vez.
Para isso, devemos separar nosso regex em grupos. Fazemos isso com "()"
Assim, o Regex fica:  \[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)
*/

//const testeReg = "São geralmente recuperados a partir de um objeto [FileList](https://developer.mozilla.org/pt-BR/docs/Web/API/FileList) que é retornado como resultado da seleção, pelo usuário, de arquivos através do elemento [<input>](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/Input), a partir do objeto [DataTransfer](https://developer.mozilla.org/pt-BR/docs/Web/API/DataTransfer) utilizado em operações de arrastar e soltar, ou a partir da API `mozGetAsFile()` em um [HTMLCanvasElement](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLCanvasElement). Em Gecko, códigos com privilégiios podem criar objetos File representando qualquer arquivo local sem a intereção do usuário (veja [Implementation notes](https://developer.mozilla.org/pt-BR/docs/Web/API/File#implementation_notes) para mais informações.)."
function extraiLinks(texto) {
    //O regex deve ficar dentro de "//". o gm fica no final do regex no site regex101.com
    const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
    //const capturas = texto.match(regex); //Apenas mostra o resultado do regex
    //const capturas = regex.exec(texto); //Executa o regex em si no texto. Porém apenas na primeira vez que encontra
    const capturas = [...texto.matchAll(regex)]; //Separa cada resultado do regex dentro de um array
    //Pega cada elemento do array de capturas e faz uma relação chave valor do nome entre colchetes com o link
    const resultado = capturas.map(captura => ({[captura[1]]: [captura[2]]}))
    //console.log(capturas)
    //console.log(resultado)

    return resultado.length !== 0 ? resultado : 'Não há links no arquivo';
}

//extraiLinks(testeReg);

/*---CODIGO SINCRONO---
Execução em sequência, uma instrução após a outra.
Ex: rádio, telefone
*/

/*---CODIGO ASSINCRONO---
Não espera a finalização de uma tarefa para iniciar a seguinte.
Aguarda a finalização da tarefa para retornar o resultado.
Executa a tarefa em segundo plano, não travando o código
Ex: mensageiros (whatsapp, telegram)
*/

/*---PROMISES (promessas)---
Forma que o JS usa para trabalhar com código assincronos. 
*/
