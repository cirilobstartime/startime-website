import { existsSync } from 'node:fs';
import { getPayload } from 'payload';
import config from '../../payload.config.ts';

if (process.env.PORTFOLIO_MEDIA_CONFIRM !== 'fill-empty-after-backup' || !process.env.PORTFOLIO_BACKUP_DB || !existsSync(process.env.PORTFOLIO_BACKUP_DB)) {
  throw new Error('A verified backup and explicit fill-empty confirmation are required');
}
const payload = await getPayload({ config });
for (const locale of ['en', 'ar'] as const) {
  const home = (await payload.find({collection:'pages',locale,depth:0,draft:false,fallbackLocale:false,where:{internalTitle:{equals:'New Site: Home'}}})).docs[0];
  const page = (await payload.find({collection:'pages',locale,depth:0,draft:false,fallbackLocale:false,where:{internalTitle:{equals:'New Site: investment'}}})).docs[0];
  if (!home || !page) throw new Error(`Missing ${locale} pages`);
  const draft = await payload.findByID({collection:'pages',id:page.id,locale,depth:0,draft:true,fallbackLocale:false});
  if (JSON.stringify(draft.sections) !== JSON.stringify(page.sections)) {
    console.log(`${locale}: preserved unpublished changes; skipped image population`);
    continue;
  }
  const photos = home.sections?.find((section:any)=>section.blockType==='newHomepagePortfolios') as any;
  const sections = structuredClone(page.sections);
  const portfolios = sections?.find((section:any)=>section.blockType==='siteInvestmentPortfolios') as any;
  if (!photos?.portfolios?.length || !portfolios?.items?.length) throw new Error(`Missing ${locale} portfolio blocks`);
  let count = 0;
  portfolios.items.forEach((item:any,index:number)=>{
    const mapped = ['government','business','community'].indexOf(item.homepagePortfolio);
    const source = photos.portfolios[mapped >= 0 ? mapped : index];
    if (!source?.image || item.image || Object.values(item.images || {}).some(Boolean)) return;
    item.image = source.image;
    if (source.images) item.images = structuredClone(source.images);
    count++;
  });
  if (count) {
    const fresh = await payload.findByID({collection:'pages',id:page.id,locale,depth:0,draft:false,fallbackLocale:false});
    if (fresh.updatedAt !== page.updatedAt || JSON.stringify(fresh.sections) !== JSON.stringify(page.sections)) throw new Error('Concurrent page edit detected; stop');
    await payload.update({collection:'pages',id:page.id,locale,overrideAccess:true,data:{sections,_status:'published'}});
  }
  console.log(`${locale}: ${count} empty card image fields filled using existing live Home media references`);
}
process.exit(0);
