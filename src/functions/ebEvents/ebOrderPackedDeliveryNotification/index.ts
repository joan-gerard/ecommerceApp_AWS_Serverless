import { EventBridgeEvent } from 'aws-lambda';

import { OrderRecord } from 'src/types/dynamo';
import axios from 'axios';
// import Secrets from '@libs/secrets';

export const handler = async (event: EventBridgeEvent<'string', OrderRecord>) => {
  try {
    const orderDetails = event.detail;

    // const authkey = await Secrets.getSecret('warehouseApiKey');

    await axios.post(
      'https://httpstat.us/201',
      {
        ...orderDetails,
      },
      // {
      //   headers: {
      //     authorization: authkey,
      //   },
      // }
    );

    console.log('Delivery API called');

    return;
  } catch (error) {
    console.log('error', error);
  }
};
