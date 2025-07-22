export default function PolicyResult({ result }) {
  return (
    <div className="mt-6 p-4 border rounded bg-gray-500">
      <h2 className="text-xl font-semibold mb-2">📋 Summary</h2>
      <ul className="list-disc ml-5 mb-4">
        {result.summary.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
      <p><strong>🔒 Trust Score:</strong> {result.trustScore}/10</p>
      <p><strong>⚠️ Risks:</strong> {result.risks.join(', ')}</p>
      <p><strong>🗂️ Categories:</strong> {result.categories.join(', ')}</p>
    </div>
  );
}
