
function dateNow() {
    const agora = new Date();

    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0'); // Lembre-se que os meses começam do zero
    const ano = agora.getFullYear();

    const hora = agora.getHours().toString().padStart(2, '0');
    const minuto = agora.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}