import {
  Naming,
  ObjectType,
  StringType,
  NumberType,
  Literal,
  ListType,
  Union,
  createJSONCallType,
  createBuilderSchema,
} from 'jc-builder'
import {
  createJSONCall,
  createSyncJSONCall,
  AsyncSender,
  SyncSender,
  createSender,
  createBatchSender,
  createSyncSender,
} from 'jc-client'

const createBS = () => {
  const Input = Naming('Input', ObjectType({ id: StringType }), '{id: string}')
  const Todo = Naming(
    'Todo',
    ObjectType({ content: StringType, createTime: NumberType }),
    '{content: string,createTime: number}'
  )
  const SuccessOutput = Naming(
    'SuccessOutput',
    ObjectType({
      type: Literal('SuccessOutput'),
      todos: ListType(
        ObjectType({ content: StringType, createTime: NumberType })
      ),
    }),
    '{type: "SuccessOutput",todos: [{content: string,createTime: number}]}'
  )
  const FailedOutput = Naming(
    'FailedOutput',
    ObjectType({ type: Literal('FailedOutput'), message: StringType }),
    '{type: "FailedOutput",message: string}'
  )
  const Output = Naming(
    'Output',
    Union(
      ObjectType({
        type: Literal('SuccessOutput'),
        todos: ListType(
          ObjectType({ content: StringType, createTime: NumberType })
        ),
      }),
      ObjectType({ type: Literal('FailedOutput'), message: StringType })
    ),
    '{type: "SuccessOutput",todos: [{content: string,createTime: number}]} | {type: "FailedOutput",message: string}'
  )

  const getTodos = createJSONCallType(
    'getTodos',
    ObjectType({ id: StringType }),
    Union(
      ObjectType({
        type: Literal('SuccessOutput'),
        todos: ListType(
          ObjectType({ content: StringType, createTime: NumberType })
        ),
      }),
      ObjectType({ type: Literal('FailedOutput'), message: StringType })
    )
  )

  return createBuilderSchema(
    {
      Input,
      Todo,
      SuccessOutput,
      FailedOutput,
      Output,
    },
    {},
    {
      getTodos,
    }
  )
}

export const createClient = (send: AsyncSender) => {
  const builderSchema = createBS()
  const callSender = createSender(send, JSON.stringify, JSON.parse)

  return {
    getTodos: createJSONCall(
      builderSchema.calls.getTodos,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}

export const createBatchClient = (send: AsyncSender) => {
  const builderSchema = createBS()
  const callSender = createBatchSender(send, JSON.stringify, JSON.parse)

  return {
    getTodos: createJSONCall(
      builderSchema.calls.getTodos,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}

export const createSyncClient = (send: SyncSender) => {
  const builderSchema = createBS()
  const callSender = createSyncSender(send, JSON.stringify, JSON.parse)

  return {
    getTodos: createSyncJSONCall(
      builderSchema.calls.getTodos,
      JSON.stringify,
      JSON.parse,
      callSender
    ),
  }
}
