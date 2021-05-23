import {
  Naming,
  ObjectType,
  StringType,
  NumberType,
  Literal,
  ListType,
  Union,
  createJSONCallType,
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

const createBuilderSchema = () => {
  const getJsoncallModule = () => {
    const Input = Naming(
      'Input',
      ObjectType({ id: StringType }),
      '{id: string}'
    )
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

    return {
      id: 'jsoncall',
      links: [],
      types: {
        Input,
        Todo,
        SuccessOutput,
        FailedOutput,
        Output,
      },
      derives: {},
      exports: {},
      calls: {
        getTodos,
      },
    }
  }
  const jsoncallModule = getJsoncallModule()

  return {
    entry: 'jsoncall',
    modules: [jsoncallModule],
    calls: jsoncallModule.calls,
  }
}

export const createClient = (send: AsyncSender) => {
  const builderSchema = createBuilderSchema()
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
  const builderSchema = createBuilderSchema()
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
  const builderSchema = createBuilderSchema()
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
