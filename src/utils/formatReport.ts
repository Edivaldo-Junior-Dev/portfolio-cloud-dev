
import { CRITERIA, VotesState, Member, Proposal } from '../types';
import { CORE_TEAM_IDS } from '../constants';

export const generateReportText = (
  votes: VotesState, 
  members: Member[], 
  proposals: Proposal[]
): string => {
  const date = new Date().toLocaleDateString();
  
  let report = `# EXEMPLO DE PREENCHIMENTO COMPLETO: MATRIZ DE ANÁLISE COMPARATIVA\n`;
  report += `(Este é o modelo final para o documento, com espaços para a avaliação de todos os ${members.length} integrantes)\n\n`;
  report += `---\n\n`;
  
  // --- 1. DADOS DO PROJETO ---
  report += `## 1. DADOS DO PROJETO\n\n`;
  
  // Tenta encontrar o projeto principal (AWS) ou usa o primeiro
  const mainProposal = proposals.find(p => p.name.includes("Nuvem") || p.name.includes("AWS")) || proposals[0];
  
  report += `* **Nome do Projeto:** ${mainProposal ? mainProposal.name : "Análise Geral"}\n`;
  report += `* **Link do MVP/Protótipo:** ${mainProposal && mainProposal.link ? mainProposal.link : "[Inserir Link]"}\n`;
  report += `* **Data da Análise:** ${date}\n\n`;
  report += `---\n\n`;
  
  // --- 2. ANÁLISE TÉCNICA POR CRITÉRIO ---
  report += `## 2. ANÁLISE TÉCNICA POR CRITÉRIO\n\n`;

  CRITERIA.forEach((criterion, idx) => {
    report += `### Critério ${idx + 1}: ${criterion}\n`;
    
    // Descrições baseadas no template original
    let descCrit = "";
    if (idx === 0) descCrit = "O problema é real? A solução proposta tem valor claro?";
    if (idx === 1) descCrit = "O MVP é exequível em 3 Sprints? A tecnologia escolhida é adequada?";
    if (idx === 2) descCrit = "O projeto pode ser fatiado em entregas semanais?";
    if (idx === 3) descCrit = "O projeto tem apelo visual (\"Wow Factor\") para o portfólio?";
    
    report += `> *${descCrit}*\n\n`;
    
    proposals.forEach((p, pIdx) => {
        const desc = p.descriptions[idx] || "[Sem descrição definida]";
        report += `* **Análise da Proposta ${pIdx + 1} (${p.name}):** ${desc}\n`;
    });
    
    report += `\n**(Avaliações da Equipe)**\n`;
    members.forEach(m => {
        const notes = proposals.map(p => {
             const s = votes[m.id]?.[p.id]?.[idx];
             return `P${proposals.indexOf(p)+1}:[${s || '_'}]`;
        }).join(' | ');
        
        report += `* ${m.name}: ${notes}/5\n`;
    });
    report += `\n---\n\n`;
  });

  // --- 3. PONTUAÇÃO TOTAL E VEREDITO ---
  report += `## 3. PONTUAÇÃO TOTAL E VEREDITO\n\n`;
  
  // Cabeçalho da Tabela
  report += `| Proposta | ${members.map(m => `Soma (${m.name.split(' ')[0]})`).join(' | ')} | **MÉDIA FINAL** |\n`;
  report += `| :--- | ${members.map(() => `:---:`).join(' | ')} | :---: |\n`;
  
  let winner = { name: 'Indefinido', avg: -1, id: '' };
  
  proposals.forEach(p => {
    let row = `| **${p.name}** |`;
    let totalScore = 0;
    let count = 0;
    
    members.forEach(m => {
        const userVotes = votes[m.id]?.[p.id];
        let sum = 0;
        let hasVotes = false;
        
        if (userVotes) {
            sum = (Object.values(userVotes) as number[]).reduce((a, b) => a + b, 0);
            if (sum > 0) hasVotes = true;
        }
        
        row += ` [ ${hasVotes ? sum : '_'} ]/20 |`;
        
        if(hasVotes) {
            totalScore += sum;
            count++;
        }
    });
    
    const avg = count > 0 ? totalScore / count : 0;
    if(avg > winner.avg) winner = { name: p.name, avg, id: p.id };
    
    row += ` **[ ${avg.toFixed(1)} ]/20** |`;
    report += `${row}\n`;
  });
  
  report += `\n### 🏆 VENCEDOR OFICIAL: ${winner.name}\n\n`;
  report += `**Justificativa da Escolha:**\n`;
  report += `[O projeto ${winner.name} foi selecionado com uma média de ${winner.avg.toFixed(1)} pontos. A equipe avaliou que ele apresenta o melhor equilíbrio entre viabilidade técnica (MVP claro) e impacto de portfólio (Uso de AWS Lambda/S3).]\n`;

  return report;
};
    