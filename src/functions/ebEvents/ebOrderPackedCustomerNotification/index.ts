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
        size: itemData.sizesAvailable.filter((size) => size.sizeCode == item.size)[0],
      };
    });

    const itemsDetails = await Promise.all(orderItemsPromise);

    await SES.sendEmail({
      email: orderDetails.userEmail,
      subject: 'Your order has been packed',
      text: `This is to let you know that the warehouse has completed packing the following order.
      
Order Summary: 
${itemsDetails.map(itemToRow)}

We'll let you know when the order has been picked by our delivery partner!
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
  size,
  title,
}: {
  count: number;
  title: string;
  size?: { sizeCode: number; displayValue: string };
}) => {
  return `${count} x ${title} ${size ? `in size ${size.displayValue}` : null}
`;
};
