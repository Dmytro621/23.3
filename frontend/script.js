// const { json } = require("body-parser");

const toDoList = $('.js--todos-wrapper');
const toDoValue = $('.js--form__input');
const toDoSubmitButton = $('.form__btn');

$(document).ready(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(todo => {
        if (!$(`.todo-item:contains(${todo.text})`).length) {
            const todoItem = `
                <li class="todo-item${todo.checked ? ' todo-item--checked' : ''}">
                  <input type="checkbox" class="checkbox" ${todo.checked ? 'checked' : ''} />
                  <span class="todo-item__description">${todo.text}</span>
                  <button class="todo-item__delete">Видалити</button>
                </li>`;
            toDoList.append(todoItem);
        }
    });
    deleteItem();
    $('.checkbox').on('change', checkedTask);
});

function saveTodos() {
    const todos = [];
    $('.todo-item').each(function() {
        const text = $(this).find('.todo-item__description').text();
        const checked = $(this).find('.checkbox').prop('checked');
        todos.push({ text, checked });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function deleteItem() {
    const deleteItemButton = $('.todo-item__delete');
    deleteItemButton.on('click', (event) => {
        event.stopPropagation();
        event.target.parentElement.remove();
        saveTodos();
    });
}

function checkedTask(event) {
    const checkboxItem = $(event.target);
    const checkboxParent = checkboxItem.closest('.todo-item');

    if (checkboxItem.prop('checked')) {
        checkboxParent.addClass('todo-item--checked');
    } else {
        checkboxParent.removeClass('todo-item--checked');
    }
    saveTodos();
}
$('.checkbox').on('change', checkedTask);

toDoSubmitButton.on('click', (event) => {
    if (!toDoValue.val()) {
        return alert('error');
    } else {
        event.preventDefault();
        fetch('http://localhost:3000/users/',
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body:   JSON.stringify({name:toDoValue.val()})
            }
        ).then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
        
        const todoItem = `
            <li class="todo-item">
              <input type="checkbox" class="checkbox" />
              <span class="todo-item__description">${toDoValue.val()}</span>
              <button class="todo-item__delete">Видалити</button>
            </li>`;
        toDoList.append(todoItem);
        toDoValue.val('');
        saveTodos();
        deleteItem();
        $('.checkbox').on('change', checkedTask);
    }
});

toDoList.on('click', '.todo-item', function(event) {
    if (!$(event.target).hasClass('checkbox') && !$(event.target).hasClass('todo-item__delete')) {
        const todoTextElement = $(this).find('.todo-item__description');
        showModal(todoTextElement);
    }
});

function showModal(todoTextElement) {
    const modal = $('.modal');
    const modalBody = $('.modal-body p');
    modalBody.text(todoTextElement.text());
    modal.show();
    $('.close, .btn-secondary').on('click', () => {
        modal.hide();
    });
    $('.btn-primary').on('click', () => {
        todoTextElement.text(modalBody.text());
        saveTodos();
        modal.hide();
    });
}
