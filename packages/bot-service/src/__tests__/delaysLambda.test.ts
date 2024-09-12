import { handler } from '../delaysLambda';
import { mockClient } from 'aws-sdk-client-mock';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('BotService', () => {
  test('should return an array of delays', async () => {
    ddbMock.on(PutCommand).resolves({});
    const response = await handler();
    expect(Array.isArray(response)).toBe(true);
  });
});
