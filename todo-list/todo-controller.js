export class TodoController{
    constructor(model, view){
        this.model = model;
        this.view = view;
    }

    todoChanged = (todo) =>{
        view.displayTodoList(todo)
    }

    handleAddTodo = (todoText) =>{
        this.model.addTodo(todoText)
    }

    handleDeleteTodo = (id) =>{
        this.model.deleteTodo(id)
    }

    handleToggleComplete = (id) =>{
        this.model.toggleComplete(id)
    }

    handleEditTodo = (id, editText)=>{
        this.model.editTodo(id, editText)
    }

}