class ForbiddenError extends Error {
    public code = ''
    constructor(message: string | undefined = "Please login to access this.") {
        super(message)
        this.code = "FORBIDDEN"
    }
}

export default ForbiddenError
