import type { NextPage } from 'next'
import { useState } from 'react'
import { useForm } from "react-hook-form";
import { VStack, Text, Button, Textarea, Heading, Box} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/provider';

interface CompleteResponse {
  completedText: string;
}

interface FormData {
  inputText: string;
}

const App: NextPage = () => {
  const [completedText, setCompletedText] = useState('no text');
  const { register, handleSubmit, formState: { errors }} = useForm();
  const onSubmit = async (data: FormData) => {
    console.log(data);
    const results : CompleteResponse = await complete(data.inputText);
    setCompletedText(results.completedText);
  }

  const complete = async (inputText: string): Promise<CompleteResponse> => {
    const body = JSON.stringify({ 'text': inputText })
    console.log(body);
    const result = await fetch('/api/complete/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    const data = await result.json();
    console.log(data);
    return {'completedText': data.text.data};
  };

  const stringToDivs = (string) => {
    let arr = string.split('\n');
    arr = arr.map((element, index) => {
      return (
        <Text key={index}>{element}</Text>
      )
    })
    return arr;
  }

  return (
    <ChakraProvider>
    <VStack spacing={24}>
    <Heading as="h1" size="xl">
          OpenAI Codegen
        </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text>Format your input as a comment in whatever language you're using</Text>
        <Textarea
          {...register("inputText")} 
          placeholder="Write code here..."
        />
        {errors.textarea && <p>{errors.textarea.message}</p>}
        <Button type='submit'>Generate</Button>
      </form>
      <Box>{stringToDivs(completedText).map((divs)=>divs)}</Box>
    </VStack>
    </ChakraProvider>
  );
};

export default App;