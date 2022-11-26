// Поле ввода комментария
const commentInput: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById('commentInput');

// div вокруг кнопки
const btnWrapper: HTMLElement = <HTMLElement>document.getElementById('btnWrapper');

// Кнопка создания комментария
const sendBtn: HTMLElement | null = document.getElementById('sendBtn');

// Количество введенных символов в поле ввода
const counter: HTMLSpanElement = <HTMLSpanElement>document.getElementById('counter');

// Параграф со счетчиком
const counterP: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('counterP');

if (commentInput && sendBtn) {
    commentInput.addEventListener('focusin', () => {
        // Подветка кнопки и разворот инпута при фокусе
        commentInput.setAttribute('rows', "8");
        sendBtn.classList.replace('btn__default', 'btn__success');
    });
    commentInput.addEventListener('focusout', () => {
        // Затемнение кнопки и сворачивание инпута при расфокусе
        commentInput.setAttribute('rows', "1");
        sendBtn.classList.replace('btn__success', 'btn__default');
    }
    );
    commentInput.addEventListener('input', () => {
        // Работа счетчика символов
        const newCommentLength: number = commentInput.value.length;
        counter.textContent = newCommentLength.toString();
        if (newCommentLength > 1000) {
            const warningMessage: HTMLParagraphElement = document.createElement('p');
            warningMessage.setAttribute('id', 'warningMessage');
            warningMessage.classList.add('text__warning');
            warningMessage.classList.add('text-14');
            warningMessage.innerText = 'Слишком длинное сообщение';
            btnWrapper.classList.add('top-offset');
            counterP.classList.replace('text__secondary', 'text__warning');
            btnWrapper.insertBefore(warningMessage, sendBtn);
        }
        else {
            const warningMessage: HTMLElement | null = document.getElementById('warningMessage');
            if (warningMessage) {
                warningMessage.remove();
                btnWrapper.classList.remove('top-offset');
                counterP.classList.replace('text__warning', 'text__secondary');
            }
        }
    })
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
    replyTo: PostComment | null = null;

    constructor(user: User, text: string, published?: number) {
        if (published) {
            this.published = published;
        }
        else {
            this.published = Date.now();
        }
        this.text = text;
        this.user = user;
    }
}