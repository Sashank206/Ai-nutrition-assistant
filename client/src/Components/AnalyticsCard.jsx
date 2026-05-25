function AnalyticsCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-gray-400 text-lg">
        {title}
      </h2>

      <p className="text-3xl font-bold text-white mt-2">
        {value}
      </p>

    </div>
  );
}

export default AnalyticsCard;