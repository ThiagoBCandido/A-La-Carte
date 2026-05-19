# À La Carte

À La Carte é uma aplicação mobile-first para gerenciamento de receitas, criada com Angular e Tailwind CSS.

O projeto funciona como um livro de receitas pessoal, com foco em organização, praticidade e armazenamento local. A aplicação não precisa de backend, pois os dados são salvos no próprio dispositivo/navegador do usuário.

## Acesse a aplicação

A aplicação está disponível em:

```txt
https://a-la-carte-navy.vercel.app/receitas
```

## Como instalar na tela inicial do celular

A aplicação pode ser adicionada à tela inicial do celular como um app.

### iPhone

1. Abra o link da aplicação no Safari.
2. Toque no botão de compartilhar.
3. Selecione **Adicionar à Tela de Início**.
4. Confirme em **Adicionar**.

Depois disso, o À La Carte ficará disponível como um ícone na tela inicial do iPhone.

### Android

1. Abra o link da aplicação no navegador.
2. Toque no menu do navegador.
3. Selecione **Adicionar à tela inicial** ou **Instalar app**.
4. Confirme a instalação.

## Objetivo

O objetivo do À La Carte é permitir que o usuário crie, edite, organize e consulte suas próprias receitas de forma prática.

A aplicação permite cadastrar receitas com foto, ingredientes, quantidades, modo de preparo, favoritos, categorias e lista de compras.

## Funcionalidades

- Cadastro de receitas
- Upload de foto da receita
- Visualização detalhada da receita
- Checklist de ingredientes
- Checklist de modo de preparo
- Edição de ingredientes e passos
- Exclusão de receitas
- Favoritar receitas
- Aba de receitas favoritas
- Lista de compras baseada nos ingredientes das receitas
- Marcar itens da lista como comprados
- Remover itens da lista de compras
- Limpar lista de compras
- Filtro por categorias
- Tela de ajustes com controle de dados locais
- Exportação de backup em JSON
- Importação de backup em JSON
- Restauração do aplicativo para o estado inicial
- Suporte a PWA para uso como app instalado na tela inicial

## Conceito do projeto

O À La Carte foi desenvolvido como uma aplicação local-first.

Isso significa que a aplicação não depende de login, conta de usuário ou backend. Os dados ficam salvos localmente no navegador/dispositivo do usuário.

Essa decisão foi tomada para manter o app simples, rápido e adequado ao uso pessoal, principalmente pensando no uso em celulares.

## A aplicação precisa de backend?

Não.

Nesta versão, o À La Carte não precisa de backend.

Como a aplicação não possui login e salva os dados localmente, um backend não é necessário para o funcionamento principal do projeto.

Um backend só faria sentido futuramente caso o projeto evoluísse para recursos como:

- sincronização entre dispositivos
- backup automático em nuvem
- compartilhamento de receitas
- conta de usuário
- acesso às mesmas receitas em múltiplos aparelhos

## Armazenamento local

Atualmente, os dados são salvos com `localStorage`.

São armazenados localmente:

- Receitas criadas
- Fotos das receitas
- Ingredientes
- Modo de preparo
- Estado dos checklists
- Receitas favoritas
- Lista de compras
- Categorias
- Dados de backup

Importante: se os dados do navegador forem apagados, as receitas também podem ser perdidas. Por isso, a tela de Ajustes possui exportação e importação de backup.

## Tecnologias utilizadas

- Angular 17
- TypeScript
- Tailwind CSS
- HTML
- CSS
- LocalStorage
- PWA

## Estrutura do projeto

```txt
alacarte/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   └── services/
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   ├── recipe-details/
│   │   │   │   ├── new-recipe/
│   │   │   │   ├── favorites/
│   │   │   │   ├── shopping-list/
│   │   │   │   ├── categories/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── shared/
│   │   │       └── components/
│   │   │
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   └── menu-icons/
│   │   │
│   │   └── manifest.webmanifest
│   │
│   ├── angular.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── ngsw-config.json
│
└── README.md
```

## Principais telas

### Receitas

Tela inicial da aplicação, onde são exibidas as receitas cadastradas pelo usuário.

Caso não exista nenhuma receita, a aplicação mostra um estado vazio com opção para criar a primeira receita.

### Nova receita

Tela responsável pelo cadastro de uma nova receita.

Permite informar:

- Nome da receita
- Descrição
- Categoria
- Dificuldade
- Tempo de preparo
- Porções
- Foto
- Ingredientes
- Quantidades
- Modo de preparo

### Detalhes da receita

Tela onde o usuário pode visualizar e interagir com a receita.

Permite:

- Ver a foto da receita
- Marcar ingredientes
- Marcar passos do preparo
- Editar ingredientes
- Editar modo de preparo
- Adicionar ingredientes à lista de compras
- Remover foto
- Excluir receita

### Favoritas

Exibe apenas as receitas marcadas como favoritas.

O usuário pode favoritar ou remover dos favoritos usando o botão de coração.

### Lista

Funciona como lista de compras.

Os ingredientes podem ser adicionados a partir da tela de detalhes de uma receita.

Permite:

- Ver ingredientes adicionados
- Marcar itens como comprados
- Remover itens individualmente
- Limpar a lista completa

### Categorias

Organiza as receitas de acordo com suas categorias.

A tela permite filtrar receitas por categoria de forma automática, com base nas receitas cadastradas.

### Ajustes

Funciona como painel de controle dos dados locais do aplicativo.

Permite:

- Ver resumo dos dados salvos
- Exportar backup
- Importar backup
- Limpar lista de compras
- Restaurar o aplicativo para o estado inicial

## Como rodar o projeto localmente

Acesse a pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Rode o projeto:

```bash
npm start
```

Ou:

```bash
ng serve
```

Depois acesse:

```txt
http://localhost:4200
```

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos de build serão gerados na pasta:

```txt
frontend/dist/
```

## Testando o build localmente

Após gerar o build, é possível servir a versão de produção localmente:

```bash
http-server dist/a-la-carte/browser -p 8080 -c-1
```

Depois acesse:

```txt
http://localhost:8080
```

## Deploy

O projeto está publicado na Vercel.

Link da aplicação:

```txt
https://a-la-carte-navy.vercel.app/receitas
```

Configurações principais do deploy:

```txt
Root Directory: frontend
Build Command: npm run build
Output Directory: dist/a-la-carte/browser
Install Command: npm install
```

## Status do projeto

O frontend principal está funcional.

A aplicação já possui as principais funcionalidades locais:

- criação de receitas
- upload de imagem
- favoritos
- categorias
- lista de compras
- ajustes
- backup
- restauração de dados
- suporte a instalação na tela inicial do celular

## Próximos passos possíveis

- Melhorar ícones e identidade visual da PWA
- Melhorar armazenamento local usando IndexedDB
- Preparar versão mobile com Capacitor
- Preparar versão desktop com Tauri
- Adicionar sincronização futuramente, apenas se necessário

## Autor

Desenvolvido por Thiago Barbosa.