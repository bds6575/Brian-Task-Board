// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // Create a task card element
  let taskCard = $("<div>", {
    class: "card task-card",
    id: "task-" + task.id,
    html: `
      <div class="card-body">
        <h5 class="card-title">${task.name}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Due Date: ${task.dueDate}</p>
        <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
      </div>
    `
  });

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  taskList.forEach(task => {
    let taskCard = createTaskCard(task);
    $("#" + task.status + "-cards").append(taskCard);
    // Make the task card draggable
  taskCard.draggable({
    cursor: "move",
    snap: true
  });

  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  let taskName = $("#taskName").val();
  let taskDescription = $("#taskDescription").val();
  let dueDate = $("#dueDate").val();

  if (taskName && taskDescription && dueDate) {
    let newTask = {
      id: generateTaskId(),
      name: taskName,
      description: taskDescription,
      dueDate: dueDate,
      status: "todo"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);

    renderTaskList();
    $("#taskForm")[0].reset();
    $("#formModal").modal("hide");
  }
}

// Todo: create a function to handle deleting a task using event delegation
function handleDeleteTask(event) {
  let taskId = $(this).data("task-id");
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.attr("id").split("-")[1];
  let newStatus = $(this).attr("id");

  taskList.forEach(task => {
    if (task.id == taskId) {
      task.status = newStatus;
    }
  });

  localStorage.setItem("tasks", JSON.stringify(taskList));
}

$(document).ready(function () {
  renderTaskList();

  // Update the event listener for the delete button using event delegation
  $(document).on("click", ".delete-task", handleDeleteTask);

  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });

  $("#dueDate").datepicker();

  $("#taskForm").on("submit", handleAddTask);
});