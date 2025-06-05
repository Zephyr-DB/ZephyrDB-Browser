/**
 * ZephyrDB WebSocket Client
 * A real-time database client library
 */

class ZephyrDB {
    constructor(projectId, options = {}) {
        // Handle both old and new parameter formats
        if (typeof options === 'function') {
            // Legacy format: (projectId, onconnect, onclose, secure, host)
            options = {
                onConnect: arguments[1],
                onClose: arguments[2],
                secure: arguments[3],
                host: arguments[4]
            };
        }

        const {
            onConnect = (e) => console.log("ZephyrDB is ready!"),
            onClose = (e) => console.log("ZephyrDB connection lost!"),
            secure = true,
            host = "db.zephyrdb.com",
            port = 42600,
            reconnect = true,
            reconnectDelay = 1000,
            maxReconnectAttempts = 5
        } = options;

        this.projectId = projectId;
        this.options = { onConnect, onClose, secure, host, port, reconnect, reconnectDelay, maxReconnectAttempts };
        this.id = 0;
        this.lazy_sep = "\t\n\"lazy_sep\"\t\n";
        this.callbacks = {};
        this.messageQueue = [];
        this.reconnectAttempts = 0;
        this.isConnected = false;

        this.connect();
    }

    connect() {
        const { secure, host, port, onConnect, onClose } = this.options;
        const protocol = secure ? "wss" : "ws";

        try {
            this.ws = new WebSocket(`${protocol}://${this.projectId}.${host}:${port}`);

            this.ws.onopen = (e) => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                onConnect(e);
            };

            this.ws.onclose = (e) => {
                this.isConnected = false;
                onClose(e);
                this.handleReconnect();
            };

            this.ws.onerror = (e) => {
                console.error("ZephyrDB WebSocket error:", e);
            };

            this.ws.onmessage = (e) => {
                this.handleMessage(e);
            };

            // Start message queue processor
            this.startQueueProcessor();

        } catch (error) {
            console.error("Failed to connect to ZephyrDB:", error);
            this.handleReconnect();
        }
    }

    handleReconnect() {
        if (!this.options.reconnect || this.reconnectAttempts >= this.options.maxReconnectAttempts) {
            return;
        }

        this.reconnectAttempts++;
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect();
        }, this.options.reconnectDelay);
    }

    startQueueProcessor() {
        if (this.queueInterval) {
            clearInterval(this.queueInterval);
        }

        this.queueInterval = setInterval(() => {
            if (this.messageQueue.length > 0 && this.isConnected && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(this.messageQueue.join("|"));
                this.messageQueue = [];
            }
        }, 100);
    }

    handleMessage(e) {
        const messages = e.data.split("|");

        for (const msg of messages) {
            try {
                const data = this.messageToJavascript(msg);
                const callback = this.callbacks[data.id];

                if (callback) {
                    if (data.s) {
                        callback.resolve(data.r);
                    } else {
                        callback.reject(data.r);
                    }

                    if (callback.sync) {
                        callback.sync(data.r);
                    } else {
                        delete this.callbacks[data.id];
                    }
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        }
    }

    messageToJavascript(msg) {
        return JSON.parse(msg.replaceAll(this.lazy_sep, "|"));
    }

    javascriptToMessage(data) {
        const msg = JSON.stringify(data);
        return msg.replaceAll("|", this.lazy_sep);
    }

    send(name, args, callback = console.log) {
        return new Promise((resolve, reject) => {
            const id = ++this.id;
            const message = this.javascriptToMessage({
                c: name,
                id: id,
                a: args
            });

            if (message.includes("|")) {
                reject(new Error("Message cannot contain '|' characters"));
                return;
            }

            this.callbacks[id] = { resolve, reject };

            if (["get", "on", "watch", "size", "sort"].includes(name)) {
                this.callbacks[id].sync = callback;
            }

            this.messageQueue.push(message);
        });
    }

    // Helper method to split keyPath
    _splitKeyPath(keyPath) {
        return typeof keyPath === 'string' ? keyPath.split("/") : keyPath;
    }

    // Authentication methods
    async forgotPassword(email) {
        return this.send("forgot_password", { email });
    }

    async editPassword(password, uid = "") {
        return this.send("edit_password", { password, uid });
    }

    async connect(email, password) {
        return this.send("connect", { email, password });
    }

    async register(email, password, username, fullName = "") {
        return this.send("register", {
            email,
            username,
            full_name: fullName,
            password
        });
    }

    // Database operations
    async create(keyPath, value = {}, w = true) {
        return this.send("create", {
            keyPath: this._splitKeyPath(keyPath),
            value,
            w
        });
    }

    async append(keyPath, value = {}) {
        return this.send("append", {
            keyPath: this._splitKeyPath(keyPath),
            value
        });
    }

    on(command, keyPath) {
        return {
            then: async (fn) => {
                return this.send("on", {
                    keyPath: this._splitKeyPath(keyPath),
                    command
                }, fn);
            }
        };
    }

    watch(command, keyPath) {
        return {
            then: async (fn) => {
                return this.send("watch", {
                    keyPath: this._splitKeyPath(keyPath),
                    command
                }, fn);
            }
        };
    }

    async ping(keyPath, data = {}, uid = '') {
        return this.send("ping", {
            keyPath: this._splitKeyPath(keyPath),
            data,
            uid
        });
    }

    async pong(keyPath, data = {}, uid = '') {
        return this.send("pong", {
            keyPath: this._splitKeyPath(keyPath),
            data,
            uid
        });
    }

    async stop(event, command, keyPath) {
        return this.send("stop", {
            event,
            command,
            keyPath: this._splitKeyPath(keyPath)
        });
    }

    size(keyPath) {
        return {
            then: async (fn) => {
                return this.send("size", {
                    keyPath: this._splitKeyPath(keyPath)
                }, fn);
            }
        };
    }

    sort(keyPath, split = { char: "_", num: 1 }, result = { count: 10, start: 0, order: "asc" }, order = "asc") {
        return {
            then: async (fn) => {
                return this.send("sort", {
                    keyPath: this._splitKeyPath(keyPath),
                    split,
                    result,
                    order
                }, fn);
            }
        };
    }

    async get(keyPath, depth = 99) {
        return this.send("get", {
            keyPath: this._splitKeyPath(keyPath),
            depth
        });
    }

    async exist(keyPath) {
        return this.send("exist", {
            keyPath: this._splitKeyPath(keyPath)
        });
    }

    async update(keyPath, value, w = true) {
        return this.send("update", {
            keyPath: this._splitKeyPath(keyPath),
            value,
            w
        });
    }

    async delete(keyPath) {
        return this.send("delete", {
            keyPath: this._splitKeyPath(keyPath)
        });
    }

    async keys(keyPath, filter = "all") {
        return this.send("keys", {
            keyPath: this._splitKeyPath(keyPath),
            filter
        });
    }

    // Group operations
    async join(gid) {
        return this.send("join", { gid });
    }

    async invite(gid, uid, role) {
        return this.send("invite", { gid, uid, role });
    }

    async leave(gid) {
        return this.send("leave", { gid });
    }

    async run(keyPath, args = {}) {
        return this.send("run", {
            keyPath: this._splitKeyPath(keyPath),
            args
        });
    }

    async dnsResolve(domainName) {
        return this.send("dns_resolve", { domain_name: domainName });
    }

    // Connection management
    disconnect() {
        if (this.queueInterval) {
            clearInterval(this.queueInterval);
        }
        if (this.ws) {
            this.ws.close();
        }
        this.isConnected = false;
    }

    getConnectionState() {
        return {
            isConnected: this.isConnected,
            readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED,
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    // Node.js
    module.exports = ZephyrDB;
} else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], function() {
        return ZephyrDB;
    });
} else {
    // Browser global
    window.ZephyrDB = ZephyrDB;
}
