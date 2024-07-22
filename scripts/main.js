document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const filterElements = document.getElementById("filter");
  const taskList = document.getElementById("task-list");
  const takeColor = document.getElementById("task-color");
  // Make addTask Method
  function addTask(
    textTask,
    taskId = Date.now(),
    taskStatus = "pending",
    taskDate = new Date().toLocaleDateString(),
    taskColor = "bg-white",
    saveInLocalStorage = true
  ) {
    const li = document.createElement("li");
    li.classList = `flex flex-col sm:flex-row justify-between animFade items-center shadow-lg rounded w-full mb-3 py-4 px-5 border-b ${taskStatus} ${taskColor}`;
    if (taskStatus === "completed") {
      li.classList.add("opacity-50", "line-through");
    } else {
      li.classList.add("bg-white");
    }
    li.id = taskId;
    li.innerHTML = `
      <span class="sm:w-36 w-full text-center sm:my-0 my-2 font-semibold">${textTask}</span>
      <span class="text-gray-500 text-sm sm:my-0 my-2 font-bold mx-2">${taskDate}</span> 
      <select class="task-status py-[10px] sm:my-0 my-2 px-[30px] font-semibold border rounded">
        <option class="" value="pending" ${
          taskStatus === "pending" ? "selected" : ""
        }>Pending</option>
        <option value="completed" ${
          taskStatus === "completed" ? "selected" : ""
        }>Completed</option>
      </select>
      <button class="delete-task-btn text-white py-[5px] mt-3 px-[20px] bg-[#FF0000] border-2 border-[#FF0000] transition duration-200  hover:bg-white hover:text-[#FF0000] rounded-sm">Delete</button>
    `;
    taskList.appendChild(li);

    const taskSelect = li.querySelector(".task-status");
    const deleteTaskBtn = li.querySelector(".delete-task-btn");

    taskSelect.addEventListener("change", function () {
      updateTaskStatusInLocalStorage(taskId, taskSelect.value);
      if (taskSelect.value === "completed") {
        li.classList.remove("bg-white");
        li.classList.add("opacity-50", "line-through", "completed");
        li.classList.remove("pending");
      } else {
        li.classList.remove("opacity-50", "line-through", "completed");
        li.classList.add("bg-white", "pending");
      }
      filterSelection();
    });

    deleteTaskBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          taskList.removeChild(li);
          removeTaskFromLocalStorage(taskId);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      });
    });

    if (saveInLocalStorage) {
      saveTaskToLocalStorage(textTask, taskId, taskStatus, taskDate, taskColor);
    }
  }
  ////end method AddTask////

  // make saveTaskToLocalStorage
  function saveTaskToLocalStorage(
    textTask,
    taskId,
    taskStatus,
    taskDate,
    taskColor
  ) {
    const tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    tasks.push({
      text: textTask,
      id: taskId,
      status: taskStatus,
      date: taskDate,
      color: taskColor,
    });
    localStorage.setItem("Tasks", JSON.stringify(tasks));
  }
  // end saveTaskToLocalStorage

  // make updateTaskStatusInLocalStorage
  function updateTaskStatusInLocalStorage(taskId, newTaskStatus) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newTaskStatus } : task
    );
    localStorage.setItem("Tasks", JSON.stringify(tasks));
  }
  // end updateTaskStatusInLocalStorage

  // make removeTaskFromLocalStorage
  function removeTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    tasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("Tasks", JSON.stringify(tasks));
  }
  // end removeTaskFromLocalStorage

  // make loadFromLocal
  function loadFromLocal() {
    const tasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    tasks.forEach((task) => {
      addTask(task.text, task.id, task.status, task.date, task.color, false);
    });
  }
  // end loadFromLocal

  // make filterSelection
  function filterSelection() {
    const filterValue = filterElements.value;
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach((task) => {
      switch (filterValue) {
        case "all":
          task.style.display = "";
          break;
        case "pending":
          task.style.display = task.classList.contains("pending") ? "" : "none";
          break;
        case "completed":
          task.style.display = task.classList.contains("completed")
            ? ""
            : "none";
          break;
      }
    });
  }
  // end filterSelection

  addTaskBtn.addEventListener("click", function () {
    const tasktext = taskInput.value.trim();
    const taskColor = takeColor.value;
    if (tasktext !== "") {
      addTask(tasktext, undefined, undefined, undefined, taskColor);
      taskInput.value = "";
    }
  });

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTaskBtn.click();
    }
  });

  filterElements.addEventListener("change", filterSelection);
  loadFromLocal();
  filterSelection();
});
