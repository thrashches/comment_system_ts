import { Storage } from "./storage.js";
import { PostComment } from "./comments.js";
import { getCommentsBlock } from "./domUtils.js";
import { CommentType } from "./types.js";

class Renderer {
  // Класс отвечающий за рендеринг комментариев
  storage: Storage;
  ordering?: string;
  favoritedOnly: boolean = false;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  public setOrdering(ordering: string): void {
    // Устанавливает значение сортировки
    // Иницирует перерисовку комментариев
    this.ordering = ordering;
    this.clearComments();
    this.renderComments();
  }

  public switchFavoritedOnly(): void {
    // Переключение фильтрации по избранному
    this.favoritedOnly = !this.favoritedOnly;
    const favoritedOnlySpan: HTMLElement = <HTMLElement>(
      document.getElementById("favoritedOnlySpan")
    );
    favoritedOnlySpan.classList.toggle("text__secondary");
    favoritedOnlySpan.classList.toggle("text__warning");
    this.clearComments();
    this.renderComments();
  }

  private clearComments(): void {
    // Очищение блока с комментариями
    for (let comment of this.storage.comments) {
      const commentWrapper: HTMLElement | null = document.getElementById(
        `comment${comment.id}`
      );
      if (commentWrapper) {
        commentWrapper.remove();
      }
    }
  }

  private getOrderedComments(): Array<CommentType> {
    // Сортировка комментариев
    if (this.ordering === "byDate") {
      return this.storage.comments.sort((x, y) => {
        return x.published - y.published;
      });
    } else if (this.ordering === "byRating") {
      return this.storage.comments.sort((x, y) => {
        return y.rating - x.rating;
      });
    } else if (this.ordering === "byActual") {
      return this.storage.comments.sort((x, y) => {
        return y.published - x.published;
      });
    } else if (this.ordering === "byAnswers") {
      return this.storage.comments.sort((x, y) => {
        return (
          this.storage.getAnswersCount(y.id) -
          this.storage.getAnswersCount(x.id)
        );
      });
    } else {
      return this.storage.comments;
    }
  }

  public renderComments(): void {
    // Отрисовка всех комментариев
    this.storage.refresh();
    const savedComments = this.getOrderedComments().filter((x) => {
      if (this.favoritedOnly) {
        return x.favorited;
      }
      return x;
    });
    if (savedComments) {
      const mainIds: Array<number> = new Array();
      for (let commentData of savedComments) {
        if (!commentData.replyTo) {
          const commentObj = new PostComment(
            commentData.user,
            commentData.text,
            commentData.published,
            commentData.id,
            commentData.replyTo,
            commentData.favorited,
            commentData.rating
          );
          const comments: HTMLElement = <HTMLElement>(
            document.getElementById("comments")
          );
          comments.appendChild(commentObj.getHTMLElement());
        }
      }
      for (let commentData of savedComments) {
        if (commentData.replyTo) {
          const commentObj = new PostComment(
            commentData.user,
            commentData.text,
            commentData.published,
            commentData.id,
            commentData.replyTo,
            commentData.favorited,
            commentData.rating
          );

          const comments: HTMLElement = getCommentsBlock(commentData.replyTo);
          comments.appendChild(commentObj.getHTMLElement());
        }
      }
    }
  }
}

export default Renderer;
