const jsreport = require('jsreport-core')();
const fs = require('fs');

async function generateReport(donante) {
  await jsreport.init();

  const template = {
    content: `
      <h1>Donante Registrado</h1>
      <table>
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

  fs.writeFileSync('report1.pdf', report.content);

  await jsreport.close();
  console.log('Report generated successfully');
}

module.exports = generateReport;
