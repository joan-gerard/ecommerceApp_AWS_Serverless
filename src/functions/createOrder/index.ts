import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { Order, OrderRecord } from 'src/types/dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const ordersTable = process.env.ordersTable;
    const userId: string = event.requestContext?.authorizer?.claims?.sub;
    const userEmail: string = event.requestContext?.authorizer?.claims?.email;

    const order: Order = JSON.parse(event.body);

    order.items.map((item) => {
      if (!item.count) {
        throw new Error(`Missing count for ${item.id}`);
      }
    });

    if (!order.paymentSessionId) {
      throw new Error(`Missing paymentSessionId`);
    }

    const timestamp = Date.now();

    const fullOrder: OrderRecord = {
      id: order.paymentSessionId,
      pk: userId,
      sk: `order#${timestamp}`,

      userId,
      userEmail,
      orderCreated: timestamp,
      status: 'order_placed',

      items: order.items,
      paymentSessionId: order.paymentSessionId,
      orderId: uuid()
    };

    await Dynamo.write({
      data: fullOrder,
      tableName: ordersTable,
    });

    return formatJSONResponse({
      body: { message: `${fullOrder.orderId}` },
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
