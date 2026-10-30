'use strict';
// One-off source integration check. Actual send/reset handlers and queue code;
// in-memory Prisma, auth and Twilio adapters only. No DB or network access.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const app = process.argv[2];
const output = process.argv[3];
const ts = require(path.join(app, 'node_modules/typescript'));
const evidence = { scope: 'actual route/queue/reset source with in-memory adapters', realMessages: 0, databaseWrites: 0, sources: {}, queries: [], requests: [], phases: [], checks: [] };
const template = { id: 'isolated-template', createdBy: 'mock-admin', status: 'APPROVED', bodyText: 'Hello {{first_name}}', buttons: [{id:'yes', title:'Yes'}], twilioContentSid:'MOCK-CONTENT-NOT-REAL', variableMapping: {first_name:'Name'} };
const oldTime = '2026-01-01T00:00:00.000Z';
const rows = ['PENDING','PENDING','SENT','DELIVERED','READ'].map((status,i) => ({ id: 'mock-'+i, templateId: template.id, name: 'Mock '+i, phone: 'MOCK_RECIPIENT_'+i, customVars:{Name:'Mock '+i}, status, waMessageId:i>1?'OLD-'+i:null, sentAt:i>1?oldTime:null, deliveredAt:i>2?oldTime:null, readAt:i>3?oldTime:null, errorCode:null, errorMessage:null, failedAt:null, createdAt:new Date(i*1000).toISOString() }));
const replies=[];
const clone = x => JSON.parse(JSON.stringify(x));
const protectedBefore = clone(rows.slice(2));
function selected(where, r) { return (!where.id || typeof where.id==='string' && r.id===where.id || where.id.in?.includes(r.id)) && (!where.templateId || r.templateId===where.templateId) && (!where.status || typeof where.status==='string' && r.status===where.status || where.status.in?.includes(r.status)); }
const contact = {
  async findMany({where,orderBy}) { evidence.queries.push(clone({where,orderBy})); return clone(rows.filter(r=>selected(where,r))); },
  async findUnique({where,include}) { const r=rows.find(r=>r.id===where.id); return r?{...clone(r),...(include?{template:{createdBy:template.createdBy}}:{})}:null; },
  async updateMany({where,data}) { let count=0;for(const r of rows) if(selected(where,r)){Object.assign(r,data);count++;}return{count}; },
  async update({where,data}) { const r=rows.find(r=>r.id===where.id);if(!r)throw Error('Missing fixture');Object.assign(r,data);return clone(r); }
};
const prisma = { contact, buttonResponse:{async deleteMany({where}) { let count=0;for(let i=replies.length-1;i>=0;i--)if(replies[i].contactId===where.contactId){replies.splice(i,1);count++;}return{count}; }}, async $transaction(fn){return fn(prisma);} };
let messageNo=0;
const attempts=new Map();
function twilioMock(){return{messages:{async create(params){assert.ok(params.to.startsWith('whatsapp:+MOCK_RECIPIENT_'),'Only fake adapter identifiers permitted');const a=(attempts.get(params.to)||0)+1;attempts.set(params.to,a);evidence.requests.push(clone({to:params.to,attempt:a,contentSid:params.contentSid,contentVariables:params.contentVariables}));if(params.to.endsWith('_1') && a===1){const e=new Error('Controlled mocked Twilio API failure');e.code=63001;throw e;}return{sid:'MOCK-MESSAGE-'+(++messageNo),status:'queued'};}}};}
const auth = { async requireSession(){return{user:{id:'mock-admin',role:'ADMIN'}};}, requireWriteAccess(){return null;}, async requireTemplateOwner(id){assert.equal(id,template.id);return{template};} };
const responseAdapter={NextResponse:{json(value,options={}){return new Response(JSON.stringify(value),{status:options.status||200,headers:{'content-type':'application/json'}});}}};
const batches=[];
const logs=[];
const modules={};
const mappings={'@/lib/db':{prisma},'./db':{prisma},'@/lib/authz':auth,'next/server':responseAdapter,'twilio':twilioMock};
function load(rel){const filename=path.join(app,rel);const source=fs.readFileSync(filename,'utf8');evidence.sources[rel]=crypto.createHash('sha256').update(source).digest('hex');const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;const module={exports:{}};const context={module,exports:module.exports,require(id){if(id==='@/lib/whatsapp')return modules.whatsapp;if(Object.hasOwn(mappings,id))return mappings[id];throw Error('Unexpected dependency blocked: '+id);},process:{env:{WHATSAPP_PROVIDER:'twilio',TWILIO_ACCOUNT_SID:'MOCK',TWILIO_AUTH_TOKEN:'MOCK',TWILIO_WHATSAPP_NUMBER:'whatsapp:+MOCK_SENDER'}},console:{log(...a){logs.push(a.map(String).join(' '));},error(...a){logs.push(a.map(String).join(' '));}},Response,Date,Map,Set,Promise,setTimeout(callback){return setTimeout(callback,0);},fetch(){throw Error('Network forbidden in isolated check');}};vm.runInNewContext(out,context,{filename,timeout:10000});return module.exports;}
const actualWhatsapp=load('lib/whatsapp.ts');
modules.whatsapp={...actualWhatsapp,sendBatchMessages(...args){const p=actualWhatsapp.sendBatchMessages(...args);batches.push(p);return p;}};
const send=load('app/api/send/route.ts');
const reset=load('app/api/contacts/[id]/route.ts');
async function invokeSend(name){const before=evidence.requests.length;const r=await send.POST({async json(){return{templateId:template.id};}});const body=await r.json();await Promise.all(batches);const phase={name,status:r.status,response:body,requests:clone(evidence.requests.slice(before)),rows:clone(rows)};evidence.phases.push(phase);return phase;}
function check(label,fn){fn();evidence.checks.push({label,pass:true});}
(async()=>{try{
const first=await invokeSend('first send: success plus controlled failure');
check('First send selects exactly the two Pending contacts',()=>{assert.equal(first.status,200);assert.equal(first.response.totalContacts,2);assert.deepEqual(first.requests.map(x=>x.to),['whatsapp:+MOCK_RECIPIENT_0','whatsapp:+MOCK_RECIPIENT_1']);});
check('Mock success becomes Sent; API rejection becomes Failed with error',()=>{assert.equal(rows[0].status,'SENT');assert.equal(rows[1].status,'FAILED');assert.equal(rows[1].errorCode,'63001');});
check('Existing Sent, Delivered and Read contacts remain unchanged',()=>assert.deepEqual(clone(rows.slice(2)),protectedBefore));
const sentBeforeRetry=clone(rows[0]);
const second=await invokeSend('second send: retry Failed only');
check('Second send selects only the failed contact',()=>{assert.equal(second.status,200);assert.equal(second.response.totalContacts,1);assert.deepEqual(second.requests.map(x=>x.to),['whatsapp:+MOCK_RECIPIENT_1']);});
check('Retry succeeds and clears old failure fields',()=>{assert.equal(rows[1].status,'SENT');assert.equal(rows[1].errorCode,null);assert.equal(rows[1].errorMessage,null);assert.equal(rows[1].failedAt,null);});
check('Already-sent and delivered/read rows get no second request or mutation',()=>{assert.deepEqual(clone(rows[0]),sentBeforeRetry);assert.deepEqual(clone(rows.slice(2)),protectedBefore);assert.equal(attempts.get('whatsapp:+MOCK_RECIPIENT_0'),1);});
const third=await invokeSend('third send: no eligible contacts');
check('Sending when every contact is completed returns 400 and makes zero requests',()=>{assert.equal(third.status,400);assert.equal(third.response.error,'沒有待發送的聯繫人');assert.equal(third.requests.length,0);});
const beforeResetMessage=rows[0].waMessageId;
const resetResponse=await reset.PATCH({async json(){return{status:'PENDING'};}},{params:Promise.resolve({id:rows[0].id})});
const resetData=await resetResponse.json();
evidence.reset={status:resetResponse.status,response:resetData};
check('Actual reset handler clears the selected contact message/send state',()=>{assert.equal(resetResponse.status,200);assert.equal(rows[0].status,'PENDING');assert.equal(rows[0].waMessageId,null);assert.equal(rows[0].sentAt,null);});
const fourth=await invokeSend('after reset: send only reset contact');
check('After reset exactly one request targets the reset contact',()=>{assert.equal(fourth.status,200);assert.equal(fourth.response.totalContacts,1);assert.deepEqual(fourth.requests.map(x=>x.to),['whatsapp:+MOCK_RECIPIENT_0']);assert.equal(rows[0].status,'SENT');assert.notEqual(rows[0].waMessageId,beforeResetMessage);});
check('Other Sent, Delivered and Read contacts were never resent',()=>{assert.deepEqual(clone(rows.slice(2)),protectedBefore);assert.equal(attempts.get('whatsapp:+MOCK_RECIPIENT_2'),undefined);assert.equal(attempts.get('whatsapp:+MOCK_RECIPIENT_3'),undefined);assert.equal(attempts.get('whatsapp:+MOCK_RECIPIENT_4'),undefined);assert.equal(attempts.get('whatsapp:+MOCK_RECIPIENT_1'),2);});
evidence.outcome='pass';
}catch(e){evidence.outcome='fail';evidence.error=e.stack;process.exitCode=1;}finally{evidence.adapterLog=logs;fs.writeFileSync(output,JSON.stringify(evidence,null,2));console.log(JSON.stringify({outcome:evidence.outcome,checks:evidence.checks,phases:evidence.phases.map(p=>({name:p.name,status:p.status,contactCount:p.response.totalContacts||0,requestCount:p.requests.length})),error:evidence.error,realMessages:0,databaseWrites:0},null,2));}})();
