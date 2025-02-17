export function generateEmailTemplate(propertyName: string, ownerId: string) {
  return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Propiedad Registrada</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #000917;
                  margin: 0;
                  padding: 0;
                  color: #ffffff;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  color: #333;
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #9A5939;
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
              }
              .header img {
                  max-width: 150px;
              }
              .content {
                  padding: 20px;
                  text-align: left;
                  color: #000917;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #979CA3;
                  margin-top: 20px;
                  padding: 15px;
                  background-color: #000917;
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
              }
              .footer a {
                  color: #9A5939;
                  text-decoration: none;
                  font-weight: bold;
                  transition: color 0.3s;
              }
              .footer a:hover {
                  color: #ffffff;
              }
              .button-container {
                  text-align: center;
                  margin-top: 20px;
              }
              .btn {
                    display: inline-block;
                    width: 100%;
                    max-width: 250px;
                    padding: 14px 0;
                    background-color: #9A5939;
                    color: #ffffff !important;
                    text-decoration: none !important;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    text-align: center;
                    transition: background-color 0.3s, transform 0.2s;
                }
              .btn:hover {
                  background-color: #7d442b;
                  transform: scale(1.05);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="https://tu-dominio.com/logo.png" alt="EdifiK Logo">
              </div>
              <div class="content">
                  <h2>Nueva Propiedad Registrada en EdifiK</h2>
                  <p>Estimado equipo de EdifiK,</p>
                  <p>Se ha registrado una nueva propiedad en la plataforma.</p>
                  <ul>
                      <li><strong>Nombre de la Propiedad:</strong> ${propertyName}</li>
                      <li><strong>Propietario:</strong> ${ownerId}</li>
                  </ul>
                  <p>Le recomendamos revisar y validar la información en el sistema administrativo.</p>
                  <p>Para más detalles, acceda a su cuenta en EdifiK.</p>
                  <div class="button-container">
                      <a href="https://edifik.com/login" class="btn">Ingresar a EdifiK</a>
                  </div>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} EdifiK. Todos los derechos reservados.</p>
                  <p><a href="https://edifik.com">Sitio Web</a> | <a href="mailto:soporte@edifik.com">Soporte</a></p>
              </div>
          </div>
      </body>
      </html>
    `;
}
