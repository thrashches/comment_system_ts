// id комментариев для проверки на уникальность и назначения следующего id
const commentIds: Array<number> = new Array();

// Поле ввода комментария
const commentInput: HTMLTextAreaElement = <HTMLTextAreaElement>(
  document.getElementById("commentInput")
);

// div вокруг кнопки
const btnWrapper: HTMLElement = <HTMLElement>(
  document.getElementById("btnWrapper")
);

// Кнопка создания комментария
const sendBtn: HTMLButtonElement = <HTMLButtonElement>(
  document.getElementById("sendBtn")
);

// Количество введенных символов в поле ввода
const counter: HTMLSpanElement = <HTMLSpanElement>(
  document.getElementById("counter")
);

// Параграф со счетчиком
const counterP: HTMLParagraphElement = <HTMLParagraphElement>(
  document.getElementById("counterP")
);

commentInput.addEventListener("focusin", () => {
  // Подветка кнопки и разворот инпута при фокусе
  commentInput.setAttribute("rows", "8");
  sendBtn.classList.replace("btn__default", "btn__success");
});
commentInput.addEventListener("focusout", () => {
  // Затемнение кнопки и сворачивание инпута при расфокусе
  commentInput.setAttribute("rows", "1");
  sendBtn.classList.replace("btn__success", "btn__default");
});
commentInput.addEventListener("input", () => {
  // Работа счетчика символов
  const newCommentLength: number = commentInput.value.length;
  counter.textContent = newCommentLength.toString();
  if (newCommentLength > 1000) {
    const warningMessage: HTMLParagraphElement = document.createElement("p");
    warningMessage.setAttribute("id", "warningMessage");
    warningMessage.classList.add("text__warning");
    warningMessage.classList.add("text-14");
    warningMessage.innerText = "Слишком длинное сообщение";
    btnWrapper.classList.add("top-offset");
    counterP.classList.replace("text__secondary", "text__warning");
    sendBtn.disabled = true;
    sendBtn.classList.replace("btn__success", "btn__default");
    btnWrapper.insertBefore(warningMessage, sendBtn);
  } else {
    const warningMessage: HTMLElement | null =
      document.getElementById("warningMessage");
    if (warningMessage) {
      sendBtn.disabled = false;
      sendBtn.classList.replace("btn__default", "btn__success");
      warningMessage.remove();
      btnWrapper.classList.remove("top-offset");
      counterP.classList.replace("text__warning", "text__secondary");
    }
  }
});

function loadSavedCommentIds() {
  // Загрузка занятых id комментариев из localStorage
  const savedIdsstring: string | null =
    window.localStorage.getItem("commentIds");
  if (
    !savedIdsstring ||
    JSON.parse(savedIdsstring).length < commentIds.length
  ) {
    window.localStorage.setItem("commentIds", JSON.stringify(commentIds));
  }
}

function getUniqueCommentId(): number {
  // Генерация нового id комментария
  loadSavedCommentIds();
  if (!commentIds.length) {
    commentIds.push(1);
    window.localStorage.setItem("commentIds", JSON.stringify(commentIds));
    return 1;
  } else {
    const newId: number = Math.max(...commentIds) + 1;
    commentIds.push(newId);
    window.localStorage.setItem("commentIds", JSON.stringify(commentIds));
    return newId;
  }
}

function addComment() {
  // Добавление нового комментария на страницу
  if (commentInput.value.length) {
    const user: User = testUsers[0];
    const newComment: PostComment = new PostComment(user, commentInput.value);
    const element: HTMLElement = newComment.getHTMLElement();
    const comments: HTMLElement = <HTMLElement>(
      document.getElementById("comments")
    );
    comments.appendChild(element);
    commentInput.value = "";
    counter.innerText = "0";
    newComment.saveToLocalStorage();
  }
}

sendBtn.addEventListener("click", () => {
  addComment();
});

commentInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    addComment();
  }
});

function getSavedComments(): Array<PostComment> | null {
  // Загрузка сохраненных комментариев
  const commentsString: string | null = window.localStorage.getItem("comments");
  if (commentsString) {
    return JSON.parse(commentsString);
  }
  return null;
}

class User {
  // Класс пользователя
  id: number;
  fullName: string;
  avatar: string;

  constructor(id: number, fullName: string, avatar: string) {
    this.id = id;
    this.fullName = fullName;
    this.avatar = avatar;
  }
}

class PostComment {
  // Класс комментария
  id: number;
  user: User;
  text: string;
  published: number;
  rating: number = 0;
  favorited: boolean = false;
  replyTo: number | null = null;

  constructor(user: User, text: string, published?: number, id?: number) {
    if (published && id) {
      this.published = published;
      this.id = id;
    } else {
      this.published = Date.now();
      this.id = getUniqueCommentId();
    }

    this.text = text;
    this.user = user;
  }

  getAvatar(): HTMLElement {
    // Элемент аватара
    const commentAvatar = this.getWrappedItem("comment__avatar");
    commentAvatar.setAttribute(
      "style",
      `background-image: url('${this.user.avatar}');`
    );
    return commentAvatar;
  }

