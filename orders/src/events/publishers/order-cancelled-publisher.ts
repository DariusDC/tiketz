import { OrderCancelledEvent, Publisher, Subjects } from "@dctiketz/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
