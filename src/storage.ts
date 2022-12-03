import { CommentType } from "./types.js";

function initEmptyCommentsStorage() {
  window.localStorage.setItem("comments", "[]");
  return new Array();
}

function getUniqueCommentId(): number {
  // Генерация нового id комментария
  const commentIds = getSavedComments()?.map((comment) => comment.id);
  if (commentIds?.length) {
    return Math.max(...commentIds) + 1;
  }
  return 1;
}

function getSavedComments(): Array<CommentType> | null {
  // Загрузка сохраненных комментариев
  const commentsString: string | null = window.localStorage.getItem("comments");
  if (commentsString) {
    return JSON.parse(commentsString);
  }
  return null;
}

class Storage {
  // Класс для чтения и сохранения в localStorage
  comments: Array<CommentType>;

  constructor() {
    const savedComments = getSavedComments();
    if (savedComments) {
      this.comments = savedComments;
    } else {
      this.comments = initEmptyCommentsStorage();
    }
  }

  public refresh(): void {
    // Обновление комментариев в Storage
    const savedComments = getSavedComments();
    if (savedComments) {
      this.comments = savedComments;
    }
  }

  public getCommentData(id: number): CommentType | null {
    // Получение из localStorage по id
    const commentIndex: number | undefined = this.comments.findIndex(
      (obj) => obj.id == id
    );
    if (!isNaN(commentIndex)) {
      return this.comments[commentIndex];
    }
    return null;
  }

  public removeCommentData(id: number): void {
    // Удаление комментария из localStorage
    for (let index = 0; index <= this.comments.length; index++) {
      if (this.comments[index].id === id) {
        this.comments.splice(index, 1);
        this.save();
        break;
      }
    }
  }

  public getAnswersCount(id: number): number {
    // Получение количества ответов на комментарий(для сортировки)
    return this.comments.filter((x) => {
      return x.replyTo === id;
    }).length;
  }

  public addCommentData(data: CommentType): void {
    // Добавление комментария в localStorage
    this.comments.push(data);
    this.save();
  }

  public updateCommentData(id: number, data: CommentType): void {
    const commentIndex = this.comments.findIndex((obj) => obj.id == id);
    this.comments[commentIndex] = data;
    this.save();
  }

  private save() {
    // Синхронизация с localStorage
    window.localStorage.setItem("comments", JSON.stringify(this.comments));
  }
}

export { getUniqueCommentId, getSavedComments, Storage };
