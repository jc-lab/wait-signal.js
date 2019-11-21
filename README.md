# EXAMPLE

### JAVASCRIPT
```javascript
const WaitEvent = require('wait-event');

const ready1 = new WaitEvent();
const ready2 = new WaitEvent();

(async() => {
    try {
        let result = await ready1.wait();
        console.log("WAIT-1 SUCCESS: ", result);
    }catch(e){
        console.log("WAIT-1 THROW: ", e.message);
    }
})();

(async() => {
    ready1.wait((result, e) => {
        if(e) {
            console.log("WAIT-2 THROW: ", e.message);
            return ;
        }
        console.log("WAIT-2 SUCCESS: ", result);
    });
})();

ready1.signal("*SIGNAL*");
ready2.throw(new Error('Test Throw Message'));

(async() => {
    try {
        let result = await ready2.wait();
        console.log("WAIT-3 SUCCESS: ", result);
    }catch(e){
        console.log("WAIT-3 THROW: ", e.message);
    }
})();

(async() => {
    ready2.wait((result, e) => {
        if(e) {
            console.log("WAIT-4 THROW: ", e.message);
            return ;
        }
        console.log("WAIT-4 SUCCESS: ", result, " / ", e);
    });
})();
```

### TYPESCRIPT
```typescript
import WaitEvent from 'wait-event'

const ready1 = new WaitEvent<string>();
const ready2 = new WaitEvent<string>();

(async() => {
    try {
        let result: string = await ready1.wait();
        console.log("WAIT-1 SUCCESS: ", result);
    }catch(e){
        console.log("WAIT-1 THROW: ", e.message);
    }
})();

(async() => {
    ready1.wait((result: string, e) => {
        if(e) {
            console.log("WAIT-2 THROW: ", e.message);
            return ;
        }
        console.log("WAIT-2 SUCCESS: ", result);
    });
})();

ready1.signal("*SIGNAL*");
ready2.throw(new Error('Test Throw Message'));

(async() => {
    try {
        let result: string = await ready2.wait();
        console.log("WAIT-3 SUCCESS: ", result);
    }catch(e){
        console.log("WAIT-3 THROW: ", e.message);
    }
})();

(async() => {
    ready2.wait((result: string, e) => {
        if(e) {
            console.log("WAIT-4 THROW: ", e.message);
            return ;
        }
        console.log("WAIT-4 SUCCESS: ", result, " / ", e);
    });
})();
```

## LICENSE

This software may be modified and distributed under the terms of the Apache License 2.0.  See the LICENSE file for details.
