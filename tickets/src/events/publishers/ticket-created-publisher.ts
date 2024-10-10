import { Publisher, Subjects, TicketCreatedEvent } from "@dctiketz/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
