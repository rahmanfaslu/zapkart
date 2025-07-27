export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">📦 Products</h3>
          <p className="text-2xl font-bold">50</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">🛒 Orders</h3>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">👤 Users</h3>
          <p className="text-2xl font-bold">80</p>
        </div>
      </div>
    </div>
  );
}
