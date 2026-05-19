# À La Carte

À La Carte é uma aplicação mobile-first para gerenciamento de receitas, criada com Angular e Tailwind CSS.

O projeto foi pensado como um livro de receitas pessoal, com foco em organização, uso simples e armazenamento local. A aplicação não possui login, pois a proposta inicial é funcionar como um app local-first, onde as receitas ficam salvas no próprio dispositivo do usuário.

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

## Conceito do projeto

O À La Carte foi desenvolvido como uma aplicação local-first.

Isso significa que os dados são salvos localmente no navegador, sem necessidade de login, conta de usuário ou backend obrigatório nesta fase.

A decisão de não usar login foi tomada para manter o app mais simples, direto e adequado ao uso pessoal, principalmente pensando em uma futura versão mobile.

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
│   │   └── assets/
│   │       └── icons/
│   │
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
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

## Como rodar o projeto

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

## Próximos passos possíveis

- Transformar o projeto em PWA
- Testar instalação no iPhone via Safari
- Melhorar armazenamento local usando IndexedDB
- Preparar versão mobile com Capacitor
- Preparar versão desktop com Tauri
- Adicionar backend futuramente apenas se houver necessidade de sincronização entre dispositivos

## Observação sobre backend

Nesta fase, o projeto não depende de backend.

Como a aplicação não possui login e salva os dados localmente, o backend não é obrigatório agora.

Um backend pode ser adicionado futuramente caso o projeto evolua para recursos como:

- sincronização em nuvem
- backup automático
- compartilhamento de receitas
- conta de usuário
- acesso em múltiplos dispositivos

## Autor

Desenvolvido por Thiago Barbosa.