import { TodoView } from "../todo-list/todo-view.js";
import { getElement, createElement, clearList} from "../utils.js";
export class ProjView{
    constructor(rootElement, model){
    
        // PROJECT CONSTRUCTION
        this.getElement = getElement;
        this.createElement = createElement;
        this.clearList = clearList;
        this.model = model;
        
        this.projDiv = createElement('div', 'proj-div')

        this.app = rootElement;
        
        this.form = this.createElement('form');

        this.projList =  this.createElement('ul', 'proj-list');

        this.title = createElement('h1');
        this.title.textContent = 'Projects';

        this.projTextInput = createElement('input','proj-input');
        this.projTextInput.type = 'text';
        this.projTextInput.placeholder = 'A multi-step task is a project.';

        this.addProjButton = createElement('button', 'add-proj-button');
        this.addProjButton.textContent = 'Add';

        this.form.append(this.projTextInput, this.addProjButton );
        this.projDiv.append(this.title, this.form, this.projList);
        this.app.append(this.projDiv);
    }

// PROJ METHODS
    
    resetInput(){
        this.projTextInput.value = '';
    }

    //TEXTAREA USED BECAUSE CONTENTEDITABLE SPANS WERE HAVING TROUBLE WITH SELECTING THEM UNINTENTIONALLY 
   setTextareaToSavedHeight(savedHeight, textarea, handleSaveHeight){
    if(savedHeight){
        textarea.style.height = savedHeight;
    } else {
        window.requestAnimationFrame(() => {
            textarea.style.height = (textarea.scrollHeight-8) + 'px'; 
            handleSaveHeight(textarea.id, textarea.style.height);
        });
    }
}

    resizeToScrollHeight(textarea, handleSaveHeight) {
        textarea.style.height = 'auto'; 
        textarea.style.height = (textarea.scrollHeight-8) + 'px'; 
        handleSaveHeight(textarea.id, textarea.style.height);
    }

   listenForInputThenResize(textarea, handleSaveHeight){
       textarea.addEventListener('input', () => {
         this.resizeToScrollHeight(textarea, handleSaveHeight);
        });
    }

    createProjListItem(proj, handleGetHeight, handleSaveHeight){
        const projListItem = createElement('div', 'proj-list-item')
        projListItem.id = proj.id

        const projListItemTextarea = createElement('textarea', ['editable', 'proj-list-item-text']);
        projListItemTextarea.value = proj.text;
        projListItemTextarea.id = proj.id;

        this.setTextareaToSavedHeight(handleGetHeight(projListItemTextarea.id), projListItemTextarea, handleSaveHeight);
        this.listenForInputThenResize(projListItemTextarea, handleSaveHeight);


        const strikeThrough = createElement('s', 's')

        const deleteButton = createElement('button', 'proj-delete-button')
        deleteButton.textContent = 'Done'

        const dropDownButton = createElement('button', 'dropdown-button');
        this.toggleDropDownArrow(dropDownButton, proj);


        projListItem.append(strikeThrough, projListItemTextarea, dropDownButton, deleteButton)

        return projListItem;

    }

    toggleDropDownArrow(dropDownButton, proj){
        if(proj.dropDownButtonOn === true){
            dropDownButton.innerHTML = 'Steps <span class="arrow">&uarr;</span>';}
        else{
            dropDownButton.innerHTML = 'Steps <span class="arrow">&darr;</span>';}
    }

    
    createDropDown(proj, handleAddStep){        
        const stepList = createElement('ol','step-list');

        const newStepInput =  createElement('input', 'new-step-input')
        newStepInput.type = 'text';
        newStepInput.placeholder = 'Small + precise = actionable';

        const addNewStepButton = createElement('button', 'add-new-step-button')
        addNewStepButton.textContent = 'Add';

        const stepForm = createElement('form', 'step-form');

        const dropDownDiv = createElement('div', 'dropdown-div');

        newStepInput.append();

        stepForm.append(newStepInput, addNewStepButton);

        dropDownDiv.append(stepForm, stepList);

        this.initializeDropDownDisplay(proj.dropDownButtonOn, dropDownDiv)

        this.addNewStepListener(stepForm, handleAddStep, proj);

        return dropDownDiv;
    }  
    
