import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const all = await prisma.patient.findMany();
const emptyFirst = all.filter(p=>!p.firstName).length;
const emptyLast = all.filter(p=>!p.lastName).length;
console.log('EMPTY firstName:', emptyFirst, 'EMPTY lastName:', emptyLast);
console.log('SAMPLE 8:', all.slice(0,8).map(p=>({f:p.ficheroNumber, n:p.firstName+' '+p.lastName, dni:p.dni, ph:p.phone, ins:p.insurance, mail:p.email})));
// patients with numeric fichero <=3418
const low = all.filter(p=>{const n=parseInt((p.ficheroNumber||'').replace('F-',''));return n<=3420;});
console.log('LOW(<=3420):', low.length);
const high = all.filter(p=>{const n=parseInt((p.ficheroNumber||'').replace('F-',''));return n>3420;});
console.log('HIGH(>3420):', high.length, high.map(p=>p.ficheroNumber));
// phone/insurance fill rate
console.log('with phone:', all.filter(p=>p.phone).length, 'with insurance(non Particular):', all.filter(p=>p.insurance && p.insurance!=='Particular').length);
// how many share exact same name (possible family)
const map={};for(const p of all){const k=(p.firstName+' '+p.lastName).toLowerCase().trim();map[k]=(map[k]||0)+1;}
console.log('names with count>2:', Object.entries(map).filter(([,v])=>v>2).slice(0,20));
await prisma.$disconnect();
