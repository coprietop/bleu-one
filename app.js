const porcentajes = {2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
const COP_RATE = 3600;
const $ = (id)=>document.getElementById(id);
const moneyCOP = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
const numFmt = new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
function n(v){
  const raw = String(v ?? '').trim();
  if(!raw) return 0;
  // Acepta 50000, 50.000, 50,000 y evita que 50.000 se lea como 50.
  const clean = raw.replace(/[^0-9]/g,'');
  return Number(clean)||0;
}
function fmtCOP(v){return moneyCOP.format(Math.round(v)).replace('COP','').trim()}
function fmtUSD(v){return 'US$ ' + numFmt.format(Math.round(v))}
function pct(v){
  const x = Number(v);
  if(!isFinite(x)) return 0;
  return Math.max(0, Math.min(100, x));
}
function progressMessage(v){
  const x=pct(v);
  if(x>=100) return '🎉 ¡META CUMPLIDA! Disfruta este logro... y mañana comienza a construir el siguiente.';
  if(x>=81) return '⭐ Estás muy cerca. Un esfuerzo adicional puede hacer que este mes marque la diferencia.';
  if(x>=61) return '🔥 ¡Vas muy bien! No disminuyas el ritmo. La constancia separa a los líderes del resto.';
  if(x>=36) return '🚀 Excelente progreso. Mantén la disciplina y la meta comenzará a verse cada vez más cerca.';
  if(x>=16) return '💪 Vas avanzando, pero aún puedes acelerar el ritmo. Cada día cuenta.';
  return '🌱 Todo gran resultado comienza con el primer paso. Hoy aún estás a tiempo de construir un gran mes.';
}
function setProgress(barId, pctId, value){
  const val=pct(value);
  const bar=$(barId), label=$(pctId);
  if(bar){
    bar.style.width='0%';
    requestAnimationFrame(()=>{ bar.style.width=val.toFixed(2)+'%'; });
  }
  if(label) label.textContent=Math.round(val)+'%';
  const msg=$(pctId+'Msg');
  if(msg){
    msg.textContent=progressMessage(val);
    msg.classList.remove('celebrate','encourage');
    void msg.offsetWidth;
    msg.classList.add(val>=100?'celebrate':'encourage');
  }
}
function bindMoney(id, cb){ const el=$(id); if(!el) return; el.addEventListener('input',()=>{const val=n(el.value); el.value=val?numFmt.format(val):''; cb&&cb();}); el.dispatchEvent(new Event('input')); }

function calcOrden(){
  const total=n($('total').value); const dep=n($('deposito').value); const cuotas=Number($('cuotas').value);
  const compra=total/1.19; const iva=total-compra; const min=total*0.05; const saldo=Math.max(total-dep,0); const p=porcentajes[cuotas]||0; const pago=saldo*(p/100); const mg=total*0.20;
  $('precioCompra').textContent=fmtCOP(compra); $('iva').textContent=fmtCOP(iva); $('precioTotal').textContent=fmtCOP(total); $('depositoHoy').textContent=fmtCOP(dep); $('saldo').textContent=fmtCOP(saldo); $('cuotasOut').textContent=cuotas; $('pagoMinimo').textContent=fmtCOP(pago);
  const mgEl=$('mgValor'); if(mgEl) mgEl.textContent=fmtCOP(mg);
  $('depositHint').textContent=`Mínimo requerido: ${fmtCOP(min)}.`; $('formula').textContent=`Pago mínimo mensual calculado según tabla interna: ${fmtCOP(pago)}.`;
  const alerta=$('alerta');
  if(dep>=min){alerta.className='alert ok'; alerta.textContent='Depósito correcto. Cumple con el mínimo requerido del 5%.'}
  else{alerta.className='alert bad'; alerta.textContent=`Depósito insuficiente. Debe ser mínimo ${fmtCOP(min)}.`}
}
for(let i=2;i<=27;i++){const o=document.createElement('option'); o.value=i; o.textContent=`${i} cuotas`; if(i===27)o.selected=true; $('cuotas').appendChild(o)}
['total','deposito'].forEach(id=>bindMoney(id, calcOrden)); $('cuotas').addEventListener('change',calcOrden); calcOrden();

for(let i=2;i<=27;i++){const o=document.createElement('option'); o.value=i; o.textContent=`${i} meses`; if(i===27)o.selected=true; const sel=$('cuotaMeses'); if(sel) sel.appendChild(o)}
function calcCuota(){
  const v=n($('cuotaValor').value);
  const meses=Number($('cuotaMeses')?.value || 27);
  const p=porcentajes[meses]||5;
  const venta=p ? Math.round(v/(p/100)) : 0;
  $('cuotaVenta').textContent=fmtCOP(venta);
  const f=$('cuotaFormula'); if(f) f.textContent=`Venta aproximada calculada según ${meses} meses y tabla interna.`;
}
bindMoney('cuotaValor', calcCuota); const cuotaMeses=$('cuotaMeses'); if(cuotaMeses) cuotaMeses.addEventListener('change',calcCuota); calcCuota();
function calcNombres(){const v=n($('metaNombres').value); $('nombresOut').textContent=numFmt.format(Math.ceil(v/185));}
bindMoney('metaNombres', calcNombres);

const niveles = [
  {name:'JD', compras:null, volumen:20000, desc:'Meta JD: US$20.000 en volumen durante 3 meses. Cada mes debe tener mínimo US$4.000.', nota:'JD se mide únicamente por volumen.'},
  {name:'D3', compras:27000, desc:'Meta D3: US$27.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'},
  {name:'D2', compras:80000, desc:'Meta D2: US$80.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'},
  {name:'D1', compras:135000, desc:'Meta D1: US$135.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'},
  {name:'BLUE', compras:275000, desc:'Meta BLUE: US$275.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'},
  {name:'ROYAL', compras:550000, desc:'Meta ROYAL: US$550.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'},
  {name:'PREMIER', compras:1000000, desc:'Meta PREMIER: US$1.000.000 en compras durante el año. Puedes ingresar tu avance como compras o como volumen.'}
];
const adnBleu = [
  'Enfócate en las instantáneas. Practícalas con tus compañeros al terminar la capacitación.',
  'Es mejor traer 7 nombres activos que 30 sin activar.',
  'Para mejorar mercados, el 4 en 14 es lo más efectivo. Si necesitas complementar, usa buzones o QR de forma estratégica en estratos 3 y 4.',
  'Una hora de autoagendamiento al día puede hacer la diferencia este mes.',
  'Pídele la lista de tus antiguos clientes a tu distribuidor. A veces lo que buscas no está afuera, está con tus antiguos clientes.',
  'Todos los caminos deben conducir a mejorar nuestro 4 en 14.'
];
let adnIndex = 0;
function setAdn(i){ adnIndex=(i+adnBleu.length)%adnBleu.length; const el=$('ascensoConsejo'); if(el) el.textContent=adnBleu[adnIndex]; }
const cards=$('ascensoCards');
if(cards){ niveles.forEach((x,i)=>{const b=document.createElement('button'); b.className='ascenso-card'+(i===0?' active':''); b.type='button'; b.dataset.idx=i; b.innerHTML=`<strong>${x.name}</strong><span>Ver progreso →</span>`; cards.appendChild(b); }); }
let selectedAscenso=0;
document.querySelectorAll('.ascenso-card').forEach(btn=>btn.addEventListener('click',()=>{selectedAscenso=Number(btn.dataset.idx); document.querySelectorAll('.ascenso-card').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); calcAscenso();}));
$('otroAdn')?.addEventListener('click',()=>setAdn(adnIndex+1));
function calcAscenso(){
  const idx=selectedAscenso;
  const nivel=niveles[idx];
  const isJD=idx===0;
  const jdBox=$('jdMesesBox'); const otrosBox=$('otrosAscensosBox');
  if(jdBox) jdBox.style.display=isJD?'block':'none';
  if(otrosBox) otrosBox.style.display=isJD?'none':'block';

  let actual=0;
  const metaVol=nivel.volumen || nivel.compras*3.8;
  let meses=1;
  if(isJD){
    const m1=n($('jdMes1').value), m2=n($('jdMes2').value), m3=n($('jdMes3').value);
    actual=m1+m2+m3;
    meses=3;
    const valores=[m1,m2,m3];
    const debajo=valores.map((v,i)=>v>0 && v<4000 ? i+1 : null).filter(Boolean);
    const vacios=valores.filter(v=>v===0).length;
    const alerta=$('jdAlerta');
    if(debajo.length){
      alerta.className='alert bad';
      alerta.textContent=`Atención: Mes ${debajo.join(', ')} está por debajo del mínimo de US$4.000. Ese mes puede hacer que la ventana de ascenso se corra.`;
    } else if(actual>=20000 && valores.every(v=>v>=4000)){
      alerta.className='alert ok';
      alerta.textContent='Ruta correcta: cumples US$20.000 y cada mes supera el mínimo de US$4.000.';
    } else if(vacios){
      alerta.className='alert ok';
      alerta.textContent='Ingresa los 3 meses para validar el camino a JD.';
    } else {
      alerta.className='alert bad';
      alerta.textContent='Aún no alcanzas los US$20.000. Revisa el faltante y conviértelo en nombres semanales.';
    }
  } else {
    const tipo=$('ascensoTipoActual')?.value || 'venta';
    const valor=n($('ascensoVol').value);
    actual=tipo==='compra' ? valor*3.8 : valor;
    meses=Math.max(1,n($('ascensoMeses').value));
  }

  const falta=Math.max(metaVol-actual,0);
  const avance=pct((actual/metaVol)*100);
  const mensual=isJD ? falta : falta/meses;
  $('ascensoTitulo').textContent=`${nivel.name}`; const ati=$('ascensoTituloInput'); if(ati) ati.textContent=nivel.name;
  $('ascensoDescripcion').textContent=nivel.desc;
  setProgress('ascensoBar','ascensoPct',avance);
  $('ascensoMetaVol').textContent=fmtUSD(metaVol);
  $('ascensoActualLabel').textContent=isJD?'Volumen acumulado en 3 meses':'Volumen actual aproximado';
  $('ascensoActual').textContent=fmtUSD(actual);
  $('ascensoFalta').textContent=fmtUSD(falta);
  const faltaCopIva = falta * COP_RATE * 1.19;
  const faltaCopEl = $('ascensoFaltaCOP'); if(faltaCopEl) faltaCopEl.textContent = fmtCOP(faltaCopIva) + ' COP';
  $('ascensoMensualLabel').textContent=isJD?'Faltante para los US$20.000':'Volumen mensual necesario';
  $('ascensoMensual').textContent=fmtUSD(mensual);
  $('ascensoExtra').textContent=isJD ? 'JD se mide únicamente por volumen.' : 'Los valores son aproximados y se calculan según tu avance y los meses restantes.';

  const nombres=Math.ceil((isJD ? falta : mensual)/185); const an=$('ascensoNombres'); if(an) an.textContent=numFmt.format(nombres);
  if(falta>0){
    if(nombres>=100) setAdn(2);
    else if(nombres>=50) setAdn(0);
    else if(nombres>=20) setAdn(3);
    else setAdn(5);
  } else {
    setAdn(5);
  }
}
bindMoney('ascensoVol', calcAscenso); ['jdMes1','jdMes2','jdMes3'].forEach(id=>bindMoney(id, calcAscenso)); $('ascensoMeses').addEventListener('input',calcAscenso); const ascTipo=$('ascensoTipoActual'); if(ascTipo) ascTipo.addEventListener('change',calcAscenso); calcAscenso();

