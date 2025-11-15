# AWS Architecture Diagrams - Product Specifications API

## Generated Diagrams

### 1. Basic Architecture Diagram
**File:** `ff-api-architecture.png`
**Path:** `/home/pandson/echo-architect-artifacts/ff-API-20251115-163324/generated-diagrams/generated-diagrams/ff-api-architecture.png`

This diagram shows the core components of the Product Specifications API:
- Client Applications connecting to API Gateway
- API Gateway routing to Lambda functions
- Lambda functions (getProducts, getProductById, initializeSampleData) 
- DynamoDB table for data storage
- CloudWatch for monitoring and logging

### 2. Detailed Architecture Diagram  
**File:** `ff-api-detailed-architecture.png`
**Path:** `/home/pandson/echo-architect-artifacts/ff-API-20251115-163324/generated-diagrams/generated-diagrams/ff-api-detailed-architecture.png`

This comprehensive diagram includes:
- **Client Layer**: User applications making HTTPS requests
- **API Gateway**: REST API with CORS enabled, routing requests to appropriate Lambda functions
- **Serverless Compute**: 
  - Lambda functions with specific responsibilities
  - IAM execution role with DynamoDB permissions
- **Data Storage**: DynamoDB table with on-demand billing and product_id primary key
- **Monitoring**: CloudWatch for metrics and CloudWatch Logs for function logs
- **Infrastructure**: AWS CDK for Infrastructure as Code deployment

## Architecture Components Mapped from Design Document

### API Gateway (Line 15-19 in design.md)
- REST API configuration with resource-based routing
- CORS enabled for web application integration
- No authentication (prototype system)

### Lambda Functions (Line 21-26 in design.md)
- **getProducts**: Handles GET /api/products with filtering and pagination
- **getProductById**: Handles GET /api/products/{product_id} for single item lookup
- **initializeSampleData**: One-time data population function
- Runtime: Node.js 18.x
- Memory: 256MB, Timeout: 30 seconds

### DynamoDB Table (Line 28-37 in design.md)
- Table Name: ProductSpecifications
- Primary Key: product_id (String)
- On-demand billing mode suitable for prototype
- Attributes include product_name, category, brand, specifications, timestamps

### Monitoring & Security (Line 108-125 in design.md)
- CloudWatch integration for logs and metrics
- IAM roles with minimal DynamoDB permissions
- Encryption at rest with AWS managed keys

## Data Flow
1. Client applications send HTTPS requests to API Gateway
2. API Gateway routes requests to appropriate Lambda functions based on path
3. Lambda functions query/scan DynamoDB table for product data
4. Results are returned through API Gateway to clients
5. All operations are logged to CloudWatch for monitoring

## Infrastructure Deployment
- AWS CDK used for Infrastructure as Code
- Single stack deployment
- Serverless architecture with auto-scaling capabilities
