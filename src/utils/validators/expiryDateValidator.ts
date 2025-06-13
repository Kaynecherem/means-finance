const expiryDateValidator = (_: unknown, value: { month: string; year: string }) => {

    if (!value) {
        // eslint-disable-next-line no-template-curly-in-string
        return Promise.reject(new Error("Please enter ${label}"));
    }

    const { month, year } = value;
    // eslint-disable-next-line no-template-curly-in-string
    const errorMessage = "${label} is invalid"
    // Ensure both month and year are present
    if (!month || !year) {
        return Promise.reject(new Error(errorMessage));
    }

    // Ensure the month is between 01 and 12
    const monthNum = parseInt(month, 10);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return Promise.reject(new Error(errorMessage));
    }

    // Ensure the year is in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const inputYear = parseInt(year, 10);

    if (isNaN(inputYear) || inputYear < currentYear) {
        return Promise.reject(new Error(errorMessage));
    }

    // If it's the current year, make sure the month is in the future
    if (inputYear === currentYear && monthNum < currentDate.getMonth() + 1) {
        return Promise.reject(new Error(errorMessage));
    }

    return Promise.resolve();
};
export default expiryDateValidator  
