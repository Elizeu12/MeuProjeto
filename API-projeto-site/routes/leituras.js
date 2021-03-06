var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Leitura = require('../models').Leitura;
var env = process.env.NODE_ENV || 'development';

/* Recuperar as últimas N leituras */
router.get('/ultimas/:iduser', function (req, res, next) {

	// quantas são as últimas leituras que quer? 7 está bom?
	const limite_linhas = 7;

	var iduser = req.params.iduser;

	console.log(`Recuperando as ultimas ${limite_linhas} dados`);

	let instrucaoSql = "";

	if (env == 'dev') {
		// abaixo, escreva o select de dados para o Workbench
		instrucaoSql = `select nome,nomeEstrela,dadoSensor,DATE_FORMAT(Dataehora,'%H:%i:%s') as data from usuario_bd
		inner join estrela on usuario_bd.idUsuario = estrela.Fkusuario
		inner join dados on dados.idDado = estrela.Fkdado
		where Fkusuario = ${iduser} order by idDado desc limit ${limite_linhas};
		SELECT TIMEDIFF(${menosbrilho[0]}, ${menosbrilho[1]}) as dif;`;
	} else if (env == 'production') {
		// abaixo, escreva o select de dados para o SQL Server
		instrucaoSql = `select top ${limite_linhas} 
		temperatura, 
		umidade, 
		momento,
		FORMAT(momento,'HH:mm:ss') as momento_grafico
		from leitura
		where fkcaminhao = ${idcaminhao}
		order by id desc`;
	} else {
		console.log("\n\n\n\nVERIFIQUE O VALOR DE LINHA 1 EM APP.JS!\n\n\n\n")
	}

	sequelize.query(instrucaoSql, {
		model: Leitura,
		mapToModel: true
	})
		.then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
});


router.get('/tempo-real/:iduser', function (req, res, next) {
	console.log('Recuperando dados');

	//var idcaminhao = req.body.idcaminhao; // depois de .body, use o nome (name) do campo em seu formulário de login
	var iduser = req.params.iduser;

	let instrucaoSql = "";

	if (env == 'dev') {
		// abaixo, escreva o select de dados para o Workbench
		instrucaoSql = `select nome,nomeEstrela,dadoSensor,Dataehora as data from usuario_bd
		inner join estrela on usuario_bd.idUsuario = estrela.Fkusuario
		inner join dados on dados.idDado = estrela.Fkdado
		where Fkusuario = ${iduser} order by idDado desc;`;
	} else if (env == 'production') {
		// abaixo, escreva o select de dados para o SQL Server
		instrucaoSql = `select top 1 temperatura, umidade, FORMAT(momento,'HH:mm:ss') as momento_grafico, fkcaminhao from leitura where fkcaminhao = ${idcaminhao} order by id desc`;
	} else {
		console.log("\n\n\n\nVERIFIQUE O VALOR DE LINHA 1 EM APP.JS!\n\n\n\n")
	}

	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
});

// estatísticas (max, min, média, mediana, quartis etc)
router.get('/valoresplanetas', function (req, res, next) {
	console.log(`Recuperando as estatísticas atuais`);

	const instrucaoSql =`
	select NomePlaneta from planetas
	left join estrela on planetas.idplaneta = estrela.Fkplaneta order by idPlaneta desc;`;


	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});

});


module.exports = router;
