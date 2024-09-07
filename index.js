const fieldGroups = document.querySelectorAll(".form-group");
const radioOptions = document.querySelectorAll(".queryOption");
const getForm = document.querySelector("form");
const notification = document.querySelector(".toast");
let isFormValid = true;

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("showNotification") === "true") {
    showNotification();
    localStorage.removeItem("showNotification");
  }
});

const showNotification = () => {
  setTimeout(function () {
    notification.classList.remove("hidden");
  }, 100);

  setTimeout(function () {
    notification.classList.add("hidden");
  }, 5000);
};

notification.addEventListener("click", function () {
  notification.classList.add("hidden");
});

getForm.addEventListener("submit", function (event) {
  event.preventDefault();
  isFormValid = true;

  fieldGroups.forEach(function (group) {
    checkInputValidity(group);
  });

  if (isFormValid) {
    localStorage.setItem("showNotification", "true");
    getForm.submit();
  }
});

const checkInputValidity = (group) => {
  const field = group.querySelector("input, textarea");

  if (field) {
    const inputType = field.type || "text";
    validateInputType(inputType, group);
  }
};

const validateInputType = (inputType, group) => {
  if (inputType === "radio") {
    const radios = group.querySelectorAll("input");
    let anyChecked = false;

    radios.forEach((radio) => {
      if (radio.checked) {
        anyChecked = true;
      }
    });

    if (!anyChecked) {
      showErrorMsg(group, ".error");
      isFormValid = false;
    }
  }

  if (inputType === "checkbox") {
    const checkbox = group.querySelector("input");
    if (!checkbox.checked) {
      showErrorMsg(group, ".error");
      isFormValid = false;
    }
  }

  if (inputType === "text" || inputType === "textarea") {
    const textInput = group.querySelector(
      inputType === "textarea" ? "textarea" : "input"
    );
    if (textInput.value.trim() === "") {
      showErrorMsg(group, ".error");
      isFormValid = false;
    }
  }

  if (inputType === "email") {
    const emailInput = group.querySelector("input");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput.value.trim() === "") {
      showErrorMsg(group, ".empty");
      isFormValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
      showErrorMsg(group, ".valid");
      isFormValid = false;
    }
  }
};

const hideErrorMsg = (group) => {
  const allErrors = group.querySelectorAll(".error");
  allErrors.forEach((err) => {
    err.classList.add("hidden");
  });
};

const showErrorMsg = (group, className) => {
  const errorBlock = group.querySelector(className);
  errorBlock.classList.remove("hidden");
};

radioOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const radio = option.querySelector("input");
    radio.checked = true;
    hideErrorMsg(option.closest(".form-group"));
  });
});

fieldGroups.forEach((group) => {
  const fields = group.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    field.addEventListener("focus", function () {
      hideErrorMsg(group);
    });

    field.addEventListener("blur", function () {
      checkInputValidity(group);
    });
  });
});
