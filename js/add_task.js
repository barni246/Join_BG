setURL("https://barnabas-gonda.de/post/smallest_backend_ever");

let tasks = [];
let team= [];

async function preloader() {
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("keyTasks")) || [];
  team = JSON.parse(backend.getItem("contacts")) || [];
}
 
let form = document.getElementsByTagName("form")[0];
let title = document.getElementById("title");
let description = document.getElementById("description");
let date = document.getElementById("date");
//subtask elements
let subtaskInputField = document.getElementById("addSubtask");
let subtaskOnInput = document.getElementById("subtaskOninput");
let addSubtaskIcon = document.getElementById("addSubtaskIcon");
let clearSubtaskInput = document.getElementById("clearSubtaskInput");
let finishEditingSubtask = document.getElementById("finishEditingSubtask");
let subtaskContainer = document.getElementById("subtaskContainer");

//clear & create task button
let clear = document.getElementById("clear");
let create = document.getElementById("create");

clear.addEventListener('click', (e)=> {
  e.preventDefault();
  window.location.reload();
})


//category elements
let clearCategory = document.getElementById("clearCategory");
let addCategory = document.getElementById("addCategory");
let dropdownOpen = false;
let editingCategory = false;
let categories = ["New Category", "Sales", "Marketing"];
let colorDots = document.getElementsByClassName("color-dot");
let assignedColors = [null, colorDots[1], colorDots[2]];
let categoryInput = document.getElementById("selectCategory");
let dropdownContainer = document.getElementById("dropdownContainer");
let categoryOninput = document.getElementById("categoryOninput");
let colorContainer = document.getElementById("colorContainer");
let categoryDot = document.getElementById("categoryDot");

// add listener to category input field
categoryInput.addEventListener("click", function () {
  if (!editingCategory) {
    if (dropdownOpen) {
      dropdownContainer.style.display = "none";
      categoryInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
      categoryInput.style.borderRadius = "7px";
      dropdownOpen = false;
    } else {
      categoryInput.style.borderBottom = "none";
      categoryInput.style.borderRadius = "7px 7px 0 0";
      dropdownContainer.style.display = "block";
      dropdownContainer.innerHTML = "";
      dropdownContainer.innerHTML += `<div class="category" id="newCategory">${categories[0]}</div>`;
      if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
          let color = assignedColors[i];
          if (color != null) {
            color.classList.remove("selected");
            dropdownContainer.innerHTML += `<div class="category" onclick="selectCategory(event)"><div class="category-text">${categories[i]}</div> ${color.outerHTML}</div>`;
          } else {
            dropdownContainer.innerHTML += `<div class="category" onclick="selectCategory(event)"><div class="category-text">${categories[i]}</div></div>`;
          }
        }
      }

      addListenerToNewCategory();
      dropdownOpen = true;
    }
  }
});

//add listener to new category div
function addListenerToNewCategory() {
  let newCategory = document.getElementById("newCategory");
  newCategory.addEventListener("click", function () {
    categoryOninput.style.display = "flex";
    dropdownContainer.style.display = "none";
    categoryInput.value = "";
    categoryInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
    categoryInput.style.borderRadius = "7px";
    categoryDot.style.display = "none";
    categoryInput.placeholder = "New category name";
    categoryInput.removeAttribute("readonly");
    colorContainer.style.display = "flex";
    editingCategory = true;
  });
}

clearCategory.addEventListener("click", function () {
  categoryInput.value = "Select Task Category";
  colorContainer.style.display = "none";
  categoryInput.setAttribute("readonly", "true");
  dropdownOpen = false;
  editingCategory = false;
  categoryOninput.style.display = "none";
  for (let i = 0; i < colorDots.length; i++) {
    const dot = colorDots[i];
    if (dot.classList.contains("selected")) {
      dot.classList.remove("selected");
    }
  }
});

addCategory.addEventListener("click", function () {
  if (categoryInput.value.length > 0) {
    colorContainer.style.display = "none";
    categoryInput.setAttribute("readonly", "true");
    dropdownOpen = false;
    editingCategory = false;
    categoryOninput.style.display = "none";
    [...colorDots].forEach((el) => {
      if (el.classList.contains("selected")) {
        assignedColors.push(el);
      }
    });
    let filteredArray = Array.prototype.filter.call([...colorDots], condition);
    let noMatch = filteredArray.length === 0;
    if (noMatch) {
      categories.push(categoryInput.value);
      assignedColors.push(null);
    } else {
      categories.push(categoryInput.value);
      displayColorDot();
    }
  }
});

let condition = function (el) {
  return el.classList.contains("selected");
};

