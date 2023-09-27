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
  
    function createTodoItem(name) {
      let item = document.createElement("li");
      // кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement("div");
      let doneButton = document.createElement("button");
      let deleteButton = document.createElement("button");
  
      // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
      item.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      item.textContent = name;
  
      buttonGroup.classList.add("btn-group", "btn-group-sm");
      doneButton.classList.add("btn", "btn-success");
      doneButton.textContent = "Готово";
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Удалить";
  
      // вкладываем кнопку в отдельный элемент, чтобы они объединились в один блок
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);
  
      // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать событие нажатия
      return {
        item,
        doneButton,
        deleteButton,
      };
    }
  
    // главная функция где будет обрабатываться добавление списки и тд**
    function createTodoApp(container, title = "Список дел", listName = "") {
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();
  
      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
  
      // данный метод вернет входящую строку в виде данных
      function jsonToData(data) {
        return JSON.parse(data);
      };
  
      // данный метод вернет данные из localstorage
      function getCartData() {
        return localStorage.getItem(listName);
      };
  
      // данный метод вернет входящие данные в виде строки
      function dataToJson(data) {
        return JSON.stringify(data);
      };
  
      //данный метод запишет наши данные в localstorage
      function setCartData(data) {
        localStorage.setItem(listName, data);
      };
  
      // функция удаление элемента обьекта в массиве
      function todoRemoveObj(array, item) {
        let index = array.indexOf(item)
        if (index !== -1) {
          array.splice(index, 1);
          //  удаляет в localstorage конкретную элемент в массив при срабатывание функции
          setCartData(dataToJson(array));
        }
      }
  
      // этот переменная пустой массив нужен для того чтобы добавить обьект todoitem внутри массив или если есть элементы внутри массива то вернет первое значение
      let todosArray = jsonToData(getCartData()) || [];
  
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
  
      // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
      todoItemForm.form.addEventListener("submit", function (e) {
        // этот браузер предотвращает стандартное действие браузера
        // в данном случае мы не хотим, чтобы при нажатии на кнопку страница перезагружалась
        e.preventDefault();
  
        // игнорируем создание элемента, если пользователь ничего не ввел в поле
        if (!todoItemForm.input.value) {
          return;
        }
  
        let todoItem = createTodoItem(todoItemForm.input.value);
  
        function todoDoneObj(array) {
          // Проверяем, содержит ли элемент класс "list-group-item-success"
          // Если содержит, устанавливаем значение свойства "done" объекта "obj" в true
          // Если не содержит, устанавливаем значение свойства "done" объекта "obj" в false
          if (todoItem.item.classList.contains("list-group-item-success")) {
            obj.done = true;
            //  поменяет на true в массиве где внутри обьект и ключ done в localstorage при срабатывание функции
            setCartData(dataToJson(array));
          } else {
            obj.done = false;
            //  поменяет на false в массиве где внутри обьект и ключ done в localstorage при срабатывание функции
            setCartData(dataToJson(array));
          };
        };
  
        // добавляем обработчики на кнопки
        todoItem.doneButton.addEventListener("click", function () {
          todoItem.item.classList.toggle("list-group-item-success");
          // вызываем функции для изменение в обьекте done при клике
          todoDoneObj(todosArray);
        });
        todoItem.deleteButton.addEventListener("click", function () {
          if (confirm("Вы уверены?")) {
            todoItem.item.remove();
            // удаляет элемент обьект в массиве
            todoRemoveObj(todosArray, obj);
          }
        });
  
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
        todoList.append(todoItem.item);
        // обнуляем значение в поле, чтобы не пришлось стирать его вручную
        todoItemForm.input.value = "";
        // вернем значение disabled button
        todoItemForm.button.disabled = true;
        //записываем массив в localstorage
        setCartData(dataToJson(todosArray));
      });
    }
    window.createTodoApp = createTodoApp;
  })();
  