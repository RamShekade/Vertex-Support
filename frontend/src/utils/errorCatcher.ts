import axios from "axios";
import { ErrorCode } from "models/Errors";

export const getErrorMessage = (error: unknown): string => {
    console.error("Error caught:", error);

    if (axios.isAxiosError(error)) {

        const appError = error.response?.data as {
            code: ErrorCode;
            message: string;
        } | undefined;

        if (!appError) {
            return error.message;
        }
        console.error("AppError details:", appError);

        switch (appError.code) {
            case ErrorCode.InvalidRequest:
                return "The request was invalid. Please check your input.";

            case ErrorCode.InternalError:
                return "An internal error occurred. Please try again later.";

            case ErrorCode.ConversationNotFound:
                return "The requested conversation was not found.";

            case ErrorCode.InvalidApiKey:
                return "The API key provided is invalid.";

            case ErrorCode.RateLimitExceeded:
                return "You have exceeded the rate limit. Please wait and try again.";

            case ErrorCode.ServiceUnavailable:
                return "The service is currently unavailable.";

            case ErrorCode.ServiceTemporarilyUnavailable:
                return "The service is temporarily unavailable.";

            default:
                return appError.message;
        }
    }

    return "An unexpected error occurred.";
};