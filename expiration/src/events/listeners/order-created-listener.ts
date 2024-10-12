import { OrderCreatedEvent, OrderStatus, Subjects } from "@dctiketz/common";
import Listener from "@dctiketz/common/build/events/base-listener";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";
import { EachMessagePayload } from "kafkajs";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName(): string {
    return queueGroupName;
  }

  onMesssage(data: OrderCreatedEvent["data"], msg: EachMessagePayload): void {}

  // async onMesssage(
  //   data: OrderCreatedEvent["data"],
  //   msg:
  // ): Promise<void> {
  //   const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
  //   console.log("Waiting... " + delay + "MS");

  //   await expirationQueue.add(
  //     { orderId: data.id },
  //     {
  //       delay,
  //     }
  //   );

  //   msg.ack();
  // }
}
