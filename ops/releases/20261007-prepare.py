import concurrent.futures, hashlib, json, os, pathlib, shutil, sqlite3, subprocess, tarfile, urllib.parse, urllib.request

OLD = pathlib.Path('/var/www/startime-cms/releases/20261006-editorial-globe')
NEW = pathlib.Path('/var/www/startime-cms/releases/20261007-portfolios-carousel')
DB = pathlib.Path('/var/www/startime-cms/releases/20261001-cms/startime.db')
UPLOADS = pathlib.Path('/var/www/startime-cms/releases/20261001-cms/uploads')
BACKUP = pathlib.Path('/var/backups/startime/20261007-portfolios-carousel')
COMMIT = '255a94f2fb1196ca694916912fb7fa36cb11a542'
FILES = [
('src/app/(new-frontend)/[locale]/investment/page.tsx','2fda13992fee8286a385a540d1990d4bbd55f408c7f2139b08cbac773029c1b2','7d4550c1e655179f32f5e5bd997b370aaf87cb5b9d1966cfbc8dcd609d0f8587'),
('src/app/(new-frontend)/cms-carousel.css',None,'4c106edc3731acb11cc132dcfb0a9a8f31177d581d1437d01c105d3ef21d31e6'),
('src/app/(new-frontend)/cms-investment-contact-visual.css','666bc764f674bb2d57cd47f514a72a39f5018d7ecd49c474957a0616b78852d7','f5a370f02f8db292410ab8b5839b3e0dff32eb60d0ff6b94b85a32958a45660a'),
('src/app/(new-frontend)/globals.css','9e4f70bb1d8574b199fcb7047791c2d474677cbef52cb833d79405b59214b934','87c8232a0bd77ad78903de85d3ab369a4bf18b9163aa17b8d8338cf75ae967d3'),
('src/app/(new-frontend)/layout.tsx','ddfd0212956829011681b310ec1d7680947cadf919a56ede9669f0e13f78dc78','0cee31608e65fa80131852138d7110ed08713ad221643522d5851d23c7edd030'),
('src/components/DiscoverPage.tsx','ab09b7ea0576ae133fb01cb3eb929960604d6d065c3a18f876142e167f55d71a','4da196314079cdf737ec1c57621d45349b82ae34ec53ad3a72584c55f3af6814'),
('src/components/EditorialSwiper.tsx','dec6c8225a0393933267164aeac7a0d705ddc0c431e26d28d7b8ded9a10bfb2e','fec12840914a2f734edcd8ca008ec3ad243dde718603138a2bb9a56517558d8a'),
('src/components/Home2Page.tsx','1296fc90f3c28cf08b653942caf4d9b305bf8d29dfac989386fdfe82fef2f9bf','106ce510a3d0a8262909018159df81599a23bef246f0ba4d8c51f823bf0206d9'),
('src/components/InsightsPage.tsx','5db7c93e73959ef7982ffbaacca106cf565ddff32aba4d28115b16c5563b4e3c','d873df269802644fd128968d22d8e89ba16410372cf3daf67bd5912557a63cb0'),
('src/components/InvestmentPage.tsx','39fba8b9c4ff2c89a1542a4dc22c910cb5ee1f4b79062bb231f8d7a38648ee6c','ec9911bfbcaac916ca75447225b239a54c6464fecf103c0ca3a50195bb359ea9'),
('src/components/SlideCounter.tsx',None,'a8a13ae628a053b5523fde02adc889d9e7612ce04210437dfba67c0d1dd38727'),
('src/components/VisionPage.tsx','457dfb624ff20a09a104dc70d1f4b7e5aca0f8bf3178aa839932b22a57edd941','0c018a396272370494c7ac4cefbbcafb58055d4689d35e52966d44f178e5e60a'),
('src/content/investmentContactCms.ts','a67d02b5793ffd3191f44b52d3e40a44093ac253939548e3045db6539d72e8aa','19cc5d8b0e0bc286c31ad50062cecf6cd9ae13e5fc2c9fd55e41a2bee86ec51d'),
('src/content/newSiteCmsHome.ts','143ca0b174df6082066d3195746ebd3333dbaae9e55d593571c2c39c63b70576','27dbf7841f2309f677c46399ce87d482d473aa86bc718411026caf8cfa9a744e'),
('src/content/portfolioImages.ts',None,'5ffd71c8f20ed50392e1e514327afb0dfe999e54ba072db0cc00ffd3a6081354'),
('src/payload/blocks/newSiteSections.ts','170839eee7d43962a2dffb7a7c794b3fce0f4fb06972cd5e9597da66b4448ae6','c8e1c29080185801a5cba360bc031a2020e6ab38d35e58aba7cc7ffc8616cd97'),
('src/payload/fields/responsiveMedia.ts','987e7d99fffdd0d8eff56be52ff380b9117e9efce55fe2d19b31a0fa150c96fd','f8ea29549a3834be7c95cf7e3e7fd1ed790a962523906fec1e2e0052686c0462')]
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
active = subprocess.check_output(['systemctl','show','startime-cms.service','-p','WorkingDirectory','--value'],text=True).strip()
assert active == str(OLD), 'Active release changed; stop'
assert DB.is_file() and UPLOADS.is_dir() and (OLD/'uploads').resolve() == UPLOADS
assert not NEW.exists() and not BACKUP.exists(), 'Candidate or backup already exists; inspect before resuming'
for name, base, target in FILES:
    file = OLD/name
    assert (sha(file) if file.exists() else None) == base, 'Base source mismatch: '+name
