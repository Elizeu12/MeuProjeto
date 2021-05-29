'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Leitura = sequelize.define('dados',{	
		idDado: {
			field: 'idDado',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		dadoSensor: {
			field: 'dadoSensor',
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		Dataehora: {
			field: 'Dataehora',
			type: DataTypes.DATE, // NÃO existe DATETIME. O tipo DATE aqui já tem data e hora
			allowNull: false
		},
	}, 
	{
		tableName: 'dados', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return Leitura;
};
