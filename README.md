# Cloud-Based Parking Lot Management System (Serverless AWS)

This project implements a simple parking lot management system using AWS Lambda, API Gateway, and DynamoDB, deployed with Serverless Framework.

It supports vehicle **entry** and **exit** operations, calculates parking fees based on time, and prevents duplicate entries for the same vehicle until exit is completed.

## Features

- `POST /entry`: Register vehicle entry and return a ticket ID
  - Blocks duplicate entries if a vehicle hasn’t exited yet
- `POST /exit`: Calculate fee and mark ticket as exited
  - Fee = $10/hour, billed in 15-minute increments
- All endpoints are secured via API key
- Fully deployed to AWS — no setup needed by the TA

## Live API Access

This project is already deployed. You can test it directly using Postman or `curl`.

### Base URL:

api keys:
parkingApiKey: sent seperately, insert it in headers as: <x-api-key: actualApiKey>
endpoints:
POST - https://lgf93z13g1.execute-api.us-east-1.amazonaws.com/dev/entry
POST - https://lgf93z13g1.execute-api.us-east-1.amazonaws.com/dev/exit
