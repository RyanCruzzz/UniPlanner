function renderSubjects() {
    const grid = document.getElementById(`subjectsGrid`)
    grid.innerHTML = ''
        subjects.forEach(function(subject){ 
            const card = `
            <div class="subject-card">
                <div class="subject-header">
                    <div class="subject-name">${subject.name}</div>
                </div>
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
}

function closeModal() {
    document.getElementById('overlay').classList.remove('active')
    document.getElementById('modalSubject').classList.remove('active')
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



renderSubjects()

