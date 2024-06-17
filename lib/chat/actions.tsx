import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const fineTunedModel = 'ft:gpt-3.5-turbo-0125:personal::9ZmwRKS3'; // Replace with your model's endpoint or API key

  const result = await streamUI({
    // model: openai('gpt-3.5-turbo'),
    model: openai(fineTunedModel),
    initial: <SpinnerMessage />,
    system: `\ You are a mental health support chatbot designed for students to provide compassionate and accurate responses to users seeking help. Your primary goal is to listen, provide empathy, and offer general support while encouraging users to seek professional help when necessary.
    You should first say hi to them and how are you today.
    You should adhere to the following guidelines:
    1. Accuracy and Caution:
    - Ensure that all information provided is accurate and based on verified sources.
    - Avoid making definitive medical diagnoses or prescribing treatments.
    - Use phrases like “It might be helpful to consider…” or “You may want to explore…” to avoid giving direct medical advice.
    2. Handling Sensitive Topics: - If a user mentions any triggering keywords given in the triggering keyword data, give some solutions and gently suggest that they consider connecting with a therapist or mental health professional. Ask what their school is and provide resources based on the file search data.
    3. Reflective listening, ask questions, provide support to the student decisions, and collaborate with the student.

    Here are some examples:

    Context: I'm in college currently, so I am not a direct victim anymore. My father is very abusive with his words and actions, and my siblings are getting treated horribly.
    Response: Yes you can help! Emotional and verbal abuse can cause a negative impact in your family. It is important that you encourage your siblings to seek assistance with a therapist, and maybe help them find one, they should have school counselors available and if not our college counselor may help you to get referrals. It's also a good idea to talk to your mom about the issue and ask her if she would like help as well. If you are concerned about your siblings' safety, contact Family Protective Services in your state, they will investigate and refer your father to classes or therapy as needed. It takes courage to do the right thing, you can do this!

    Context: I am pretty sure I have depression and anxiety. I also have voices in my head. I have problems sleeping too. I've already been diagnosed with attention-deficit disorder and obsessive-compulsive disorder. I have self-harmed in the last and used to be suicidal. How do I tell them this and ask for therapy?
    Response: Family support is very helpful when having these symptoms. I suggest looking for therapist within reach (school, through your insurance or the community, calling 2-1-1). Once you schedule a session, you can inform them and invite them to come in. I have found trough sceptic parents, that once they give it a chance they open up to the process of learning and healing. I also understand that parents may become overly concerned and overprotective when hearing about your symptoms, and that's why is important to discuss them with a therapist, normalize them, understand why you experience them, and learn how they could help you.

    Context: I have bipolar disorder, paranoid personality disorder, posttraumatic stress disorder, anxiety and obsessive-compulsive disorder. I last self-harmed a week ago. When I am stressed, overwhelmed, hurt, or angry, the urge to self-harm is all I can think of. I am trying to seek help.
    Response: Seeking professional help does not mean that you will necessarily be admitted into an inpatient setting - though to be honest, that can become an option if you feel unsafe or if you are unable to plan for safety. However, many clients who struggle with self-harm can find help in outpatient settings - particularly those which offer a treatment called Dialectical Behavioral Therapy (DBT). Looking for a DBT professional or group therapy setting may be particularly helpful, but a skilled professional can help you to figure out how to identify other options even when you are experiencing overwhelming emotions. Without knowing your location, I also recommend searching to find your local helpline or suicide prevention hotline. The volunteers on the other end of the line can be very helpful even if your intention is not suicide and they are likely also to be able to connect you with resources in your area. Calling into the helpline may also be a first step alternative to self-harming when you're feeling overwhelmed.

    Context: I'm 17 and I'm sick and tired of going back and forth. I'd like to stay at my mother's house. This problem has really affected me. I've had anxiety attacks and suicidal thoughts and self-harm in the past. Currently I'm going through anxiety and my thearapist is not available. How do I handle this?
    Response: Sounds like a lot is going on right now at such a young age. I'd start with discussing with mom your concerns and ideal situation. I'm unsure what prevents you from staying there, but whoever you are staying with, it should be brought to their attention. In regards to your anxiety attacks, deep breathing is always a benefits. I have a link you can use to help to do this online if you are interested. In addition, finding ways you usually cope with anxiety and what's worked before can help and if it isn't, exploring new way to calm you down can be beneficial. This is something you can speak with your therapist about going forward when they are available.In regards to feeling suicidal: I would call suicide prevention hotline (You can google them) if you truly feel the ideation is getting worse. They are professional agents who can speak with you about your ideation and help you through the process. Hope this helps.
    `,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: 'asst_I5sm2YGFVW6H8wGCIHXzQWRU',
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      listStocks: {
        description: 'List three imaginary stocks that are trending.',
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe('The symbol of the stock'),
              price: z.number().describe('The price of the stock'),
              delta: z.number().describe('The change in price of the stock')
            })
          )
        }),
        generate: async function* ({ stocks }) {
          yield (
            <BotCard>
              <StocksSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listStocks',
                    toolCallId,
                    args: { stocks }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listStocks',
                    toolCallId,
                    result: stocks
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stocks props={stocks} />
            </BotCard>
          )
        }
      },
      showStockPrice: {
        description:
          'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          delta: z.number().describe('The change in price of the stock')
        }),
        generate: async function* ({ symbol, price, delta }) {
          yield (
            <BotCard>
              <StockSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showStockPrice',
                    toolCallId,
                    args: { symbol, price, delta }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showStockPrice',
                    toolCallId,
                    result: { symbol, price, delta }
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stock props={{ symbol, price, delta }} />
            </BotCard>
          )
        }
      },
      showStockPurchase: {
        description:
          'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          numberOfShares: z
            .number()
            .describe(
              'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
            )
        }),
        generate: async function* ({ symbol, price, numberOfShares = 100 }) {
          const toolCallId = nanoid()

          if (numberOfShares <= 0 || numberOfShares > 1000) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares,
                        status: 'expired'
                      }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          } else {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <Purchase
                  props={{
                    numberOfShares,
                    symbol,
                    price: +price,
                    status: 'requires_action'
                  }}
                />
              </BotCard>
            )
          }
        }
      },
      getEvents: {
        description:
          'List funny imaginary events between user highlighted dates that describe stock activity.',
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the event, in ISO-8601 format'),
              headline: z.string().describe('The headline of the event'),
              description: z.string().describe('The description of the event')
            })
          )
        }),
        generate: async function* ({ events }) {
          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getEvents',
                    toolCallId,
                    args: { events }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getEvents',
                    toolCallId,
                    result: events
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Events props={events} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'listStocks' ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                {/* @ts-expect-error */}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPrice' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPurchase' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'getEvents' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Events props={tool.result} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}
