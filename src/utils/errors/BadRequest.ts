class BadRequestError extends Error {
    public code = ''
    constructor(message: string | undefined = "Bad Request") {
        super(message)
        this.code = "BAD_REQUEST"
    }
}

export default BadRequestError
