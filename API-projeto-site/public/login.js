function entrar() {
    aguardar();
    var formulario = new URLSearchParams(new FormData(form_login));
    email = login_html.value
    confere1 = email.indexOf('@')
    confere2 = email.indexOf('.com')
    if (confere1 >= 0 && confere2 >= 0) {

        fetch("/usuarios/autenticar", {
            method: "POST",
            body: formulario
        }).then(resposta => {

            if (resposta.ok) {

                resposta.json().then(json => {

                    sessionStorage.login_usuario_meuapp = json.Email;
                    sessionStorage.nome_usuario_meuapp = json.Nome;
                    sessionStorage.id_usuario_meuapp = json.idUsuario;

                    window.location.href = 'tempo-real.html';
                });

            } else {

                console.log('Erro de login!');

                resposta.text().then(texto => {
                    console.error(texto);
                    finalizar_aguardar(texto);
                });
            }
        });
    }
    else {
        div_erro.innerHTML = "Insira os dados corretamente";
        finalizar_aguardar();
    }
    return false;
}

function aguardar() {
    btn_entrar.disabled = true;
    img_aguarde.style.visibility = 'visible';
    div_erro.style.visibility = 'hidden';
}

function finalizar_aguardar(resposta) {
    btn_entrar.disabled = false;
    img_aguarde.style.visibility = 'hidden';
    div_erro.style.visibility = 'visible';
    div_erro.innerHTML = resposta;
}