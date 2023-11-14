(function () {
    // создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
      let appTitle = document.createElement("h2");
      appTitle.innerHTML = title;
      return appTitle;
    }
  
    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
      let form = document.createElement("form");
      let input = document.createElement("input");
      let buttonWrapper = document.createElement("div");
      let button = document.createElement("button");
  
      form.classList.add("input-group", "mb-3");
      input.classList.add("form-control");
      input.placeholder = "Введите название нового дела";
      buttonWrapper.classList.add("input-group-append");
      button.classList.add("btn", "btn-primary");
      button.textContent = "Добавить дело";
  
      input.addEventListener("input", ButtonED);
  
      function ButtonED() {
        input.value === '' ? button.disabled = true : button.disabled = false;
      }
      ButtonED();
  
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);
  
      return {
        form,
        input,
        button,
      };
    }
  
    // создаем и возвращаем список элементов
    function createTodoList() {
      let list = document.createElement("ul");
      list.classList.add("list-group");
      return list;
    }
  
    function createTodoItemElement(todoItem, { onDone, onDelete }) {
      let item = document.createElement("li");
      // кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement("div");
      let doneButton = document.createElement("button");
      let deleteButton = document.createElement("button");

      const doneClass = 'list-group-item-success';
  
      // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      item.textContent = todoItem.name;

      if (todoItem.done) {
        item.classList.add(doneClass);
      }
  
      buttonGroup.classList.add("btn-group", "btn-group-sm");
      doneButton.classList.add("btn", "btn-success");
      doneButton.textContent = "Готово";
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Удалить";

      // добавляем обработчики на кнопки
      doneButton.addEventListener("click", function () {
        onDone({ todoItem, element: item });
        item.classList.toggle(doneClass, todoItem.done);
      });
      deleteButton.addEventListener("click", function () {
        onDelete({ todoItem, element: item });
      });
  
      // вкладываем кнопку в отдельный элемент, чтобы они объединились в один блок
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
  
      // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать событие нажатия
      return item;
    }
  
    // главная функция где будет обрабатываться добавление списки и тд**
    async function createTodoApp(container, title = "Список дел", owner) {
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();
      const handlers = {
        onDone({todoItem}) {
          todoItem.done = !todoItem.done;
          fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ done: todoItem.done }),
            headers: {
              'Content-Type' : 'application/json',
            }
          });
        },
        onDelete({ todoItem, element }) {
          if (!confirm('Вы уверены?')) {
            return;
          }
          element.remove();
          fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
            method: 'DELETE',
          });
        },
      };
  
      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
  
      // функция удаление элемента обьекта в массиве
      function todoRemoveObj(array, item) {
        let index = array.indexOf(item)
        if (index !== -1) {
          array.splice(index, 1);
        }
      }
  
      // этот переменная пустой массив нужен для того чтобы добавить обьект todoitem внутри массив или если есть элементы внутри массива то вернет первое значение
      let todosArray = [];
  
      // Функция для отображения списка дел на экране
      function renderTodoList() {
        todoList.innerHTML = ""; // Очищаем список перед отрисовкой
  
        for (let i = 0; i < todosArray.length; i++) {
          let todo = todosArray[i];
          let todoItem = createTodoItem(todo.name);
  
          if (todo.done) {
            todoItem.item.classList.add("list-group-item-success");
          }
  
          todoItem.doneButton.addEventListener("click", function () {
            todoItem.item.classList.toggle("list-group-item-success");
            todo.done = !todo.done;
            setCartData(dataToJson(todosArray));
          });
  
          todoItem.deleteButton.addEventListener("click", function () {
            if (confirm("Вы уверены?")) {
              todoItem.item.remove();
              todoRemoveObj(todosArray, todo);
            }
          });
  
          todoList.append(todoItem.item);
        }
      }
  
      // Вызываем функцию для отображения списка дел при запуске приложения
      renderTodoList();

      // отправляем запрос на список всех дел
      const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
      const todoItemList = await response.json();

      todoItemList.forEach(todoItem => {
        const todoItemElement = createTodoItemElement(todoItem, handlers);
        todoList.append(todoItemElement);
      });
  
      // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
      todoItemForm.form.addEventListener("submit", async function (e) {
        // этот браузер предотвращает стандартное действие браузера
        // в данном случае мы не хотим, чтобы при нажатии на кнопку страница перезагружалась
        e.preventDefault();
  
        // игнорируем создание элемента, если пользователь ничего не ввел в поле
        if (!todoItemForm.input.value.trim()) {
          return;
        }

        const response = await fetch('http://localhost:3000/api/todos', {
          method: 'POST',
          body: JSON.stringify({
            name: todoItemForm.input.value.trim(),
            owner,
          }),
          headers: {
            'Content-Type' : 'application/json',
          }
        });

        const todoItem = await response.json();
  
        const todoItemElement = createTodoItemElement(todoItem, handlers);
  
        // функция для добавление новый индификатор для обьекта в массиве
        function addObjId(array) {
          for (let i = 0; i < array.length; i++) {
            array[i].id = i + 1;
          };
  
          return array.length + 1;
        };
  
        // преобразовываем список дел в виде обьект
        let obj = {
          id: addObjId(todosArray),
          name: todoItemForm.input.value,
          done: false,
        };
  
        // добавляем обьект в массив
        todosArray.push(obj);
  
        // создаем и добавляем в список новое дело с названием из поля для ввода
        todoList.append(todoItemElement);
        // обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = "";
        // вернем значение disabled button
        todoItemForm.button.disabled = true;
      });
    }
    window.createTodoApp = createTodoApp;
  })();
  