import mongoose from "mongoose";
import { Order } from "../../../models/order-model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@dctiketz/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    userId: "abc",
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    ticket: {
      id: "abc",
    },
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updated the status of the order", async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMesssage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { data, listener, msg, order } = await setup();

  await listener.onMesssage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
