export enum ErrorCode {
    InvalidRequest = 'invalid_request',
    InternalError = 'internal_error',
    ConversationNotFound = 'conversation_not_found',
    InvalidApiKey = 'invalid_api_key',
    RateLimitExceeded = 'rate_limit_exceeded',
    ServiceUnavailable = 'service_unavailable',
    ServiceTemporarilyUnavailable = 'service_temporarily_unavailable',
}

export interface AppError {
    code: ErrorCode;
    message: string;
}