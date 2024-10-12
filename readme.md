# Tiketz

Welcome to **Tiketz**! 🎟️

Tiketz is a fun and intuitive microservices application designed for ticket management. Whether you're looking to buy a ticket for an event or sell one, Tiketz makes it easy! With a user-friendly interface built using React and Next.js, and a backend powered by Node.js, this application is structured to handle everything you need in the world of ticketing.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Microservices](#microservices)
  - [Auth Service](#auth-service)
  - [Ticket Service](#ticket-service)
  - [Order Service](#order-service)
  - [Payment Service](#payment-service)
  - [Expiration Service](#expiration-service)
- [Technologies](#technologies)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Build and Run the Services](#build-and-run-the-services)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

Tiketz comes packed with features to enhance your ticketing experience:

- **User Authentication**: Secure sign-in and management to keep your account safe.
- **Ticket Management**: Create, update, and delete tickets.
- **Order Processing**: Simple order creation for buying tickets.
- **Payment Integration**: Securely process payments through Stripe.
- **Order Expiration**: Automatically manage order expirations to allow re-listing of tickets.
- **Asynchronous Communication**: Efficiently handles communication between services using NATS Streaming Service.

## Architecture

At the heart of Tiketz is a microservices architecture, where each component works independently yet cohesively. This design promotes scalability, reliability, and ease of maintenance.

### Components

- **Microservices**: Each service operates separately, allowing for isolated development and deployment. This means you can update one part of the application without affecting others!
- **NATS Streaming Service**: Acts as the glue that holds everything together by facilitating asynchronous communication between services.
- **Database**: Each service can use its own database schema, keeping data management straightforward and organized.

## Microservices

Let's dive into the core of Tiketz! Here’s a rundown of each microservice and what it does:

### Auth Service

- **What it does**: This service is responsible for all user authentication activities.
- **Key features**:
  - Validates user credentials.
  - Generates JWT tokens for secure sessions.
  - Allows other services to get user info when needed.

### Ticket Service

- **What it does**: The backbone of the ticketing system, this service manages all ticket-related activities.
- **Key features**:
  - Persists ticket information.
  - Notifies the Order service whenever a ticket changes.
  - Ensures tickets are only available based on order and payment status.

### Order Service

- **What it does**: This service creates and tracks orders for ticket purchases.
- **Key features**:
  - Checks if tickets are available before creating an order.
  - Emits events for order management (like creation and expiration).
  - Keeps track of order statuses (pending, completed, expired).

### Payment Service

- **What it does**: Handles everything related to payments.
- **Key features**:
  - Processes payments through Stripe.
  - Sends updates to other services once payment is successful.
  - Secures payment details for each transaction.

### Expiration Service

- **What it does**: Manages the lifecycle of orders, ensuring timely expirations.
- **Key features**:
  - Listens for new orders and sets timers for expiration.
  - Notifies other services when orders expire, allowing tickets to be re-listed.
  - Helps keep the system clean and efficient.

## Technologies

Tiketz is built using a combination of powerful technologies:

- **Node.js**: For building fast and scalable backend services.
- **React**: A JavaScript library that makes it easy to create interactive user interfaces.
- **Next.js**: A framework for server-side rendering, ensuring a smooth user experience.
- **Docker**: To package each service into containers, making it easy to manage.
- **Kubernetes**: Helps deploy, scale, and manage these containers effortlessly.
- **NATS Streaming Service**: A messaging system that ensures smooth communication between services.
- **Stripe**: For secure and reliable payment processing.

## Setup

### Prerequisites

Before diving in, make sure you have these tools installed:

- **Docker**: Essential for containerizing our application services.
- **Kubernetes**: For managing our services (you can use Minikube for local development).
- **Node.js**: Required for running the backend services.
- **npm or yarn**: To manage your project dependencies.

### Clone the Repository

Start by cloning the Tiketz repository to your local machine:

```bash
git clone https://github.com/yourusername/tiketz.git
cd tiketz
```
