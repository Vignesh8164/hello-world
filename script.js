class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.taskCount = document.getElementById('taskCount');
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        // Initial render
        this.renderTodos();
        this.updateTaskCount();
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (text === '') {
            this.showMessage('Please enter a task!');
            return;
        }
        
        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo); // Add to beginning of array
        this.saveTodos();
        this.renderTodos();
        this.updateTaskCount();
        this.todoInput.value = '';
        this.todoInput.focus();
    }
    
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveTodos();
            this.renderTodos();
            this.updateTaskCount();
        }
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
            this.updateTaskCount();
        }
    }
    
    renderTodos() {
        if (this.todos.length === 0) {
            this.todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
            return;
        }
        
        this.todoList.innerHTML = this.todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" 
                       class="todo-checkbox" 
                       ${todo.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTodo(${todo.id})">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">Delete</button>
            </li>
        `).join('');
    }
    
    updateTaskCount() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        if (total === 0) {
            this.taskCount.textContent = 'No tasks';
        } else if (total === 1) {
            this.taskCount.textContent = `1 task (${completed} completed, ${pending} pending)`;
        } else {
            this.taskCount.textContent = `${total} tasks (${completed} completed, ${pending} pending)`;
        }
    }
    
    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Failed to save todos:', error);
            this.showMessage('Failed to save tasks. Please check your browser settings.');
        }
    }
    
    loadTodos() {
        try {
            const stored = localStorage.getItem('todos');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load todos:', error);
            return [];
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showMessage(message) {
        // Simple alert for now - could be enhanced with custom modal
        alert(message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Handle browser back/forward navigation
window.addEventListener('beforeunload', () => {
    // Data is already saved in localStorage, nothing to do here
});