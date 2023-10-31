const $postTitleField = document.querySelector('.js-field-title');
const $postTextField = document.querySelector('.js-field-post');
const $publicBtn = document.querySelector('.js-public-btn');
const $postList = document.querySelector('.js-post-list');
const postListData = [];

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

function clearFields() {
  $postTextField.value = '';
  $postTitleField.value = '';
}

$publicBtn.addEventListener('click', () => {
  getPost();
  clearFields();
  renderPostList();
});

renderPostList();
