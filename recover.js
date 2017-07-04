const recover = require('./recover/recover');
console.log('Starting ticket recovery');
// Fecha desde la cual calcular los tiempos relativos
recover.fromDate = new Date('2017-06-15');
recover.recover();
