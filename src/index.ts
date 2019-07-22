import { FireSQL } from 'firesql.js'

export const STORE_STATE = 'STORE_STATE'
export const SYNC_STATE = 'SYNC_STATE'
export const vuexfiresqlMutations = {
  [STORE_STATE](state, newState) {
    this.replaceState(newState)
  }
}
let db, uploadState, event
export const vuexfiresqlActions = {
  [SYNC_STATE](store, { table, pkColumnName, pk, jsonColumnName }) {
    if (!db) return
    let ownEvent
    if (event) db.socket.off(event)
    event = table + '/' + pk
    db.on(event, (row, type) => {
      if (ownEvent) {
        ownEvent = false
        return
      }
      // eslint-disable-next-line no-console
      console.log('precommit', row, type)
      if (type === 'UpdateRowsEvent') {
        store.commit(STORE_STATE, row.after_values[jsonColumnName])
      }
    })
    uploadState = (state) => {
      db.table(table)
        .where(pkColumnName, pk)
        .update({ [jsonColumnName]: JSON.stringify(state) })
      ownEvent = true
    }
    db.table(table)
      .where(pkColumnName, pk)
      .select(jsonColumnName)
      .then((rows) => {
        // eslint-disable-next-line no-console
        console.log(rows)
        if (rows) {
          store.commit(STORE_STATE, JSON.parse(rows[0][jsonColumnName]))
        } else {
          db.table(table).insert({
            [pkColumnName]: pk,
            [jsonColumnName]: JSON.stringify(store.state)
          })
        }
      })
  }
}

export function vuexFireSQL(url) {
  return (store) => {
    db = new FireSQL(url)
    store.subscribe((mutation, state) => {
      if (mutation.type === STORE_STATE) return
      if (uploadState) uploadState(state)
    })
    return db
  }
}
