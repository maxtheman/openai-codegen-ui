// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: 'ENTER_API_KEY_HERE',
  });
const openai = new OpenAIApi(configuration);

type Data = {
  text: string
}

const completeText = async (text : string) => {
  const response = await openai.createCompletion('code-davinci-002',
      {
          prompt: text,
          max_tokens: 32,
          temperature: 0.1,
          n: 1,
      }
  );
  const data = response.data.choices[0] ? response.data.choices[0].text : 'No completion found'
  return {data};
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { text } = req.body
  const completedText = await completeText(text)
  res.status(200).json({ 'text' : completedText, 'input': text })
}