function calcTicket(){
  const sel=$('ticketTipo');
  const meta=n(sel.value);
  const actual=n($('ticketVol').value);
  const metaEl=$('ticketMeta');
  const metaTxt=$('ticketMetaTexto');
  const detalle=$('ticketMetaDetalle');
  if(!meta){
    if(metaEl) metaEl.textContent='—';
    if(metaTxt) metaTxt.textContent='Selecciona una categoría';
    if(detalle) detalle.textContent='Selecciona una categoría para ver su meta específica.';
    setProgress('ticketBar','ticketPct',0); $('ticketFalta').textContent='Selecciona una categoría para calcular tu avance.';
    return;
  }
  const label=sel.options[sel.selectedIndex]?.textContent || '';
  const avance=pct(actual/meta*100);
  const falta=Math.max(meta-actual,0);
  const detalles={
    34000:'Meta: US$34.000 en venta personal al final del cuatrimestre.',
    42000:'Meta: US$42.000 en venta personal de pareja al final del cuatrimestre.',
    65000:'Meta: US$65.000 en volumen de distribución al final del cuatrimestre.',
    30000:'Meta: US$30.000 en socios directos nuevos durante el cuatrimestre.',
    20000:'Meta: US$20.000 si eres novato del cuatrimestre.'
  };
  if(metaEl) metaEl.textContent=fmtUSD(meta);
  if(metaTxt) metaTxt.textContent=label;
  if(detalle) detalle.textContent=detalles[meta] || `Meta: ${fmtUSD(meta)}.`;
  setProgress('ticketBar','ticketPct',avance); $('ticketFalta').textContent=falta?`Faltan ${fmtUSD(falta)} para clasificar.`:'Meta cumplida para este cuatrimestre.';
}
bindMoney('ticketVol', calcTicket); $('ticketTipo').addEventListener('change',calcTicket); calcTicket();
function calcMoto(){const tipo=$('motoTipo').value; const v=n($('motoVol').value); let tickets=0, detalle=''; if(tipo==='personal'){tickets = v>=5000 ? 1+Math.floor((v-5000)/1000) : 0; const bono=v>=15000?3:0; tickets+=bono; detalle = bono?`Incluye 3 tickets adicionales por bono trimestral de US$15.000.`:`Venta personal: 1 ticket por US$5.000 y 1 adicional por cada US$1.000 extra.`;} else {tickets = v>=30000 ? 5+Math.floor((v-30000)/1000) : 0; detalle = `Distribución: 5 tickets por US$30.000 en el trimestre y 1 adicional por cada US$1.000 extra.`;} $('motoTickets').textContent=tickets; $('motoDetalle').textContent=detalle;}
bindMoney('motoVol', calcMoto); $('motoTipo').addEventListener('change',calcMoto); calcMoto();
function calcIngresos(){
  const r=Number($('ingRol').value); const vol=n($('ingVol').value); const ingreso=vol*r;
  $('ingUsd').textContent=fmtUSD(ingreso); $('ingCop').textContent=fmtCOP(ingreso*COP_RATE);
}
function calcIngresoDeseado(){
  const r=Number($('ingRolDeseado').value); const deseadoCop=n($('ingDeseadoCop').value); const deseadoUsd=deseadoCop/COP_RATE; const volNecesario=r?deseadoUsd/r:0;
  $('ingDeseadoUsd').textContent=fmtUSD(deseadoUsd); $('ingVolNecesario').textContent=fmtUSD(volNecesario); $('ingNombres').textContent=numFmt.format(Math.ceil(volNecesario/185));
}
bindMoney('ingVol', calcIngresos); $('ingRol').addEventListener('change',calcIngresos); calcIngresos();
bindMoney('ingDeseadoCop', calcIngresoDeseado); $('ingRolDeseado').addEventListener('change',calcIngresoDeseado); calcIngresoDeseado();
function calcAdmin(){
  const tipo=$('adminTipo').value; const m=n($('adminMonto').value); const p=tipo==='emprendedor'?0.25:0.30; const reserva=m*p;
  if(tipo==='emprendedor'){
    $('adminReservaLabel').textContent='Guardar para más demostraciones (25%)';
    $('adminDisponibleLabel').textContent='Disponible después de separar';
    $('adminExplica').textContent='Recomendación: no consumas todo el ingreso. Separa primero el 25% para más demostraciones, prospección y actividad. Lo que no se reinvierte, se frena.';
  } else {
    $('adminReservaLabel').textContent='Puedes tomar para ti (30%)';
    $('adminDisponibleLabel').textContent='Capital para operación y crecimiento';
    $('adminExplica').textContent='Si no tienes salario fijo, toma máximo el 30% de cada estado de cuenta. El restante debe proteger operación, equipo, demostraciones, eventos y crecimiento.';
  }
  $('adminReserva').textContent=fmtCOP(reserva); $('adminDisponible').textContent=fmtCOP(m-reserva);
}
bindMoney('adminMonto', calcAdmin); $('adminTipo').addEventListener('change',calcAdmin); calcAdmin();