  getWrappedItem(cssClass: string): HTMLElement {
    // Элемент заголовка комментария(имя пользователя/дата/реплай)
    const wrappedItem: HTMLElement = document.createElement("div");
    wrappedItem.classList.add(cssClass);
    return wrappedItem;
  }

  getTimestamp(): string {
    // Получаем текущую дату/время в виде строки
    const date = new Date(this.published);
    return `${date.getDate()}.${
      date.getMonth() + 1
    } ${date.getHours()}:${date.getMinutes()}`;
  }

  getTimestampItem(): HTMLElement {
    // Возвращает div с датой и временем
    const timestampItem: HTMLElement = this.getWrappedItem(
      "comment__header__item"
    );
    const timestampSpan: HTMLSpanElement = document.createElement("span");
    timestampSpan.classList.add("text__secondary");
    timestampSpan.classList.add("text-14");
    timestampSpan.innerText = this.getTimestamp();
    timestampItem.appendChild(timestampSpan);

    return timestampItem;
  }

  getHeader(): HTMLElement {
    // Заголовок комментария
    const header: HTMLElement = this.getWrappedItem("comment__header");
    const fullNameWrapper: HTMLElement = this.getWrappedItem(
      "comment__header__item"
    );

    const fullName: HTMLAnchorElement = document.createElement("a");
    fullName.href = "#";
    fullName.innerText = this.user.fullName;
    fullNameWrapper.appendChild(fullName);
    header.appendChild(fullNameWrapper);

    if (this.replyTo) {
      // Если комментарий является ответом
    }
    header.appendChild(this.getTimestampItem());
    return header;
  }

  getBody(): HTMLElement {
    // Текст комментария
    const body = this.getWrappedItem("comment__body");
    const p = document.createElement("p");
    p.innerText = this.text;
    body.appendChild(p);
    return body;
  }

  getAnswerBtn(): HTMLElement {
    // Кнопка ответить
    const answerBtnWrapper = this.getWrappedItem("comment__footer__item");
    const answerIcon: HTMLElement = document.createElement("i");
    answerIcon.classList.add("icon");
    answerIcon.classList.add("icon__answer");
    const answerA: HTMLAnchorElement = document.createElement("a");
    answerA.appendChild(answerIcon);
    answerA.innerHTML += " Ответить";
    answerA.classList.add("text__secondary");
    answerA.href = "#";
    answerBtnWrapper.appendChild(answerA);
    return answerBtnWrapper;
  }

  getFavoriteBtn(): HTMLElement {
    // Кнопка избранное
    const favoriteBtnWrapper = this.getWrappedItem("comment__footer__item");
    const favoritedIcon = document.createElement("i");
    favoritedIcon.classList.add("icon");
    if (this.favorited) {
      favoritedIcon.classList.add("icon__in-favorites");
    } else {
      favoritedIcon.classList.add("icon__not-in-favorites");
    }
    const favoriteA: HTMLAnchorElement = document.createElement("a");
    favoriteA.appendChild(favoritedIcon);
    if (this.favorited) {
      favoriteA.innerHTML += " В избранном";
    } else {
      favoriteA.innerHTML += " В избранное";
    }
    favoriteA.href = "#";
    favoriteA.classList.add("text__secondary");
    favoriteBtnWrapper.appendChild(favoriteA);
    return favoriteBtnWrapper;
  }

  getFooter(): HTMLElement {
    // Подвал комментария
    const footer = this.getWrappedItem("comment__footer");
    const answerBtnWrapper = this.getAnswerBtn();
    const favoriteBtnWrapper = this.getFavoriteBtn();
    footer.appendChild(answerBtnWrapper);
    footer.appendChild(favoriteBtnWrapper);
    return footer;
  }

  getHTMLElement(): HTMLElement {
    // div с комментарием, аватаром и тд
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.setAttribute("id", `comment${this.id}`);
    commentDiv.appendChild(this.getAvatar());
    commentDiv.appendChild(this.getHeader());
    commentDiv.appendChild(this.getBody());
    commentDiv.appendChild(this.getFooter());
    return commentDiv;
  }

  saveToLocalStorage() {
    const storage: Array<PostComment> | null = getSavedComments();

    if (storage) {
      storage.push(this);
      window.localStorage.setItem("comments", JSON.stringify(storage));
    } else {
      window.localStorage.setItem("comments", JSON.stringify([this]));
    }
  }
}

const testUsers = [
  new User(1, "Максим Авдеенко", "https://picsum.photos/id/1/100"),
  new User(2, "Алексей_1994b", "https://picsum.photos/id/2/100"),
  new User(3, "Джунбокс3000", "https://picsum.photos/id/3/100"),
];

const savedComments = getSavedComments();
if (savedComments) {
  const mainIds: Array<number> = new Array();
  for (let commentData of savedComments) {
    if (!commentData.replyTo) {
      const commentObj = new PostComment(
        commentData.user,
        commentData.text,
        commentData.published,
        commentData.id
      );
      const comments: HTMLElement = <HTMLElement>(
        document.getElementById("comments")
      );
      comments.appendChild(commentObj.getHTMLElement());
    }
  }
}
