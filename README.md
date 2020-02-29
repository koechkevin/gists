# Aurora Web App Frontend Setup

## 🚗 Getting Started

```Note

These instructions will get you a copy of the project up and running on
your local machine for development and testing purposes. And including
Project structure and coding standard, please review it seriously.
```

## 🔨 Prerequisites

* node >= 8.9.0
* typescript >= 3.0
* yarn >= 1.14.0 or npm >= 6.7.0
* git >= 2.10.1

## 🔧 Development Tools

* [VS Code](https://code.visualstudio.com/)
* [Chrome](https://www.google.com/chrome/)
* [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en-US)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en-US)
* [Node](https://nodejs.org/en/)

## 💻 Running Project

### `npm install` or `yarn install`

Install the packages

### `npm start` or `yarn start`

Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test` or `yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run mock` or `yarn build`

Run mock server and please access `http://localhost:3031` to test api if it's ready.

### `npm run tslint` or `yarn tslint`

Auto fix tslint errors.

## 🏯 Project Architecture

### Structure

```Typescript
.
├── mock/                         # Mock data service
│   ├── db.js                     # Mock data DB
│   └── routes.json               # Mock data API route config
│   └── ...
├── public/                       # Static files（including css, images, fonts, index.html e.g）
│   ├── images/                   # Public image resources
│   ├── css/                      # Public css resources
│   ├── fonts/                    # Public font resources
│   ├── icons/                    # Public svg icon resources
│   └── ...
├── src/
│   ├── components/               # Global react components
│   │   └── ...
│   ├── i18n/                     # i18n multi language config
│   │   └── ...
│   ├── models/                   # Dva models
│   │   └── ...
│   ├── middleware/               # Redux middleware
│   │   └── ...
│   ├── store/                    # Redux store config
│   │   └── ...
│   ├── pages/                    # All pages view
│   │   └── ...
│   ├── routes/                   # App router config
│   │   └── ...
│   ├── locales/                  # App i18n multi language config
│   │   └── ...
│   ├── services/                 # API request services
│   │   └── ...
│   ├── style/                    # Global CSS style
│   │   └── ...
│   ├── utils/                    # Global utils
│   │   └── ...
│   ├── App.css                   # App component CSS style
│   ├── App.tsx                   # App root component
│   ├── App.test.tsx              # App jest test case
│   ├── env.ts                    # App env config
│   ├── index.tsx                 # React entry file
│   ├── logo.svg                  # App logo
│   ├── Page.tsx                  # Global pages route
│   │
├── build/                        # The production static files
├── .gitignore                    # Git ignore config（Do not tamper with the configuration!!!）
├── .editorconfig                 # VS Code editor config（Do not tamper with the configuration!!!）
├── Dockerfile                    # Docker deploy config（Do not tamper with the configuration!!!）
├── config-overrides.js           # Webpack default settings override config
├── eslint.json                   # eslint rules config（Do not tamper with the configuration!!!）
└── package.json                  # Build script and packages config（Do not tamper with the configuration!!!）
└── yarn.lock                     # Yarn lock file
└── README.md                     # Project readme file

```

### Tech stack

[`React`](https://github.com/facebook/react) [`Create React App`](https://facebook.github.io/create-react-app/docs/getting-started) [`React Router`](https://github.com/ReactTraining/react-router) [`Redux`](https://github.com/reduxjs/redux) [`Flux`](https://facebook.github.io/flux/) [`Jest`](https://github.com/facebook/jest) [`React Hot Loader`](https://github.com/gaearon/react-hot-loader) [`React Loadable`](https://github.com/jamiebuilds/react-loadable) [`Webpack`](https://github.com/webpack/webpack) [`Babel`](https://github.com/babel/babel) [`enzyme`](https://github.com/airbnb/enzyme) [`draft-js`](https://draftjs.org/) [`Dva`](https://dvajs.com)

### Structure Details

We use [react redux typescript guide](https://github.com/piotrwitek/react-redux-typescript-guide) as our coding standard,
please review this guide before coding.

#### Components

For components folder, we will have global common components, and only global components
can be put in it and make sure this folder don't have redundant code and files.

It may look like:

```Typescript
├── components/                            # All pages view
│   ├── Header/                            # App Header components
│   │   ├── Header.module.css              # Header component css style module
│   │   └── Header.tsx                     # Header component
│   ├── SideBar/                           # App SideBar components
│   │   ├── SideBar.module.css             # SideBar component css style module
│   │   └── SideBar.tsx                    # SideBar component
│   ├── Footer/                            # App Footer components
│   │   ├── Footer.module.css              # Footer component css style module
│   │   └── Footer.tsx                     # Footer component
│   ├── index.tsx                          # All components will be exported on index file for other modules importing
│   └── ...
├── ...
```

#### Models

Data flow with dva
![Data flow with dva](https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png)

Structure with dva
![Structure with dva](https://cdn.yuque.com/yuque/0/2018/png/103904/1528436195004-cd3800f2-f13d-40ba-bb1f-4efba99cfe0d.png)

```Typescript
// App Model
import { addTodoAPI } from '../services/'

const initialState = {
  todo: [],
}

export default {
  state: [],
  namespace: 'todo',
  effects: {
    *addToDo({ payload: todo }, { put, call }) {
      yield call(addTodoAPI, todo);
      yield put({ type: 'add', payload: todo });
    },
  },
  reducers: {
    add(state, { payload: todo }) {
      return state.concat(todo);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/todo') {
          dispatch({
            type: 'todo/list',
          });
        }
      });
    },
  },
}
```

Dva model was made up of five parts which include `state`, `namespace`, `effects`, `reducers` and `subscriptions`;

##### namespace

Model's namespace need to use upper camel case and make sure the namespace is unique on the whole app

##### state

App initial state

##### effect

Effect is a generator function which includes `put`, `call` and `select` functions.

`put` for action triggering.

```Javascript
yield put({ type: 'todo/add', payload: 'Learn Dva' });
```

`call` async, with Promise supporting.

```Javascript
const result = yield call(fetch, '/todo');
```

`select` for extract data from state.

```Javascript
const todo = yield select(state => state.todo);
```

##### reducer

Reducer is a function, which takes a state and a action, output a state: (state, action) => state.

Reducers specify how the application's state changes in response to actions sent to the store. Remember that actions only describe what happened, but don't describe how the application's state changes.

##### subscription

subscriptions will subscribe to data source, and dispatch according to different actions. Data source can be current time, server's websocket connection, keyboard event, changes in geolocation, changes in history router, etc, with format of ({ dispatch, history }) => unsubscribe.

Global models folder structure may look like:

```Typescript
├── models/                          # Redux reducers
│   ├── ToDoModel.ts                 # App todo model
│   ├── index.ts                     # All models should be exported on index file
│   └── ...
├── ...
```

[More information about dva](https://github.com/dvajs/dva-knowledgemap/blob/master/README_en.md)

#### Middleware

It provides a third-party extension point between dispatching an action, and the moment it reaches the reducer.

```Typescript
├── middleware/                        # Redux middleware
│   ├── ReduxSocketMiddleware.ts       # redux websocket middleware
│   ├── index.ts                       # All middleware should be exported on index file
│   └── ...
├── ...
```

[More information about redux middleware](https://redux.js.org/advanced/middleware)

#### Store

The Store is the object that brings all reducers together. The store has the following responsibilities:

* Holds application state;
* Allows access to state via getState();
* Allows state to be updated via dispatch(action);
* Registers listeners via subscribe(listener);
* Registers listeners via subscribe(listener);
* Handles unregistering of listeners via the function returned by subscribe(listener).

```Note
It's important to note that you'll only have a single store in a Redux application.
When you want to split your data handling logic, you'll use reducer composition
instead of many stores
```

[More information about redux store](https://redux.js.org/basics/store)

#### Pages

All pages of the whole App need to be put in there and make sure we have a pure coding environment,
and every page needs to have its own state model(Dva model files). And pages folder will have some other sub folders,
it may look like:

```Typescript
├── pages/                             # All pages view
│   ├── Dashboard/                     # Dashboard page folder
│   │   ├── models/                    # Dva model files
│   │   │   └── DashboardModel.ts      # Models in dashboard page
│   │   ├── components/                # Components in dashboard page
│   │   ├── Dashboard.module.css       # Dashboard page css style module
│   │   └── Dashboard.tsx              # Dashboard page
│   ├── Candidate/                     # Candidate page folder
│   │   └── ...
│   ├── JobTitle/                      # Job title page folder
│   │   └── ...
│   ├── index.js                       # All pages will be exported on index file for other modules importing
│   └── ...
├── ...
```

##### react-loadable

A higher order component for loading components with promises. So we need to use react-loadable to load our component if it’s necessary for lazy loading our component. And this way will make our component small pieces, especially in a big project, will improve our performance and experience. And also we need export our pages in pages/index.ts with react loadable. For example:

```Typescript
/* example in index.ts */
import * as React from 'react';
import Loadable from 'react-loadable';

import { Loading } from '../components';
import { ExamplePage } from './Example';

const Example = Loadable.Map({
  loader: {
    Example: () => import('./Example/Example'),
  },
  loading: Loading,
  render(loaded: any, props: any) {
    const Example = loaded.Example.default;
    return <Example {...props} />;
  },
});
```

#### Routes

The App routes and route config will be there, including auth routes and permission routes.

```Typescript
├── routes/                             # All pages view
│   ├── config.ts                       # Route config
│   ├── index.ts                        # All routes will be configured there
│   └── ...
├── ...
```

#### Services

All API services need to put in this folder, and the name of service should be the same with backend API.
For example: we have candidate service and user service on the backend, so the front-end services should
be CandidateService and UserService, we use upper camel case naming standard to name our service files.
The code structure may look like:

```Typescript
import { ApiUrl } from './config'

export class ExampleService {

  getList(params: object) {
    return AxiosInstance.get(ApiUrl.url, params)
  }

  postItem(params: object) {
    return AxiosInstance.post(ApiUrl.url, params)
  }

  patchItem(params: object) {
    return AxiosInstance.patch(ApiUrl.url, params)
  }

  deleteItem(params: object) {
    return AxiosInstance.delete(ApiUrl.url, params)
  }
}
```

```Typescript
├── services/                          # All services folder
│   ├── CandidateService.ts            # Candidate service
│   ├── UserService                    # User service
│   ├── AxiosInstance.ts               # Axios library instance and AJAX config
│   ├── config.ts                      # Backend api server config(including api url, host, socket config e.g)
│   ├── index.ts                       # All services will be exported on index file
│   └── ...
├── ...
```

#### Styles

We need to use css module as our styling standard

A CSS Module is a CSS file in which all class names and animation names are scoped locally by default.
All URLs (url(...)) and @imports are in module request format (./xxx and ../xxx means relative,
xxx and xxx/yyy means in modules folder, i. e. in node_modules).

CSS Modules compile to a low-level interchange format called ICSS or Interoperable CSS, but are written like normal CSS files:

```Typescript
/* style.css */
.example {
  color: green;
}
```

When importing the CSS Module from a JS Module, it exports an object with all mappings from local names to global names.

```Typescript
import React from 'react'
import ReactDOM from 'react-dom'
import styles from './style.css'
// import { className } from './style.css'

ReactDOM.render(
  <TodoApp className={styles.example} />,
  document.getElementById('todo-example')
)
```

[More information about CSS Modules](https://github.com/css-modules/css-modules)

#### Utils

We should put all util functions or constants in `utils/` folder.

```Typescript
├── utils/                              # Util functions
│   ├── constant.ts                     # Global constants
│   ├── index.ts                        # All utils will be exported on index file
│   └── ...
├── ...
```

#### 🌲 Jest Test

Jest test case structure

```Typescript
├── components/                             # All pages view
│   ├── SideBar/                            # App SideBar components
│   │   ├── __test__                        # SideBar component jest test
│   │   │   ├── __snapshots__               # Component test snapshot
│   │   │   └── SideBar.test.ts             # SideBar jest test case
│   │   ├── SideBar.module.css              # SideBar component css style module
│   │   └── SideBar.ts                      # SideBar component
│   └── ...
├── ...
```

[Jest Test Framework](https://jestjs.io/)

## Git Flow

| Branch Type | Naming Standard | Created From      | Merged Into        | Description                       |
| ----------- | --------------- | ----------------- | ------------------ | --------------------------------- |
| feature     | feature/*       | develop           | develop            | new features                      |
| release     | release/*       | develop           | develop and master | new version release               |
| hotfix      | hotfix/*        | master or release | release or master  | fix issues from master or release |

* `master`
The master branch stores the official release history

* `develop`
This branch will contain the complete history of the project, whereas master will contain an abridged version. Other developers should now clone the central repository and create a tracking branch for develop

```Git
git checkout develop
git push -u origin develop
```

* `feature/my-awesome-feature`
Each new feature should reside in its own branch, which can be pushed to the central repository for backup/collaboration. But, instead of branching off of `master`, feature branches use `develop` as their parent branch. When a feature is complete, it gets merged back into `develop`. Features should never interact directly with `master`.
Creating a feature branch:

```Git
git checkout develop
git checkout -b feature/add-todo
```

* `hotfix/fix-bug`
Maintenance or “hotfix” branches are used to quickly patch production releases. Hotfix branches are a lot like `release` branches and feature branches except they're based on `master` instead of `develop`. This is the only branch that should fork directly off of `master`. As soon as the fix is complete, it should be merged into both `master` and `develop` (or the current release branch), and `master` should be tagged with an updated version number.

```Git
git checkout release
git checkout -b hotfix/fix-a-bug
```

* `release/0.0.1`
Once develop has acquired enough features for a release (or a predetermined release date is approaching), you fork a release branch off of develop. Creating this branch starts the next release cycle, so no new features can be added after this point—only bug fixes, documentation generation, and other release-oriented tasks should go in this branch. Once it's ready to ship, the release branch gets merged into master and tagged with a version number. In addition, it should be merged back into develop, which may have progressed since the release was initiated.

```Git
git checkout develop
git checkout -b release/0.0.1
```

[More information about git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
