import { EventBridgeEvent } from 'aws-lambda';

import Dynamo from '@libs/Dynamo';
import { OrderRecord, ProductsRecord } from 'src/types/dynamo';
import SES from '@libs/SES';

export const handler = async (event: EventBridgeEvent<'string', OrderRecord>) => {
  try {
    const productTable = process.env.productTable;

    const orderDetails = event.detail;

    const orderItemsPromise = orderDetails.items.map(async (item) => {
      const itemData = await Dynamo.get<ProductsRecord>({
        tableName: productTable,
        pkValue: item.id,
      });

      return {
        count: item.count,
        title: itemData.title,
        // size: itemData.sizesAvailable.filter((size) => size.sizeCode == item.size)[0],
      };
    });

    const itemsDetails = await Promise.all(orderItemsPromise);

    await SES.sendEmail({
      email: orderDetails.userEmail,
      subject: 'Your order has been placed',
      text: `Thank you for placing your order. We're preparing it at our warehouse.

Your order number: ${orderDetails.orderId}

Order Summary: 
${itemsDetails.map(itemToRow)}

We'll let you know when the order has been packed!
`,
    });

    console.log('email sent');
    return;
  } catch (error) {
    console.log('error', error);
  }
};

const itemToRow = ({
  count,
  title,
}: {
  count: number;
  title: string;
}) => {
  return `${count} x ${title}
`;
};
