import { ExpirationCompleteEvent, Publisher, Subjects } from "@dctiketz/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
