import { PaymentCreatedEvent, Publisher, Subjects } from "@dctiketz/common";

export class PaymentCreatePublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
