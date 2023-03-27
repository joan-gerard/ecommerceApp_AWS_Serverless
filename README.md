# E-Commerce App - AWS Serverless

An e-commerce backend with an event-driven architecture using AWS EventBridge

### The Endpoints

```

```

### Project structure
```
.
├── ecomsanity                  # Connects Sanity to backend - contains config and schemas
├── SanityData                  # Folder containing functions supporting cronJob handler
│   ├── deployToAWS             # Btach deploy to AWS DynamoDB 
│   ├── formatData              # Formats data to match DynamoDB schemas 
│   └── SanityClient            # Sanity Client configuration 
├── serverless                  # Folder holding extra serverless configuration
│   ├── dynamoResources         # DynamoDB table configuration 
│   └── functions               # config pointing to handlers path and http method 
├── src
│   ├── functions               # Folder containing lambda fn 
│   │   ├── createOrder
│   │   │   └── index.ts        # lambda querying on a dynamodb table
│   │   ├── cronJob
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   ├── deliveryOrderPicked
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   ├── getProduct
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   ├── getProducts
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   ├── streamHandler
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   ├── warehousePackingComplete
│   │   │   └── index.ts        # lambda making use of SES and SNS clients for notifications
│   │   └── ebEvents
|   |       ├── ebOrderPackedCustomerNotification         # DynamoDB table configuration 
|   |       ├── ebOrderPackedDeliveryNotification         # DynamoDB table configuration 
|   |       ├── ebOrderPickedCustomerNotification         # DynamoDB table configuration 
|   |       ├── ebOrderPlacedCustomerNotification         # DynamoDB table configuration 
|   |       └── ebOrderPlacedWarehouseNotification        # config pointing to handlers path and http method 
│   │
│   └── libs                    
│       ├── dynamo.ts           # DynamoDB 'write', 'get' and 'query' functions
│       └── apiGateway.ts       # API Gateway specific helpers
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── webpack.config.js           # Webpack configuration
└── tsconfig.paths.json         # Typescript paths
```