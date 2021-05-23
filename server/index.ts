import { ObjectType, StringType, NumberType, Literal, ListType, Union, createJSONCallType, ToType, createBuilderSchema } from 'jc-builder'
import { createService } from 'jc-server'

const Input = ObjectType({
  id: StringType
})

const Todo = ObjectType({
  content: StringType,
  createTime: NumberType
})
type Todo = ToType<typeof Todo>

const SuccessOutput = ObjectType({
  type: Literal('SuccessOutput'),
  todos: ListType(Todo)
})

const FailedOutput = ObjectType({
  type: Literal('FailedOutput'),
  message: StringType
})

const Output = Union(SuccessOutput, FailedOutput)

const getTodos = createJSONCallType('getTodos', Input, Output)

const module = {
  id: 'todo',
  types: {
    Input,
    Todo,
    SuccessOutput,
    FailedOutput,
    Output
  },
  links: [],
  derives: {},
  exports: {
  },
  calls: {
    getTodos
  }
}

const schema = createBuilderSchema({
  Input,
  Todo,
  SuccessOutput,
  FailedOutput,
  Output
}, {
  getTodos
})

const service = createService(schema, JSON.stringify, JSON.parse)

export const call = service({
  getTodos: ({ id }) => {
    if (mockData[id]) {
      // without validation of return data
      return {
        type: 'SuccessOutput' as const,
        todos: mockData[id],
      }
    } else {
      return {
        type: 'FailedOutput' as const,
        message: 'unknown id',
      }
    }
  }
})

const mockData: Record<string, Todo[]> = {
  foo: [
    {
      content: 'foo1',
      createTime: Date.now(),
    },
    {
      content: 'foo2',
      createTime: Date.now(),
    },
    {
      content: 'foo3',
      createTime: Date.now(),
    },
  ],
  bar: [
    {
      content: 'bar1',
      createTime: Date.now(),
    },
    {
      content: 'bar2',
      createTime: Date.now(),
    },
    {
      content: 'bar3',
      createTime: Date.now(),
    },
  ],
}