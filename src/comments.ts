import { User } from "./users.js";
import { getUniqueCommentId } from "./storage.js";
import { getSavedComments } from "./storage.js";
import { CommentType } from "./types.js";
import {
  moveCommentInput,
  getCommentsBlock,
  getCommentInput,
} from "./domUtils.js";
import { Storage } from "./storage.js";

class PostComment {
  // Класс комментария
  id: number;
  user: User;
  text: string;
  published: number;
  rating: number = 0;
  favorited: boolean = false;
  replyTo: number | null = null;

  constructor(user: User, text: string, published?: number, id?: number, replyTo?: number | null, favorited?: boolean) {
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

  setReplyTo(replyTo: number | null) {
    // Сеттер id комментария, на который написан ответ
    this.replyTo = replyTo;
  }

  setFavorited(favorited: boolean) {
    // Сеттер для favorited
    this.favorited = favorited;
  }

  switchFavorited() {
    // Переключает нахождение в избранном
    this.favorited = !this.favorited;
    this.saveToLocalStorage(true);
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

  getAnswerBtn(): HTMLElement | null {
    // Кнопка ответить
    if (this.replyTo) {
      return null;
    }
    const answerBtnWrapper = this.getWrappedItem("comment__footer__item");
    const answerIcon: HTMLElement = document.createElement("i");
    answerIcon.classList.add("icon");
    answerIcon.classList.add("icon__answer");
    const answerA: HTMLAnchorElement = document.createElement("a");
    answerA.appendChild(answerIcon);
    answerA.innerHTML += " Ответить";
    answerA.classList.add("text__secondary");
    // answerA.href = "#";
    answerA.setAttribute("id", `replyTo${this.id}`);
    answerA.addEventListener("click", () => {
      moveCommentInput(this.id);
    });
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
    // favoriteA.href = "#";
    favoriteA.classList.add("text__secondary");
    favoriteA.addEventListener("click", () => {
      this.switchFavorited();
    });
    favoriteBtnWrapper.appendChild(favoriteA);
    return favoriteBtnWrapper;
  }

  getFooter(): HTMLElement {
    // Подвал комментария
    const footer = this.getWrappedItem("comment__footer");
    const answerBtnWrapper = this.getAnswerBtn();
    const favoriteBtnWrapper = this.getFavoriteBtn();
    if (answerBtnWrapper) {
      footer.appendChild(answerBtnWrapper);
    }
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
    if (!this.replyTo) {
      const answers = this.getWrappedItem("comment__answers");
      answers.setAttribute("id", `replysTo${this.id}`);
      answers.setAttribute("data-reply-to", this.id.toString());
      answers.innerHTML = `<div id="replysToInputSeparator${this.id}" hidden></div>`;
      commentDiv.appendChild(answers);
    }
    return commentDiv;
  }

  saveToLocalStorage(update: boolean = false): void {
    // Сохранение комментариев
    const storage = new Storage();

    // const storage: Array<CommentType> | null = getSavedComments();
    if (update) {
      storage.updateCommentData(this.id, this);
    } else {
      storage.addCommentData(this);
    }
    //   storage.push(this);
    //   window.localStorage.setItem("comments", JSON.stringify(storage));
    // } else {
    //   window.localStorage.setItem("comments", JSON.stringify([this]));
    // }
  }

  removeFromLocalStorage() {
    const storage: Array<CommentType> | null = getSavedComments();
    console.log(storage);
    if (storage) {
      for (let index = 0; index <= storage.length; index++) {
        console.log(storage[index]);
        if (storage[index].id === this.id) {
          console.log("zzzzzzzzzzzzzzzz");
          storage.splice(index, 1);
          localStorage.setItem("comments", JSON.stringify(storage));
        }
      }
    }
  }
}

function addComment(user: User, replyTo?: number) {
  // Добавление нового комментария на страницу
  const commentInput: HTMLTextAreaElement = getCommentInput();
  if (commentInput.value.length) {
    //   const user: User = testUsers[0];
    const counter: HTMLSpanElement = <HTMLSpanElement>(
      document.getElementById("counter")
    );
    const newComment: PostComment = new PostComment(user, commentInput.value);
    if (replyTo) {
      newComment.setReplyTo(replyTo);
    }
    const comments = getCommentsBlock(replyTo);
    const element: HTMLElement = newComment.getHTMLElement();

    comments.appendChild(element);
    commentInput.value = "";
    counter.innerText = "0";
    newComment.saveToLocalStorage();
    moveCommentInput();
  }
}

export { PostComment, addComment };
