function renderSubjects() {
    const grid = document.getElementById(`subjectsGrid`)
        subjects.forEach(function(subject){ 
            const card = `
            <div class="subject-card">
                <div class="subject-header">
                    <div class="subject-name">${subject.name}</div>
                </div>
            </div>`
            grid.innerHTML += card
        })
}

renderSubjects()