function calcSistema122(){
  const codigos=n($('s122Codigos').value);
  const ventas=n($('s122Ventas').value);
  const personal=n($('s122Personal').value);
  const bonoPrimera=codigos*200000;
  const dosUsd=ventas*0.02;
  const dosCop=dosUsd*COP_RATE;
  const clasifica=personal>=2000;
  $('s122Primera').textContent=fmtCOP(bonoPrimera);
  $('s122DosUsd').textContent=fmtUSD(dosUsd);
  $('s122DosCop').textContent=fmtCOP(dosCop);
  $('s122Total').textContent=fmtCOP(bonoPrimera + (clasifica?dosCop:0));
  const alerta=$('s122Alerta');
  if(clasifica){
    alerta.className='alert ok';
    alerta.textContent='Clasifica para reclamar el 2% mensual porque cumple mínimo US$2.000 de volumen personal.';
  } else {
    alerta.className='alert bad';
    alerta.textContent=`No clasifica al 2% este mes. Debe llegar a mínimo US$2.000 de volumen personal. Faltan ${fmtUSD(Math.max(2000-personal,0))}.`;
  }
}
['s122Socios','s122Codigos'].forEach(id=>{const el=$(id); if(el){el.addEventListener('input',calcSistema122)}});
['s122Ventas','s122Personal'].forEach(id=>bindMoney(id, calcSistema122));
calcSistema122();

