export interface APIResponse {
    status: {
        code: number;
        message: string;
    };
    data: {} | any;
}