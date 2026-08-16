export const metadata = {
    title: "Transactions",
    description: "View and manage your transactions here.",
};

const TransactionsPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
            <p className="text-gray-600">View and manage your transactions here.</p>
        </div>
    );
}

export default TransactionsPage;