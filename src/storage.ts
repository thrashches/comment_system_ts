import { CommentType } from "./types.js";

// id комментариев для проверки на уникальность и назначения следующего id
const commentIds: Array<number> = new Array();

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

function initEmptyCommentsStorage() {
  window.localStorage.setItem("comments", "[]");
  return new Array();
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

function getSavedCommentIds(): Array<number> | null {
  const commentIdsString = window.localStorage.getItem("commentIds");
  if (commentIdsString) {
    return JSON.parse(commentIdsString);
  }
  return null;
}

function initEmptyCommentIds(): Array<number> {
  window.localStorage.setItem("commentIds", "[]");
  return new Array();
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
  commentIds: Array<number>;

  constructor() {
    const savedComments = getSavedComments();
    if (savedComments) {
      this.comments = savedComments;
    } else {
      this.comments = initEmptyCommentsStorage();
    }
    const savedCommentIds = getSavedCommentIds();
    if (savedCommentIds) {
      this.commentIds = savedCommentIds;
    } else {
      this.commentIds = initEmptyCommentIds();
    }
  }

  public getCommentData(id: number): CommentType | null {
    // Получение из localStorage по id
    if (id in this.commentIds) {
      for (let commentData of this.comments) {
        if (commentData.id === id) {
          return commentData;
        }
      }
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

  public addCommentData(data: CommentType): void {
    // Добавление комментария в localStorage
    this.comments.push(data);
    this.save();
  }

  public updateCommentData(id: number, data: CommentType): void {
      this.removeCommentData(id);
      this.addCommentData(data);
  }

  save() {
    // Синхронизация с localStorage
    window.localStorage.setItem("comments", JSON.stringify(this.comments));
    window.localStorage.setItem("commentIds", JSON.stringify(this.commentIds));
  }
}

export { getUniqueCommentId, getSavedComments, Storage };
