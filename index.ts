


class PostComment {
    userId: number;
    text: string;
    published: number;
    rating: number = 0;

    constructor(userId: number, text: string, published?: number) {
        if (published) {
            this.published = published;
        }
        else {
            this.published = Date.now();
        }
        this.text = text;
        this.userId = userId;
    }
}