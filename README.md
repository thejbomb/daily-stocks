# Daily stocks
This project (back-end) notifies users in the database when there is a change in price the price of the stock they're interested in.

http://dailystocks.info

## Getting started

Clone the repository for local development.

## Prerequisites

Npm and mongodb is needed for local development so be sure to install those beforehand.
In addition to that, you will need an alpha vantage api key, an email and a mongodb cluster set up, be sure to gather these things before development.

### Installing

After cloning the repository, call npm install to install all the dependencies for the project.
Before you're ready to start development, you need to create your own .env file that contains your alpha vanatge api key, email and password for the email you'll use for nodemailer, and your mongodb cluster uri.

## Deployment

This project is deployed on an AWS EC2 instance.
You could do the same or use other services such as AWS amplify or Heroku.

## Built with

This project is built with Nodejs, Express, MongoDB.