function calcDesarrollo(){
  const inv=n($('desInv').value);
  const entrevistas=Math.floor(inv/3);
  const socios=Math.floor(inv/9);
  $('desEntrevistas').textContent=numFmt.format(entrevistas);
  $('desSocios').textContent=numFmt.format(socios);
}
const desInv=$('desInv'); if(desInv){desInv.addEventListener('input',calcDesarrollo); calcDesarrollo();}
const toggleSpeech=$('toggleSpeech'); if(toggleSpeech){toggleSpeech.addEventListener('click',()=>{const box=$('speechBox'); box?.classList.toggle('hidden'); toggleSpeech.innerHTML = box?.classList.contains('hidden') ? 'Ver Speech <span>→</span>' : 'Ocultar Speech <span>↑</span>';});}

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{
  if(document.body.classList.contains('locked') && btn.dataset.screen !== 'somos') return;
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.screen).classList.add('active');
  document.body.classList.remove('menu-open');
  window.scrollTo({top:0,behavior:'smooth'});
}));
let deferredPrompt; const installBtn=$('installBtn'); window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault(); deferredPrompt=e; installBtn.classList.remove('hidden')}); installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; installBtn.classList.add('hidden')});
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}

const menuToggle=$('menuToggle');
menuToggle?.addEventListener('click',()=>document.body.classList.toggle('menu-open'));
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')document.body.classList.remove('menu-open')});

