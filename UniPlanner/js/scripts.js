// ===== ESTADO =====
let filterStatus = 'all'
let searchQuery = ''
let confirmCallback = null

// ===== LOADING =====
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loadingScreen').style.opacity = '0'
        setTimeout(function() {
            document.getElementById('loadingScreen').style.display = 'none'
            initApp()
        }, 400)
    }, 1200)
})

function initApp() {
    const user = localStorage.getItem('currentUser')
    if (user) {
        showApp(user)
    } else {
        document.getElementById('loginScreen').style.display = 'flex'
    }
}

// ===== LOGIN =====
function showLogin() {
    document.getElementById('loginForm').style.display = 'block'
    document.getElementById('registerForm').style.display = 'none'
    document.getElementById('loginError').textContent = ''
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none'
    document.getElementById('registerForm').style.display = 'block'
    document.getElementById('registerError').textContent = ''
}

function doLogin() {
    const ra = document.getElementById('loginRA').value.trim()
    const password = document.getElementById('loginPassword').value
    if (!ra || !password) {
        document.getElementById('loginError').textContent = 'Preencha todos os campos.'
        return
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    if (!users[ra]) {
        document.getElementById('loginError').textContent = 'RA não encontrado.'
        return
    }
    if (users[ra] !== password) {
        document.getElementById('loginError').textContent = 'Senha incorreta.'
        return
    }
    localStorage.setItem('currentUser', ra)
    document.getElementById('loginScreen').style.display = 'none'
    showApp(ra)
}

function doRegister() {
    const ra = document.getElementById('registerRA').value.trim()
    const password = document.getElementById('registerPassword').value
    if (!ra || !password) {
        document.getElementById('registerError').textContent = 'Preencha todos os campos.'
        return
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    if (users[ra]) {
        document.getElementById('registerError').textContent = 'RA já cadastrado.'
        return
    }
    users[ra] = password
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', ra)
    document.getElementById('loginScreen').style.display = 'none'
    showApp(ra)
    showToast('✓ Conta criada com sucesso!')
}

function showApp(ra) {
    document.getElementById('appScreen').style.display = 'block'
    document.getElementById('userGreeting').textContent = 'Olá, RA ' + ra + ' — bom estudo!'
    loadData()
    applyTheme()
    render()
    setDate()
    checkWelcome()
}

function doLogout() {
    showConfirm('Sair do sistema', 'Tem certeza que deseja sair?', function() {
        localStorage.removeItem('currentUser')
        subjects = []
        tasks = []
        completedTasks = []
        document.getElementById('appScreen').style.display = 'none'
        document.getElementById('loginScreen').style.display = 'flex'
        document.getElementById('loginRA').value = ''
        document.getElementById('loginPassword').value = ''
        showLogin()
    })
}

// ===== TEMA =====
function toggleTheme() {
    const html = document.documentElement
    const current = html.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    document.getElementById('themeToggle').textContent = next === 'dark' ? '🌙' : '☀️'
}

function applyTheme() {
    const saved = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
    document.getElementById('themeToggle').textContent = saved === 'dark' ? '🌙' : '☀️'
}

// ===== CONFIRMAÇÃO CUSTOMIZADA =====
function showConfirm(title, msg, callback) {
    confirmCallback = callback
    document.getElementById('confirmTitle').textContent = title
    document.getElementById('confirmMsg').textContent = msg
    document.getElementById('confirmModal').classList.add('active')
    document.getElementById('confirmOverlay').classList.add('active')
}

function confirmOk() {
    var cb = confirmCallback
    cancelConfirm()
    if (cb) cb()
}

function cancelConfirm() {
    document.getElementById('confirmModal').classList.remove('active')
    document.getElementById('confirmOverlay').classList.remove('active')
    confirmCallback = null
}

// ===== RENDERIZAÇÃO =====
function renderSubjects() {
    const grid = document.getElementById('subjectsGrid')
    grid.innerHTML = ''
    const now = new Date(); now.setHours(0,0,0,0)

    let sortedSubjects = [...subjects]
    if (filterStatus === 'name') {
        sortedSubjects.sort(function(a, b) { return a.name.localeCompare(b.name) })
    }

    sortedSubjects.forEach(function(subject) {
        const subjectTasks = tasks.filter(function(task) { return task.subjectId === subject.id })
        let filteredTasks = subjectTasks

        if (searchQuery !== '') {
            filteredTasks = filteredTasks.filter(function(task) {
                return task.title.toLowerCase().includes(searchQuery.toLowerCase())
            })
        }

        if (filterStatus === 'pending') {
            filteredTasks = filteredTasks.filter(function(task) { return new Date(task.deadline) >= now })
        } else if (filterStatus === 'overdue') {
            filteredTasks = filteredTasks.filter(function(task) { return new Date(task.deadline) < now })
        }

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
                    ${filteredTasks.length === 0
                        ? '<div class="empty-state">Nenhuma tarefa encontrada.</div>'
                        : filteredTasks.map(function(task) { return renderTask(task) }).join('')}
                </div>
                <button class="add-task-btn" onclick="openTaskModal('${subject.id}')">+ Adicionar tarefa</button>
            </div>`
        grid.innerHTML += card
    })

    grid.innerHTML += `<div class="add-subject-card" onclick="openSubjectModal()">+ Nova Disciplina</div>`
}

function renderTask(task) {
    const now = new Date(); now.setHours(0,0,0,0)
    const deadline = new Date(task.deadline)
    const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
    const isOverdue = diffDays < 0

    const priorityMap = { high: '🔴', medium: '🟡', low: '🟢' }
    const priorityIcon = priorityMap[task.priority || 'medium']

    let progressHtml = ''
    let deadlineHtml = ''

    if (isOverdue) {
        deadlineHtml = `<span class="overdue-msg">⚠ Prazo esgotado</span>`
    } else {
        const total = 14
        const pct = Math.max(0, Math.min(100, Math.round((diffDays / total) * 100)))
        const barColor = diffDays <= 2 ? '#f05454' : diffDays <= 5 ? '#f5a623' : 'var(--accent)'
        progressHtml = `<div class="progress-wrap"><div class="progress-fill" style="width:${pct}%;background:${barColor}"></div></div>`
        const label = diffDays === 0 ? 'Hoje!' : diffDays === 1 ? 'Amanhã' : `${diffDays}d`
        deadlineHtml = `<span class="task-deadline ${diffDays <= 3 ? 'soon' : ''}">📅 ${label}</span>`
    }

    const tagsHtml = task.tags && task.tags.length > 0
        ? `<div class="task-tags">${task.tags.map(t => `<span class="task-tag">${t}</span>`).join('')}</div>`
        : ''

    const manualProgress = task.progress !== undefined
        ? `<div class="manual-progress-wrap"><div class="manual-progress-fill" style="width:${task.progress}%"></div></div><span class="manual-progress-label">${task.progress}%</span>`
        : ''

    return `
        <div class="task-item${isOverdue ? ' overdue' : ''}" id="task-${task.id}">
            <div class="task-top">
                <div class="task-title">${priorityIcon} ${task.title}</div>
                <div class="task-actions">
                    <button class="task-edit-btn" onclick="openEditTaskModal('${task.id}')">✎</button>
                    <button class="task-check" onclick="completeTask('${task.id}')">✓</button>
                </div>
            </div>
            ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
            ${tagsHtml}
            ${manualProgress}
            <div class="task-footer">${deadlineHtml}${progressHtml}</div>
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
        grid.innerHTML += `
            <div class="completed-task">
                <div class="completed-info">
                    <div class="completed-title">${task.title}</div>
                    <div class="completed-subject">${task.subjectName}</div>
                </div>
                <button class="completed-remove" onclick="removeCompleted('${task.id}')">✕</button>
            </div>`
    })
}

function renderStatsBar() {
    const now = new Date(); now.setHours(0,0,0,0)
    const overdue = tasks.filter(function(t) { return new Date(t.deadline) < now }).length
    const pending = tasks.filter(function(t) { return new Date(t.deadline) >= now }).length
    document.getElementById('statsBar').innerHTML = `
        <div class="stat-chip"><span class="stat-dot" style="background:#6fb8fc"></span><strong>${tasks.length}</strong> tarefas</div>
        <div class="stat-chip"><span class="stat-dot" style="background:#3ecf8e"></span><strong>${pending}</strong> pendentes</div>
        <div class="stat-chip"><span class="stat-dot" style="background:#f05454"></span><strong>${overdue}</strong> atrasadas</div>
        <div class="stat-chip"><span class="stat-dot" style="background:#7c6ffc"></span><strong>${completedTasks.length}</strong> concluídas</div>`
    const title = overdue > 0 ? `(${overdue} atrasadas) UniPlanner` : 'UniPlanner'
    document.title = title
}

function render() { renderSubjects(); renderCompleted(); renderStatsBar() }

// ===== FILTROS =====
function setFilter(status) {
    filterStatus = status
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active') })
    document.getElementById('filter-' + status).classList.add('active')
    render()
}

function sortByName() {
    filterStatus = 'name'
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active') })
    document.getElementById('filter-name').classList.add('active')
    render()
}

function setSearch(value) { searchQuery = value; render() }

// ===== TOAST =====
function showToast(message) {
    const toast = document.getElementById('toast')
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(function() { toast.classList.remove('show') }, 2500)
}

// ===== BOAS VINDAS =====
function checkWelcome() {
    if (!localStorage.getItem('visited')) {
        document.getElementById('welcomeBanner').style.display = 'block'
    }
}

function closeWelcome() {
    document.getElementById('welcomeBanner').style.display = 'none'
    localStorage.setItem('visited', 'true')
}

// ===== DISCIPLINAS =====
function openSubjectModal() {
    buildColorPicker()
    document.getElementById('subjectName').value = ''
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalSubject').classList.add('active')
}

function saveSubject() {
    const name = document.getElementById('subjectName').value.trim()
    if (!name) return
    subjects.push({ id: 's' + Date.now(), name, color: selectedColor })
    document.getElementById('subjectName').value = ''
    closeModal(); render(); saveData()
    showToast('✓ Disciplina criada!')
}

function removeSubject(id) {
    showConfirm('Remover disciplina', 'Todas as tarefas associadas serão removidas.', function() {
        subjects = subjects.filter(function(s) { return s.id !== id })
        tasks = tasks.filter(function(t) { return t.subjectId !== id })
        render(); saveData()
        showToast('Disciplina removida.')
    })
}

// ===== TAREFAS =====
function openTaskModal(subjectId) {
    currentSubjectId = subjectId
    document.getElementById('taskTitle').value = ''
    document.getElementById('taskDesc').value = ''
    document.getElementById('taskDeadline').value = ''
    document.getElementById('taskPriority').value = 'medium'
    document.querySelectorAll('#taskTagsPicker input').forEach(function(cb){cb.checked=false})
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalTask').classList.add('active')
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim()
    const description = document.getElementById('taskDesc').value.trim()
    const deadline = document.getElementById('taskDeadline').value
    const priority = document.getElementById('taskPriority').value
    if (!title || !deadline) return
    const subjectTasks = tasks.filter(function(t) { return t.subjectId === currentSubjectId })
    if (subjectTasks.length >= 10) { showToast('⚠ Limite de 10 tarefas!'); return }
    const tags = Array.from(document.querySelectorAll('#taskTagsPicker input:checked')).map(function(cb){return cb.value})
    tasks.push({ id: 't' + Date.now(), title, description, subjectId: currentSubjectId, deadline, priority, done: false, progress: 0, tags: tags })
    document.getElementById('taskTitle').value = ''
    document.getElementById('taskDesc').value = ''
    document.getElementById('taskDeadline').value = ''
    closeModal(); render(); saveData()
    showToast('✓ Tarefa criada!')
}

function completeTask(id) {
    const task = tasks.find(function(t) { return t.id === id })
    const subject = subjects.find(function(s) { return s.id === task.subjectId })
    completedTasks.push({ ...task, subjectName: subject ? subject.name : '' })
    tasks = tasks.filter(function(t) { return t.id !== id })
    render(); saveData()
    showToast('✓ Tarefa concluída!')
}

function removeCompleted(id) {
    completedTasks = completedTasks.filter(function(t) { return t.id !== id })
    renderCompleted(); saveData()
    showToast('Tarefa removida.')
}

// ===== EDITAR TAREFA =====
function openEditTaskModal(taskId) {
    const task = tasks.find(function(t) { return t.id === taskId })
    if (!task) return
    currentEditTaskId = taskId
    document.getElementById('editTaskTitle').value = task.title
    document.getElementById('editTaskDesc').value = task.description || ''
    document.getElementById('editTaskDeadline').value = task.deadline
    document.getElementById('editTaskPriority').value = task.priority || 'medium'
    const progress = task.progress || 0
    document.getElementById('editTaskProgress').value = progress
    document.getElementById('progressLabel').textContent = progress + '%'
    const checkboxes = document.querySelectorAll('#tagsPicker input[type=checkbox]')
    checkboxes.forEach(function(cb) { cb.checked = task.tags && task.tags.includes(cb.value) })
    document.getElementById('overlay').classList.add('active')
    document.getElementById('modalEditTask').classList.add('active')
}

function updateProgressLabel(value) {
    document.getElementById('progressLabel').textContent = value + '%'
}

function saveEditTask() {
    const title = document.getElementById('editTaskTitle').value.trim()
    const description = document.getElementById('editTaskDesc').value.trim()
    const deadline = document.getElementById('editTaskDeadline').value
    const priority = document.getElementById('editTaskPriority').value
    const progress = parseInt(document.getElementById('editTaskProgress').value)
    const tags = Array.from(document.querySelectorAll('#tagsPicker input:checked')).map(function(cb) { return cb.value })
    if (!title || !deadline) return
    const idx = tasks.findIndex(function(t) { return t.id === currentEditTaskId })
    if (idx === -1) return
    tasks[idx] = { ...tasks[idx], title, description, deadline, priority, progress, tags }
    currentEditTaskId = null
    closeModal(); render(); saveData()
    showToast('✓ Tarefa atualizada!')
}

// ===== COLOR PICKER =====
function buildColorPicker() {
    const colorCircle = document.getElementById('colorPicker')
    colorCircle.innerHTML = ''
    selectedColor = COLORS[0]
    COLORS.forEach(function(color, index) {
        colorCircle.innerHTML += `<div class="color-dot ${index === 0 ? 'active' : ''}" style="background:${color}" onclick="selectColor('${color}',this)"></div>`
    })
}

function selectColor(color, el) {
    selectedColor = color
    document.querySelectorAll('.color-dot').forEach(function(d) { d.classList.remove('active') })
    el.classList.add('active')
}

// ===== MODAL =====
function closeModal() {
    document.getElementById('overlay').classList.remove('active')
    ;['modalSubject','modalTask','modalEditTask'].forEach(function(id) {
        document.getElementById(id).classList.remove('active')
    })
    currentEditTaskId = null
}

// ===== DATA =====
function setDate() {
    const d = new Date()
    document.getElementById('navDate').textContent = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ===== LOCALSTORAGE =====
function saveData() {
    const user = localStorage.getItem('currentUser')
    if (!user) return
    localStorage.setItem('subjects_' + user, JSON.stringify(subjects))
    localStorage.setItem('tasks_' + user, JSON.stringify(tasks))
    localStorage.setItem('completedTasks_' + user, JSON.stringify(completedTasks))
}

function loadData() {
    const user = localStorage.getItem('currentUser')
    if (!user) return
    const s = localStorage.getItem('subjects_' + user)
    const t = localStorage.getItem('tasks_' + user)
    const c = localStorage.getItem('completedTasks_' + user)
    if (s) subjects = JSON.parse(s)
    if (t) tasks = JSON.parse(t)
    if (c) completedTasks = JSON.parse(c)
}