print('PREFLIGHT: all 17 patch source paths match the recorded base', flush=True)
os.umask(0o077)
BACKUP.mkdir(parents=True)
source = sqlite3.connect(DB)
with sqlite3.connect(BACKUP/'startime.db') as backup:
    source.backup(backup)
    assert backup.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
source.close()
for source_file, name in [(OLD/'.env','environment.private'),(pathlib.Path('/etc/nginx/sites-enabled/startime.sa'),'nginx-site.conf'),(pathlib.Path('/etc/systemd/system/startime-cms.service'),'systemd-unit.service')]:
    shutil.copyfile(source_file, BACKUP/name)
with tarfile.open(BACKUP/'uploads.tar.gz','w:gz') as archive:
    archive.add(UPLOADS, arcname='uploads')
with sqlite3.connect(BACKUP/'startime.db') as backup:
    counts = {name:backup.execute('SELECT count(*) FROM "'+name+'"').fetchone()[0] for name in ['pages','media','cms_users','forms','form_submissions','jobs','redirects']}
(BACKUP/'metadata.json').write_text(json.dumps({'old':str(OLD),'new':str(NEW),'base':'ec77cbef5409d8edef4821e8981d37e08152b17f','target':'da209d95c7cb9e0efb70c5f2b57282c056143e81','companySource':COMMIT,'counts':counts,'archiveRoot':'uploads'},indent=2))
(BACKUP/'SHA256SUMS').write_text(''.join(sha(file)+'  '+file.name+'\n' for file in sorted(BACKUP.iterdir()) if file.is_file()))
print('BACKUP: DB integrity ok; uploads/env/Nginx/unit captured; counts '+json.dumps(counts), flush=True)
os.umask(0o022)
shutil.copytree(OLD, NEW, symlinks=True, ignore=shutil.ignore_patterns('.next*','node_modules','uploads','.git','.env','*.db','*.db-wal','*.db-shm','database','backups','tmp','qa-captures'))
def download(entry):
    name, base, target = entry
    url = 'https://raw.githubusercontent.com/cirilobstartime/startime-website/'+COMMIT+'/'+urllib.parse.quote(name)
    with urllib.request.urlopen(url,timeout=45) as response: data=response.read()
    assert hashlib.sha256(data).hexdigest()==target, 'Target checksum mismatch: '+name
    file=NEW/name
    file.parent.mkdir(parents=True,exist_ok=True)
    file.write_bytes(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: list(pool.map(download,FILES))
shutil.copyfile(OLD/'.env', NEW/'.env')
os.chmod(NEW/'.env',0o600)
(NEW/'uploads').symlink_to(UPLOADS)
subprocess.run(['cp','-a','--reflink=auto',str(OLD/'node_modules'),str(NEW/'node_modules')],check=True)
for filename in ['package.json','package-lock.json','payload.config.ts']:
    assert sha(OLD/filename)==sha(NEW/filename)
(NEW/'RELEASE-MANIFEST.json').write_text((BACKUP/'metadata.json').read_text())
print('PREPARED: checksummed code-only patch; dependencies unchanged; preserved live data links; active service untouched',flush=True)
