
export const successResponse = (res, message = "Success", data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, message = "Bad Request", errors = [], statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};

export const serverErrorResponse = (res, message = "Internal Server Error") => {
    return res.status(500).json({
        success: false,
        message,
    });
};

