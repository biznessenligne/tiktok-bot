'use client';
import Link from 'next/link';
import { useState } from 'react';

// --- Icônes SVG ---
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconBot = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" x2="8" y1="16" y2="16"></line><line x1="16" x2="16" y1="16" y2="16"></line></svg>;
const IconVideo = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default function DashboardVisual() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  // On transforme la liste en "useState" pour pouvoir y ajouter des éléments
  const [recentVideos, setRecentVideos] = useState([
    { id: 1, title: "Les secrets d'Elon Musk", niche: "Business", status: "Terminé", views: "12.5K" },
    { id: 2, title: "Pourquoi tu dors tard", niche: "Facts", status: "Publié", views: "8.2K" },
    { id: 3, title: "Motivation du matin", niche: "Sport", status: "Rendu", views: "-" },
  ]);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setLoading(true);
    try {
      // On appelle NOTRE API
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche: 'General' })
      });
      
      const data = await res.json();

      if (data.success) {
        alert(`Script généré par l'IA : \n\n${data.script}`);
        
        // On ajoute la nouvelle vidéo à la liste
        const newVideo = {
          id: Date.now(),
          title: topic,
          niche: 'General',
          status: 'Rendu',
          views: "0"
        };
        setRecentVideos([newVideo, ...recentVideos]);
        setTopic(''); // Vide le champ
      } else {
        alert("Erreur : " + data.error);
      }
    } catch (error) {
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 font-sans text-gray-100">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">AI</div>
          <span className="text-xl font-bold tracking-tight">TikTok<span className="text-blue-500">Bot</span></span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
  <NavItem icon={<IconHome />} label="Dashboard" active href="/dashboard" />
  <NavItem icon={<IconBot />} label="Mes Machines" href="/machines" />
  <NavItem icon={<IconVideo />} label="Galerie Vidéos" href="/videos" />
  <NavItem icon={<IconSettings />} label="Paramètres" href="/settings" />
</nav>
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Crédits Restants</p>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">42</span>
              <span className="text-xs text-green-400 mb-1">+12 demain</span>
            </div>
            <button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-xs py-2 rounded transition">Recharger</button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-950/80 backdrop-blur">
          <h2 className="text-lg font-semibold">Tableau de bord</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Jean Dupont</p>
              <p className="text-xs text-gray-500">Compte Pro</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Vues Totales" value="1.2M" change="+15%" positive />
            <StatCard title="Vidéos Créées" value="348" change="+22%" positive />
            <StatCard title="Taux d'engagement" value="4.8%" change="-0.2%" positive={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Generator Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><IconBot /></div>
                  <h3 className="text-xl font-bold">Générateur IA</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Sujet de la vidéo</label>
                    <textarea 
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-32 resize-none"
                      placeholder="Ex: Les 3 habitudes des millionnaires le matin..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Style Visuel</label>
                      <select className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white focus:outline-none">
                        <option>Cinéma Hollywood</option>
                        <option>Anime Manga</option>
                        <option>Minimaliste Noir & Blanc</option>
                        <option>Neon Cyberpunk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Voix IA</label>
                      <select className="w-full bg-gray-950 border border-gray-700 rounded-xl p-3 text-white focus:outline-none">
                        <option>Adam (Profond)</option>
                        <option>Rachel (Dynamique)</option>
                        <option>Antoine (Storyteller)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !topic}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2
                      ${loading ? 'bg-blue-600 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'}`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyse & Montage en cours...
                      </>
                    ) : (
                      "Lancer la Machine TikTok"
                    )}
                  </button>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-lg">Générations Récentes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase bg-gray-950/50 text-gray-300">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Titre</th>
                        <th className="px-4 py-3">Niche</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3 rounded-r-lg text-right">Vues</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {recentVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-800/50 transition">
                          <td className="px-4 py-3 font-medium text-white">{video.title}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 rounded bg-gray-800 text-xs border border-gray-700">{video.niche}</span></td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <IconCheck /> {video.status}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-white">{video.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                </div>
                <h3 className="font-bold text-lg mb-4 relative z-10">Santé du Système</h3>
                
                <div className="space-y-4 relative z-10">
                  <HealthItem label="API TikTok" status="Operational" color="green" />
                  <HealthItem label="Moteur Vidéo" status="High Load" color="yellow" />
                  <HealthItem label="Base de données" status="Operational" color="green" />
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                <h3 className="font-bold text-blue-400 mb-2">💡 Conseil Pro</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Tes vidéos sur la niche <strong>"Business"</strong> performent mieux le mardi à 18h. Essaie de planifier ta prochaine génération pour ce créneau.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- Sous-composants ---
function NavItem({ icon, label, active = false, href }: { icon: any, label: string, active?: boolean, href: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function StatCard({ title, value, change, positive }: { title: string, value: string, change: string, positive: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between h-32 hover:border-gray-700 transition">
      <span className="text-gray-400 text-sm font-medium">{title}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className={`text-sm font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
      </div>
    </div>
  );
}

function HealthItem({ label, status, color }: { label: string, status: string, color: 'green' | 'yellow' }) {
  const colors = color === 'green' ? 'bg-green-500' : 'bg-yellow-500';
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colors} animate-pulse`}></span>
        <span className="text-xs font-medium text-gray-300">{status}</span>
      </div>
    </div>
  );
}