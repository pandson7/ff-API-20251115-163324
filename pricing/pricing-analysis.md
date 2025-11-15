# Product Specifications API - Pricing Analysis

## Executive Summary

This document provides a comprehensive cost analysis for the Product Specifications API, a serverless REST API built using AWS Lambda, API Gateway, and DynamoDB. The analysis covers multiple usage scenarios from prototype to production scale.

**Key Cost Drivers:**
- API Gateway requests: $3.50 per million requests (first 333M)
- Lambda invocations: $0.20 per million requests + compute time
- DynamoDB On-Demand: $0.125 per million reads, $0.625 per million writes
- DynamoDB Storage: $0.25 per GB-month (after 25GB free tier)

## Architecture Overview

The solution consists of:
- **API Gateway**: REST API with 2 endpoints
- **Lambda Functions**: 3 functions (getProducts, getProductById, initializeSampleData)
- **DynamoDB Table**: Single table with on-demand billing
- **Region**: US East (N. Virginia)

## Pricing Components

### 1. AWS Lambda

**Request Pricing:**
- $0.0000002 per request (first 1M requests/month free)

**Compute Pricing (256MB memory allocation):**
- Tier 1 (0-6B GB-seconds): $0.0000166667 per GB-second
- Tier 2 (6B-15B GB-seconds): $0.0000150000 per GB-second
- Tier 3 (15B+ GB-seconds): $0.0000133334 per GB-second

**Free Tier Benefits:**
- 1M requests per month (first 12 months)
- 400,000 GB-seconds compute time per month (first 12 months)

### 2. Amazon API Gateway

**REST API Pricing:**
- First 333M requests/month: $3.50 per million requests
- Next 667M requests/month: $2.80 per million requests
- Next 19B requests/month: $2.38 per million requests
- Over 20B requests/month: $1.51 per million requests

**No Free Tier** for API Gateway

### 3. Amazon DynamoDB

**On-Demand Pricing:**
- Read Request Units: $0.125 per million RRUs
- Write Request Units: $0.625 per million WRUs

**Storage Pricing:**
- First 25 GB-months: Free
- Beyond 25 GB: $0.25 per GB-month

**Free Tier Benefits:**
- 25 GB storage per month (always free)
- 2.5M DynamoDB Streams read requests per month (always free)

## Usage Scenarios & Cost Analysis

### Scenario 1: Prototype/Development (Low Usage)

**Monthly Usage:**
- API Requests: 10,000
- Lambda Invocations: 10,000 (avg 200ms duration)
- DynamoDB Reads: 8,000 (80% read operations)
- DynamoDB Writes: 2,000 (20% write operations)
- Storage: 1 GB

**Cost Breakdown:**
- **API Gateway**: 10,000 × $0.0000035 = $0.035
- **Lambda Requests**: 10,000 × $0.0000002 = $0.002 (covered by free tier)
- **Lambda Compute**: 10,000 × 0.2s × 0.256GB × $0.0000166667 = $0.085 (covered by free tier)
- **DynamoDB Reads**: 8,000 × $0.000000125 = $0.001
- **DynamoDB Writes**: 2,000 × $0.000000625 = $0.00125
- **DynamoDB Storage**: Free (under 25GB)

**Total Monthly Cost: $0.04** (with free tier benefits)
**Total Annual Cost: $0.48**

### Scenario 2: Small Production (Medium Usage)

**Monthly Usage:**
- API Requests: 500,000
- Lambda Invocations: 500,000 (avg 200ms duration)
- DynamoDB Reads: 400,000
- DynamoDB Writes: 100,000
- Storage: 10 GB

**Cost Breakdown:**
- **API Gateway**: 500,000 × $0.0000035 = $1.75
- **Lambda Requests**: 500,000 × $0.0000002 = $0.10
- **Lambda Compute**: 500,000 × 0.2s × 0.256GB × $0.0000166667 = $4.27
- **DynamoDB Reads**: 400,000 × $0.000000125 = $0.05
- **DynamoDB Writes**: 100,000 × $0.000000625 = $0.0625
- **DynamoDB Storage**: Free (under 25GB)

**Total Monthly Cost: $6.24**
**Total Annual Cost: $74.88**

### Scenario 3: Growing Business (High Usage)

**Monthly Usage:**
- API Requests: 5,000,000
- Lambda Invocations: 5,000,000 (avg 200ms duration)
- DynamoDB Reads: 4,000,000
- DynamoDB Writes: 1,000,000
- Storage: 50 GB

**Cost Breakdown:**
- **API Gateway**: 5,000,000 × $0.0000035 = $17.50
- **Lambda Requests**: 5,000,000 × $0.0000002 = $1.00
- **Lambda Compute**: 5,000,000 × 0.2s × 0.256GB × $0.0000166667 = $42.67
- **DynamoDB Reads**: 4,000,000 × $0.000000125 = $0.50
- **DynamoDB Writes**: 1,000,000 × $0.000000625 = $0.625
- **DynamoDB Storage**: (50-25) × $0.25 = $6.25

**Total Monthly Cost: $68.55**
**Total Annual Cost: $822.60**

### Scenario 4: Enterprise Scale (Very High Usage)

