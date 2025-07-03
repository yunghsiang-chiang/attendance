const apiBase = "https://dict.hochi.org.tw:5165/api/admin";

async function loadHealth() {
    const res = await fetch(`${apiBase}/health`);
    const data = await res.json();
    let status = data.status === 'ok' ? '✅ 正常' : '⚠️ 異常';
    document.getElementById('healthStatus').innerHTML =
        `狀態：${status}，CPU 使用率：${data.cpu}% ，記憶體使用率：${data.mem}%`;
}

async function loadSources() {
    const res = await fetch(`${apiBase}/source-files`);
    const result = await res.json(); // result 是 { file_count, files, folder }

    const list = document.getElementById('sourceFiles');
    list.innerHTML = '';

    result.files.forEach(f => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = f;
        list.appendChild(li);
    });
    document.getElementById('sourceInfo').textContent = `共 ${result.file_count} 本書`;
}


async function askQuestion() {
    const q = document.getElementById('questionInput').value.trim();
    if (!q) return;

    const res = await fetch(`${apiBase}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, topK: 5 })
    });
    const data = await res.json();
    document.getElementById('qText').textContent = data.question;
    document.getElementById('aText').textContent = data.answer;
    document.getElementById('contextText').textContent = data.context.replace(/\n/g, "\n");
    document.getElementById('elapsed').textContent = data.elapsed_sec;
}

document.getElementById('askBtn').addEventListener('click', askQuestion);
window.addEventListener('DOMContentLoaded', () => {
    loadHealth();
    loadSources();
});