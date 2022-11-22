class db{
    constructor(tarefa, id){
        this.id = id;
        this.tarefa = tarefa
    }

    getId(){
        let tarefas = localStorage.getItem('IDs')
        if(tarefas == null){
            this.setNewId()
            return localStorage.getItem('IDs')
        }else{
            return tarefas
        }
    }
    
    getTarefas(){
        return localStorage.getItem('tarefas')
    }

    setNewId(){
        return localStorage.setItem('IDs', [0])
    }
    
    setNewTarefa(id){
        let arr = [this.getId()]
        let arrTarefas = ''
        arr.push(id)
        localStorage.setItem('IDs', arr)
        let tarefas = this.getTarefas()

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
        let tarefas = JSON.parse(this.getTarefas())
        tarefas.forEach(x => {
            if(x.id == id){
                x.tarefa = tarefa
            }
        })
        localStorage.setItem('tarefas', JSON.stringify(tarefas))
    }

    deleteTarefa(id){
        let idCont = this.getId()
        let tarefas = JSON.parse(this.getTarefas())
        let novoIds = idCont.replace(`${id},`, '')
        localStorage.setItem('IDs', novoIds)
        let novo = tarefas.filter(i => i.id != id)
        localStorage.setItem('tarefas', JSON.stringify(novo))
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    let logo = document.querySelector('h1')
    let btnTarefa = document.querySelector('input[type="text"]')
    let btnAdd = document.querySelector('button[type="submit"]')
    let consultaMenu = document.querySelector('#consulta')
    let cadastroMenu = document.querySelector('#cadastro')
    let cadastroDiv = document.querySelector('#cadastroDiv')
    let aviso = document.querySelector('.aviso')
    
    consultaMenu.addEventListener('click', function(){
        cadastroDiv.style.marginLeft = '-101%'
        this.classList.toggle('text-bold')
        cadastroMenu.classList.toggle('text-bold')
        loadTarefas()
    })

    cadastroMenu.addEventListener('click', cadastroMenuA)
    logo.addEventListener('click', cadastroMenuA)

    function cadastroMenuA(){
        cadastroMenu.classList.toggle('text-bold')
        consultaMenu.classList.toggle('text-bold')
        cadastroDiv.style.marginLeft = 0
    }

    let tarefa1 = new db()
    let id = tarefa1.getId().length
    btnAdd.setAttribute('id', ++id)

    btnAdd.addEventListener('click', function(e){
        e.preventDefault()
        let newTarefa = new db()
        if(btnTarefa.value != ''){
            newTarefa.id = parseInt(btnAdd.getAttribute('id'))
            newTarefa.tarefa = btnTarefa.value
            newTarefa.setNewTarefa(newTarefa.id)
            btnAdd.setAttribute('id', ++id)
            aviso.innerHTML = "Tarefa cadastrada com sucesso"
            aviso.className = "aviso aviso-success"
            setTimeout(() => aviso.className = "aviso" ,3000)
            btnTarefa.value = ''
        }else{
            aviso.innerHTML = "Digite o nome da terefa"
            aviso.className = "aviso aviso-error"
            setTimeout(() => aviso.className = "aviso" ,3000)
        }
    })

    function loadTarefas(){
        tarefas = JSON.parse(tarefa1.getTarefas())
        let listaTarefas = document.querySelector('.listaTarefas')
        while(listaTarefas.firstChild){
            listaTarefas.removeChild(listaTarefas.firstChild)
        }
        if(tarefas != null || tarefas != undefined){
            tarefas.forEach(tarefa => {
                listaTarefas.innerHTML += `<li><input type="text" disabled class="nomeTarefa" value="${tarefa.tarefa}">
                <span class='tarefasItems tarefa' id="${tarefa.id}" data-action="update"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"/></svg></span>
                <span class='tarefasItems tarefa d-none' id="${tarefa.id}" data-action="save"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg></span>
                <span class='tarefasItems tarefa' id="${tarefa.id}" data-action="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/></svg></span></li>`
            });
            let tarefasItems = document.querySelectorAll('.tarefasItems')
            tarefasItems.forEach(x => {
                x.addEventListener('click', function(e){
                    let id = x.getAttribute('id')
                    let tarefas = JSON.parse(tarefa1.getTarefas())
                    for(let i of tarefas){
                        if(i.id == id && x.getAttribute('data-action') == 'delete'){
                            tarefa1.deleteTarefa(i.id)
                            x.parentElement.remove()
                            aviso.innerHTML = "Tarefa excluida com sucesso"
                            aviso.className = "aviso aviso-success"
                            setTimeout(() => aviso.className = "aviso" ,3000)
                            loadTarefas()
                        }
                        if(i.id == id && x.getAttribute('data-action') == 'update'){
                            x.previousElementSibling.removeAttribute('disabled')
                            x.previousElementSibling.focus()
                            x.nextElementSibling.classList.toggle('d-none')
                            x.classList.toggle('d-none')
                        }
                        if(i.id == id && x.getAttribute('data-action') == 'save'){
                            let input = x.parentElement.querySelector('input')
                            if(input != ''){
                                input.setAttribute('disabled', 'disabled')
                                x.previousElementSibling.classList.toggle('d-none')
                                x.classList.toggle('d-none')
                                tarefa1.updateTarefa(id, input.value)
                                aviso.innerHTML = "Tarefa alterada com sucesso"
                                aviso.className = "aviso aviso-success"
                                setTimeout(() => aviso.className = "aviso" ,3000)
                                loadTarefas()
                            }else{
                                aviso.innerHTML = "Digite o nome da terefa"
                                aviso.className = "aviso aviso-error"
                                setTimeout(() => aviso.className = "aviso" ,3000)
                            }
                        }
                    }
                })
            })
        }else{
            aviso.innerHTML = "Nenhuma tarefa encontrada"
            aviso.className = "aviso aviso-error"
            setTimeout(() => aviso.className = "aviso" ,5000)
        }
    }
})