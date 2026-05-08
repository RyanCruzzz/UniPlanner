function renderSubjects() {
    const grid = document.getElementById('subjectsGrid')
    grid.innerHTML = ''

    subjects.forEach(function(subject) {
        const subjectTasks = tasks.filter(function(task) {
            return task.subjectId === subject.id
        })

        const card = `
            <div class="subject-card" style="--subject-color:${subject.color}">
                <div class="subject-header">
                    <div class="subject-name">
                        ${subject.name}
                        <span class="task-counter">${subjectTasks.length}/10</span>
                    </div>
                    <button class="btn-icon" onclick="removeSubject('${subject.id}')">✕</button>
                </div>
                <div class="tasks-list">
                    ${subjectTasks.map(function(task) {
                        return renderTask(task)
                    }).join('')}
                </div>
                <button class="add-task-btn" onclick="openTaskModal('${subject.id}')">
                    + Adicionar tarefa
                </button>
            </div>`

        grid.innerHTML += card
    })

    grid.innerHTML += `
        <div class="add-subject-card" onclick="openSubjectModal()">
            + Nova Disciplina
        </div>`
}

function renderTask(task) {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const deadline = new Date(task.deadline)
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    const isOverdue = diffDays < 0

    let progressHtml = ''
    let deadlineHtml = ''

    if (isOverdue) {
        deadlineHtml = `<span class="overdue-msg">⚠ Prazo esgotado</span>`
    } else {
        const total = 14
        const pct = Math.max(0, Math.min(100, Math.round((diffDays / total) * 100)))
        const barColor = diffDays <= 2 ? '#f05454' : diffDays <= 5 ? '#f5a623' : 'var(--accent)'
        progressHtml = `
            <div class="progress-wrap">
                <div class="progress-fill" style="width:${pct}%; background:${barColor}"></div>
            </div>`
        const label = diffDays === 0 ? 'Hoje!' : diffDays === 1 ? 'Amanhã' : `${diffDays}d`
        const cls = diffDays <= 3 ? 'soon' : ''
        deadlineHtml = `<span class="task-deadline ${cls}">📅 ${label}</span>`
    }

    return `
        <div class="task-item${isOverdue ? ' overdue' : ''}" id="task-${task.id}">
            <div class="task-top">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    <button class="task-edit-btn" onclick="openEditTaskModal('${task.id}')">✎</button>
                    <button class="task-check" onclick="completeTask('${task.id}')">✓</button>
                </div>
            </div>
            ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
            <div class="task-footer">
                ${deadlineHtml}
                ${progressHtml}
            </div>
        </div>`
}

function renderCompleted() {
    const grid = document.getElementById('completedGrid')
    grid.innerHTML = ''

    if (completedTasks.length === 0) {
        grid.innerHTML = '<div class="empty-state">Nenhuma tarefa concluída ainda.</div>'
        return
    }

    completedTasks.forEach(function(task) {
        const card = `
            <div class="completed-task">
                <div class="completed-info">
                    <div class="completed-title">${task.title}</div>
                    <div class="completed-subject">${task.subjectName}</div>
                </div>
                <button class="completed-remove" onclick="removeCompleted('${task.id}')">✕</button>
            </div>`
        grid.innerHTML += card
    })
}

function render() {
    renderSubjects()
    renderCompleted()
}

function showToast(message) {
    const toast = document.getElementById('toast')
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(function() {
        toast.classList.remove('show')
    }, 2500)
}

function checkWelcome() {
    const visited = localStorage.getItem('visited')
    if (!visited) {
        document.getElementById('welcomeBanner').style.display = 'block'
    }
}

function closeWelcome() {
    document.getElementById('welcomeBanner').style.display = 'none'
    localStorage.setItem('visited', 'true')
}

function openSubjectModal() {
    buildColorPicker()
    document.getElementById('subjectName').value = ''
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalSubject').classList.add('active')
}

function saveSubject() {
    const name = document.getElementById('subjectName').value.trim()
    if (name === '') return

    subjects.push({
        id: 's' + Date.now(),
        name: name,
        color: selectedColor
    })

    document.getElementById('subjectName').value = ''
    closeModal()
    render()
    saveData()
    showToast('✓ Disciplina criada!')
}

function removeSubject(id) {
    const confirmed = window.confirm('Tem certeza que deseja remover essa disciplina? Todas as tarefas associadas serão removidas.')
    if (!confirmed) return

    subjects = subjects.filter(function(s) { return s.id !== id })
    tasks = tasks.filter(function(t) { return t.subjectId !== id })
    render()
    saveData()
    showToast('Disciplina removida.')
}

