import { User } from "./users.js";
import { addComment } from "./comments.js";
import { Storage } from "./storage.js";
import Renderer from "./renderer.js";

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

// Меню сортировки
const sortToggle: HTMLAnchorElement = <HTMLAnchorElement>(
  document.getElementById("sortToggle")
);

// Элементы меню сортировки
const sortRadio: NodeListOf<HTMLElement> = document.getElementsByName("sort");

// Кнопка избранное вверху страницы
const favoritedOnly: HTMLElement = <HTMLElement>(
  document.getElementById("favoritedOnly")
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
    const existingWarning: HTMLElement | null =
      document.getElementById("warningMessage");
    if (!existingWarning) {
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
    }
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

sortToggle.addEventListener("click", () => {
  const sortDropdown: HTMLElement = <HTMLElement>(
    document.getElementById("sortDropdown")
  );
  const sortIcon: HTMLElement = <HTMLElement>(
    document.getElementById("sortIcon")
  );
  sortIcon.classList.toggle("rotated");
  sortDropdown.classList.toggle("hidden");
});

const testUsers = [
  new User(1, "Максим Авдеенко", "https://picsum.photos/id/1/100"),
  new User(2, "Алексей_1994b", "https://picsum.photos/id/2/100"),
  new User(3, "Джунбокс3000", "https://picsum.photos/id/3/100"),
];

for (let element of sortRadio) {
  // Смена сортировки
  element.addEventListener("change", (event) => {
    const sortMap = {
      byDate: "По дате",
      byRating: "По количеству оценок",
      byActual: "По актуальности",
      byAnswers: "По количеству ответов",
    };
    const input: EventTarget | null = event.target;
    if (input instanceof HTMLInputElement) {
      const sortToggleText: HTMLSpanElement = <HTMLSpanElement>(
        document.getElementById("sortToggleText")
      );
      type ObjectKey = keyof typeof sortMap;
      const sortText = input.value as ObjectKey;
      sortToggleText.textContent = sortMap[sortText];
      renderer.setOrdering(input.value);
    }
  });
}

favoritedOnly.addEventListener("click", (event) => {
  renderer.switchFavoritedOnly();
});

const storage = new Storage();
const renderer = new Renderer(storage);
renderer.renderComments();
