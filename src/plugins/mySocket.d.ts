export declare class WebSocketClient {
    constructor() {};

    connect(): void;

    sendMessage(message: any): void;

    onMessage(handler: any): void;
}