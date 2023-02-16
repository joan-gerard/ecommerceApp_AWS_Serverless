import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { OrderRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const ordersTable = process.env.ordersTable;
    const userId = event.requestContext?.authorizer?.claims?.sub;
    const userEmail = event.requestContext?.authorizer?.claims?.email;

    const order = JSON.parse(event.body);

    const timestamp = Date.now();

    const fullOrder: OrderRecord = {
      id: uuid(),
      pk: userId,
      sk: `order#${timestamp}`,

      userId,
      userEmail,
      dataCreated: timestamp,
      status: 'placed',

      items: order.items,
    };

    console.log({ userId, userEmail, fullOrder });

    await Dynamo.write({
      data: fullOrder,
      tableName: ordersTable,
    });

    return formatJSONResponse({
      body: { message: 'Order placed' },
    });
  } catch (error) {
    console.log('error', error);
    return formatJSONResponse({
      statusCode: 502,
      body: {
        message: error.message,
      },
    });
  }
};
