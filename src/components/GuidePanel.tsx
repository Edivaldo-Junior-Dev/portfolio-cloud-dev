
import React, { useState } from 'react';
import { CRITERIA, Member, Proposal } from '../types';
import { BookOpen, UserCheck, BarChart3, Sparkles, Settings, Code2, Database, Layers, CheckCircle2, ChevronDown, ChevronUp, Cpu, ShieldCheck, Cloud, Server, Globe, ArrowRight, LayoutList, Target, User, Flag, Rocket, Lock, Key, MousePointerClick } from 'lucide-react';

interface GuidePanelProps {
  members: Member[];
  proposals: Proposal[];
}

const GuidePanel: React.FC<GuidePanelProps> = ({ members, proposals }) => {
  const [openSection, setOpenSection] = useState<string | null>('presentation_script');

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
          Roteiro de apresentação e manual técnico para deploy manual do Portfólio na Nuvem.
        </p>
      </div>

      <div className="space-y-4">

        {/* SECTION 1: ROTEIRO DA EQUIPE (SCRIPT) */}
        <SectionHeader id="presentation_script" title="Roteiro Oficial da Apresentação (Equipe)" icon={UserCheck} colorClass="text-blue-600 bg-blue-600" />
        {openSection === 'presentation_script' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-8 animate-fade-in-down">
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Resumo do Estudo de Caso</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    Demonstração da migração de uma arquitetura local (monolito) para uma arquitetura distribuída e escalável na AWS (Serverless).
                </p>
            </div>

            <div className="space-y-6">
                {/* EMANUEL */}
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">1. Emanuel Heráclio (Líder e Gestão)</h4>
                    <div className="mt-2 space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 1 (Capa):</strong> "Olá, sou o Emanuel e nosso projeto é o 'Portfólio na Nuvem'. Vamos apresentar como transformamos um problema de visibilidade de desenvolvedores em uma solução escalável na AWS."
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 2 (O Problema):</strong> "Identificamos que muitos talentos perdem oportunidades porque seus projetos estão 'presos' no computador local. Nosso foco é a democratização do acesso à tecnologia através do Módulo RESTART."
                        </div>
                    </div>
                </div>

                {/* EDIVALDO */}
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">2. Edivaldo Junior (Frontend e Distribuição)</h4>
                    <div className="mt-2 space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 3 (Migração S3 + CloudFront):</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Cenário Antigo:</strong> Hospedagem Local instável.</li>
                                <li><strong>Solução AWS:</strong> S3 (Armazenamento) + CloudFront (CDN).</li>
                                <li><strong>Discurso:</strong> "Eu cuidei da interface em React. A grande evolução foi o uso do CloudFront, que garante segurança com SSL (cadeado) e faz o site carregar em milissegundos em qualquer lugar do mundo, resolvendo o requisito de performance."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* GABRIEL */}
                <div className="border-l-4 border-emerald-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">3. Gabriel Araújo (Backend Serverless)</h4>
                    <div className="mt-2 space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 4 (Lambda + API Gateway):</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Cenário Antigo:</strong> Servidor ligado 24h (Custo alto).</li>
                                <li><strong>Solução AWS:</strong> Lambda (Execução sob demanda).</li>
                                <li><strong>Discurso:</strong> "Em vez de um servidor ligado gerando custos, usamos funções Serverless. A Lambda só roda quando o usuário faz upload. A API Gateway orquestra tudo. Isso reduz o custo a quase zero (Free Tier)."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* NAIARA */}
                <div className="border-l-4 border-pink-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">4. Naiara Luprinda (Identidade e Segurança)</h4>
                    <div className="mt-2 space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 5 (Amazon Cognito):</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Cenário Antigo:</strong> Login caseiro (Inseguro).</li>
                                <li><strong>Solução AWS:</strong> Amazon Cognito (Auth gerenciada).</li>
                                <li><strong>Discurso:</strong> "Migramos para o Cognito para garantir autenticação de nível bancário. Minha missão foi garantir que um aluno não possa deletar o projeto de outro, assegurando o isolamento total dos dados."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CYNTHIA */}
                <div className="border-l-4 border-indigo-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">5. Cynthia Borelli (Arquitetura e Dados)</h4>
                    <div className="mt-2 space-y-3">
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300">
                            <strong>Slide 6 (Amazon DynamoDB):</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Cenário Antigo:</strong> Arquivos locais ou SQL lento.</li>
                                <li><strong>Solução AWS:</strong> DynamoDB (NoSQL Escalável).</li>
                                <li><strong>Discurso:</strong> "O DynamoDB armazena as URLs geradas e metadados. Ele escala horizontalmente sem perda de performance. Nossa visão de futuro é integrar com o GitHub para automação total."</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FECHAMENTO */}
                <div className="border-l-4 border-slate-500 pl-4 py-2">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">Encerramento (Todos)</h4>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300 mt-2">
                        <strong>Frase Final:</strong> "Este é o Portfólio na Nuvem: Transformando código em visibilidade através da AWS."
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* SECTION 2: MANUAL TÉCNICO (CLIQUE A CLIQUE) */}
        <SectionHeader id="aws_manual" title="Manual Técnico de Execução: Passo a Passo (S3 + CloudFront)" icon={MousePointerClick} colorClass="text-orange-600 bg-orange-600" />
        {openSection === 'aws_manual' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-8 animate-fade-in-down">
            
            <p className="text-slate-600 dark:text-slate-300 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
               <strong>Instrução:</strong> Como a automação Lambda ainda está em desenvolvimento, siga estes passos manuais para apresentar o deploy.
            </p>

            {/* PASSO 1: S3 */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Configurando o Bucket S3 (Hospedagem)
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Pesquisa:</strong>
                        <span className="text-slate-500 text-sm">No topo do console, digite <code>S3</code> e clique no primeiro serviço.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Criação:</strong>
                        <span className="text-slate-500 text-sm">Clique no botão laranja <strong>Create bucket</strong> (Criar bucket).</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Nomeação:</strong>
                        <span className="text-slate-500 text-sm">Em "Bucket name", digite: <code>portfolio-cloud-edivaldo-2026</code> (o nome deve ser único no mundo todo).</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">4. Acesso Público (Crítico):</strong>
                        <span className="text-slate-500 text-sm">Role para baixo até "Block Public Access settings". <strong>DESMARQUE</strong> a caixa "Block all public access". Marque a caixinha de aviso amarela que aparecer abaixo confirmando que você entende o risco.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">5. Finalizar:</strong>
                        <span className="text-slate-500 text-sm">Role até o final e clique em <strong>Create bucket</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">6. Upload:</strong>
                        <span className="text-slate-500 text-sm">Entre no bucket criado. Clique em <strong>Upload</strong>. Arraste todos os arquivos da pasta <code>dist</code> (que você gerou com <code>npm run build</code>) para lá. Clique em <strong>Upload</strong>.</span>
                    </div>
                </div>
            </div>

            {/* PASSO 2: STATIC HOSTING */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Ativando Site Estático
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Propriedades:</strong>
                        <span className="text-slate-500 text-sm">Dentro do seu bucket, clique na aba <strong>Properties</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Habilitar Hosting:</strong>
                        <span className="text-slate-500 text-sm">Role até o final da página em "Static website hosting". Clique em <strong>Edit</strong>. Selecione <strong>Enable</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Configurar Index:</strong>
                        <span className="text-slate-500 text-sm">Em "Index document", digite <code>index.html</code>. Em "Error document", digite <code>index.html</code> (importante para React).</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">4. Salvar:</strong>
                        <span className="text-slate-500 text-sm">Clique em <strong>Save changes</strong>. Agora você tem uma URL de site no final da página!</span>
                    </div>
                </div>
            </div>

            {/* PASSO 3: PERMISSÕES (POLICY) */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Permissões de Leitura
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                     <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Aba Permissions:</strong>
                        <span className="text-slate-500 text-sm">Vá na aba <strong>Permissions</strong> do bucket.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Bucket Policy:</strong>
                        <span className="text-slate-500 text-sm">Em "Bucket policy", clique em <strong>Edit</strong>. Cole o seguinte JSON (troque o nome do bucket):</span>
                        <pre className="bg-slate-900 text-emerald-400 p-3 rounded mt-2 text-xs overflow-x-auto">
{`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::portfolio-cloud-edivaldo-2026/*"
        }
    ]
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* PASSO 4: CLOUDFRONT (CDN) */}
            <div>
                <h3 className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-white mb-4">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Configurando CloudFront (HTTPS)
                </h3>
                <div className="space-y-4 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-6 pb-2">
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">1. Pesquisa:</strong>
                        <span className="text-slate-500 text-sm">Pesquise por <code>CloudFront</code> no console.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">2. Criar Distribuição:</strong>
                        <span className="text-slate-500 text-sm">Clique em <strong>Create distribution</strong>.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">3. Origem:</strong>
                        <span className="text-slate-500 text-sm">Em "Origin domain", clique e selecione o bucket S3 que você criou.</span>
                    </div>
                    <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">4. Configuração Web:</strong>
                        <span className="text-slate-500 text-sm">Atenção aqui: Em "Viewer protocol policy", selecione <strong>Redirect HTTP to HTTPS</strong> (Segurança).</span>
                    </div>
                     <div className="step-item">
                        <strong className="block text-slate-700 dark:text-slate-200">5. Criar:</strong>
                        <span className="text-slate-500 text-sm">Clique em <strong>Create distribution</strong>. Aguarde uns 5 minutos. Ele vai gerar um domínio tipo <code>d12345.cloudfront.net</code>. Esse é o link do seu portfólio seguro!</span>
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
