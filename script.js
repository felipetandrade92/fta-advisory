// ===== GOOGLE SHEETS URL =====
// SUBSTITUA pela URL do seu Google Apps Script (ver instruções)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzZT5IO1ySdQFXdZ1qBsDH017lW5WjPnLzE-R12uvIJD_dLsoRbWDnVB3YKbsZFmKZH/exec';

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.servico-card, .piramide-nivel, .numero-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    observer.observe(el);
});

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        document.querySelector('.nav-links')?.classList.remove('open');
    });
});

// ===== NAVBAR =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 2px 30px rgba(0,0,0,0.08)'
        : '0 2px 20px rgba(0,0,0,0.05)';
});

document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});

// ===== MODAL =====
const modal = document.getElementById('modalForm');
const modalServico = document.getElementById('modalServico');
const inputServico = document.getElementById('inputServico');
const form = document.getElementById('formConsultoria');
const formMsg = document.getElementById('formMsg');
const btnSubmit = document.getElementById('btnSubmit');

const objetivosMap = {
    'Planejamento Financeiro': [
        'Diagnóstico financeiro completo',
        'Definição de metas e prioridades',
        'Orçamento pessoal e familiar',
        'Plano de ação personalizado'
    ],
    'Educação Financeira': [
        'Workshops e mentorias individuais',
        'Conceitos de investimentos',
        'Inteligência emocional financeira',
        'Formação de hábitos financeiros'
    ],
    'Seguridade e Gestão de Riscos': [
        'Análise de riscos pessoais e patrimoniais',
        'Seguros e previdência privada',
        'Fundo de emergência estratégico',
        'Plano de contingência financeira'
    ],
    'Consultoria de Investimentos': [
        'Análise de perfil de investidor',
        'Diversificação de carteira',
        'Renda fixa, variável e fundos',
        'Planejamento de aposentadoria'
    ],
    'Assessoria Patrimonial': [
        'Organização patrimonial completa',
        'Planejamento sucessório',
        'Planejamento tributário',
        'Proteção e perpetuação do patrimônio'
    ]
};

document.querySelectorAll('.btn-servico').forEach(btn => {
    btn.addEventListener('click', () => {
        const servico = btn.getAttribute('data-servico');
        modalServico.textContent = servico;
        inputServico.value = servico;
        formMsg.textContent = '';
        formMsg.className = 'form-msg';
        form.reset();
        inputServico.value = servico;

        // Popula o select de objetivo com as opções do serviço
        const selectObj = document.getElementById('objetivo');
        selectObj.innerHTML = '<option value="">Selecione...</option>';
        const opcoes = objetivosMap[servico] || [];
        opcoes.forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            selectObj.appendChild(option);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== MÁSCARAS =====
document.getElementById('telefone').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    e.target.value = v;
});

document.getElementById('cpf').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 9) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
    else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
    e.target.value = v;
});

// ===== ENVIO DO FORMULÁRIO =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';
    formMsg.textContent = '';
    formMsg.className = 'form-msg';

    const data = {
        servico: inputServico.value,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        profissao: document.getElementById('profissao').value,
        renda: document.getElementById('renda').value,
        patrimonio: document.getElementById('patrimonio').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        dependentes: document.getElementById('dependentes').value,
        objetivo: document.getElementById('objetivo').value,
        data: new Date().toLocaleString('pt-BR')
    };

    try {
        if (GOOGLE_SHEETS_URL === 'SUA_URL_DO_GOOGLE_APPS_SCRIPT_AQUI') {
            throw new Error('Configure a URL do Google Apps Script');
        }

        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(data),
            redirect: 'follow'
        });

        formMsg.textContent = 'Solicitação enviada com sucesso! Entraremos em contato em breve.';
        formMsg.className = 'form-msg success';
        form.reset();

        setTimeout(() => closeModal(), 3000);

    } catch (error) {
        // Fallback: tenta com no-cors (alguns navegadores bloqueiam CORS)
        try {
            await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            });
            formMsg.textContent = 'Solicitação enviada com sucesso! Entraremos em contato em breve.';
            formMsg.className = 'form-msg success';
            form.reset();
            setTimeout(() => closeModal(), 3000);
        } catch (err) {
            formMsg.textContent = 'Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.';
            formMsg.className = 'form-msg error';
        }
    }

    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Enviar Solicitação';
});
