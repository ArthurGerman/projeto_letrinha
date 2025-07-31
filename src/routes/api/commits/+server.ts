// Função que busca a quantidade de commits

export async function GET() {
    const res = await fetch('https://api.github.com/repos/ArthurGerman/projeto_letrinha/commits');
    const commits = await res.json();
    return new Response(JSON.stringify({ total: Array.isArray(commits) ? commits.length : 0 }));
}