// Agregados
(function initAgregados(){
  const sel=$('agMeses');
  if(sel){
    for(let i=2;i<=27;i++){
      const o=document.createElement('option');
      o.value=i; o.textContent=`${i} meses`;
      if(i===27)o.selected=true;
      sel.appendChild(o);
    }
  }
  function calcAgregados(){
    if(!$('agSaldo')) return;
    const saldo=n($('agSaldo').value);
    const compra=n($('agCompra').value);
    const inicial=n($('agInicial').value);
    const meses=Number($('agMeses')?.value || 27);
    const p=porcentajes[meses]||5;
    const total=Math.max(saldo+compra-inicial,0);
    const pago=total*(p/100);
    $('agSaldoOut').textContent=fmtCOP(saldo);
    $('agCompraOut').textContent=fmtCOP(compra);
    $('agInicialOut').textContent=fmtCOP(inicial);
    $('agTotal').textContent=fmtCOP(total);
    $('agPago').textContent=fmtCOP(pago);
    $('agFormula').textContent=`Pago mensual calculado según ${meses} meses y tabla interna: ${fmtCOP(pago)}.`;
  }
  ['agSaldo','agCompra','agInicial'].forEach(id=>bindMoney(id, calcAgregados));
  if(sel) sel.addEventListener('change', calcAgregados);
  calcAgregados();
})();

