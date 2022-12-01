function moveCommentInput(id?: number) {
  // Перемещает поле ввода комментария внутри DOM для написания ответов
  const commentInputWrapper: Element = <Element>(
    document.querySelector("#commentInputWrapper")
  );

  if (id) {
    const replysToInputSeparator = document.querySelector(
      `#replysToInputSeparator${id}`
    );
    replysToInputSeparator?.before(commentInputWrapper);
  } else {
    const commentInputSeparator = document.querySelector(
      "#commentInputSeparator"
    );
    commentInputSeparator?.before(commentInputWrapper);
  }
}

function getCommentsBlock(replyTo?: number): HTMLElement {
  // Возвращет блок коментариев, в который необходимо добавить новый комментарий
  if (replyTo) {
    return <HTMLElement>document.getElementById(`replysTo${replyTo}`);
  }
  return <HTMLElement>document.getElementById("comments");
}

function getCommentInput(): HTMLTextAreaElement {
  // Возвращает поле ввода комментария
  const commentInput: HTMLTextAreaElement = <HTMLTextAreaElement>(
    document.getElementById("commentInput")
  );
  return commentInput;
}

export { moveCommentInput, getCommentsBlock, getCommentInput };
