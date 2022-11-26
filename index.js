// Поле ввода комментария
var commentInput = document.getElementById('commentInput');
// div вокруг кнопки
var btnWrapper = document.getElementById('btnWrapper');
// Кнопка создания комментария
var sendBtn = document.getElementById('sendBtn');
// Количество введенных символов в поле ввода
var counter = document.getElementById('counter');
// Параграф со счетчиком
var counterP = document.getElementById('counterP');
if (commentInput && sendBtn) {
    commentInput.addEventListener('focusin', function () {
        // Подветка кнопки и разворот инпута при фокусе
        commentInput.setAttribute('rows', "8");
        sendBtn.classList.replace('btn__default', 'btn__success');
    });
    commentInput.addEventListener('focusout', function () {
        // Затемнение кнопки и сворачивание инпута при расфокусе
        commentInput.setAttribute('rows', "1");
        sendBtn.classList.replace('btn__success', 'btn__default');
    });
    commentInput.addEventListener('input', function () {
        // Работа счетчика символов
        var newCommentLength = commentInput.value.length;
        counter.textContent = newCommentLength.toString();
        if (newCommentLength > 1000) {
            var warningMessage = document.createElement('p');
            warningMessage.setAttribute('id', 'warningMessage');
            warningMessage.classList.add('text__warning');
            warningMessage.classList.add('text-14');
            warningMessage.innerText = 'Слишком длинное сообщение';
            btnWrapper.classList.add('top-offset');
            counterP.classList.replace('text__secondary', 'text__warning');
            btnWrapper.insertBefore(warningMessage, sendBtn);
        }
        else {
            var warningMessage = document.getElementById('warningMessage');
            if (warningMessage) {
                warningMessage.remove();
                btnWrapper.classList.remove('top-offset');
                counterP.classList.replace('text__warning', 'text__secondary');
            }
        }
    });
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
    return PostComment;
}());
