// Поле ввода комментария
var commentInput = (document.getElementById("commentInput"));
// div вокруг кнопки
var btnWrapper = (document.getElementById("btnWrapper"));
// Кнопка создания комментария
var sendBtn = (document.getElementById("sendBtn"));
// Количество введенных символов в поле ввода
var counter = (document.getElementById("counter"));
// Параграф со счетчиком
var counterP = (document.getElementById("counterP"));
commentInput.addEventListener("focusin", function () {
    // Подветка кнопки и разворот инпута при фокусе
    commentInput.setAttribute("rows", "8");
    sendBtn.classList.replace("btn__default", "btn__success");
});
commentInput.addEventListener("focusout", function () {
    // Затемнение кнопки и сворачивание инпута при расфокусе
    commentInput.setAttribute("rows", "1");
    sendBtn.classList.replace("btn__success", "btn__default");
});
commentInput.addEventListener("input", function () {
    // Работа счетчика символов
    var newCommentLength = commentInput.value.length;
    counter.textContent = newCommentLength.toString();
    if (newCommentLength > 1000) {
        var warningMessage = document.createElement("p");
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
    else {
        var warningMessage = document.getElementById("warningMessage");
        if (warningMessage) {
            sendBtn.disabled = false;
            sendBtn.classList.replace("btn__default", "btn__success");
            warningMessage.remove();
            btnWrapper.classList.remove("top-offset");
            counterP.classList.replace("text__warning", "text__secondary");
        }
    }
});
function addComment() {
    // Добавление нового комментария на страницу
    if (commentInput.value.length) {
        var user = testUsers[0];
        var newComment = new PostComment(user, commentInput.value);
        var element = newComment.getHTMLElement();
        var comments = (document.getElementById("comments"));
        comments.appendChild(element);
        commentInput.value = "";
        counter.innerText = "0";
        newComment.saveToLocalStorage();
    }
}
sendBtn.addEventListener("click", function () {
    addComment();
});
commentInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && e.ctrlKey) {
        addComment();
    }
});
function getSavedComments() {
    // Загрузка сохраненных комментариев
    var commentsString = window.localStorage.getItem("comments");
    if (commentsString) {
        return JSON.parse(commentsString);
    }
    return null;
}
var User = /** @class */ (function () {
    function User(id, fullName, avatar) {
        this.id = id;
        this.fullName = fullName;
        this.avatar = avatar;
    }
    return User;
}());
var PostComment = /** @class */ (function () {
    function PostComment(user, text, published) {
        this.rating = 0;
        this.favorited = false;
        this.replyTo = null;
        if (published) {
            this.published = published;
        }
        else {
            this.published = Date.now();
        }
        this.text = text;
        this.user = user;
    }
    PostComment.prototype.getAvatar = function () {
        // Элемент аватара
        var commentAvatar = this.getWrappedItem("comment__avatar");
        commentAvatar.setAttribute("style", "background-image: url('".concat(this.user.avatar, "');"));
        return commentAvatar;
    };
    PostComment.prototype.getWrappedItem = function (cssClass) {
        // Элемент заголовка комментария(имя пользователя/дата/реплай)
        var wrappedItem = document.createElement("div");
        wrappedItem.classList.add(cssClass);
        return wrappedItem;
    };
    PostComment.prototype.getTimestamp = function () {
        // Получаем текущую дату/время в виде строки
        var date = new Date(this.published);
        return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, " ").concat(date.getHours(), ":").concat(date.getMinutes());
    };
    PostComment.prototype.getTimestampItem = function () {
        // Возвращает div с датой и временем
        var timestampItem = this.getWrappedItem("comment__header__item");
        var timestampSpan = document.createElement("span");
        timestampSpan.classList.add("text__secondary");
        timestampSpan.classList.add("text-14");
        timestampSpan.innerText = this.getTimestamp();
        timestampItem.appendChild(timestampSpan);
        return timestampItem;
    };
    PostComment.prototype.getHeader = function () {
        // Заголовок комментария
        var header = this.getWrappedItem("comment__header");
        var fullNameWrapper = this.getWrappedItem("comment__header__item");
        var fullName = document.createElement("a");
        fullName.href = "#";
        fullName.innerText = this.user.fullName;
        fullNameWrapper.appendChild(fullName);
        header.appendChild(fullNameWrapper);
        if (this.replyTo) {
            // Если комментарий является ответом
        }
        header.appendChild(this.getTimestampItem());
        return header;
    };
    PostComment.prototype.getBody = function () {
        // Текст комментария
        var body = this.getWrappedItem("comment__body");
        var p = document.createElement("p");
        p.innerText = this.text;
        body.appendChild(p);
        return body;
    };
    PostComment.prototype.getAnswerBtn = function () {
        // Кнопка ответить
        var answerBtnWrapper = this.getWrappedItem("comment__footer__item");
        var answerIcon = document.createElement("i");
        answerIcon.classList.add("icon");
        answerIcon.classList.add("icon__answer");
        var answerA = document.createElement("a");
        answerA.appendChild(answerIcon);
        answerA.innerHTML += " Ответить";
        answerA.classList.add("text__secondary");
        answerA.href = "#";
        answerBtnWrapper.appendChild(answerA);
        return answerBtnWrapper;
    };
    PostComment.prototype.getFavoriteBtn = function () {
        // Кнопка избранное
        var favoriteBtnWrapper = this.getWrappedItem("comment__footer__item");
        var favoritedIcon = document.createElement("i");
        favoritedIcon.classList.add("icon");
        if (this.favorited) {
            favoritedIcon.classList.add("icon__in-favorites");
        }
        else {
            favoritedIcon.classList.add("icon__not-in-favorites");
        }
        var favoriteA = document.createElement("a");
        favoriteA.appendChild(favoritedIcon);
        if (this.favorited) {
            favoriteA.innerHTML += " В избранном";
        }
        else {
            favoriteA.innerHTML += " В избранное";
        }
        favoriteA.href = "#";
        favoriteA.classList.add("text__secondary");
        favoriteBtnWrapper.appendChild(favoriteA);
        return favoriteBtnWrapper;
    };
    PostComment.prototype.getFooter = function () {
        // Подвал комментария
        var footer = this.getWrappedItem("comment__footer");
        var answerBtnWrapper = this.getAnswerBtn();
        var favoriteBtnWrapper = this.getFavoriteBtn();
        footer.appendChild(answerBtnWrapper);
        footer.appendChild(favoriteBtnWrapper);
        return footer;
    };
    PostComment.prototype.getHTMLElement = function () {
        // div с комментарием, аватаром и тд
        var commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        commentDiv.appendChild(this.getAvatar());
        commentDiv.appendChild(this.getHeader());
        commentDiv.appendChild(this.getBody());
        commentDiv.appendChild(this.getFooter());
        return commentDiv;
    };
    PostComment.prototype.saveToLocalStorage = function () {
        var storage = getSavedComments();
        if (storage) {
            storage.push(this);
            window.localStorage.setItem("comments", JSON.stringify(storage));
        }
        else {
            window.localStorage.setItem("comments", JSON.stringify([this]));
        }
    };
    return PostComment;
}());
var testUsers = [
    new User(1, "Максим Авдеенко", "https://picsum.photos/id/1/100"),
    new User(2, "Алексей_1994b", "https://picsum.photos/id/2/100"),
    new User(3, "Джунбокс3000", "https://picsum.photos/id/3/100"),
];
var savedComments = getSavedComments();
if (savedComments) {
    for (var _i = 0, savedComments_1 = savedComments; _i < savedComments_1.length; _i++) {
        var commentData = savedComments_1[_i];
        var user = new User(commentData.user.id, commentData.user.fullName, commentData.user.avatar);
        var comment = new PostComment(user, commentData.text, commentData.published);
        var comments = document.getElementById('comments');
        comments.appendChild(comment.getHTMLElement());
    }
}
