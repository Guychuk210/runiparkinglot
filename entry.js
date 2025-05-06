const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const params = event.queryStringParameters; //get the params from the url
  const plate = params?.plate;
  const parkingLot = params?.parkingLot;

  if (!plate || !parkingLot) {
    //validaton
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing plate or parkingLot" }),
    };
  }

  const existingTickets = await dynamo
    .scan({
      //look for any active ticket (can't enter again without exit)
      TableName: "Tickets",
      FilterExpression: "plate = :plate AND attribute_not_exists(exitTime)",
      ExpressionAttributeValues: {
        ":plate": plate,
      },
    })
    .promise();

  if (existingTickets.Items.length > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "This vehicle has already entered and not yet exited.",
      }),
    };
  }

  //if allowed, create a new ticket
  const ticketId = uuidv4();
  const entryTime = new Date().toISOString();

  const item = {
    ticketId,
    plate,
    parkingLot,
    entryTime,
  };

  await dynamo
    .put({
      //insert the dynamoDB
      TableName: "Tickets",
      Item: item,
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ ticketId }),
  };
};
