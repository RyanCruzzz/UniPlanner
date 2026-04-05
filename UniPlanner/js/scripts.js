function renderSubjects() {
    const grid = document.getElementById(`subjectsGrid`)
    grid.innerHTML = ''
        subjects.forEach(function(subject){ 
            const subjectTasks = tasks.filter(function(task) {
                return task.subjectId === subject.id
            })
            const card = `
            <div class="subject-card" style="--subject-color:${subject.color}">
                <div class="subject-header">
                    <div class="subject-name">${subject.name}</div>
                </div>
                <div class="tasks-list">
                    ${subjectTasks.map(function(task){
                        return `<div class="task-item">${task.title}</div>`
                    }).join('')}
                </div>
                <button class="add-task-btn" onclick="openTaskModal('${subject.id}')">
                + Adicionar tarefa
                </button>
            </div>`
            grid.innerHTML += card
        })

        grid.innerHTML += `<div class="add-subject-card" onclick="openSubjectModal()">
                                + Nova Disciplina
                             </div>`
        
}

function openSubjectModal() {
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalSubject').classList.add('active')
   
    buildColorPicker()
}

function closeModal() {
    document.getElementById('overlay').classList.remove('active')
    document.getElementById('modalSubject').classList.remove('active')
    document.getElementById('modalTask').classList.remove('active')
}

function saveSubject() {
    const name = document.getElementById('subjectName').value

    if (name === '') {
        return
    }

    const newSubject = {
        id: 's' + Date.now(),
        name: name,
        color: selectedColor
    }

    subjects.push(newSubject)

    document.getElementById('subjectName').value = '' //limpa o input após salvar

    closeModal()
    renderSubjects()
}


function buildColorPicker() {
    const colorCircle = document.getElementById('colorPicker')
    colorCircle.innerHTML = ''
    COLORS.forEach(function(circle) {
        const color = `<div class="color-dot" style="background: ${circle}" onclick="selectColor('${circle}')"></div>`
        colorCircle.innerHTML += color
    })
}

function selectColor(color) {
    selectedColor = color
}

function openTaskModal(subjectId) {
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalTask').classList.add('active')
    currentSubjectId = subjectId
}

function saveTask() {
    const title = document.getElementById('taskTitle').value
    const description = document.getElementById('taskDesc').value
    const deadline = document.getElementById('taskDeadline').value

    if (title === '' || deadline === '') {
        return
    }
    const newTask = {
        id: 't' + Date.now(),
        title: title,
        description: description,
        subjectId: currentSubjectId,
        deadline: deadline,
        done: false
    }

    tasks.push(newTask)

    document.getElementById('taskTitle').value = ''
    document.getElementById('taskDesc').value = ''
    document.getElementById('taskDeadline').value = ''
    
    closeModal()
    renderSubjects()
}



renderSubjects()