//add listeners to every color dot
for (let i = 0; i < colorDots.length; i++) {
  const dot = colorDots[i];
  dot.addEventListener("click", function (e) {
    scaleUp(e);
  });
}

function scaleUp(e) {
  for (let i = 0; i < colorDots.length; i++) {
    const dot = colorDots[i];
    if (dot.classList.contains("selected")) {
      dot.classList.remove("selected");
    }
  }
  e.target.classList.add("selected");
}

//display color dot and let user select categories
function selectCategory(e) {
  let category = e.target;
  let categoryText = category.getElementsByClassName("category-text")[0];
  categoryInput.value = categoryText.innerText;
  let textDot = category.getElementsByClassName("color-dot")[0];
  let classes = textDot.classList;
  let color = classes[1];
  categoryDot.className = "";
  categoryDot.style.display = "inline";
  categoryDot.classList.add(color);
  categoryDot.style.right = `24px`;
}

function displayColorDot() {
  let colorDiv = assignedColors[assignedColors.length - 1];
  selectedColor = colorDiv.classList[1];
  categoryDot.className = "";
  categoryDot.classList.add(selectedColor);
  categoryDot.style.right = `24px`;
  categoryDot.style.display = "inline";
}

//assigned contacts
let contactsOpened= false;

let assignedToInput = document.getElementById("assignedTo");
let contactsDropdown = document.getElementById("contactsDropdownContainer");
let contactsDropdownOpen = false;

assignedToInput.addEventListener("click", function () {
  if (contactsDropdownOpen) {
    contactsDropdownOpen = false;
    contactsDropdown.style.display = "none";
    assignedToInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
    assignedToInput.style.borderRadius = "7px";
  } else if (!contactsDropdownOpen && !contactsOpened){
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdown.innerHTML = "";
    for (let i = 0; i < team.length; i++) {
      const contact = team[i];
      contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_name.png"> ${contact.userName}</div> <input type="checkbox" class="checkbox-primary"></div>`;
    }
    contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_mail.png"> Invite new contact</div></div>`;
    contactsDropdownOpen = true;
    contactsOpened= true;
  }
  else {
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdownOpen= true;
  }
});

//add event listeners to prio items
let prioContainer = document.getElementById("prio");
let prioBtns = document.getElementsByClassName("prio-btn");
prioContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("prio-btn")) {
    if (!e.target.classList.contains("active")) {
      let active = document.querySelectorAll(".active");
      for (let i = 0; i < active.length; i++) {
        if (active[i] !== e.target) {
          active[i].classList.remove("active");
        }
      }
      e.target.classList.add("active");
      if (e.target === prioBtns[0]) {
        e.target.style.backgroundColor = "rgb(255, 61, 0)";
        e.target.style.color = "white";
        prioBtns[1].style.backgroundColor = "white";
        prioBtns[1].style.color = "black";
        prioBtns[2].style.backgroundColor = "white";
        prioBtns[2].style.color = "black";
      } else if (e.target === prioBtns[1]) {
        e.target.style.backgroundColor = "rgb(255, 168, 0)";
        e.target.style.color = "white";
        prioBtns[0].style.backgroundColor = "white";
        prioBtns[0].style.color = "black";
        prioBtns[2].style.backgroundColor = "white";
        prioBtns[2].style.color = "black";
      } else {
        e.target.style.backgroundColor = "rgb(122, 226, 41)";
        e.target.style.color = "white";
        prioBtns[0].style.backgroundColor = "white";
        prioBtns[0].style.color = "black";
        prioBtns[1].style.backgroundColor = "white";
        prioBtns[1].style.color = "black";
      }
    }
  }
});

//subtask functionality

//subtask input field listener
subtaskInputField.addEventListener("click", function () {
  subtaskOnInput.style.display = "flex";
  addSubtaskIcon.style.display = "none";
});

clearSubtaskInput.addEventListener("click", function () {
  subtaskInputField.value = "";
  subtaskOnInput.style.display = "none";
  addSubtaskIcon.style.display = "inline";
});

finishEditingSubtask.addEventListener("click", function () {
  if (subtaskInputField.value.length > 0) {
    subtaskContainer.innerHTML += /*html*/ `
             <div class="subtask">
                <p>&#9675; ${subtaskInputField.value}</p>
             </div>
     `;
      subtasksHelpArray.push(subtaskInputField.value);
      console.log('ja');
    subtaskInputField.value = "";
  }
});

//funcitionality of trashbin icon to delete subtask onclick
function removeParent(e) {
  e.target.parentNode.remove();
}

//add listener to create task button
form.addEventListener("submit", function (event) {
  event.preventDefault();
  formValidation();
});

// modify calendar so you can only select current date or date in the future
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;
document.getElementById("date").min = today;


