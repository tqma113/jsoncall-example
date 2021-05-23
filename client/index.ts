import { createSyncClient } from './client'
import { call } from '../server'

const client = createSyncClient(call)

console.log(client.getTodos({ id: 'foo' }))
