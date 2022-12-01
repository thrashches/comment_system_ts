import { User } from "./users.js";
import { PostComment, addComment } from "./comments.js";
import { getSavedComments } from "./storage.js";
import { getCommentsBlock } from "./domUtils.js";

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

function getRandomUser(): User {
  // Получение случайного пользователя
  return testUsers[Math.floor(Math.random() * testUsers.length)];
}

sendBtn.addEventListener("click", () => {
  const commentInputWrapper: HTMLElement = <HTMLElement>(
    document.getElementById("commentInputWrapper")
  );
  if (commentInputWrapper.parentElement?.hasAttribute("data-reply-to")) {
    const replyTo = parseInt(
      <string>commentInputWrapper.parentElement.dataset.replyTo
    );
    addComment(testUsers[0], replyTo);
  } else {
    addComment(testUsers[0]);
  }
});

// commentInput.addEventListener("keypress", (e) => {
//   if (e.key === "Enter" && e.ctrlKey) {
//     addComment();
//   }
// });

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
        commentData.id,
        commentData.replyTo,
        commentData.favorited,
      );
      commentObj.setFavorited(commentData.favorited);
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
        commentData.id
      );
      commentObj.setFavorited(commentData.favorited);
      commentObj.setReplyTo(commentData.replyTo);
      // FIXME: BUG
      const comments: HTMLElement = getCommentsBlock(commentData.replyTo);
      comments.appendChild(commentObj.getHTMLElement());
    }
  }
}
