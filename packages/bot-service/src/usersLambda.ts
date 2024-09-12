import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Handler } from 'aws-lambda';

const dynamoClient = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

export const handler: Handler = async (event) => {
  const body = JSON.parse(event.body);

  // Ahora puedes acceder al chat ID
  const chatId = body.message.chat.id;
  console.log('Chat ID:', chatId);

  const params = {
    Item: {
      userId: `${chatId}`,
    },
    TableName: 'usersTable',
  };

  const response = await documentClient.send(new PutCommand(params));
  return response;
};
