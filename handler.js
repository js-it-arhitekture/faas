'use strict';


const AWS = require('aws-sdk');
const uuid = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4566', // Localstack DynamoDB endpoint
  region: 'us-east-1'
});

const TABLE_NAME = "booking-management-system-events";

module.exports.createBooking = async (event) => {
  const { name, description, date } = JSON.parse(event.body);
  const id = uuid.v4();
  const newBooking = { id, name, description, date };
  await docClient.put({
    TableName: TABLE_NAME,
    Item: newBooking
  }).promise();
  return {
    statusCode: 201,
    body: JSON.stringify(newBooking)
  };
}

module.exports.getBookings = async (event) => {
  const { Items } = await docClient.scan({
    TableName: TABLE_NAME
  }).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(Items)
  };
}

module.exports.getBookingById = async (event) => {
  const { id } = event.pathParameters;
  const { Item } = await docClient.get({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();
  if (!Item) return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Booking not found' })
  }
  return {
    statusCode: 200,
    body: JSON.stringify(Item)
  };

}

module.exports.updateBooking = async (event) => {
  const { id } = event.pathParameters;
  const { name, description, date } = JSON.parse(event.body);
  const updatedBooking = { id, name, description, date };
  await docClient.put({
    TableName: TABLE_NAME,
    Item: updatedBooking
  }).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(updatedBooking)
  };
}

module.exports.deleteBooking = async (event) => {
  const { id } = event.pathParameters;
  await docClient.delete({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();
  return {
    statusCode: 204,
    body: JSON.stringify({ message: 'Booking deleted' })
  };
}


