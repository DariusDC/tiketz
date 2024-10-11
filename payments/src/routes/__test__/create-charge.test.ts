import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order-model";
import { OrderStatus } from "@dctiketz/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("Returns 404 when paying for an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "abc",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Returns 401 when paying for an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({
      token: "abc",
      orderId: order.id,
    })
    .expect(401);
});

it("Returns 400 when paying for an order that is cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "abc",
      orderId: order.id,
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
  expect(stripe.charges.create).toHaveBeenCalled();
});

it("returns a 201 and creates a payment", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  const chargeResult = await (stripe.charges.create as jest.Mock).mock
    .results[0].value;

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");
  expect(stripe.charges.create).toHaveBeenCalled();

  const payment = await Payment.findOne({ orderId: order.id });

  expect(payment).toBeDefined();
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(chargeResult.id);
});
