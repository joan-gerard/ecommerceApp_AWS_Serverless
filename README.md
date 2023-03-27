# E-Commerce App - AWS Serverless

An e-commerce backend with an event-driven architecture using AWS EventBridge (EB)

### Public Endpoints
GET all products
```
https://kiwpny70ba.execute-api.eu-central-1.amazonaws.com/dev/products
```
GET a single product
```
https://kiwpny70ba.execute-api.eu-central-1.amazonaws.com/dev/product/{productID}
```
### Live demo

There is a deployed MVP [here](https://my-amazing-store.vercel.app/)

Frontend repo [here](https://github.com/joan-gerard/ecommerceApp_AWS_Client)

### Project structure
```
.
├── ecomsanity                  # Connects Sanity CMS to backend - contains config and schemas
├── SanityData                  # Folder containing functions supporting cronJob handler
│   ├── deployToAWS             # Batch deploy new and updated Sanity products to AWS DynamoDB 
│   ├── formatData              # Formats data to match DynamoDB schemas 
│   └── SanityClient            # Sanity Client configuration 
├── serverless                  # Folder holding extra serverless configuration
│   ├── cognitoResources        # Cognito User Pool and User Pool Client configuration 
│   ├── dynamodb                # DynamoDB table configuration 
│   ├── functions               # Config pointing to Lambda handlers and their assigned events 
│   └── secrets                 # AWS Secrets configuration
├── src
│   ├── functions               # Folder containing lambda fn 
│   │   ├── createOrder
│   │   │   └── index.ts        # Lambda handling POST request to Dynamo ordersTable with status 'order_placed'
│   │   ├── cronJob
│   │   │   └── index.ts        # Scheduled task that fetches data from Sanity and batch deploys to Dynamo productsTable
│   │   ├── deliveryOrderPicked
│   │   │   └── index.ts        # Handles POST request made by delivery service to notify that order has been shipped
│   │   ├── getProduct
│   │   │   └── index.ts        # Lambda querying on Dynamo productsTable and returns a single product
│   │   ├── getProducts
│   │   │   └── index.ts        # Lambda querying on Dynamo productsTable and return all products
│   │   ├── streamHandler
│   │   │   └── index.ts        # Listens to any status changes made to Dynamo ordersTable records and then fans out EventBrdige events 
│   │   ├── warehousePackingComplete
│   │   │   └── index.ts        # Handles POST request made by warehouse to notify that order has been packed
│   │   └── ebEvents            # All EventBridge (EB) events
│   │       ├── ebOrderPackedCustomerNotification         # Listens to 'warehouse_packed' status and notifies custmer (SNS)
│   │       ├── ebOrderPackedDeliveryNotification         # Listens to 'warehouse_packed' status and POST to a fake delivery endpoint
│   │       ├── ebOrderPickedCustomerNotification         # Listens to 'being_delivered' status and notifies custmer (SNS) 
│   │       ├── ebOrderPlacedCustomerNotification         # Listens to 'order_placed' status and notifies custmer (SNS) 
│   │       └── ebOrderPlacedWarehouseNotification        # Listens to 'order_placed' status and POST to a fake warehouse endpoint 
│   │
│   ├── libs                    
│   │   ├── APIResponses.ts     # API Gateway specific helpers
│   │   ├── Authorization.ts    # Handles warehouse's and delivery partner's authorization
│   │   ├── Dynamo.ts           # DynamoDB CRUD operations helper functions
│   │   ├── secrets.ts          # getSecret helper function
│   │   └── SES.ts              # sendEmail helper function
│   └── types
│       └── dynamo.d.ts         # Global types
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── webpack.config.js           # Webpack configuration
└── tsconfig.paths.json         # Typescript paths
```