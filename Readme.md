### Proposal and a few statements

This solution might be interpreted as over-enginered, however, the main idea is that the table could be dynamically rendered and easily updated and maintained.

The `key` property is responsible to render the table headers as much as the formatting of each column. It is also responsible to define which column is going to be sorted according to the proposed rule.

**Important:** the `key` of each row of the table that is about to be added/updated, must match to the `key` defined in the  column header.

Example:
```javascript
// headers key && rows key matching
const headers = [{ key: 'columnA', value: 'First Header Title' }, { key: 'columnB', value: 'Second Header Title' }];
const row = [{ key: 'columnA', value: 'First Cell' }, { key: 'columnB', value: 'Second Cell' }];
```

This solution was made focusing security specially to prevent XSS, mutability, and less number of direct DOM manipulation.

> **Why** exporting functions instead of using arrow functions? <br/> 
Although it makes the code more verbose, it makes easier to debug.

> **Why?** ES6 classes? <br/>
It is easier to understand an ES6 class. Also it turns the code easier to maintain, for programmers that are not yet used to javascript language.


### Available Commands

---

**App Start**

```shell-script
npm run start
```

**Tests**
```shell-script
npm run test
```

**Tests Coverage**
```shell-script
npm run test:coverage
```

### Architecture explained

---

Basically, the project follows this structure **(some files and folders were omitted)**:

```
├── es6
│   └── index.js
│   └── src.js
│   	└── controller
│   	└── html-elements
│   	└── utils
│   	└── contants.js
└── ...
```

**Files and folders explained**

* `es6/index.js`: Responsible for bootstraping the table and data update;
* `es6/controller`: Responsible for defining how is the data going to be displayed;
* `es6/html-elements/table`: Responsible for rendering and updating the table on DOM;
* `es6/utils.js`:  Auxiliary functions;
* `es6/constants.js`: Static variables.

---

Many Thanks, <br />
Gabriel Tosta, glhu@gft.com