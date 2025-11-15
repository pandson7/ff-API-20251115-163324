# Design Document

## System Architecture Overview

The Product Specifications API is designed as a serverless REST API using AWS services. The architecture leverages API Gateway for request handling, Lambda functions for business logic, and DynamoDB for data storage.

## High-Level Architecture

```
Client Applications
        ↓
    API Gateway
        ↓
    Lambda Functions
        ↓
    DynamoDB Table
```

## Component Design

### 1. API Gateway
- **Purpose**: HTTP endpoint management and request routing
- **Configuration**: REST API with resource-based routing
- **CORS**: Enabled for web application integration
- **Authentication**: None (prototype system)

### 2. Lambda Functions
- **Runtime**: Node.js 18.x
- **Functions**:
  - `getProducts`: Handle GET /api/products with optional filtering
  - `getProductById`: Handle GET /api/products/{product_id}
  - `initializeSampleData`: One-time data population function

### 3. DynamoDB Table
- **Table Name**: ProductSpecifications
- **Primary Key**: product_id (String)
- **Attributes**:
  - product_id: Unique identifier
  - product_name: Product display name
  - category: Product category
  - brand: Product brand
  - specifications: JSON object with flexible schema
  - created_at: Timestamp
  - updated_at: Timestamp

### 4. Sample Data Schema
```json
{
  "product_id": "PROD-001",
  "product_name": "Wireless Bluetooth Headphones",
  "category": "electronics",
  "brand": "TechBrand",
  "specifications": {
    "color": "black",
    "battery_life": "20 hours",
    "connectivity": "Bluetooth 5.0",
    "weight": "250g",
    "price": 99.99
  },
  "created_at": "2025-11-15T21:34:46.653Z",
  "updated_at": "2025-11-15T21:34:46.653Z"
}
```

## API Endpoints Design

### GET /api/products
- **Purpose**: Retrieve all products with optional filtering
- **Query Parameters**:
  - `category`: Filter by product category
  - `brand`: Filter by product brand
  - `limit`: Number of results (default: 50, max: 100)
  - `lastKey`: Pagination token
- **Response**: Array of product objects with pagination metadata

### GET /api/products/{product_id}
- **Purpose**: Retrieve specific product by ID
- **Path Parameters**: product_id
- **Response**: Single product object or 404 error

## Data Access Patterns

### Primary Access Pattern
- **Query**: Get product by product_id
- **Key**: Partition key = product_id
- **Performance**: Single-item lookup, <10ms

### Secondary Access Patterns
- **Scan with Filter**: Filter by category or brand
- **Performance**: Full table scan with filter, <100ms for small datasets
- **Note**: For production scale, consider GSI for category/brand filtering

## Error Handling Strategy

### HTTP Status Codes
- 200: Successful retrieval
- 400: Bad request (invalid parameters)
- 404: Product not found
- 500: Internal server error

### Error Response Format
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 'PROD-999' not found",
    "timestamp": "2025-11-15T21:34:46.653Z"
  }
}
```

## Infrastructure as Code

### CDK Stack Components
- **API Gateway**: REST API with Lambda integration
- **Lambda Functions**: Node.js runtime with DynamoDB permissions
- **DynamoDB Table**: On-demand billing mode
- **IAM Roles**: Least privilege access for Lambda functions

### Deployment Strategy
- Single CDK stack deployment
- No CI/CD pipeline (simple deployment)
- Local development and testing

## Performance Considerations

### DynamoDB Configuration
- **Billing Mode**: On-demand (suitable for prototype)
- **Read/Write Capacity**: Auto-scaling based on demand
- **Item Size**: Optimized for <4KB per item

### Lambda Configuration
- **Memory**: 256MB (sufficient for JSON processing)
- **Timeout**: 30 seconds
- **Concurrent Executions**: Default AWS limits

## Security Considerations

### Data Protection
- DynamoDB encryption at rest (AWS managed keys)
- Lambda function logs encrypted
- No sensitive data in product specifications

### Access Control
- Lambda execution role with minimal DynamoDB permissions
- API Gateway without authentication (prototype only)
- CORS configured for web access

## Monitoring and Logging

### CloudWatch Integration
- Lambda function logs and metrics
- API Gateway access logs
- DynamoDB metrics

### Key Metrics to Monitor
- API response times
- Error rates
- DynamoDB read/write consumption
- Lambda function duration and errors
