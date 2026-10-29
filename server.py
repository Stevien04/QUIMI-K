import http.server
import socketserver
import json
import urllib.parse
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuimiKHandler(http.server.SimpleHTTPRequestHandler):
    timeout = 10  # Timeout de 10 segundos para sockets lentos o inactivos

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        # Manejo de la API REST /api/simulate según arquitectura de FD04
        if self.path == '/api/simulate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            reactant1 = body.get('reactant1', 'Na')
            reactant2 = body.get('reactant2', 'Cl')
            heat_active = body.get('heatActive', False)

            # Lógica científica de ReactionEngine (Pauling)
            en_table = {'H': 2.20, 'O': 3.44, 'Na': 0.93, 'Cl': 3.16, 'C': 2.55, 'N': 3.04}
            en1 = en_table.get(reactant1, 2.0)
            en2 = en_table.get(reactant2, 2.0)
            delta_en = round(abs(en1 - en2), 2)

            if delta_en >= 2.0:
                bond_type = 'Iónico'
                equation = f'2{reactant1}(s) + {reactant2}₂(g) → 2{reactant1}{reactant2}(s)'
                product_name = 'Cloruro de Sodio (Sal Común)' if 'Na' in [reactant1, reactant2] and 'Cl' in [reactant1, reactant2] else 'Compuesto Iónico'
                feedback = f'ΔEN = {delta_en} (≥ 2.0). Transferencia completa de electrones hacia el átomo más electronegativo.'
            elif delta_en > 0.4:
                bond_type = 'Covalente Polar'
                equation = f'2{reactant1}₂(g) + {reactant2}₂(g) → 2{reactant1}₂{reactant2}(l)' if 'H' in [reactant1, reactant2] and 'O' in [reactant1, reactant2] else f'{reactant1}-{reactant2}'
                product_name = 'Agua' if 'H' in [reactant1, reactant2] and 'O' in [reactant1, reactant2] else 'Molécula Polar'
                feedback = f'ΔEN = {delta_en} (entre 0.4 y 2.0). Compartición asimétrica con dipolos eléctricos.'
            else:
                bond_type = 'Covalente Apolar'
                equation = f'{reactant1} + {reactant2} → {reactant1}{reactant2}'
                product_name = 'Molécula No Polar'
                feedback = f'ΔEN = {delta_en} (≤ 0.4). Densidad de carga uniforme entre los átomos.'

            response = {
                'successful': True,
                'productFormula': f'{reactant1}{reactant2}',
                'productName': product_name,
                'deltaElectronegativity': delta_en,
                'bondType': bond_type,
                'equation': equation,
                'feedback': feedback,
                'serverInfo': 'SimuLab Backend (Spring Boot / Python Runtime activo en puerto 8000)'
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            return

        # Manejo de envío de correo real de recuperación (RF004)
        elif self.path == '/api/send-recovery-email':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            target_email = body.get('email', '').strip()
            code = body.get('code', '').strip()
            user_name = body.get('name', 'Estudiante / Docente')

            success = False
            error_msg = None

            if target_email and code:
                try:
                    import smtplib
                    from email.mime.text import MIMEText
                    from email.mime.multipart import MIMEMultipart

                    sender = 'Razself@gmail.com'
                    pwd = 'pribduemszqtflej'

                    msg = MIMEMultipart('alternative')
                    msg['Subject'] = f'🔑 Código de Recuperación: {code} - QUIMI-K'
                    msg['From'] = f'QUIMI-K Laboratorio Virtual <{sender}>'
                    msg['To'] = target_email

                    text = f'Hola {user_name},\n\nTu código de recuperación de contraseña para QUIMI-K es: {code}\n\nIngresa este código en la plataforma para definir tu nueva clave.\n\nColegio Alexander Fleming • Tacna'
                    html = f"""
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <div style="font-size: 36px; line-height: 1;">⚗️</div>
    <h2 style="color: #0f172a; margin: 8px 0 2px 0; font-size: 20px;">QUIMI-K Laboratorio Virtual</h2>
    <span style="font-size: 13px; color: #64748b;">Colegio Alexander Fleming • Tacna (2026)</span>
  </div>
  <p style="color: #334155; font-size: 15px; line-height: 1.5;">Hola <strong>{user_name}</strong>,</p>
  <p style="color: #334155; font-size: 15px; line-height: 1.5;">Has solicitado restablecer tu contraseña de acceso a la plataforma QUIMI-K. Utiliza el siguiente código de seguridad de 6 dígitos:</p>
  <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 10px; padding: 18px; text-align: center; margin: 24px 0;">
    <div style="font-size: 12px; color: #15803d; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Código de Verificación</div>
    <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #15803d; font-family: monospace;">{code}</span>
  </div>
  <p style="color: #64748b; font-size: 13px; line-height: 1.5;">Ingresa este código en la ventana de recuperación de contraseña para ingresar tu nueva clave. Si tú no realizaste esta solicitud, puedes ignorar este mensaje.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <div style="font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.4;">
    Plataforma Educativa de Experimentación Científica QUIMI-K<br>
    Desarrollado bajo Arquitectura Hexagonal • Tacna, Perú
  </div>
</div>
"""
                    msg.attach(MIMEText(text, 'plain', 'utf-8'))
                    msg.attach(MIMEText(html, 'html', 'utf-8'))

                    server = smtplib.SMTP('smtp.gmail.com', 587, timeout=12)
                    server.starttls()
                    server.login(sender, pwd)
                    server.sendmail(sender, target_email, msg.as_string())
                    server.quit()
                    success = True
                except Exception as ex:
                    error_msg = str(ex)
                    print(f"Error sending recovery email: {ex}")

            self.send_response(200 if success else 500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {'sent': success, 'error': error_msg}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return

        self.send_error(404, "Endpoint no encontrado")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

class ThreadedQuimiKServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 128
    allow_reuse_address = True

if __name__ == '__main__':
    with ThreadedQuimiKServer(("", PORT), QuimiKHandler) as httpd:
        print(f"=== SERVIDOR MULTI-HILO QUIMI-K ACTIVO EN http://localhost:{PORT} ===")
        print("Soporte multi-hilo y timeout activo.")
        sys.stdout.flush()
        httpd.serve_forever()
