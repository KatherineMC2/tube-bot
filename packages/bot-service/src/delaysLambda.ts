import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

const dynamoClient = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dynamoClient);
const linesAffected: string[] = [];
interface lineDisruption {
  lineName: string;
  lineDescription: string;
}

const saveRecord = async (lineDisruption: lineDisruption): Promise<void> => {
  const lineName = lineDisruption.lineName;
  const lineDescription = lineDisruption.lineDescription;

  const params = {
    Item: {
      LineName: `${lineName}`,
      LineDescription: `${lineDescription}`,
    },
    TableName: 'delaysTable',
  };
  await documentClient.send(new PutCommand(params));
  console.log('new records have been added to the table successfully');
};

export const handler = async () => {
  try {
    const tlfEndpoint = await axios.get(
      'https://api.tfl.gov.uk/Line/Mode/tube/Disruption',
    );
    const lines = tlfEndpoint.data;

    for (const line of lines) {
      const lineInfo = line['description'];
      const lineName = lineInfo.split(':')[0];
      const lineDescription = lineInfo.split(':')[1];
      const lineDisruption: lineDisruption = {
        lineName,
        lineDescription,
      };
      const typeOfDelay = line['closureText'];
      if (typeOfDelay === 'severeDelays') {
        linesAffected.push(lineName, lineDescription);
      } else if (typeOfDelay === 'minorDelays') {
        linesAffected.push(lineName, lineDescription);
      } else {
        console.log('lines with any kind of disruptions', lines);
      }

      await saveRecord(lineDisruption);
    }
    return linesAffected;
  } catch (error) {
    console.log('error fetching data', error);
  }
};