function openTaskModal(subjectId) {
    currentSubjectId = subjectId
    document.getElementById('taskTitle').value = ''
    document.getElementById('taskDesc').value = ''
    document.getElementById('taskDeadline').value = ''
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalTask').classList.add('active')
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim()
    const description = document.getElementById('taskDesc').value.trim()
    const deadline = document.getElementById('taskDeadline').value

    if (title === '' || deadline === '') return

    const subjectTasks = tasks.filter(function(t) { return t.subjectId === currentSubjectId })
    if (subjectTasks.length >= 10) {
        showToast('⚠ Limite de 10 tarefas por disciplina!')
        return
    }

    tasks.push({
        id: 't' + Date.now(),
        title: title,
        description: description,
        subjectId: currentSubjectId,
        deadline: deadline,
        done: false
    })

    document.getElementById('taskTitle').value = ''
    document.getElementById('taskDesc').value = ''
    document.getElementById('taskDeadline').value = ''

    closeModal()
    render()
    saveData()
    showToast('✓ Tarefa criada!')
}

function completeTask(id) {
    const task = tasks.find(function(t) { return t.id === id })
    const subject = subjects.find(function(s) { return s.id === task.subjectId })

    completedTasks.push({ ...task, subjectName: subject ? subject.name : '' })
    tasks = tasks.filter(function(t) { return t.id !== id })

    render()
    saveData()
    showToast('✓ Tarefa concluída!')
}

function removeCompleted(id) {
    completedTasks = completedTasks.filter(function(t) { return t.id !== id })
    renderCompleted()
    saveData()
    showToast('Tarefa removida.')
}

function openEditTaskModal(taskId) {
    const task = tasks.find(function(t) { return t.id === taskId })
    if (!task) return

    currentEditTaskId = taskId
    document.getElementById('editTaskTitle').value = task.title
    document.getElementById('editTaskDesc').value = task.description || ''
    document.getElementById('editTaskDeadline').value = task.deadline
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalEditTask').classList.add('active')
}

function saveEditTask() {
    const title = document.getElementById('editTaskTitle').value.trim()
    const description = document.getElementById('editTaskDesc').value.trim()
    const deadline = document.getElementById('editTaskDeadline').value

    if (title === '' || deadline === '') return

    const idx = tasks.findIndex(function(t) { return t.id === currentEditTaskId })
    if (idx === -1) return

    tasks[idx] = {
        ...tasks[idx],
        title: title,
        description: description,
        deadline: deadline
    }

    currentEditTaskId = null
    closeModal()
    render()
    saveData()
    showToast('✓ Tarefa atualizada!')
}

function buildColorPicker() {
    const colorCircle = document.getElementById('colorPicker')
    colorCircle.innerHTML = ''
    selectedColor = COLORS[0]

    COLORS.forEach(function(color, index) {
        const dot = `<div class="color-dot ${index === 0 ? 'active' : ''}" 
            style="background: ${color}" 
            onclick="selectColor('${color}', this)"></div>`
        colorCircle.innerHTML += dot
    })
}

function selectColor(color, el) {
    selectedColor = color
    document.querySelectorAll('.color-dot').forEach(function(d) {
        d.classList.remove('active')
    })
    el.classList.add('active')
}

function closeModal() {
    document.getElementById('overlay').classList.remove('active')
    document.getElementById('modalSubject').classList.remove('active')
    document.getElementById('modalTask').classList.remove('active')
    document.getElementById('modalEditTask').classList.remove('active')
    currentEditTaskId = null
}

function setDate() {
    const d = new Date()
    const opts = { weekday: 'long', day: 'numeric', month: 'long' }
    document.getElementById('navDate').textContent = d.toLocaleDateString('pt-BR', opts)
}

function saveData() {
    localStorage.setItem('subjects', JSON.stringify(subjects))
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
}

function loadData() {
    const savedSubjects = localStorage.getItem('subjects')
    const savedTasks = localStorage.getItem('tasks')
    const savedCompleted = localStorage.getItem('completedTasks')

    if (savedSubjects) subjects = JSON.parse(savedSubjects)
    if (savedTasks) tasks = JSON.parse(savedTasks)
    if (savedCompleted) completedTasks = JSON.parse(savedCompleted)
}

loadData()
render()
setDate()
checkWelcome()