export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Paramètres du Compte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Compte */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-blue-500">Profil</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <div className="p-2 bg-gray-800 rounded border border-gray-700">jean.dupont@email.com</div>
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm w-full">Modifier le profil</button>
          </div>
        </div>

        {/* Section API */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-green-500">Clés API</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400">OpenAI Status</label>
              <div className="p-2 bg-green-900/20 text-green-400 rounded border border-green-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Connecté
              </div>
            </div>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm w-full">Gérer les crédits</button>
          </div>
        </div>
      </div>
    </div>
  );
}