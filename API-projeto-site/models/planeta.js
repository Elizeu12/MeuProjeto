'use strict';

/* 
lista e explicação dos Datatypes:
https://codewithhugo.com/sequelize-data-types-a-practical-guide/
*/

module.exports = (sequelize, DataTypes) => {
    let Planeta = sequelize.define('Planeta',{	
		idPlaneta: {
			field: 'idPlaneta',
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},	
		NomePlaneta: {
			field: 'NomePlaneta',
			type: DataTypes.STRING,
			allowNull: false
		},
		tempo_orbita: {
			field: 'tempo_orbita',
			type: DataTypes.STRING,
			allowNull: false
		},
	}, 
	{
		tableName: 'planetas', 
		freezeTableName: true, 
		underscored: true,
		timestamps: false,
	});

    return Planeta;
};
