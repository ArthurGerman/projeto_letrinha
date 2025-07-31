// Função que busca e retorna a quantidade de commits

export async function GET() {
    const res = await fetch('https://api.github.com/repos/ArthurGerman/projeto_letrinha/commits?per_page=1');
    const link = res.headers.get('link');
    let total = 1;
    if (link) {
        const match = link.match(/&page=(\d+)>; rel="last"/);
        if (match) {
            total = parseInt(match[1]);
        }
    }
    return new Response(JSON.stringify({ total }));
}