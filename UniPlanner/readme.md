# UniPlanner

O UniPlanner é uma aplicação web desenvolvida para ajudar estudantes universitários a organizar suas responsabilidades acadêmicas, como trabalhos, provas, listas de exercícios e projetos.

O sistema permite que o usuário crie tarefas associadas a disciplinas específicas, acompanhe prazos de entrega, visualize o progresso das atividades e gerencie tarefas concluídas em uma interface organizada.

Este projeto também serve como ambiente de aprendizado para praticar conceitos fundamentais de desenvolvimento web, com foco principalmente em JavaScript e manipulação do DOM.

---

# Objetivo do Projeto

O principal objetivo desta aplicação é fornecer um ambiente estruturado onde estudantes possam gerenciar suas atividades acadêmicas de forma mais eficiente.

O sistema permite que os usuários:

- Cadastrarem disciplinas
- Criem tarefas associadas a cada disciplina
- Definam prazos de entrega
- Acompanhem o progresso das tarefas
- Marquem tarefas como concluídas
- Visualizem tarefas atrasadas
- Organizem suas atividades de forma clara

Cada tarefa contém as seguintes informações:

Título da tarefa
Breve descrição
Data de entrega
Barra de progresso
Status de conclusão

Exemplo de estrutura:

Task 1: Desenvolvimento de API
Descrição: Criar uma API REST para a disciplina de Programação Web
Prazo: 25/03
Progresso: [barra de progresso]

---

# Funcionalidades Principais

## Gerenciamento de Disciplinas

O sistema organiza as tarefas por disciplina.

Cada disciplina funciona como um contêiner onde as tarefas são agrupadas. Isso ajuda a manter uma separação clara entre diferentes matérias.

Cada disciplina possui:

- Nome da disciplina
- Identificação visual (cor)
- Lista de tarefas associadas

---

## Gerenciamento de Tarefas

Os usuários podem criar múltiplas tarefas dentro de cada disciplina.

Cada tarefa contém:

- Título
- Descrição
- Prazo de entrega
- Barra de progresso
- Status de conclusão

Para manter organização visual e usabilidade, cada disciplina possui um limite máximo de **10 tarefas**.

Exemplo de estrutura dentro de uma disciplina:

Task 1: Trabalho de API
Breve descrição
Prazo
Barra de progresso

Task 2: Lista de Exercícios de JavaScript
Breve descrição
Prazo
Barra de progresso

Task 3: Prova Parcial
Breve descrição
Prazo
Barra de progresso

---

## Visualização de Progresso

Cada tarefa possui sua própria barra de progresso.

A barra de progresso indica visualmente quanto tempo resta até o prazo final da tarefa.

Caso existam múltiplas tarefas dentro da mesma disciplina, cada uma exibirá sua própria barra de progresso independente.

---

## Sistema de Conclusão de Tarefas

O usuário pode marcar tarefas como concluídas.

Quando uma tarefa é concluída:

- Ela é removida da disciplina original
- Ela é movida para uma seção chamada **Tarefas Concluídas**
- Caso necessário, um novo card é criado automaticamente nessa seção

Essa separação permite que o usuário mantenha foco nas tarefas pendentes enquanto preserva o histórico de tarefas já finalizadas.

---

## Seção de Tarefas Concluídas

As tarefas concluídas são exibidas em uma seção separada localizada após a área principal da aplicação.

Essa seção possui estrutura semelhante à seção principal, porém contém apenas tarefas que já foram finalizadas.

O usuário também pode remover definitivamente tarefas dessa seção caso deseje.

---

## Sistema de Prazo

Se o prazo de uma tarefa for atingido antes que ela seja marcada como concluída:

- O card da tarefa recebe um tom levemente avermelhado
- A barra de progresso é removida
- Uma mensagem é exibida informando que o prazo foi atingido

Exemplo de mensagem:

Prazo esgotado

Esse feedback visual permite que o usuário identifique rapidamente tarefas atrasadas.

---

## Modo de Foco para Cards

Quando um card de tarefa é selecionado:

- Ele se posiciona no centro da tela
- Ele fica maior que os demais cards
- O fundo da página fica levemente desfocado

Isso cria um ambiente de foco para visualização e edição da tarefa.

---

# Estrutura do Projeto

UniPlanner

css/
Arquivos responsáveis pelo estilo da aplicação, layout e aparência dos componentes.

js/
Arquivos responsáveis pela lógica da aplicação.

model.js
Define a estrutura dos dados utilizados pelo sistema.

scripts.js
Responsável pela manipulação do DOM e comportamento da aplicação.

index.html
Define a estrutura base da interface da aplicação.

README.md
Arquivo de documentação do projeto.

---

# Modelagem de Dados

A aplicação utiliza duas estruturas principais de dados: Subject (disciplina) e Task (tarefa).

Subject representa uma disciplina acadêmica.

Task representa uma atividade específica, como trabalho, prova ou lista de exercícios.

Exemplo de modelo de dados:

Subject

id
name
color

Task

id
title
description
subjectId
deadline
done

Essa estrutura permite associar tarefas às respectivas disciplinas.

---

# Tecnologias Utilizadas

HTML5
CSS3
JavaScript (Vanilla JavaScript)

O projeto foi desenvolvido propositalmente sem frameworks para focar na compreensão dos fundamentos da linguagem JavaScript e da manipulação do DOM.

---

# Metodologia de Desenvolvimento

O projeto é desenvolvido seguindo uma abordagem baseada em sprints.

Cada sprint foca em conceitos técnicos específicos e na implementação gradual das funcionalidades do sistema.

---

# Roadmap de Desenvolvimento

Sprint 1
Estrutura base da interface
Criação da barra de navegação
Estilos globais

---

---

# Objetivo Educacional

Este projeto foi desenvolvido como ambiente prático para aprendizado de:

Lógica com JavaScript
Manipulação do DOM
Arquitetura de aplicações front-end
Controle de versão com Git
Trabalho colaborativo em equipe

---

# Status do Projeto

Projeto em desenvolvimento.

Fase atual: estrutura inicial da interface e arquitetura da aplicação.
