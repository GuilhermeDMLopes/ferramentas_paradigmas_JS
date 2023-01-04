//Faz a validação dos links
import chalk from 'chalk';

function extraiLinks(arrLinks) {
    //Pega os valores do Objeto de Lista de links, ou seja, apenas os links.
    //o join() pega o array de cada link e junta em um só
    return arrLinks.map((objetoLink) => Object.values(objetoLink).join())
}

//Função para verificar se as URLS são válidas e retornam seus status
async function checaStatus(listaURLs) {

    //Recebe a lista de promessas e resolve uma a uma
    const arrStatus = await Promise.all(
        listaURLs.map(async (url) => {
            try {
                const response = await fetch(url)
                return response.status
            } catch(erro) {
                return manejaErros(erro)
            }
        })
    )

    return arrStatus;
}

function manejaErros(erro) {
    if(erro.cause.code === 'ENOTFOUND') {
        return "Link não encontrado";
    } else {
        return "Ocorreu algum erro";
    }
}

export default async function listaValidada(listaDeLinks) {
    const links = extraiLinks(listaDeLinks);
    const status = await checaStatus(links)
    
    //Adicionando os status no mapa de chave:valor inicial
    //Os () retornam um objeto
    return listaDeLinks.map((objeto, indice) => ({
        ...objeto,
        status: status[indice]
    }))
}