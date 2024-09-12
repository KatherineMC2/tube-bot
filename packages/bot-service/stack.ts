import path from 'node:path';
import { type App, Stack, type StackProps } from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

//https://blog.tericcabrel.com/rest-api-aws-lambda-api-gateway-cdk/

export class BotService extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    /* ----------------- Lambda ----------------- */

    const delaysLambda = new NodejsFunction(this, 'DelaysLambda', {
      functionName: 'delaysLambda',
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './src/delaysLambda.ts'),
      architecture: Architecture.ARM_64,
    });

    //Create the users notification preference lambda

    const usersLambda = new NodejsFunction(this, 'usersLambda', {
      functionName: 'usersLambda',
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './src/usersLambda.ts'),
      architecture: Architecture.ARM_64,
    });

    // Schedule the Lambda function to be executed every 15 mins
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('cron(0/15 * * * ? *)'),
    });

    rule.addTarget(new targets.LambdaFunction(delaysLambda));

    // Create a table for storing delays

    const delaysTable = new dynamodb.Table(this, 'delaysTable', {
      tableName: 'delaysTable',
      partitionKey: { name: 'LineName', type: dynamodb.AttributeType.STRING },
    });

    //Create a table for storing user preferences

    const usersTable = new dynamodb.Table(this, 'usersTable', {
      tableName: 'usersTable',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });
    usersTable.grantReadWriteData(usersLambda);

    //Grant read and write access for the lambda to write in the delays table
    delaysTable.grantReadWriteData(delaysLambda);

    //Create the APIateway
    const lineDisruptionsAPI = new apigw.RestApi(this, 'tube-api', {
      restApiName: 'lineDisruptionsAPI',
    });

    const usersLambdaWithAPIGW = new apigw.LambdaIntegration(usersLambda);

    lineDisruptionsAPI.root.addMethod('POST', usersLambdaWithAPIGW);
  }
}
