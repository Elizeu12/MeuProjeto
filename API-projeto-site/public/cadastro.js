function cadastrar() {
    aguardar();
    var formulario = new URLSearchParams(new FormData(form_cadastro));
    email = login_html.value
    nome = nome.value
    confere1 = email.indexOf('@')
    confere2 = email.indexOf('.com')
    confere3 = nome.length
    if (confere1 >= 0 && confere2 >= 0 && confere3 >= 2) {

        fetch("/usuarios/cadastrar", {
            method: "POST",
            body: formulario
        }).then(function (response) {

            if (response.ok) {

                window.location.href = 'login.html';

            } else {

                console.log('Erro de cadastro!');
                response.text().then(function (resposta) {
                    div_erro.innerHTML = resposta;
                });
                finalizar_aguardar();
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
    // img_aguarde.style.display='block';
    div_erro.style.display = 'none';
}

function finalizar_aguardar() {
    btn_entrar.disabled = false;
    // img_aguarde.style.display='none';
    div_erro.style.display = 'block';
}