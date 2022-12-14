class db{
    constructor(tarefa, id){
        this.id = id;
        this.tarefa = tarefa
    }

    get ids(){
        let tarefas = localStorage.getItem('IDs')
        if(tarefas == null){
            this.newId
            return localStorage.getItem('IDs')
        }else{
            return tarefas
        }
    }
    
    get tarefas(){
        return localStorage.getItem('tarefas')
    }

    get newId(){
        return localStorage.setItem('IDs', [0])
    }
    
    set setTarefa(id){
        let arr = [this.ids]
        let arrTarefas = ''
        arr.push(id)
        localStorage.setItem('IDs', arr)
        let tarefas = this.tarefas

        if(tarefas == null){
            arrTarefas = [{id: this.id, tarefa: this.tarefa}]
            arrTarefas = JSON.stringify(arrTarefas)
            localStorage.setItem('tarefas', arrTarefas)
        }else{
            let x = JSON.parse(tarefas)
            x.push({id: this.id, tarefa: this.tarefa})
            arrTarefas = JSON.stringify(x)
            localStorage.setItem('tarefas', arrTarefas)
        }
    }

    updateTarefa(id, tarefa){
        let tarefas = JSON.parse(this.tarefas)
        tarefas.forEach(x => {
            if(x.id == id){
                x.tarefa = tarefa
            }
        })
        localStorage.setItem('tarefas', JSON.stringify(tarefas))
    }

    deleteTarefa(id){
        let idCont = this.ids
        let tarefas = JSON.parse(this.tarefas)
        let novoIds = idCont.replace(`${id},`, '')
        localStorage.setItem('IDs', novoIds)
        let novo = tarefas.filter(i => i.id != id)
        localStorage.setItem('tarefas', JSON.stringify(novo))
    }
}


let logo = document.querySelector('h1')
let btnTarefa = document.querySelector('input[type="text"]')
let btnAdd = document.querySelector('button[type="submit"]')
let consultaMenu = document.querySelector('#consulta')
let cadastroMenu = document.querySelector('#cadastro')
let cadastroDiv = document.querySelector('#cadastroDiv')
const aviso = document.querySelector('.aviso')

consultaMenu.addEventListener('click', function(){
    cadastroDiv.style.marginLeft = '-101%'
    this.classList.toggle('text-bold')
    cadastroMenu.classList.toggle('text-bold')
    aviso.className = 'aviso'
    loadTarefas()
})

cadastroMenu.addEventListener('click', cadastroMenuA)
logo.addEventListener('click', cadastroMenuA)

function cadastroMenuA(){
    cadastroMenu.classList.toggle('text-bold')
    consultaMenu.classList.toggle('text-bold')
    cadastroDiv.style.marginLeft = 0
    aviso.className = 'aviso'
}

let newInstTarefa = new db()
let id = newInstTarefa.ids.length
btnAdd.setAttribute('id', ++id)

btnAdd.addEventListener('click', function(e){
    e.preventDefault()
    let instTarefa = new db()
    if(btnTarefa.value != ''){
        instTarefa.id = parseInt(btnAdd.getAttribute('id'))
        instTarefa.tarefa = btnTarefa.value
        instTarefa.setTarefa = instTarefa.id
        btnAdd.setAttribute('id', ++id)
        showNotification("Tarefa cadastrada com sucesso", "aviso-success")
        btnTarefa.value = ''
    }else{
        showNotification("Digite o nome da terefa", "aviso-error")
    }
})

function loadTarefas(){
    tarefas = JSON.parse(newInstTarefa.tarefas)
    let listaTarefas = document.querySelector('.listaTarefas')
    resetRenderTarefas(listaTarefas)
    if(!!tarefas){
        tarefas.forEach(tarefaDB => renderTarefas(listaTarefas, tarefaDB));
        let tarefasItems = document.querySelectorAll('.tarefasItems')
        tarefasItems.forEach(tarefaEl => btnsConsulta(tarefaEl))
    }else{
        showNotification("Nenhuma tarefa encontrada", "aviso-error")
    }
}

function resetRenderTarefas(listaTarefas){
    while(listaTarefas.firstChild){
        listaTarefas.removeChild(listaTarefas.firstChild)
    }
}

function btnsConsulta(tarefaEl){ 
    tarefaEl.addEventListener('click', ()=>{
        let id = tarefaEl.getAttribute('id')
        let tarefas = JSON.parse(newInstTarefa.tarefas)
        for(let tarefa of tarefas){
            if(tarefa.id == id && tarefaEl.getAttribute('data-action') == 'delete'){
                btnDelete(newInstTarefa, tarefaEl, tarefa.id)
            }
            if(tarefa.id == id && tarefaEl.getAttribute('data-action') == 'update'){
                btnUpdate(tarefaEl)
            }
            if(tarefa.id == id && tarefaEl.getAttribute('data-action') == 'save'){
                btnSave(newInstTarefa, tarefaEl, id) 
            }
        }
    })
}

function btnDelete(newInstTarefa, tarefaEl, tarefaId){
    newInstTarefa.deleteTarefa(tarefaId)
    tarefaEl.parentElement.remove()
    showNotification("Tarefa excluida com sucesso", "aviso-success")
    loadTarefas()
}

function btnUpdate(tarefaEl){
    tarefaEl.previousElementSibling.removeAttribute('disabled')
    tarefaEl.previousElementSibling.focus()
    tarefaEl.nextElementSibling.classList.toggle('d-none')
    tarefaEl.classList.toggle('d-none')
}

function btnSave(newInstTarefa, tarefaEl, id){
    let input = tarefaEl.parentElement.querySelector('input')
    if(input != ''){
        input.setAttribute('disabled', 'disabled')
        tarefaEl.previousElementSibling.classList.toggle('d-none')
        tarefaEl.classList.toggle('d-none')
        newInstTarefa.updateTarefa(id, input.value)
        showNotification("Tarefa alterada com sucesso", "aviso-success")
        loadTarefas()
    }else{
        showNotification("Digite o nome da terefa", "aviso-error")
    }
}

function showNotification(text, classe){
    aviso.innerHTML = text
    aviso.className = `aviso ${classe}`
    setTimeout(() => aviso.className = "aviso", 3000)
}

function renderTarefas(listaTarefas, tarefa){
    listaTarefas.innerHTML += `<li><input type="text" disabled class="nomeTarefa" value="${tarefa.tarefa}">
    <span class='tarefasItems tarefa' id="${tarefa.id}" data-action="update"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg></span>
    <span class='tarefasItems tarefa d-none' id="${tarefa.id}" data-action="save"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg></span>
    <span class='tarefasItems tarefa' id="${tarefa.id}" data-action="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg></span></li>`
}

