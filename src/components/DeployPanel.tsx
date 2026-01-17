
import React from 'react';
import { Construction, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { User } from '../types';

interface DeployPanelProps {
  currentUser: User;
  onBack: () => void;
  onGoToGuide: () => void;
}

const DeployPanel: React.FC<DeployPanelProps> = ({ currentUser, onBack, onGoToGuide }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600"></div>

      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-2xl relative z-10">
        
        <div className="inline-flex items-center justify-center p-6 bg-yellow-500/10 text-yellow-500 rounded-full mb-8 ring-1 ring-yellow-500/30">
          <Construction size={64} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight">
          Módulo em <span className="text-yellow-500">Desenvolvimento</span>
        </h1>

        <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto">
          O sistema de <strong>Deploy Automatizado (One-Click)</strong> está mapeado para a próxima Sprint.
          <br/><br/>
          Atualmente, a infraestrutura AWS (S3, CloudFront) deve ser configurada manualmente através do Console da AWS.
        </p>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8 text-left flex gap-4 items-start">
           <AlertTriangle className="text-orange-500 shrink-0 mt-1" />
           <div>
              <h3 className="font-bold text-white mb-1">Status do Sistema: OFFLINE</h3>
              <p className="text-sm text-slate-400">
                A conexão direta com a API Lambda ainda não foi estabelecida. Por favor, utilize o método manual descrito na documentação.
              </p>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
           <button 
             onClick={onBack}
             className="px-8 py-4 rounded-xl font-bold text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-all"
           >
             Voltar ao Dashboard
           </button>
           
           <button 
             onClick={onGoToGuide}
             className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
           >
             <BookOpen size={20} />
             Ler Manual de Deploy
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

      </div>
      
      <div className="mt-8 text-slate-600 font-mono text-xs uppercase tracking-widest">
        Roadmap 2026 • Sprint 2 Backlog
      </div>
    </div>
  );
};

export default DeployPanel;
