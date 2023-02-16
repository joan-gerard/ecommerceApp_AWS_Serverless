import { DynamoDBStreamEvent } from 'aws-lambda';
import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
  PutEventsRequestEntry,
} from '@aws-sdk/client-eventbridge';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new EventBridgeClient({});
const eventBridgeBusName = process.env.eventBridgeBusName;

export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    const ebEvents = event.Records.map((record) => {
      if (!record?.dynamodb?.NewImage) {
        return;
      }

      console.log({ record, image: record.dynamodb.NewImage });

      const event = recordToEvent(record);

      return event;
    });

    console.log({ ebEvents });

    const params: PutEventsCommandInput = {
      Entries: ebEvents,
    };

    const command = new PutEventsCommand(params);

    const response = await client.send(command);

    console.log({ response });
  } catch (error) {
    console.log('error', error);
  }
};

const recordToEvent = (record: DynamoDBStreamEvent['Records'][0]) => {
  const statusToSource = {
    placed: 'order.placed',
    packed: 'order.packed',
    delivered: 'order.delivered',
    error: 'order.error',
  };

  const data = unmarshall(record.dynamodb.NewImage as Record<string, AttributeValue>);

  const [tableArn] = record.eventSourceARN.split('/stream');

  const event: PutEventsRequestEntry = {
    Time: new Date(record?.dynamodb?.ApproximateCreationDateTime || Date.now()),
    Source: statusToSource[data.status],
    Resources: [tableArn],
    DetailType: record['eventName'],
    Detail: JSON.stringify(data),
    EventBusName: eventBridgeBusName,
  };

  return event;
};
