import AppError from "./AppError.js";

export default function mapDbError(err) {
    if (err instanceof AppError) {
        return err;
    }

    if (!err || !err.code) {
        return new AppError(
            "Internal Server Error",
            500,
            "INTERNAL_SERVER_ERROR"
        );
    }

    switch (err.code) {
        case "ER_DUP_ENTRY":
            return new AppError(
                "Resource already exists",
                409,
                err.code
            );

        case "ER_NO_REFERENCED_ROW":
        case "ER_NO_REFERENCED_ROW_2":
            return new AppError(
                "Referenced resource not found",
                404,
                err.code
            );

        case "ER_ROW_IS_REFERENCED":
        case "ER_ROW_IS_REFERENCED_2":
            return new AppError(
                "Resource is still referenced by other records",
                409,
                err.code
            );

        case "ER_BAD_NULL_ERROR":
        case "ER_NO_DEFAULT_FOR_FIELD":
        case "ER_DATA_TOO_LONG":
        case "ER_WARN_DATA_OUT_OF_RANGE":
        case "ER_TRUNCATED_WRONG_VALUE":
        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        case "ER_WRONG_VALUE_COUNT_ON_ROW":
            return new AppError(
                "Invalid data",
                400,
                err.code
            );

        case "ER_PARSE_ERROR":
        case "ER_BAD_FIELD_ERROR":
        case "ER_FIELD_SPECIFIED_TWICE":
        case "ER_NON_UNIQ_ERROR":
        case "ER_NO_SUCH_TABLE":
        case "ER_WRONG_FIELD_WITH_GROUP":
            return new AppError(
                "Database query error",
                500,
                err.code
            );

        case "ER_ACCESS_DENIED_ERROR":
        case "ER_DBACCESS_DENIED_ERROR":
        case "ER_TABLEACCESS_DENIED_ERROR":
        case "ER_COLUMNACCESS_DENIED_ERROR":
            return new AppError(
                "Database access denied",
                500,
                err.code
            );

        case "ER_BAD_DB_ERROR":
        case "ER_CON_COUNT_ERROR":
        case "ER_SERVER_SHUTDOWN":
        case "ECONNREFUSED":
        case "ECONNRESET":
        case "ENOTFOUND":
        case "ETIMEDOUT":
        case "PROTOCOL_CONNECTION_LOST":
        case "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR":
        case "PROTOCOL_ENQUEUE_AFTER_QUIT":
            return new AppError(
                "Database connection error",
                503,
                err.code
            );

        case "ER_LOCK_DEADLOCK":
        case "ER_LOCK_WAIT_TIMEOUT":
            return new AppError(
                "Database is busy, please try again",
                503,
                err.code
            );

        default:
            return new AppError(
                "Internal Server Error",
                500,
                err.code
            );
    }
}