// Botón Somos Bleu
(function initSomos(){
  document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{
    const target=btn.dataset.go;
    document.body.classList.remove('locked');
    document.body.classList.remove('menu-open');
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.querySelector(`.nav-item[data-screen="${target}"]`)?.classList.add('active');
    document.getElementById(target)?.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }));
})();

// Toppers
(function initToppers(){
  const data={
    personal:{title:'Venta personal', items:[
      {name:'Maricela Chilito & Eduardo Mayordomo', city:'Funza', volume:23664, move:0},
      {name:'Cristian Camilo Forero', city:'Cajicá', volume:14663, move:0},
      {name:'Lina Marcela Molina', city:'Cajicá', volume:12817, move:0},
      {name:'Samuel Camilo Riaño', city:'Chía', volume:11071, move:0},
      {name:'Carolina Castillo & Tulio Gómez', city:'Bogotá', volume:11034, move:76, highlight:true}
    ]},
    junior:{title:'Distribuidores Junior', items:[
      {name:'Maricela Chilito & Eduardo Mayordomo', city:'Funza', volume:23664, move:0},
      {name:'Cristian Camilo Forero', city:'Cajicá', volume:14663, move:1},
      {name:'Lina Marcela Molina', city:'Cajicá', volume:14448, move:1},
      {name:'Samuel Camilo Riaño', city:'Chía', volume:13218, move:-2},
      {name:'Andrés & Samuel Álvarez', city:'Chía', volume:9182, move:0}
    ]},
    distribuidores:{title:'Distribuidores', items:[
      {name:'Ana Morales & Christian Prieto', city:'Bogotá', volume:25754, move:25, highlight:true},
      {name:'Yurani Chacón & Luis Villarraga', city:'Cajicá', volume:22233, move:-1},
      {name:'Rodolfo Tarazona & Edna Ruiz', city:'Tocancipá', volume:15367, move:0},
      {name:'Alex Prieto & Valentina Rodríguez', city:'Chía', volume:14044, move:0},
      {name:'Alejandro Camelo & Karol Viloria', city:'Tocancipá', volume:13776, move:-3}
    ]}
  };
  const medals=['🥇','🥈','🥉','4','5'];
  let current='personal';
  function movementHTML(item){
    const m=Number(item.move||0);
    if(m>0) return `<span class="move move-up">↑ +${m}</span>${item.highlight?'<em class="rise-badge">🔥 Mayor ascenso</em>':''}`;
    if(m<0) return `<span class="move move-down">↓ ${m}</span>`;
    return '<span class="move move-same">—</span>';
  }
  function movementText(item){
    const m=Number(item.move||0);
    if(m>0) return `Movimiento: subió ${m} posiciones`;
    if(m<0) return `Movimiento: bajó ${Math.abs(m)} posiciones`;
    return 'Movimiento: se mantuvo en su posición';
  }

  function openModal(item, idx, category){
    const m=$('topperModal'); if(!m) return;
    $('modalMedal').textContent=medals[idx] || idx+1;
    $('modalName').textContent=item.name;
    $('modalCity').textContent=`📍 ${item.city}`;
    $('modalVolume').textContent=fmtUSD(item.volume);
    $('modalCategory').textContent=category;
    let movement=$('modalMovement');
    if(!movement){
      movement=document.createElement('div');
      movement.id='modalMovement';
      movement.className='modal-movement';
      $('modalCategory').insertAdjacentElement('afterend', movement);
    }
    movement.textContent=movementText(item);
    m.classList.remove('hidden');
    if(idx===0) setTimeout(launchConfetti, 120);
  }
  function render(key=current){
    if(!$('podium')) return;
    current=key;
    const group=data[key];
    $('podiumTitle').textContent=group.title;
    const [a,b,c]=group.items;
    $('podium').innerHTML=`
      <button class="podium-place first podium-enter" data-idx="0"><span class="medal">🥇</span><strong>${a.name}</strong><small>${a.city}</small><b>${fmtUSD(a.volume)}</b><span class="movement-wrap">${movementHTML(a)}</span></button>
      <div class="podium-row">
        <button class="podium-place second podium-enter" data-idx="1"><span class="medal">🥈</span><strong>${b.name}</strong><small>${b.city}</small><b>${fmtUSD(b.volume)}</b><span class="movement-wrap">${movementHTML(b)}</span></button>
        <button class="podium-place third podium-enter" data-idx="2"><span class="medal">🥉</span><strong>${c.name}</strong><small>${c.city}</small><b>${fmtUSD(c.volume)}</b><span class="movement-wrap">${movementHTML(c)}</span></button>
      </div>`;
    $('topperList').innerHTML=group.items.slice(3).map((x,i)=>`<button class="topper-row" data-idx="${i+3}"><span>${i+4}°</span><strong>${x.name}</strong><small>${x.city}</small><b>${fmtUSD(x.volume)}</b><span class="movement-wrap">${movementHTML(x)}</span></button>`).join('');
    document.querySelectorAll('.podium-enter').forEach((el,i)=>{ el.style.animationDelay=`${i*110}ms`; });
    document.querySelectorAll('#podium [data-idx], #topperList [data-idx]').forEach(el=>el.addEventListener('click',()=>openModal(group.items[Number(el.dataset.idx)], Number(el.dataset.idx), group.title)));
  }
  document.querySelectorAll('.topper-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.topper-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); render(btn.dataset.top);
  }));
  $('modalClose')?.addEventListener('click',()=> $('topperModal')?.classList.add('hidden'));
  $('topperModal')?.addEventListener('click',(e)=>{ if(e.target.id==='topperModal') $('topperModal').classList.add('hidden'); });
  function colombiaParts(date=new Date()){
    const parts=new Intl.DateTimeFormat('es-CO',{timeZone:'America/Bogota',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date);
    const obj={}; parts.forEach(p=>{if(p.type!=='literal') obj[p.type]=Number(p.value)});
    return obj;
  }
  function setMonthLabel(){
    const label=$('topperMonthLabel'); if(!label) return;
    label.textContent='Junio 2026';
  }
  function endOfCurrentMonthColombia(now=new Date()){
    const bogotaNow=new Date(now.toLocaleString('en-US',{timeZone:'America/Bogota'}));
    const y=bogotaNow.getFullYear();
    const m=bogotaNow.getMonth();
    // Inicio del mes siguiente a las 00:00 en Colombia (UTC-5).
    return new Date(Date.UTC(y, m + 1, 1, 5, 0, 0));
  }
  function setCountdownLabel(){
    const label=document.querySelector('.countdown-label');
    if(!label) return;
    const bogotaNow=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Bogota'}));
    const monthName=new Intl.DateTimeFormat('es-CO',{month:'long', timeZone:'America/Bogota'}).format(bogotaNow);
    const title=monthName.charAt(0).toUpperCase()+monthName.slice(1);
    label.textContent=`Finaliza ${title} ${bogotaNow.getFullYear()} en`;
  }
  function tick(){
    const el=$('topCountdown'); if(!el) return;
    const now=new Date();
    let diff=Math.max(0, endOfCurrentMonthColombia(now)-now);
    const d=Math.floor(diff/86400000); diff-=d*86400000;
    const h=Math.floor(diff/3600000); diff-=h*3600000;
    const m=Math.floor(diff/60000); diff-=m*60000;
    const s=Math.floor(diff/1000);
    const vals=[d,h,m,s].map(x=>String(x).padStart(2,'0'));
    el.querySelectorAll('strong').forEach((node,i)=>node.textContent=vals[i]);
  }
  function launchConfetti(){
    const layer=$('confettiLayer'); if(!layer) return;
    layer.innerHTML='';
    for(let i=0;i<34;i++){
      const piece=document.createElement('i');
      piece.style.left=(8+Math.random()*84)+'%';
      piece.style.animationDelay=(Math.random()*0.25)+'s';
      piece.style.transform=`rotate(${Math.random()*360}deg)`;
      piece.style.setProperty('--fall', (80+Math.random()*120)+'px');
      layer.appendChild(piece);
    }
    layer.classList.add('show');
    setTimeout(()=>{ layer.classList.remove('show'); layer.innerHTML=''; }, 1500);
  }
  render(); setMonthLabel(); setCountdownLabel(); tick(); setInterval(tick,1000);
})();



