class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskIdCounter = this.getNextId();
        
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        
        this.bindEvents();
        this.renderTasks();
        this.updateTaskCount();
    }
    
    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
    }
    
    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const task = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.taskInput.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCount();
    }
    
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCount();
    }
    
    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateTaskCount();
        }
    }
    
    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskCount();
    }
    
    renderTasks() {
        this.taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
            return;
        }
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="todoApp.toggleTask(${task.id})">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">Delete</button>
            `;
            
            this.taskList.appendChild(li);
        });
    }
    
    updateTaskCount() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        if (totalTasks === 0) {
            this.taskCount.textContent = 'No tasks';
        } else if (totalTasks === 1) {
            this.taskCount.textContent = `1 task (${completedTasks} completed)`;
        } else {
            this.taskCount.textContent = `${totalTasks} tasks (${completedTasks} completed, ${pendingTasks} pending)`;
        }
    }
    
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }
    
    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }
    
    getNextId() {
        const savedCounter = localStorage.getItem('taskIdCounter');
        return savedCounter ? parseInt(savedCounter) : 1;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});