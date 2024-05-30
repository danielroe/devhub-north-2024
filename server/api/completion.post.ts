import { OpenAI } from 'openai'

export default defineEventHandler(async event => {
  const { prompt, malleables } = await readBody(event)
  const api = new OpenAI({
    apiKey: useRuntimeConfig().openai.token
  })
  const result = await api.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    messages: [
      {
        role: 'system',
        content: 'You are an AI who is responsible for manipulating the state of a web application to suit user needs. You only speak JSON.'
      },
      {
        role: 'system',
        content: 'The current state of the application is:\n\n' + JSON.stringify(malleables, null, 2)
      },
      {
        role: 'user',
        content: prompt
      },
      {
        role: 'system',
        content: 'Print the current state of the application reflecting the user\'s request:\n\n'
      },
    ]
  })
  console.log(result.choices[0].message.content)
  return JSON.parse(result.choices[0].message.content as string)
})
