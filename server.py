import http.server
import socketserver
import json
import urllib.parse
import os
import sys

# PostgreSQL Database Integration
try:
    import psycopg2
    import psycopg2.extras
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DB_CONFIG = {
    'host': os.environ.get('PGHOST', 'localhost'),
    'port': int(os.environ.get('PGPORT', 5432)),
    'database': os.environ.get('PGDATABASE', 'quimik_db'),
    'user': os.environ.get('PGUSER', 'dbshield_user'),
    'password': os.environ.get('PGPASSWORD', 'supersecret')
}

def get_pg_connection():
    if not HAS_POSTGRES:
        return None
    try:
        return psycopg2.connect(**DB_CONFIG, connect_timeout=3)
    except Exception as e:
        return None

def query_all_data():
    conn = get_pg_connection()
    if not conn:
        return None
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("SELECT id, name, email, password, role, classroom, classroom_id AS \"classroomId\", practice, attempts, score, status, date, registered_at AS \"registeredAt\", teacher_request_status AS \"teacherRequestStatus\", notes_history AS \"notesHistory\" FROM users ORDER BY created_at ASC;")
        users = cur.fetchall()

        cur.execute("SELECT id, name, level, assigned_practice AS \"assignedPractice\", total_capacity AS \"totalCapacity\", tutor, students FROM classrooms ORDER BY created_at ASC;")
        classrooms = cur.fetchall()

        cur.execute("SELECT id, title, topic, target_classrooms AS \"targetClassrooms\", status, created_at AS \"createdAt\", published_at AS \"publishedAt\", questions FROM evaluations;")
        evaluations = cur.fetchall()

        cur.close()
        conn.close()

        # Normalizar tipos para el frontend
        for u in users:
            try:
                if u.get('score') and u['score'] != '-':
                    u['score'] = float(u['score'])
            except Exception:
                pass
            try:
                if u.get('attempts') and str(u['attempts']).isdigit():
                    u['attempts'] = int(u['attempts'])
            except Exception:
                pass

        return {
            'users': users,
            'classrooms': classrooms,
            'evaluations': evaluations,
            'engine': 'PostgreSQL 16'
        }
    except Exception as e:
        print(f"Error querying Postgres: {e}")
        if conn:
            conn.close()
        return None

def save_classroom_to_pg(c):
    conn = get_pg_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO classrooms (id, name, level, assigned_practice, total_capacity, tutor, students)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                level = EXCLUDED.level,
                assigned_practice = EXCLUDED.assigned_practice,
                total_capacity = EXCLUDED.total_capacity,
                tutor = EXCLUDED.tutor,
                students = EXCLUDED.students;
        """, (
            c.get('id'),
            c.get('name'),
            c.get('level'),
            c.get('assignedPractice'),
            int(c.get('totalCapacity', 20)),
            c.get('tutor'),
            json.dumps(c.get('students', []))
        ))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving classroom: {e}")
        if conn:
            conn.close()
        return False

def save_user_to_pg(u):
    conn = get_pg_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (id, name, email, password, role, classroom, classroom_id, practice, attempts, score, status, date, registered_at, teacher_request_status, notes_history)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                password = EXCLUDED.password,
                role = EXCLUDED.role,
                classroom = EXCLUDED.classroom,
                classroom_id = EXCLUDED.classroom_id,
                practice = EXCLUDED.practice,
                attempts = EXCLUDED.attempts,
                score = EXCLUDED.score,
                status = EXCLUDED.status,
                date = EXCLUDED.date,
                registered_at = EXCLUDED.registered_at,
                teacher_request_status = EXCLUDED.teacher_request_status,
                notes_history = EXCLUDED.notes_history;
        """, (
            u.get('id'),
            u.get('name'),
            u.get('email'),
            u.get('password', '123'),
            u.get('role', 'student'),
            u.get('classroom'),
            u.get('classroomId'),
            u.get('practice'),
            str(u.get('attempts', 1)),
            str(u.get('score', 18)),
            u.get('status', 'Aprobado'),
            u.get('date'),
            u.get('registeredAt'),
            u.get('teacherRequestStatus'),
            json.dumps(u.get('notesHistory', []))
        ))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving user: {e}")
        if conn:
            conn.close()
        return False

