const $postTitleField = document.querySelector('.js-field-title');
const $postTextField = document.querySelector('.js-field-post');
const $publicBtn = document.querySelector('.js-public-btn');
const $postList = document.querySelector('.js-post-list');
const $errorsContainer = document.querySelector('.errors');
const $postTitleErrorElement = createErrorElement('Заголовок больше 100 символов');
const $postTextErrorElement = createErrorElement('Пост больше 200 символов');
const postListData = [];

const postEntryData = {
  postTitle: {
    element: $postTitleField,
    errorElement: $postTitleErrorElement,
    isErrorAdded: false,
    maxLength: 100,
    isValid: false,
  },
  postBody: {
    element: $postTextField,
    errorElement: $postTextErrorElement,
    isErrorAdded: false,
    maxLength: 200,
    isValid: false,
  },
  get isValid() {
    return this.postTitle.isValid && this.postBody.isValid ? true : false;
  },
};

/**
 * Создание постов
 */
function getEmptyPostListText() {
  return '<p class="not-posts">Тут пока пусто...</p>';
}

function getPostElement(postData) {
  return `
    <div class="post">
        <div class="post__date" data-id="${postData.id}">${postData.date}</div>
        <h3 class="post__title">${postData.title}</h3>
        <p class="post__text">${postData.text}</p>
    </div>
    `;
}

function getPost() {
  const post = {
    id: getPostId(),
    date: getCurrentDate(),
    title: $postTitleField.value,
    text: $postTextField.value,
  };
  postListData.push(post);
}

function getCurrentDate() {
  const date = new Date().toLocaleString();
  return date.split(',').join(' ').slice(0, -3);
}

function getPostId() {
  return Math.random();
}

function renderPostList() {
  $postList.innerHTML = '';

  if (!postListData.length) {
    $postList.innerHTML = getEmptyPostListText();
  } else {
    let html = '';
    postListData.forEach((post) => (html += getPostElement(post)));
    $postList.innerHTML = html;
  }
}

/**
 * Работа с полями
 */
function clearFields() {
  $postTextField.value = '';
  $postTitleField.value = '';
}

function createErrorElement(text) {
  const $errorElement = document.createElement('p');
  $errorElement.classList.add('error');
  $errorElement.innerText = text;

  return $errorElement;
}

function resetFieldsValidity(dataObj) {
  Object.values(dataObj).forEach((item) => {
    if (typeof item === 'object' && item.hasOwnProperty('isValid')) {
      item.isValid = false;
    }
  });
}

/**
 * Работа с кнопкой
 */
function validateBtn(postDataObj) {
  if (postDataObj.isValid) {
    enableBtn();
  } else {
    disableBtn();
  }
}

function disableBtn() {
  $publicBtn.disabled = true;
  $publicBtn.classList.add('public-btn__disabled');
}
function enableBtn() {
  $publicBtn.disabled = false;
  $publicBtn.classList.remove('public-btn__disabled');
}

function updateBtnAvailability(fieldsDataObj, property) {
  const { element, maxLength } = fieldsDataObj[property];

  if (element.value.length && element.value.length <= maxLength) {
    fieldsDataObj[property].isValid = true;
    validateBtn(fieldsDataObj);
  } else {
    fieldsDataObj[property].isValid = false;
    validateBtn(fieldsDataObj);
  }
}

/**
 * Валидация полей
 */
function validateField(fieldsDataObj, property) {
  let { element, errorElement, maxLength } = fieldsDataObj[property];

  if (element.value.length > maxLength && fieldsDataObj[property].isErrorAdded === false) {
    fieldsDataObj[property].isErrorAdded = true;
  } else if (element.value.length <= maxLength && fieldsDataObj[property].isErrorAdded === null) {
    removeError(element, errorElement);
    fieldsDataObj[property].isErrorAdded = false;
  }

  if (fieldsDataObj[property].isErrorAdded) {
    setError(element, errorElement);
    fieldsDataObj[property].isErrorAdded = null;
    fieldsDataObj[property].isValid = false;
  }

  updateBtnAvailability(fieldsDataObj, property);
}

function setError(field, errorElement) {
  $errorsContainer.append(errorElement);
  field.classList.add('invalid');
}

function removeError(field, errorElement) {
  errorElement.remove();
  field.classList.remove('invalid');
}

/**
 * Обработчики событий
 */
$publicBtn.addEventListener('click', () => {
  getPost();
  clearFields();
  renderPostList();
  resetFieldsValidity(postEntryData);
  validateBtn(postEntryData);
});

$postTitleField.addEventListener('input', validateField.bind(this, postEntryData, 'postTitle'));
$postTextField.addEventListener('input', validateField.bind(this, postEntryData, 'postBody'));

/**
 * Инициализация приложения
 */
renderPostList();
validateBtn(postEntryData);
