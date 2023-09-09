const jsreport = require('jsreport-core')();
const fs = require('fs');

async function generateReportAll(dataArray) {
  await jsreport.init();

  let tableRows = '';

  // Loop through the dataArray and generate table rows dynamically
  dataArray.forEach((donante) => {
    tableRows += `
      <tr>
        <th>Tipo de Documento</th>
        <td>${donante.tipoDocumento}</td>
      </tr>
      <tr>
        <th>Cédula</th>
        <td>${donante.cedula}</td>
      </tr>
      <tr>
        <th>Nombres</th>
        <td>${donante.nombres}</td>
      </tr>
      <tr>
        <th>Apellidos</th>
        <td>${donante.apellidos}</td>
      </tr>
      <tr>
        <th>Sexo</th>
        <td>${donante.sexo}</td>
      </tr>
      <tr>
        <th>Fecha de Nacimiento</th>
        <td>${donante.fechaNacimiento}</td>
      </tr>
      <tr>
        <th>Tipo de Sangre</th>
        <td>${donante.tipoSangre}</td>
      </tr>
      <tr>
        <th>Peso</th>
        <td>${donante.peso}</td>
      </tr>
      <tr>
        <th>Fecha de Último Alcohol</th>
        <td>${donante.fechaAlcohol}</td>
      </tr>
      <tr><td colspan="2"><hr /></td></tr>
    `;
  });

  const template = {
    content: `
      <h1>Donantes Registrados</h1>
      <table>
        ${tableRows}
      </table>
    `,
    engine: 'jsrender',
    recipe: 'chrome-pdf',
  };

  const report = await jsreport.render({
    template: template,
    data: {},
    options: { preview: false },
  });

  fs.writeFileSync('report_all.pdf', report.content);

  await jsreport.close();
  console.log('Report of every record generated successfully');
}

module.exports = generateReportAll;
