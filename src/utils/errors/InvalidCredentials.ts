class InvalidCredentialsError extends Error {
    public code = ''
    constructor(message: string | undefined = "Invalid user credentials.") {
        super(message)
        this.code = "INVALID_CREDENTIALS"
    }
}

export default InvalidCredentialsError
