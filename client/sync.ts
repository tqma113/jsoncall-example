import * as fs from 'fs'
import path from 'path'
import { format } from 'prettier'
import { introspectionClientCodegen } from 'jc-codegen'
import { call } from '../server'

introspectionClientCodegen(call, (source) =>
  format(source, {
    parser: 'typescript',
    semi: false,
    singleQuote: true,
    printWidth: 80,
  })
).then((source) =>
  fs.writeFileSync(path.resolve(__dirname, './client.ts'), source)
)