def save_score_to_pg(data):
    user_id = data.get('userId')
    classroom_id = data.get('classroomId')
    score = str(data.get('score', 18))
    attempts = str(data.get('attempts', 1))
    status = data.get('status', 'Aprobado')
    date_val = data.get('date')

    conn = get_pg_connection()
    if not conn:
        return False
    try:
        cur = conn.cursor()
        if user_id:
            cur.execute("""
                UPDATE users SET score = %s, attempts = %s, status = %s, date = %s
                WHERE id = %s;
            """, (score, attempts, status, date_val, user_id))

        if classroom_id:
            cur.execute("SELECT students FROM classrooms WHERE id = %s;", (classroom_id,))
            row = cur.fetchone()
            if row and row[0]:
                students = row[0]
                for s in students:
                    if s.get('id') == user_id:
                        s['score'] = float(score) if score != '-' else 18
                        s['attempts'] = int(attempts) if str(attempts).isdigit() else 1
                        s['status'] = status
                        s['date'] = date_val
                cur.execute("UPDATE classrooms SET students = %s WHERE id = %s;", (json.dumps(students), classroom_id))

        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving score: {e}")
        if conn:
            conn.close()
        return False

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuimiKHandler(http.server.SimpleHTTPRequestHandler):
    timeout = 10  # Timeout de 10 segundos para sockets lentos o inactivos

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def send_json_response(self, code, data):
        try:
            payload = json.dumps(data, ensure_ascii=False).encode('utf-8')
            self.send_response(code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Connection', 'close')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(payload)
        except (ConnectionResetError, BrokenPipeError):
            pass
        except Exception as e:
            print(f"Error sending json response: {e}")

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            pass

    def do_GET(self):
        # API Estado de Base de Datos PostgreSQL
        if self.path == '/api/db/status':
            conn = get_pg_connection()
            status = {
                'connected': conn is not None,
                'engine': 'PostgreSQL 16.15',
                'database': 'quimik_db' if conn else None,
                'host': DB_CONFIG['host'],
                'port': DB_CONFIG['port']
            }
            if conn:
                conn.close()
            self.send_json_response(200, status)
            return

        # API Carga Completa de Datos desde PostgreSQL
        elif self.path == '/api/db/data':
            data = query_all_data()
            if data is not None:
                self.send_json_response(200, {'success': True, 'data': data})
            else:
                self.send_json_response(200, {'success': False, 'message': 'PostgreSQL offline or local fallback'})
            return

        super().do_GET()

    def do_POST(self):
        # API Guardar Salón en PostgreSQL
        if self.path == '/api/db/save-classroom':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_classroom_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Guardar Usuario en PostgreSQL
        elif self.path == '/api/db/save-user':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_user_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Guardar Calificación en PostgreSQL
        elif self.path == '/api/db/save-score':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_score_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # Manejo de la API REST /api/simulate según arquitectura de FD04
        elif self.path == '/api/simulate':
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
                'serverInfo': 'SimuLab Backend (PostgreSQL 16 + Spring Boot/Python en puerto 8000)'
            }

            self.send_json_response(200, response)
            return

        # Manejo de envío de correo real de recuperación (RF004)
        elif self.path == '/api/send-recovery-email':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            target_email = body.get('email', '')
            code = body.get('code', '')
            user_name = body.get('name', 'Usuario')

            success = False
            error_msg = ''

            if target_email and code:
                try:
                    import smtplib
                    from email.mime.text import MIMEText
                    from email.mime.multipart import MIMEMultipart

                    sender = "Razself@gmail.com"
                    pwd = "prib duem szqt flej"

                    msg = MIMEMultipart('alternative')
                    msg['Subject'] = f"Código de Recuperación QUIMI-K: {code}"
                    msg['From'] = f"QUIMI-K Laboratorio Virtual <{sender}>"
                    msg['To'] = target_email

                    text = f"Hola {user_name},\n\nTu código de recuperación institucional para QUIMI-K es: {code}\n\nIngresa este código en la plataforma para restablecer tu contraseña.\n\nI.E. Alexander Fleming - Tacna"
                    html = f"""
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
  <div style="background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 1.5rem; text-align: center; color: #ffffff;">
    <h2 style="margin: 0; font-size: 1.4rem;">🧪 QUIMI-K v1.0</h2>
    <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; opacity: 0.9;">I.E. Alexander Fleming • Tacna</p>
  </div>
  <div style="padding: 1.75rem 1.5rem; color: #1e293b;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 1.15rem;">Recuperación de Contraseña</h3>
    <p style="font-size: 0.9rem; line-height: 1.5; color: #475569;">
      Hola <strong>{user_name}</strong>, hemos recibido una solicitud para restablecer tu contraseña en el Laboratorio Virtual.
    </p>
    <div style="margin: 1.5rem 0; text-align: center; background: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 1.25rem;">
      <span style="display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Tu Código de Verificación:</span>
      <span style="display: block; font-size: 2.2rem; font-weight: 800; letter-spacing: 6px; color: #0284c7; margin-top: 0.35rem;">{code}</span>
    </div>
    <p style="font-size: 0.82rem; color: #64748b; margin: 0; line-height: 1.4;">
      Este código es de uso personal y expirará en 15 minutos. Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura.
    </p>
  </div>
  <div style="background: #f1f5f9; padding: 0.85rem; text-align: center; font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #e2e8f0;">
    I.E. Alexander Fleming • Tacna, Perú (2026) • SimuLab Virtual Chemistry
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

            response = {'sent': success, 'error': error_msg}
            self.send_json_response(200 if success else 500, response)
            return

        self.send_error(404, "Endpoint no encontrado")

    def do_OPTIONS(self):
        try:
            self.send_response(200)
            self.send_header('Content-Length', '0')
            self.send_header('Connection', 'close')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
        except (ConnectionResetError, BrokenPipeError):
            pass

class ThreadedQuimiKServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 128
    allow_reuse_address = True

if __name__ == '__main__':
    with ThreadedQuimiKServer(("", PORT), QuimiKHandler) as httpd:
        print(f"=== SERVIDOR MULTI-HILO QUIMI-K ACTIVO EN http://localhost:{PORT} ===")
        print("Soporte multi-hilo, timeout y PostgreSQL 16 activo.")
        sys.stdout.flush()
        httpd.serve_forever()
