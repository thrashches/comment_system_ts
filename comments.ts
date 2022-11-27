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
  user: User;
  text: string;
  published: number;
  rating: number = 0;
  favorited: boolean = false;
  replyTo: PostComment | null = null;

  constructor(user: User, text: string, published?: number) {
    if (published) {
      this.published = published;
    } else {
      this.published = Date.now();
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
    commentDiv.appendChild(this.getAvatar());
    commentDiv.appendChild(this.getHeader());
    commentDiv.appendChild(this.getBody());
    commentDiv.appendChild(this.getFooter());
    console.log(JSON.stringify(this));
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

export { User, PostComment };
