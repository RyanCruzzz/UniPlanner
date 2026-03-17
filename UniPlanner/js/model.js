// É aqui que vou definir como as informações serão estruturadas
// Lembrando que cada disciplina e cada tarefa vai ser um objeto com suas propriedades
const COLORS = ['#7c6ffc',  '#fc6f9e',  '#6ffcb7',  '#fcd76f',  '#6fb8fc',  '#fc9b6f'] // ponto importante, o nome 'COLORS' é uma convenção, ou seja, (indica que é uma constante global). Que nunca muda. E uma convenção seria um acordo entre os desenvolvedores, isso não é uma regrada linguagem

let subjects = [ //vai armazenar todas as disciplinas, ela vai começar vazia
    {id: "s1", name: "Programação Web", color: '#7c6ffc'},
    {id: "s2", name: "Banco de Dados", color: '#fc6f9e'},
]

let tasks = [ // armazena todas as tarefas, começa vazia também

]

let completedTasks = [ //armazena todas as tarefas concluidas, começa vazia

]

// VARIÁVEIS DE CONTROLE - elas controlam o estado da interface
let currentSubjectId = null
let focusedTask = null
let selectedColor = COLORS[0]










