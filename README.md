# ZephyrDB JavaScript Client

The official JavaScript client for ZephyrDB - the serverless database built for developers who move fast.

[![npm version](https://badge.fury.io/js/zephyr-db.svg)](https://www.npmjs.com/package/zephyr-db)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is ZephyrDB?

ZephyrDB is a next-generation serverless database with global edge network, sub-50ms latency, and unlimited scaling. Build without limits.

**Coming Q2-Q3 2025:**
- 🌍 **Global Edge Network** - 15+ regions worldwide
- ⚡ **Instant Scaling** - Zero to millions instantly
- 🔄 **Real-time Events** - Live data updates
- 💰 **Pay-as-you-Scale** - Start free, pay for usage
- 🔧 **Cloud Functions** - Edge computing made simple

## Installation

### NPM (React, Vue, Angular, etc.)
```bash
npm install zephyr-db
```

### CDN (Vanilla HTML/JS)
```html
<script src="https://cdn.jsdelivr.net/npm/zephyr-db@latest/dist/zephyr-db.min.js"></script>
```

## Quick Start

### Modern JavaScript/React
```javascript
import ZephyrDB from 'zephyr-db';

const db = new ZephyrDB('your-project-id', {
    onConnect: () => console.log('🚀 Connected!'),
    secure: true
});

// Create data
await db.create('users/john', {
    name: 'John Doe',
    email: 'john@example.com'
});

// Get data
const user = await db.get('users/john');

// Update data
await db.update('users/john/email', 'newemail@example.com');

// Real-time updates
db.watch('update', 'users/john')
    .then(data => console.log('Updated:', data));
```

### Vanilla JavaScript
```html
<script src="https://cdn.jsdelivr.net/npm/zephyr-db@latest/dist/zephyr-db.min.js"></script>
<script>
    const db = new ZephyrDB('your-project-id');
    
    async function createUser() {
        await db.create('users/jane', { name: 'Jane Smith' });
        const user = await db.get('users/jane');
        console.log('User:', user);
    }
    
    createUser();
</script>
```

### React Example
```javascript
import { useState, useEffect } from 'react';
import ZephyrDB from 'zephyr-db';

function App() {
    const [db] = useState(new ZephyrDB('your-project-id'));
    const [users, setUsers] = useState([]);
    
    const addUser = async () => {
        await db.create(`users/${Date.now()}`, { 
            name: 'New User',
            email: 'user@example.com'
        });
        loadUsers();
    };
    
    const loadUsers = async () => {
        const data = await db.get('users');
        setUsers(Object.values(data || {}));
    };
    
    useEffect(() => {
        loadUsers();
        // Real-time updates
        db.watch('create', 'users').then(() => loadUsers());
    }, []);
    
    return (
        <div>
            <button onClick={addUser}>Add User</button>
            {users.map(user => <div key={user.email}>{user.name}</div>)}
        </div>
    );
}
```

## API Reference

### Constructor Options
```javascript
const db = new ZephyrDB(projectId, {
    onConnect: () => {},      // Connection callback
    onClose: () => {},        // Disconnect callback  
    secure: true,             // Use WSS (recommended)
    reconnect: true,          // Auto-reconnect
    maxReconnectAttempts: 5   // Max reconnection tries
});
```

### Core Methods

**Data Operations**
```javascript
await db.create(path, data)           // Create new data
await db.get(path)                    // Read data
await db.update(path, data)           // Update data  
await db.delete(path)                 // Delete data
await db.exist(path)                  // Check if exists
await db.keys(path)                   // Get all keys
```

**Real-time Features**
```javascript
db.watch(command, path)               // Watch for changes
db.on(command, path)                  // Listen for events
await db.stop(event, command, path)   // Stop watching
```

**Advanced**
```javascript
await db.run(path, args)              // Run cloud functions
await db.size(path)                   // Get collection size
await db.sort(path, options)          // Sort data
```

## Error Handling
```javascript
const db = new ZephyrDB('project-id', {
    onError: (error) => console.error('DB Error:', error),
    onClose: () => console.log('Connection lost')
});

try {
    await db.create('users/123', { name: 'John' });
} catch (error) {
    console.error('Failed:', error);
}
```

## Get Started with ZephyrDB

### 1. Join the Waitlist
ZephyrDB launches **Q2 2025**. [Join our waitlist](https://zephyrdb.com) for early access.

### 2. Early Access Benefits
- 🎁 Free credits to get started
- 🏆 Lifetime benefits for early adopters
- 🚀 Priority support

### 3. Migration from Firebase
```javascript
// Firebase - Complex setup
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
const app = initializeApp(config);
const firestore = getFirestore(app);
await setDoc(doc(firestore, 'users', 'john'), data);

// ZephyrDB - Simple and clean
import ZephyrDB from 'zephyr-db';
const db = new ZephyrDB('project-id');
await db.create('users/john', data);
```

## License

MIT © 2025 ZephyrDB

## Support

- 📧 [help@zephyrdb.com](mailto:help@zephyrdb.com)
- 📖 [Documentation](https://docs.zephyrdb.com)
- 🐛 [GitHub Issues](https://github.com/Zephyr-DB/ZephyrDB-Browser/issues)

---

**Ready to build fast?** [Join the ZephyrDB waitlist](https://zephyrdb.com) today.

*Built with ❤️ for developers who move fast.*