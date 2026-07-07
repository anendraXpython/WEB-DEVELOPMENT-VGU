let input = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let taskList = document.getElementById("taskList");

function addTask(){

    let task = input.value.trim();

    if(task === ""){
        alert("Please enter a task.");
        return;
    }

    let li = document.createElement("li");

    let leftSide = document.createElement("div");
    leftSide.classList.add("task-left");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("taskCheckbox");

    let taskText = document.createElement("span");
    taskText.classList.add("taskText");
    taskText.textContent = task;

    leftSide.appendChild(checkbox);
    leftSide.appendChild(taskText);

    let deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.classList.add("deleteBtn");

    li.appendChild(leftSide);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

    input.value="";

    checkbox.addEventListener("change",function(){

        taskText.classList.toggle("completed");

    });

    deleteBtn.addEventListener("click",function(event){

        event.stopPropagation();

        li.remove();

    });

}

addBtn.addEventListener("click",addTask);

input.addEventListener("keypress",function(event){

    if(event.key==="Enter"){

        addTask();

    }

});
