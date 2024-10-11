import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  console.log(tickets);

  const ticketsWidget = tickets.map((t) => {
    return (
      <tr key={t.id}>
        <td>{t.title}</td>
        <td>{t.price} $</td>
        <td>
          {currentUser?.id !== t.userId && (
            <Link href={`tickets/[ticketId]`} as={`/tickets/${t.id}`}>
              View
            </Link>
          )}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>{ticketsWidget}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: tickets } = await client.get("/api/tickets");
  return { tickets };
};

export default LandingPage;
