export default function CurrentTicketOther() {
  return (
    <div>
      <h2 className="text-2xl mb-4">
        Current Ticket: <strong>WEB-1245</strong>
      </h2>
      <div>
        <h3 className="text-xl font-semibold mt-5 mb-2">Pick your vote</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 5, 8, 13, 21].map((num) => (
            <button
              key={num}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => console.log(`Voted: ${num}`)}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
