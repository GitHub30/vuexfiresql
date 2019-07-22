# VuexFireSQL [![npm version](https://badge.fury.io/js/vuexfiresql.svg)](https://badge.fury.io/js/vuexfiresql)
FireSQL bindings for Vuex

# Installation
```bash
yarn add vuexfiresql
# or
npm install vuexfiresql
```

# Usage
## Nuxt.js
Due to the order code is loaded in, vuexfiresql must be included as a NuxtJS plugin:
```javascript
// nuxt.config.js

...
plugins: [{ src: '~/plugins/vuexfiresql.js', ssr: false }]
...
```

```javascript
// ~/plugins/vuexfiresql.js

import { vuexFireSQL } from 'vuexfiresql'

export default ({ store }) => {
  vuexFireSQL('http://localhost:8080')(store)
}

// You can inject db instance, too.
// export default ({ store }, inject) => {
//   const db = vuexFireSQL('http://localhost:8080')(store)
//   inject('db', db)
// }
// this.$db.table('messages').select()
```

Add the actions and mutations to your root Store:
```javascript
// ~/store/index.js

import { vuexfiresqlActions, vuexfiresqlMutations } from 'vuexfiresql'

export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  ...vuexfiresqlMutations
}

export const actions = {
  ...vuexfiresqlActions
}
```

Specifies the vuex state you want to sync.
```javascript
// equal the following
// SELECT json FROM json WHERE id = 10
this.$store.dispatch('SYNC_STATE', {
    table: 'json',
    pkColumnName: 'id',
    pk: 101,
    jsonColumnName: 'json'
})
```