export interface ZephyrDBOptions {
    onConnect?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    secure?: boolean;
    host?: string;
    port?: number;
    reconnect?: boolean;
    reconnectDelay?: number;
    maxReconnectAttempts?: number;
}

export interface ConnectionState {
    isConnected: boolean;
    readyState: number;
    reconnectAttempts: number;
}

export interface SortOptions {
    char: string;
    num: number;
}

export interface SortResult {
    count: number;
    start: number;
    order: string;
}

export declare class ZephyrDB {
    constructor(projectId: string, options?: ZephyrDBOptions);

    // Authentication
    forgotPassword(email: string): Promise<any>;
    editPassword(password: string, uid?: string): Promise<any>;
    connect(email: string, password: string): Promise<any>;
    register(email: string, password: string, username: string, fullName?: string): Promise<any>;

    // Database operations
    create(keyPath: string | string[], value?: any, w?: boolean): Promise<any>;
    append(keyPath: string | string[], value?: any): Promise<any>;
    get(keyPath: string | string[], depth?: number): Promise<any>;
    update(keyPath: string | string[], value: any, w?: boolean): Promise<any>;
    delete(keyPath: string | string[]): Promise<any>;
    exist(keyPath: string | string[]): Promise<any>;
    keys(keyPath: string | string[], filter?: string): Promise<any>;

    // Real-time operations
    on(command: string, keyPath: string | string[]): { then: (fn: Function) => Promise<any> };
    watch(command: string, keyPath: string | string[]): { then: (fn: Function) => Promise<any> };
    stop(event: string, command: string, keyPath: string | string[]): Promise<any>;

    // Utility operations
    size(keyPath: string | string[]): { then: (fn: Function) => Promise<any> };
    sort(keyPath: string | string[], split?: SortOptions, result?: SortResult, order?: string): { then: (fn: Function) => Promise<any> };

    // Communication
    ping(keyPath: string | string[], data?: any, uid?: string): Promise<any>;
    pong(keyPath: string | string[], data?: any, uid?: string): Promise<any>;

    // Groups
    join(gid: string): Promise<any>;
    invite(gid: string, uid: string, role: string): Promise<any>;
    leave(gid: string): Promise<any>;

    // Execution
    run(keyPath: string | string[], args?: any): Promise<any>;
    dnsResolve(domainName: string): Promise<any>;

    // Connection management
    disconnect(): void;
    getConnectionState(): ConnectionState;
}

export default ZephyrDB;
