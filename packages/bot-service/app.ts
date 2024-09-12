import { App } from 'aws-cdk-lib';
import { BotService } from './stack';

const app = new App();

new BotService(app, 'BotService', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION,
  },
});
