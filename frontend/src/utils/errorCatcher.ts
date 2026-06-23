import { ErrorCode } from "models/Errors";

export const getErrorMessage = (error: unknown): string => {
    console.error("Error caught:", error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const appError = error as { code: ErrorCode; message: string };
        switch (appError.code) {
            case ErrorCode.InvalidRequest:
                return 'The request was invalid. Please check your input and try again.';
            case ErrorCode.InternalError:
                return 'An internal error occurred. Please try again later.';
            case ErrorCode.ConversationNotFound:
                return 'The requested conversation was not found.';
            case ErrorCode.InvalidApiKey:
                return 'The API key provided is invalid. Please check your configuration.';
            case ErrorCode.RateLimitExceeded:
                return 'You have exceeded the rate limit. Please wait and try again.';
            case ErrorCode.ServiceUnavailable:
                return 'The service is currently unavailable. Please try again later.'; 
            case ErrorCode.ServiceTemporarilyUnavailable:
                return 'The service is temporarily unavailable. Please try again later.';
            default:
                return 'An unknown error occurred. Please try again.';
        }   
    }

    return 'An unexpected error occurred. Please try again.';
}