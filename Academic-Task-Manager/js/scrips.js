// ententendo os conceitos
const addSubjectButton = document.querySelector("#add-subject-btn") //crio uma variavel chamada addSubjectButton, e selecione no meu documento o elemento que tem a div #add-subject-btn, a partir de agora, esse elemento está dentro da minha variavel
const subjectsContainer =  document.querySelector("#subjects-container") // mesma explicação da linha de cima

addSubjectButton.addEventListener("click", function(){ //agora eu vou adicionar um evento na minha primeira variavel, quando o usuario clicar, vai executar um função que faz o seguinte...
    const card = document.createElement("div") //faz o seguinte, cria um variavel chamada card, e o que vai ter dentro dessa variavel é uma div que estou criando no html, que no primeiro momento não é possível visualizar

    card.innerText = "Nova Disciplina" //agora dentro dessa variavel que está carregando nossa div, eu digo o seguinte, quero adicona o seguinte conteudo dentro dessa div

    subjectsContainer.appendChild(card) //e para mostrar na tela, eu uso o appendChild, agora eu coloco minha variavel subjectsContainer, que é onde vai ficar as disciplinas, e com o appendChild, faço com que o conteudo que esteja dentro da variavel card, apareça dentro da minha section chamada subjectionContainer
})