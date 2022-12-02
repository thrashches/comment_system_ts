import { User } from "./users.js";
import { getUniqueCommentId } from "./storage.js";
import {
  moveCommentInput,
  getCommentsBlock,
  getCommentInput,
  getWrappedItem,
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

  constructor(
    user: User,
    text: string,
    published?: number,
    id?: number,
    replyTo?: number | null,
    favorited?: boolean,
    rating?: number
  ) {
    if (published && id) {
      this.published = published;
      this.id = id;
    } else {
      this.published = Date.now();
      this.id = getUniqueCommentId();
    }
    replyTo && (this.replyTo = replyTo);
    favorited && (this.favorited = favorited);
    rating && (this.rating = rating);

    this.text = text;
    this.user = user;
  }

  public setReplyTo(replyTo: number | null): void {
    // Сеттер id комментария, на который написан ответ
    this.replyTo = replyTo;
  }

  public setFavorited(favorited: boolean): void {
    // Сеттер для favorited
    this.favorited = favorited;
  }

  private switchFavorited(): void {
    // Переключает нахождение в избранном
    this.favorited = !this.favorited;
    this.saveToLocalStorage(true);
    const favoritedBtn = document.getElementById(`favorited${this.id}`);
    if (favoritedBtn) {
      favoritedBtn.replaceWith(this.getFavoriteBtn());
    }
  }

  private incRating(): void {
    this.rating++;
    this.saveToLocalStorage(true);
    const ratingSpan = document.getElementById(`rating${this.id}`);
    ratingSpan && (ratingSpan.innerText = this.rating.toString());
  }

  private decRating(): void {
    this.rating--;
    this.saveToLocalStorage(true);
    const ratingSpan = document.getElementById(`rating${this.id}`);
    ratingSpan && (ratingSpan.innerText = this.rating.toString());
  }

  private getAvatar(): HTMLElement {
    // Элемент аватара
    const commentAvatar = getWrappedItem("comment__avatar");
    commentAvatar.setAttribute(
      "style",
      `background-image: url('${this.user.avatar}');`
    );
    return commentAvatar;
  }

  private getTimestamp(): string {
    // Получаем текущую дату/время в виде строки
    const date = new Date(this.published);
    return `${date.getDate()}.${
      date.getMonth() + 1
    } ${date.getHours()}:${date.getMinutes()}`;
  }

  private getTimestampItem(): HTMLElement {
    // Возвращает div с датой и временем
    const timestampItem: HTMLElement = getWrappedItem("comment__header__item");
    const timestampSpan: HTMLSpanElement = document.createElement("span");
    timestampSpan.classList.add("text__secondary");
    timestampSpan.classList.add("text-14");
    timestampSpan.innerText = this.getTimestamp();
    timestampItem.appendChild(timestampSpan);

    return timestampItem;
  }

  private getHeader(): HTMLElement {
    // Заголовок комментария
    const header: HTMLElement = getWrappedItem("comment__header");
    const fullNameWrapper: HTMLElement = getWrappedItem(
      "comment__header__item"
    );

    const fullName: HTMLAnchorElement = document.createElement("a");
    fullName.href = "#";
    fullName.innerText = this.user.fullName;
    fullNameWrapper.appendChild(fullName);
    header.appendChild(fullNameWrapper);

    if (this.replyTo) {
      // Если комментарий является ответом
      const storage = new Storage();
      const replyToElement: HTMLElement = getWrappedItem(
        "comment__header__item"
      );
      const replyFullName: string | undefined = storage.getCommentData(
        this.replyTo
      )?.user.fullName;
      if (replyFullName) {
        replyToElement.innerHTML = `<a><span class="text__secondary"><i class="icon icon__answer"></i> ${replyFullName}</span></a>`;
        header.appendChild(replyToElement);
      }
    }
    header.appendChild(this.getTimestampItem());
    return header;
  }

  private getBody(): HTMLElement {
    // Текст комментария
    const body = getWrappedItem("comment__body");
    const p = document.createElement("p");
    p.innerText = this.text;
    body.appendChild(p);
    return body;
  }

  private getAnswerBtn(): HTMLElement | null {
    // Кнопка ответить
    if (this.replyTo) {
      return null;
    }
    const answerBtnWrapper = getWrappedItem("comment__footer__item");
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

  private getFavoriteBtn(): HTMLElement {
    // Кнопка избранное
    const favoriteBtnWrapper = getWrappedItem("comment__footer__item");
    favoriteBtnWrapper.setAttribute("id", `favorited${this.id}`);
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

  private getRatingSwitch(): HTMLElement {
    // Кнопки рейтинга
    const ratingWrapper = getWrappedItem("comment__footer__item");
    const ratingSwitch = getWrappedItem("switch-wrapper");
    const decBtn = document.createElement("button");
    decBtn.innerText = "-";
    decBtn.classList.add("switch", "text__warning");
    decBtn.addEventListener("click", () => {
      // Уменьшение рейтинга
      this.decRating();
    });
    ratingSwitch.appendChild(decBtn);
    const incBtn = document.createElement("button");
    incBtn.innerText = "+";
    incBtn.classList.add("switch", "text__success");
    incBtn.addEventListener("click", () => {
      // Увеличение рейтинга
      this.incRating();
    });
    const ratingSpan = document.createElement("span");
    ratingSpan.innerText = this.rating.toString();
    ratingSpan.classList.add("text__success");
    ratingSpan.setAttribute("id", `rating${this.id}`);
    ratingSwitch.appendChild(ratingSpan);
    ratingSwitch.appendChild(incBtn);
    ratingWrapper.appendChild(ratingSwitch);
    return ratingWrapper;
  }

  private getFooter(): HTMLElement {
    // Подвал комментария
    const footer = getWrappedItem("comment__footer");
    const answerBtnWrapper = this.getAnswerBtn();
    const favoriteBtnWrapper = this.getFavoriteBtn();
    const ratingSwitch = this.getRatingSwitch();
    if (answerBtnWrapper) {
      footer.appendChild(answerBtnWrapper);
    }
    footer.appendChild(favoriteBtnWrapper);
    footer.appendChild(ratingSwitch);
    return footer;
  }

  public getHTMLElement(): HTMLElement {
    // div с комментарием, аватаром и тд
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");
    commentDiv.setAttribute("id", `comment${this.id}`);
    commentDiv.appendChild(this.getAvatar());
    commentDiv.appendChild(this.getHeader());
    commentDiv.appendChild(this.getBody());
    commentDiv.appendChild(this.getFooter());
    if (!this.replyTo) {
      const answers = getWrappedItem("comment__answers");
      answers.setAttribute("id", `replysTo${this.id}`);
      answers.setAttribute("data-reply-to", this.id.toString());
      answers.innerHTML = `<div id="replysToInputSeparator${this.id}" hidden></div>`;
      commentDiv.appendChild(answers);
    }
    return commentDiv;
  }

  public saveToLocalStorage(update: boolean = false): void {
    // Сохранение комментариев
    const storage = new Storage();
    if (update) {
      storage.updateCommentData(this.id, this);
    } else {
      storage.addCommentData(this);
    }
  }
}

function addComment(user: User, replyTo?: number): void {
  // Добавление нового комментария на страницу
  const commentInput: HTMLTextAreaElement = getCommentInput();
  if (commentInput.value.length) {
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