    createStepItem(handleDeleteStep, step, proj, projArr, handleGetHeight, handleSaveHeight){

        const stepItem = createElement('li', ['step-item']);
        stepItem.id = step.id;
        const stepItemTextarea = createElement('textarea', ['step-item-text','editable']);
        stepItemTextarea.value = step.text;
        stepItemTextarea.id = step.id;

        this.setTextareaToSavedHeight(handleGetHeight(stepItemTextarea.id), stepItemTextarea, handleSaveHeight);
        this.listenForInputThenResize(stepItemTextarea, handleSaveHeight);

        const deleteStepButton = createElement('button', ['delete-step-button', 'delete-button']);
        deleteStepButton.innerText = 'Done';
        this.addDeleteStepListener(deleteStepButton, handleDeleteStep, proj, projArr);

        stepItem.append(stepItemTextarea , deleteStepButton);

        return stepItem;
    }

    addDeleteStepListener(deleteStepButton, handler, proj){
        deleteStepButton.addEventListener('click', event =>{
            if(event.target.classList.contains('delete-step-button')){
            const stepId = (event.target.parentElement.id);
            const projId = (proj.id);
            
            handler(projId, stepId);
            }
        })
    }

    addNewStepListener(element, handler, proj){
        element.addEventListener('submit', (event) =>{
            event.preventDefault();
            const newStepTextInput = event.target.querySelector('.new-step-input');
            const newStepText = newStepTextInput.value;
            handler(proj.id, newStepText);
        })

    }

    initializeDropDownDisplay(dropDownProperty, dropDownDiv){
        if(dropDownProperty === false){
          dropDownDiv.style.display = 'none';
          }
    }

    addDropDownButtonListener(dropDownButton, dropDownDiv, newStepInput, proj, handleUpdateProjectDropDownProperty){
        dropDownButton.addEventListener('click', event => {
        
            if(event.currentTarget.className === 'dropdown-button' && proj.dropDownButtonOn === false ){
                dropDownDiv.style.display = 'flex';
                proj.dropDownButtonOn = true;
                console.log("🚀 ~ file: proj-view.js:181 ~ ProjView ~ addDropDownButtonListener ~ newStepInput:", newStepInput)
                setTimeout(() => newStepInput.focus(), 0);
                handleUpdateProjectDropDownProperty(proj.id, proj.dropDownButtonOn);
            } 
                else if (event.target.className === 'dropdown-button'){
                dropDownDiv.style.display = 'none';
                proj.dropDownButtonOn = false;
                handleUpdateProjectDropDownProperty(proj.id, proj.dropDownButtonOn);

                }
        })
        
    }

    displayProjList({
        projArr,
        handleAddStep,
        handleDeleteStep,
        handleGetHeight,
        handleSaveHeight, 
        handleUpdateProjectDropDownProperty
    }){
    
        clearList(this.projList);

        projArr.forEach(proj => {
            const projListItem = this.createProjListItem(proj, handleGetHeight, handleSaveHeight);
            
            const dropDownDiv = this.createDropDown(proj, handleAddStep);
            const stepList = dropDownDiv.querySelector('.step-list');
            
            if(proj.stepArr){
                
                proj.stepArr.map((step) => {
                    const stepItem = this.createStepItem(handleDeleteStep, step, proj, projArr, handleGetHeight, handleSaveHeight);
                    stepList.append(stepItem);
                })
                
                const dropDownButton = projListItem.querySelector('.dropdown-button');
                
                const stepForm = dropDownDiv.querySelector('.step-form');

                const newStepInput = stepForm.querySelector('.new-step-input');

                this.addDropDownButtonListener(dropDownButton, dropDownDiv, newStepInput, proj, handleUpdateProjectDropDownProperty)
                
                dropDownDiv.append(stepList);
            }
            this.projList.append(projListItem, dropDownDiv);
        })
    }
           
     get _projText(){
        const _projText = this.projTextInput.value
        return _projText
    }
    
    // PROJ BINDING AND LISTENERS   
    addNewProjectListener(handler){
        this.form.addEventListener('submit', event =>{
            event.preventDefault()
            if(this._projText){
                handler(this._projText)
                this.resetInput()
            }
        })
    }
    
    bindDeleteProject(handler){
        this.projList.addEventListener('click', event =>{
            if(event.target.className === 'proj-delete-button'){
                const id = event.target.parentElement.id
                handler(id)
            }
        })
    }

    bindToggleComplete(handler){
        this.projList.addEventListener('change', event =>{
            if(event.target.type === 'checkbox'){
                const id = event.target.parentElement.id
                handler(id)
            }
        })
    }



}

