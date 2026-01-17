
import React, { useState } from 'react';
import { Member, Proposal } from '../types';
import { ChevronDown, ChevronUp, Cloud, MousePointerClick, AlertTriangle, GitBranch, Terminal, ShieldAlert } from 'lucide-react';

interface GuidePanelProps {
  members: Member[];
  proposals: Proposal[];
}

const GuidePanel: React.FC<GuidePanelProps> = ({ members, proposals }) => {
  const [openSection, setOpenSection] = useState<string | null>('aws_manual');

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

        {/* SECTION: SOLUÇÃO DE PROBLEMAS (GIT E NODE) */}
        <SectionHeader id="troubleshooting" title="Correção de Erros (Git e NPM)" icon={AlertTriangle} colorClass="text-red-600 bg-red-600" />
        {openSection === 'troubleshooting' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6 animate-fade-in-down">
            
            <p className="text-slate-600 dark:text-slate-300">
                Se você está vendo erros no terminal ou o VSCode não sincroniza, instale as ferramentas abaixo e <strong>reinicie o computador</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* NODE JS */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-2 mb-2 text-green-600 font-bold">
                        <Terminal size={20} />
                        <h3>Erro: "npm não reconhecido"</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        O comando <code>npm run build</code> falha porque você não tem o Node.js.
                    </p>
                    <a 
                        href="https://nodejs.org/" 
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition-colors"
                    >
                        Baixar Node.js (LTS)
                    </a>
                </div>

                {/* GIT */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold">
                        <GitBranch size={20} />
                        <h3>Erro: "Unable to find git"</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        O VSCode não consegue sincronizar com GitHub sem o Git instalado no Windows.
                    </p>
                    <a 
                        href="https://git-scm.com/download/win" 
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-orange-600 text-white py-2 rounded font-bold hover:bg-orange-700 transition-colors"
                    >
                        Baixar Git for Windows
                    </a>
                </div>

                {/* POWERSHELL SCRIPT ERROR */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900 lg:col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2 text-red-500 font-bold">
                        <ShieldAlert size={20} />
                        <h3>Erro: "Scripts desabilitados"</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">
                        Se aparecer erro vermelho ao dar <code>npm install</code>, rode este comando no terminal para destravar o Windows:
                    </p>
                    <code className="block w-full bg-slate-800 text-yellow-400 p-2 rounded text-[10px] font-mono break-all mb-2">
                        Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
                    </code>
                    <p className="text-[10px] text-slate-400 italic">Aceite digitando "S" ou "Y" quando pedir.</p>
                </div>
            </div>

          </div>
        )}

        {/* SECTION: MANUAL TÉCNICO (CLIQUE A CLIQUE) */}
        <SectionHeader id="aws_manual" title="Manual de Deploy: Upload via Computador (VSCode)" icon={MousePointerClick} colorClass="text-orange-600 bg-orange-600" />
        {openSection === 'aws_manual' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-8 animate-fade-in-down">
            
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
                        <strong className="block text-slate-700 dark:text-slate-200">2. Instalar (Primeira vez):</strong>
                        <span className="text-slate-500 text-sm">Digite <code>npm install</code> e dê Enter. Espere baixar tudo.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Build:</strong>
                        <span className="text-slate-500 text-sm">Digite <code>npm run build</code> e dê Enter.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">4. Resultado:</strong>
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
                        <span className="text-slate-500 text-sm">Aba <strong>Properties</strong> &rarr; Rolar até o fim &rarr; Static website hosting &rarr; <strong>Enable</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Index:</strong>
                        <span className="text-slate-500 text-sm">Escreva <code>index.html</code> em "Index document". Salve.</span>
                    </div>
                     <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Permissões (JSON):</strong>
                        <span className="text-slate-500 text-sm">Aba <strong>Permissions</strong> &rarr; Bucket Policy &rarr; Edit &rarr; Cole o JSON abaixo:</span>
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