**Monthly Usage:**
- API Requests: 50,000,000
- Lambda Invocations: 50,000,000 (avg 200ms duration)
- DynamoDB Reads: 40,000,000
- DynamoDB Writes: 10,000,000
- Storage: 200 GB

**Cost Breakdown:**
- **API Gateway**: 50,000,000 × $0.0000035 = $175.00
- **Lambda Requests**: 50,000,000 × $0.0000002 = $10.00
- **Lambda Compute**: 50,000,000 × 0.2s × 0.256GB × $0.0000166667 = $426.67
- **DynamoDB Reads**: 40,000,000 × $0.000000125 = $5.00
- **DynamoDB Writes**: 10,000,000 × $0.000000625 = $6.25
- **DynamoDB Storage**: (200-25) × $0.25 = $43.75

**Total Monthly Cost: $666.67**
**Total Annual Cost: $8,000.04**

## Cost Optimization Recommendations

### Immediate Optimizations

1. **API Gateway Caching**
   - Enable caching for frequently accessed product data
   - 0.5GB cache: $0.02/hour = $14.40/month
   - Can reduce DynamoDB reads by 60-80%

2. **Lambda Memory Optimization**
   - Test with 128MB memory (current: 256MB)
   - Potential 50% reduction in compute costs
   - Monitor performance impact

3. **DynamoDB Query Optimization**
   - Implement efficient query patterns
   - Use projection expressions to reduce data transfer
   - Consider batch operations for bulk requests

### Long-term Optimizations

1. **Reserved Capacity (High Usage)**
   - For predictable workloads >100M requests/month
   - DynamoDB Reserved Capacity can save 53-76%
   - API Gateway has no reserved pricing

2. **CloudFront Distribution**
   - Cache static responses at edge locations
   - Reduce API Gateway requests by 40-60%
   - Additional cost: ~$0.085 per GB transferred

3. **Provisioned Concurrency (if needed)**
   - Only for latency-critical applications
   - Additional cost: $0.0000097 per GB-second
   - Eliminates cold start latency

## Cost Comparison by Scenario

| Scenario | Monthly Requests | Monthly Cost | Cost per 1K Requests |
|----------|------------------|--------------|----------------------|
| Prototype | 10,000 | $0.04 | $0.004 |
| Small Production | 500,000 | $6.24 | $0.012 |
| Growing Business | 5,000,000 | $68.55 | $0.014 |
| Enterprise | 50,000,000 | $666.67 | $0.013 |

## Key Assumptions

1. **Lambda Function Performance**
   - Average execution time: 200ms
   - Memory allocation: 256MB
   - No cold start optimization needed

2. **API Usage Pattern**
   - 80% read operations (GET requests)
   - 20% write operations (data updates)
   - Uniform distribution throughout the month

3. **Data Characteristics**
   - Average item size: 2KB
   - No complex queries requiring scans
   - Minimal data transfer costs

4. **Regional Deployment**
   - Single region deployment (us-east-1)
   - No cross-region replication
   - No disaster recovery costs included

## Exclusions

The following costs are **NOT** included in this analysis:

1. **Development & Deployment**
   - CodePipeline, CodeBuild, CodeDeploy
   - Developer time and resources
   - Testing environment costs

2. **Monitoring & Logging**
   - CloudWatch Logs storage beyond free tier
   - Custom metrics and dashboards
   - X-Ray tracing (if implemented)

3. **Security & Compliance**
   - WAF (Web Application Firewall)
   - Certificate Manager (if custom domain)
   - Security scanning tools

4. **Data Transfer**
   - Internet egress charges
   - Cross-AZ data transfer
   - CloudFront distribution costs

5. **Backup & Recovery**
   - DynamoDB backup storage
   - Cross-region backup replication
   - Point-in-time recovery storage

## Free Tier Benefits Summary

**First 12 Months:**
- Lambda: 1M requests + 400,000 GB-seconds/month
- DynamoDB: 25GB storage (always free)
- DynamoDB Streams: 2.5M read requests/month (always free)

**Always Free:**
- DynamoDB: 25GB storage
- DynamoDB Streams: 2.5M read requests/month

## Monitoring & Alerting Recommendations

1. **Cost Monitoring**
   - Set up billing alerts at $10, $50, $100 thresholds
   - Monitor daily spend trends
   - Track cost per request metrics

2. **Usage Monitoring**
   - Lambda duration and memory utilization
   - DynamoDB throttling events
   - API Gateway 4xx/5xx error rates

3. **Performance Monitoring**
   - API response times
   - Lambda cold start frequency
   - DynamoDB query performance

## Conclusion

The Product Specifications API offers excellent cost efficiency for serverless applications:

- **Prototype stage**: Nearly free with AWS free tier
- **Production ready**: Scales cost-effectively with usage
- **Enterprise scale**: Predictable pricing model

The pay-per-use model ensures you only pay for actual consumption, making it ideal for applications with variable or unpredictable traffic patterns.

For applications expecting consistent high traffic (>10M requests/month), consider implementing caching strategies and monitoring for potential reserved capacity savings.

---

**Document Version**: 1.0  
**Last Updated**: November 15, 2025  
**Region**: US East (N. Virginia)  
**Currency**: USD
