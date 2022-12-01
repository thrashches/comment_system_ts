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

export { User };
