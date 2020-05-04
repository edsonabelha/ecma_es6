import api from './api';
class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.getElementById('repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.listEl = document.getElementById('repo-list');


    this.registerHandlers();
  }

  //
  registerHandlers() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  // Função pra Faser Loading na Pagina
  setLoading(loading = true) {
    if (loading === true) {
        let loadingEl = document.createElement('span');
        loadingEl.appendChild(document.createTextNode('Carregando'));
        loadingEl.setAttribute('id', 'loading');

        this.formEl.appendChild(loadingEl);
    } else {
      document.getElementById('loading').remove();
    }
  }
  //Metodo para Adicionar Repositorios
  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;
    //Verifica se tem alguma escrita no Input
    if (repoInput.length === 0)
      return;

   //Chama a Função Lodaing
    this.setLoading();

    try {
      //Faz a Busca pelo Repositorio Escrito no Input
      const response = await api.get(`/repos/${repoInput}`);

      //Usando a Desestruturação pegamos apenas as Informações Necessarias
      //da Variavel Response que nos retorna os Dados Vindo da API
      const {name, description, html_url, owner: { avatar_url} } = response.data;

      //Usamos a Short Syntax e Chamamos as Variveis Criadas
      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url,
      });

      this.inputEl.value = '';

      this.render();

    } catch (error) {
      alert('O Repositorio Não Existe!..')
    }

    //Seta o Loading Como Falso
    this.setLoading(false);
  }

  // Renderiza os Elementos HTML na Tela
  render() {
    this.listEl.innerHTML = '';

    this.repositories.forEach(repo => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.avatar_url);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', repo.html_url);
      linkEl.appendChild(document.createTextNode('Acessar'));

      let listItemEl = document.createElement('li');
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listEl.appendChild(listItemEl);
    });
  }
}

//Executa a Nossa Classe
new App();

