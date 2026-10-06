import pathlib, subprocess, time, urllib.request

OLD = '/var/www/startime-cms/releases/20261006-editorial-globe'
NEW = '/var/www/startime-cms/releases/20261007-portfolios-carousel'
BACKUP = pathlib.Path('/var/backups/startime/20261007-portfolios-carousel')
UNIT = pathlib.Path('/etc/systemd/system/startime-cms.service')
NGINX = pathlib.Path('/etc/nginx/sites-enabled/startime.sa').resolve()
assert pathlib.Path(NEW+'/.deployment-build-ok').is_file()
assert pathlib.Path(NEW+'/.next/BUILD_ID').is_file()
assert subprocess.check_output(['systemctl','show','startime-cms.service','-p','WorkingDirectory','--value'],text=True).strip()==OLD
assert UNIT.read_bytes()==(BACKUP/'systemd-unit.service').read_bytes(), 'Unit changed since backup'
assert NGINX.read_bytes()==(BACKUP/'nginx-site.conf').read_bytes(), 'Nginx changed since backup'
assert pathlib.Path(NEW+'/uploads').resolve()==pathlib.Path('/var/www/startime-cms/releases/20261001-cms/uploads')
assert pathlib.Path(NEW+'/.env').read_bytes()==pathlib.Path(OLD+'/.env').read_bytes(), 'Runtime environment changed'
subprocess.run(['sudo','-u','www-data','test','-x',NEW+'/.next/static'],check=True)
for file in pathlib.Path(NEW+'/.next/static').rglob('*'):
    if file.is_file():
        subprocess.run(['sudo','-u','www-data','test','-r',str(file)],check=True)
        break
unit = UNIT.read_text()
nginx = NGINX.read_text()
assert unit.count(OLD)>=2 and nginx.count(OLD)>=3

def run(*args): subprocess.run(args,check=True)
def healthy():
    for attempt in range(30):
        try:
            with urllib.request.urlopen('http://127.0.0.1:3100/investment',timeout=5) as response:
                if response.status==200:return
        except Exception: pass
        time.sleep(1)
    raise RuntimeError('New application health check failed')

try:
    UNIT.write_text(unit.replace(OLD,NEW))
    NGINX.write_text(nginx.replace(OLD,NEW))
    run('nginx','-t')
    run('systemctl','daemon-reload')
    run('systemctl','restart','startime-cms.service')
    healthy()
    run('systemctl','reload','nginx')
    run('systemctl','is-active','startime-cms.service')
    print('ACTIVATED: portfolio/carousel patch; live DB/uploads/environment retained')
except Exception:
    UNIT.write_text(unit)
    NGINX.write_text(nginx)
    run('nginx','-t')
    run('systemctl','daemon-reload')
    run('systemctl','restart','startime-cms.service')
    run('systemctl','reload','nginx')
    print('ROLLED BACK: previous code/config restored; current CMS data preserved')
    raise
