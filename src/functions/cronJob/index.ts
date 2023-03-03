import { client } from '@libs/SanityClient';

// export const handler = (event: any, context: any, callback) => {
//   console.log('Hello, Welcome to Hevo');
//   callback(null);
// };

export const handler = async () => {
  console.log('CRON JOB START');
  const productsQuery = '*[_type == "product"]';
  const products: any[] = await client.fetch(productsQuery);

  console.log({ products });
  console.log('CRON ROB ENDED');

};
