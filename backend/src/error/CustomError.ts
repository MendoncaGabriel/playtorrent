class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Necessário para que instanceof funcione corretamente em subclasses
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class ValidationError extends CustomError {
    constructor(message: string) {
        super(message, 400);
    }
}

class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
    }
}

class InternalServerError extends CustomError {
    constructor(message: string) {
        super(message, 500);
    }
}
