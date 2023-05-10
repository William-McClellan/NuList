import { createElement, clearList} from "../utils.js";
import { ProjModel } from "../model/proj-model.js";

    
export class TodoView{
    constructor(rootElement ,model){
        this.createElement = createElement;
        this.clearList = clearList;

        this.model = model;
        this.app = rootElement;       

        this.todoDiv = createElement('div','todo-div')

        this.todoList = createElement('ul', 'todo-list');

        this.title = createElement('h1');
        this.title.textContent = 'Next Actions';

        this.form = createElement('form');

        this.todoTextInput = createElement('input','todo-input');
        this.todoTextInput.type = 'text';
        this.todoTextInput.placeholder = 'small + precise = actionable';

        this.submitTodoButton = createElement('button');
        this.submitTodoButton.textContent = 'Add';
        
        this.form.append(this.todoTextInput, this.submitTodoButton );
        this.todoDiv.append( this.title, this.form, this.todoList);
        this.app.append(this.todoDiv);

        this.firstStepList = createElement('ul', 'first-step-list');
    }

    resetInput(){
        this.todoTextInput.value = '';
    }

    createFirstStepItem(handleDeleteFirstStep, step){
      if(step){
      
        const firststepItem = createElement('li', 'first-step-item');
        firststepItem.id = step.id;

        const firststepItemSpan = createElement('span', 'editable', 'first-step-item');
        firststepItemSpan.contentEditable = true;
        firststepItemSpan.textContent = step.text;

        const firststepItemProjText = createElement('span', 'project-text');
        firststepItemProjText.textContent = '# ' + step.projText;
        
        const firststepItemDeleteButton = createElement('button', ['delete-button', 'delete-first-step-button']);
        firststepItemDeleteButton.textContent = 'Done';

        this.addDeleteFirstStepButtonListener( handleDeleteFirstStep, firststepItemDeleteButton, step);

        firststepItem.append(firststepItemSpan, firststepItemProjText, firststepItemDeleteButton);
       
        return firststepItem;
      }
    }
    

    addDeleteFirstStepButtonListener(handleDeleteFirstStep, deleteButton, step){
        deleteButton.addEventListener('click', (e) => {
            if(e.target.classList.contains('delete-first-step-button') && e.target.classList.contains('delete-button')){
                e.preventDefault();
                console.log('Delete first step button clicked');
                console.log(e.target.parentElement)
                const projId = step.projId;
                const stepId = step.id;
                handleDeleteFirstStep(projId, stepId);
            }
        })
    }

    createTodoListPlaceHolder(){
        const todoListPlaceholder = createElement('p')
        todoListPlaceholder.textContent = 'Nothing left to do! Go to proj for more actions.'
        this.todoList.append(todoListPlaceholder)
    }

    createTodoListItem(todo){
        const todoListItem = createElement('li', 'todo-list-item')
        todoListItem.id = todo.id 

        const todoListItemSpan = createElement('span', 'editable');
        todoListItemSpan.contentEditable = true;

        if(todo.complete === true){
            const strikeThrough = createElement('s', 's')
            strikeThrough.textContent = todo.text
            todoListItem.append(strikeThrough)
        }   else {
            todoListItemSpan.textContent = todo.text
            todoListItem.append(todoListItemSpan)
        }

        const deleteButton = createElement('button',['delete-todo-button', 'delete-button'])
        deleteButton.textContent = 'Done'
        todoListItem.append(deleteButton)


        return todoListItem;
    }

    todoArrExistsAndPopulated(todoArr){
        if(todoArr && todoArr.length > 0){
            return true;
        } else {
            return false;
        }
    }

    firstStepArrExistsAndPopulated(firstStepArr){
        if(firstStepArr && firstStepArr.length > 0){
            return true;
        } else {
            return false;
        }
    }

    displayTodoList(handleDeleteFirstStep, todoArr, firstStepArr){

        clearList(this.todoList);
        clearList(this.firstStepList);
        
        if(!this.todoArrExistsAndPopulated(todoArr) && !this.firstStepArrExistsAndPopulated(firstStepArr)){
            this.createTodoListPlaceHolder();
         } else {
                todoArr.forEach(todo => {
                const todoListItem = this.createTodoListItem(todo);
                this.todoList.append(todoListItem)
                })
            if(this.firstStepArrExistsAndPopulated(firstStepArr)){
                firstStepArr.forEach((step) => {
                const firstStepItem = this.createFirstStepItem(handleDeleteFirstStep, step);

                this.firstStepList.append(firstStepItem);
                this.todoList.prepend(this.firstStepList);
            })
        }
        }
    }

    get _todoText(){
        const _todoText = this.todoTextInput.value
        return _todoText
    }
    
    bindAddTodo(handler){
        this.form.addEventListener('submit', event =>{
            event.preventDefault()

            if(this._todoText){
                handler(this._todoText)
                this.resetInput()
            }
        })
    }

    bindDeleteTodo(handler){
        this.todoList.addEventListener('click', event =>{
            if(event.target.className === "delete-todo-button delete-button"){
                const id = event.target.parentElement.id
                handler(id)    
            }
        })
        
    }

    bindToggleComplete(handler){
        this.todoList.addEventListener('change', event =>{
            if(event.target.type === 'checkbox'){
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }
        })
    }

}