// Bleu One v1.0 Stable - Presentation Edition enhancements
(function(){
  const purposes = {
    orden: ['Orden de Compra','Una orden bien hecha genera confianza. Un error puede costarte una venta.'],
    cuota: ['Cuota','No vendas un producto. Ayuda a construir una decisión inteligente.'],
    agregados: ['Agregados','Un agregado bien calculado evita reprocesos y protege la experiencia del cliente.'],
    nombres: ['Nombres','Cuando sabes cuántos nombres necesitas, dejas de esperar resultados y empiezas a construirlos.'],
    ascenso: ['Ascensos','Cada dólar de volumen es un paso más hacia tu siguiente nivel.'],
    ticket: ['Ticket Dorado','La constancia durante cuatro meses puede cambiar un año completo.'],
    sistema122: ['Sistema 122','Las ventas generan ingresos. Las personas construyen patrimonio.'],
    desarrollo: ['Desarrollo','El crecimiento de una organización siempre comienza desarrollando personas.'],
    moto: ['Tickets Moto','Cada venta suma. Cada ticket acerca la posibilidad de cumplir un sueño.'],
    ingresos: ['Proyección de ingresos','Todo gran resultado comienza con una meta clara.'],
    admin: ['Administración','Quien administra bien pequeñas cantidades estará preparado para grandes oportunidades.'],
    toppers: ['Toppers','El reconocimiento no premia el talento. Premia la disciplina.']
  };
  Object.entries(purposes).forEach(([id,[title,text]])=>{
    const screen=document.getElementById(id); if(!screen || screen.querySelector('.purpose-card')) return;
    const head=screen.querySelector('.screen-head'); if(!head) return;
    const card=document.createElement('div'); card.className='purpose-card';
    card.innerHTML=`<strong>${title}</strong><p>${text}</p>`;
    head.insertAdjacentElement('afterend',card);
  });
  document.querySelectorAll('.ascenso-card span').forEach(el=>{ el.textContent='Ver mi avance →'; });
  const toggleSpeech=document.getElementById('toggleSpeech'); if(toggleSpeech) toggleSpeech.innerHTML='Ver Speech <span>→</span>';
  if(!document.querySelector('.made-by-floating')){
    const f=document.createElement('div'); f.className='made-by-floating'; f.textContent='Made with ❤️ by Bleu Company'; document.body.appendChild(f);
  }
  // Mensajes de progreso estables, sin depender de animaciones de texto.
  function ensureProgressMessage(pctId, barId){
    const pct=document.getElementById(pctId), bar=document.getElementById(barId); if(!pct || !bar) return;
    let msg=document.getElementById(pctId+'Msg');
    if(!msg){ msg=document.createElement('div'); msg.id=pctId+'Msg'; msg.className='progress-message encourage'; bar.parentElement.insertAdjacentElement('afterend',msg); }
    const value=parseFloat(String(pct.textContent).replace('%',''))||0;
    msg.textContent=progressMessage(value);
  }
  ensureProgressMessage('ascensoPct','ascensoBar');
  ensureProgressMessage('ticketPct','ticketBar');
  // Inicializa barras y mensajes después de que todos los módulos cargan.
  try{ calcAscenso(); calcTicket(); calcCuota(); calcAgregados?.(); }catch(e){}
})();
