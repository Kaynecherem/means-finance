class SomethingWentWrongError extends Error {
    public code = ''
    constructor(message: string | undefined = "Something went wrong.") {
        super(message)
        this.code = "SOMETHING_WENT_WRONG"
    }
}

export default SomethingWentWrongError
