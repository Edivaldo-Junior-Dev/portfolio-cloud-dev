
import React, { useState } from 'react';
import { CRITERIA, Member, Proposal } from '../types';
import { BookOpen, UserCheck, BarChart3, Sparkles, Settings, Code2, Database, Layers, CheckCircle2, ChevronDown, ChevronUp, Cpu, ShieldCheck, Cloud, Server, Globe, ArrowRight, LayoutList, Target, User, Flag, Rocket, Lock, Key, MousePointerClick, AlertTriangle } from 'lucide-react';

interface GuidePanelProps {
  members: Member[];
  proposals: Proposal[];
}

const GuidePanel: React.FC<GuidePanelProps> = ({ members, proposals }) => {
  const [openSection, setOpenSection] = useState<string | null>('aws_manual'); // Abre o manual direto

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const SectionHeader = ({ id, title, icon: Icon, colorClass }: any) => (
    <button 
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all duration-200 ${openSection === id ? 'bg-white dark:bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-current`}>
          <Icon size={24} />
        </div>
        <span className="font-bold text-lg text-slate-800 dark:text-white text-left">{title}</span>
      </div>
      {openSection === id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full mb-4">
          <Cloud size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Central de Migração AWS</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Manual Oficial para Deploy Manual via S3 (Método Rápido).
        </p>
      </div>

      <div className="space-y-4">

        {/* SECTION: MANUAL TÉCNICO (CLIQUE A CLIQUE) */}
        <SectionHeader id="aws_manual" title="Manual de Deploy: Upload via Computador (VSCode)" icon={MousePointerClick} colorClass="text-orange-600 bg-orange-600" />
        {openSection === 'aws_manual' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-8 animate-fade-in-down">
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 flex gap-3">
               <AlertTriangle className="text-yellow-600 shrink-0" />
               <div>
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Atenção: Use os arquivos da pasta DIST</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                     Não suba a pasta do projeto inteira (src, node_modules, etc). A AWS só entende os arquivos finais gerados dentro da pasta <code>dist</code>.
                  </p>
               </div>
            </div>

            {/* PASSO 1: BUILD */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Gerar Arquivos (No seu VSCode)
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Terminal:</strong>
                        <span className="text-slate-500 text-sm">Abra o terminal do VSCode na pasta do projeto.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Comando:</strong>
                        <span className="text-slate-500 text-sm">Digite <code>npm run build</code> e dê Enter.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Resultado:</strong>
                        <span className="text-slate-500 text-sm">Uma pasta chamada <code>dist</code> vai aparecer na lista de arquivos à esquerda.</span>
                    </div>
                </div>
            </div>

            {/* PASSO 2: UPLOAD */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Fazer Upload (No Navegador)
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. AWS Console:</strong>
                        <span className="text-slate-500 text-sm">Vá para o seu bucket S3 criado (ex: <code>portfolio-cloud-edivaldo-v1</code>).</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Botão Upload:</strong>
                        <span className="text-slate-500 text-sm">Clique no botão laranja <strong>Upload</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Arrastar Arquivos:</strong>
                        <span className="text-slate-500 text-sm">
                           No seu computador, abra a pasta <code>dist</code>. Selecione <strong>TUDO</strong> que está dentro dela (index.html, pasta assets, vite.svg).
                           <br/>
                           <span className="text-red-500 font-bold">NÃO ARRASTE A PASTA "DIST". ARRASTE O CONTEÚDO DELA.</span>
                           <br/>
                           Arraste para a janela da AWS.
                        </span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">4. Confirmar:</strong>
                        <span className="text-slate-500 text-sm">Clique em <strong>Upload</strong> lá embaixo.</span>
                    </div>
                </div>
            </div>

            {/* PASSO 3: CONFIGURAÇÃO */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Configurar para Abrir
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Static Hosting:</strong>
                        <span className="text-slate-500 text-sm">Aba <strong>Properties</strong> -> Rolar até o fim -> Static website hosting -> <strong>Enable</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Index:</strong>
                        <span className="text-slate-500 text-sm">Escreva <code>index.html</code> em "Index document". Salve.</span>
                    </div>
                     <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Permissões (JSON):</strong>
                        <span className="text-slate-500 text-sm">Aba <strong>Permissions</strong> -> Bucket Policy -> Edit -> Cole o JSON abaixo:</span>
                        <pre className="bg-slate-900 text-emerald-400 p-3 rounded mt-2 text-xs overflow-x-auto font-mono">
{`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::NOME-DO-SEU-BUCKET/*"
        }
    ]
}`}
                        </pre>
                        <span className="text-xs text-orange-500 mt-1 block">* Troque NOME-DO-SEU-BUCKET pelo nome real do seu bucket.</span>
                    </div>
                </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default GuidePanel;
