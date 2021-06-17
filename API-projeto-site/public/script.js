var Valores;
let usuario;
var dataehora;
var incremento = 0;
var conferir = 0;
var referencia = 0
var diferenca
// var media
var menosbrilho = [];
var novoplaneta = [];

iduser = sessionStorage.id_usuario_meuapp
console.log(iduser)
verificar_autenticacao();

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizacaoPeriodica() {
    obterdadosporusuario(iduser);
    obterplanetas();
    setTimeout(atualizacaoPeriodica, 3000);
}



function obterdadosporusuario(iduser) {
    //aguardar();
    fetch(`/leituras/tempo-real/${iduser}`)
        .then(resposta => {

            console.log(resposta)
            if (resposta.ok) {
                resposta.json().then(function (resposta) {

                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    // aqui, após registro. use os nomes 
                    // dos atributos que vem no JSON 
                    var dados = {
                        dadoSensor: resposta.dadoSensor,
                        idDado: resposta.idDado,
                        dataehora: resposta.data
                        // media: resposta.media
                    }
                    // media = dados.media;
                    dataehora = dados.dataehora;

                    console.log("Olha a hora aquiiiiiiiiiiiii " + dados.dataehora)
                    valores = dados.dadoSensor
                    console.log(dados.dadoSensor)
                    drawChart()

                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do caminhao p/ gráfico: ${error.message}`);
        });
}

google.charts.load('current', { 'packages': ['gauge'] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Brilho em %', 0],
    ]);

    var options = {
        width: 200, height: 320,
        redFrom: 90, redTo: 100,
        yellowFrom: 75, yellowTo: 90,
        minorTicks: 5
    };
    incremento++
    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
    var porcentagem = (valores * 100) / 1024;
    // var porcentagemmedia = (media * 100) / 1024;

    if (porcentagem <= 10) {
        conferir++
        if (incremento != conferir) {

            dataehora = dataehora.replace("T", " ");
            dataehora = dataehora.replace("Z", "");
            menosbrilho.push(dataehora)
            console.log(menosbrilho[1])
            referencia++
            if (referencia == 2) {
                var inicio = menosbrilho[0];
                var termino = menosbrilho[1];

                const today = new Date(inicio);
                const endDate = new Date(termino);
                const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
                const hours = parseInt(Math.abs(endDate - today) / (1000 * 60 * 60) % 24);
                const minutes = parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);
                const seconds = parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000) % 60);
                diferenca = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's'

                document.getElementById('orbita').value = diferenca;
                abrirModal.classList.add("abrir")
                console.log("Media de hoaaaaaaaaaaaaaaa " + diferenca);
                menosbrilho = []
                menosbrilho.push(dataehora)
                incremento = 0;
                conferir = 0;
                referencia = 0;
            }
        }
        else {
            incremento = 0;
            conferir = 0;
        }
    }

    id_fundo.style.opacity = porcentagem / 100;
    data.setValue(0, 1, porcentagem);
    console.log(valores)
    chart.draw(data, options);
}



const data = [];
const baixo = [];
var i = 95
let prev2 = 0;
for (let i = 0; i < 100; i++) {
    baixo.push(i)
}


var ctx = document.getElementById('myChart');
var meuGrafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: baixo,
        datasets: [
            {
                label: "Lumens",
                data: data,
                borderWidth: 2,
                radius: 0,
                borderColor: '#0000FF',
                backgroundColor: 'transparent',
            },
        ]
    },
    options: {
        fill: false,
        interaction: {
            intersect: false
        },
        title: {
            display: true,
            fontSize: 20,
            text: "Lumens",
            position: 'top',
        },
        legend: {
            display: true,
            reverse: true,
            position: 'bottom'
        },
        layout: {
            padding: {
                left: 50,
                top: 50
            },

            radius: 0

        }
    }
})
function cadastrar() {
    var formulario = new URLSearchParams(new FormData(form_cadastro));
    fetch("/usuarios/planeta", {
        method: "POST",
        body: formulario
    }).then(function (response) {

        if (response.ok) {
            abrirModal.classList.remove("abrir")

        } else {

            console.log('Erro de cadastro!');
            response.text().then(function (resposta) {
            });
        }
    });
    return false;
}


function obterplanetas() {
    //aguardar();
    fetch(`/leituras/valoresplanetas`)
        .then(resposta => {
            if (resposta.ok) {

                console.log('hello world ' + resposta)
                resposta.json().then(function (resposta) {
                    console.log(`Dados recebidos teste: ${JSON.stringify(resposta)}`);


                    planetas.innerHTML = '';
                    for (let index = 0; index < resposta.length; index++) {
                        planetas.innerHTML += resposta[index].NomePlaneta + '<br>'

                    }

                });
            } else {

                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados do caminhao p/ gráfico: ${error.message}`);
        });
}


function sendData(iduser) {
    var http = new XMLHttpRequest();
    console.log("Id aqui aaaaaaaaaaaaaaa " + iduser)
    http.open('GET', `http://localhost:3000/api/sendData/${iduser}`, false);
    http.send(null);
    meuGrafico.data.labels.push(i + 10);
    meuGrafico.data.datasets.forEach((dataset) => {
        dataset.data.push(valores);
    });
    meuGrafico.update();
}


// Descomente abaixo se quiser inserir dados a cada X segundos  
setInterval(function () {
    sendData(iduser);
}, 3000);