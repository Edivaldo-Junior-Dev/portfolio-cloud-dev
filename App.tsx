
import React, { useEffect, useState, useCallback } from 'react';
import { INITIAL_VOTES, MEMBERS as DEFAULT_MEMBERS, PROPOSALS as DEFAULT_PROPOSALS, CORE_TEAM_IDS, TEAMS as DEFAULT_TEAMS } from './constants';
import { Score, VotesState, Member, Proposal, User, Team } from './types';
import { api } from './lib/api'; 
import VotingForm from './components/VotingForm';
import ResultsMatrix from './components/ResultsMatrix';
import AIChatPanel from './components/AIChatPanel';
import LoginPanel from './components/LoginPanel';
import TeamDashboard from './components/TeamDashboard';
import TeamMembers from './components/TeamMembers';
import TeamRolesPanel from './components/TeamRolesPanel'; 
import GuidePanel from './components/GuidePanel'; 
import { Moon, Sun, BarChart3, LogOut, Layers, ChevronLeft, BookOpen, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('matrix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'dashboard' | 'matrix' | 'members' | 'guide' | 'roles'>('dashboard');
  const [activeTab, setActiveTab] = useState<'vote' | 'results' | 'ai'>('vote');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // State Global
  const [teams, setTeams] = useState<Team[]>(DEFAULT_TEAMS);
  const [savedProfiles, setSavedProfiles] = useState<Member[]>([]);
  const [votes, setVotes] = useState<VotesState>(INITIAL_VOTES);
  
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isOnline, setIsOnline] = useState(true);

  // --- SINCRONIZAÇÃO (AGORA LOCAL/AWS READY) ---

  const syncData = useCallback(async () => {
    if(!currentUser) return;
    try {
        // Agora busca do LocalStorage (via api.ts refatorado)
        const [remoteTeams, remoteProfiles, remoteVotes] = await Promise.all([
            api.fetchData('teams'),
            api.fetchData('profiles'),
            api.fetchData('votes')
        ]);

        if (remoteTeams) setTeams(remoteTeams);
        if (remoteProfiles) setSavedProfiles(remoteProfiles);
        if (remoteVotes) setVotes(remoteVotes);

        setIsOnline(true);
    } catch (e: any) {
        console.error("Erro de sync:", e);
        setIsOnline(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if(currentUser) {
        syncData();
    }
  }, [currentUser, syncData]);

  // --- HANDLERS DE PERSISTÊNCIA ---

  const handleSaveTeam = async (updatedTeam: Team) => {
      const newTeams = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
      setTeams(newTeams); 
      await api.saveData('teams', newTeams);
  };

  const handleSaveProfile = async (member: Member) => {
      const filtered = savedProfiles.filter(p => p.name !== member.name);
      const newProfiles = [...filtered, member];
      setSavedProfiles(newProfiles);
      await api.saveData('profiles', newProfiles);
  };

  const handleVote = async (pid: string, cidx: number, score: Score) => {
    if (!currentUser) return;
    const memberId = CORE_TEAM_IDS.find(id => currentUser.name.toLowerCase().includes(id)) || 'visitor';
    
    const newVotes = JSON.parse(JSON.stringify(votes));
    if(!newVotes[memberId]) newVotes[memberId] = {};
    if(!newVotes[memberId][pid]) newVotes[memberId][pid] = {};
    newVotes[memberId][pid][cidx] = score;

    setVotes(newVotes);
    await api.saveData('votes', newVotes);
  };

  // --- EFEITOS UI ---
  useEffect(() => {
    localStorage.setItem('matrix_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
      localStorage.removeItem('matrix_user');
      localStorage.removeItem('auth_token');
      setCurrentUser(null);
  };

  if (!currentUser) return <LoginPanel onLogin={setCurrentUser} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200 font-sans">
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg shadow-orange-500/20"><Layers size={20} /></div>
            <div>
              <h1 className="text-lg font-black dark:text-white leading-none tracking-tighter">Matriz<span className="text-orange-500">Cognis</span></h1>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-widest flex items-center gap-2">
                 <Wifi size={10} className="text-emerald-500" /> SYSTEM READY (AWS S3 MODE)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('guide')} className="text-slate-500 hover:text-orange-500 mr-4" title="Documentação">
                <BookOpen size={20} />
            </button>

            {view !== 'dashboard' && (
              <button 
                onClick={() => { setView('dashboard'); setSelectedTeam(null); }}
                className="bg-white text-orange-500 font-black px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-all text-xs border border-orange-100 uppercase tracking-widest flex items-center gap-2"
              >
                <ChevronLeft size={16} /> Voltar
              </button>
            )}
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="p-2 text-red-500 border border-red-500/20 rounded-xl">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-1">
        {view === 'guide' && <GuidePanel members={DEFAULT_MEMBERS} proposals={DEFAULT_PROPOSALS} />}

        {view === 'dashboard' && (
          <TeamDashboard 
            teams={teams} 
            onSaveTeam={handleSaveTeam} 
            onEnterMatrix={(t) => { setSelectedTeam(t); setView('matrix'); }} 
            onViewMembers={(t) => { setSelectedTeam(t); setView('members'); }}
            onViewRoles={(t) => { setSelectedTeam(t); setView('roles'); }}
            currentUser={currentUser} 
          />
        )}
        
        {view === 'members' && selectedTeam && (
          <TeamMembers 
            team={selectedTeam} 
            onBack={() => setView('dashboard')}
            currentUser={currentUser} 
            savedProfiles={savedProfiles}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {view === 'roles' && selectedTeam && (
          <TeamRolesPanel
            team={selectedTeam}
            currentUser={currentUser}
            onBack={() => setView('dashboard')}
            savedProfiles={savedProfiles}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {view === 'matrix' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 gap-4">
               <div>
                  <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{selectedTeam?.name}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Auditando: {selectedTeam?.project.name}</p>
               </div>
               <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button onClick={() => setActiveTab('vote')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'vote' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500'}`}>VOTAÇÃO</button>
                  <button onClick={() => setActiveTab('results')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'results' ? 'bg-white dark:bg-slate-700 text-orange-500 shadow-sm' : 'text-slate-500'}`}>MATRIZ</button>
                  <button onClick={() => setActiveTab('ai')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>IA</button>
               </div>
            </div>
            {activeTab === 'vote' && <VotingForm member={DEFAULT_MEMBERS.find(m => currentUser.name.toLowerCase().includes(m.id)) || DEFAULT_MEMBERS[0]} votes={votes} proposals={DEFAULT_PROPOSALS} onVote={handleVote} />}
            {activeTab === 'results' && <ResultsMatrix votes={votes} members={DEFAULT_MEMBERS} proposals={DEFAULT_PROPOSALS} />}
            {activeTab === 'ai' && <AIChatPanel votes={votes} members={DEFAULT_MEMBERS} proposals={DEFAULT_PROPOSALS} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
