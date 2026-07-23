const porcentajes = {2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
const COP_RATE = 3443.59;
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
function calcMoto(){
  const tipoEl=$('motoTipo'), volEl=$('motoVol');
  if(!tipoEl || !volEl) return;
  const tipo=tipoEl.value; const v=n(volEl.value); let tickets=0, detalle='';
  if(tipo==='personal'){tickets = v>=5000 ? 1+Math.floor((v-5000)/1000) : 0; const bono=v>=15000?3:0; tickets+=bono; detalle = bono?`Incluye 3 tickets adicionales por bono trimestral de US$15.000.`:`Venta personal: 1 ticket por US$5.000 y 1 adicional por cada US$1.000 extra.`;}
  else {tickets = v>=30000 ? 5+Math.floor((v-30000)/1000) : 0; detalle = `Distribución: 5 tickets por US$30.000 en el trimestre y 1 adicional por cada US$1.000 extra.`;}
  if($('motoTickets')) $('motoTickets').textContent=tickets; if($('motoDetalle')) $('motoDetalle').textContent=detalle;
}
if($('motoVol')) bindMoney('motoVol', calcMoto); if($('motoTipo')) $('motoTipo').addEventListener('change',calcMoto); calcMoto();
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
  const rankings={
    junio:{
      label:'Junio 2026', final:true,
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
    },
    julio:{
      label:'Julio 2026', final:false,
      personal:{title:'Venta personal', items:[
        {name:'Sandra Milena Cano', city:'Tocancipá', distribution:'Lions Heart', volume:11993, move:21, highlight:true},
        {name:'Leidy Rojas & Steven Prieto', city:'Chía', distribution:'Company Lury Blue', volume:11649, move:11},
        {name:'Nelsen Rocío Vega', city:'Tocancipá', distribution:'Nakuru Company', volume:8837, move:13},
        {name:'Jessica Paola Calderón', city:'Tocancipá', distribution:'Sabores de Prestigio', volume:8760, move:-3},
        {name:'María Paula Villarraga & Andrea Juzga', city:'Cajicá', distribution:'Samand Corporation', volume:8486, move:62, highlight:true}
      ]},
      junior:{title:'Mejor Distribuidor Junior', items:[
        {name:'Leidy Rojas & Steven Prieto', city:'Chía', distribution:'Company Lury Blue', volume:11649, move:1},
        {name:'Samuel Camilo Riaño', city:'Chía', distribution:'Exclusive Quality', volume:6700, move:2},
        {name:'Natalia Bolívar & Santiago Parra', city:'Cajicá', distribution:'JM Global Company', volume:6112, move:2},
        {name:'Andrea Barriga', city:'Cajicá', distribution:'Lions Fuentes', volume:5197, move:27, highlight:true},
        {name:'Andrés Moreno', city:'Bogotá', distribution:'Esenzia Vital SAS', volume:4894, move:13}
      ]},
      distribuidores:{title:'Mejor Distribuidor', items:[
        {name:'Dayana Ayala & Wilmer Núñez', city:'Tocancipá', distribution:'Lion Heart SAS', volume:18337, move:1},
        {name:'Rodolfo Tarazona & Edna Ruiz', city:'Tocancipá', distribution:'Taru Company', volume:16021, move:12},
        {name:'Ana Morales & Christian Prieto', city:'Bogotá', distribution:'Bleu Company', volume:14452, move:0},
        {name:'María Paula Villarraga & Andrea Juzga', city:'Cajicá', distribution:'Samand Corporation', volume:13861, move:9},
        {name:'Karol Bernal', city:'Bogotá', distribution:'Aeternum Company', volume:13716, move:7}
      ]}
    }
  };
  const medals=['🥇','🥈','🥉','4','5'];
  let currentMonth='julio';
  let currentCategory='personal';

  function movementHTML(item){
    if(item.move===null || item.move===undefined) return '<span class="move move-new">En competencia</span>';
    const m=Number(item.move||0);
    if(m>0) return `<span class="move move-up">↑ +${m}</span>${item.highlight?'<em class="rise-badge">🔥 Mayor ascenso</em>':''}`;
    if(m<0) return `<span class="move move-down">↓ ${m}</span>`;
    return '<span class="move move-same">—</span>';
  }
  function movementText(item){
    if(item.move===null || item.move===undefined) return 'Ranking de Julio a la fecha';
    const m=Number(item.move||0);
    if(m>0) return `Movimiento: subió ${m} posiciones`;
    if(m<0) return `Movimiento: bajó ${Math.abs(m)} posiciones`;
    return 'Movimiento: se mantuvo en su posición';
  }
  function launchConfetti(container=document.body){
    const layer=document.createElement('div');
    layer.className='confetti-layer';
    const symbols=['◆','●','✦','■'];
    for(let i=0;i<34;i++){
      const piece=document.createElement('i');
      piece.textContent=symbols[i%symbols.length];
      piece.style.left=`${8+Math.random()*84}%`;
      piece.style.animationDelay=`${Math.random()*.28}s`;
      piece.style.animationDuration=`${.85+Math.random()*.7}s`;
      piece.style.setProperty('--drift',`${-50+Math.random()*100}px`);
      layer.appendChild(piece);
    }
    container.appendChild(layer);
    setTimeout(()=>layer.remove(),1900);
  }
  function openModal(item, idx, category){
    const m=$('topperModal'); if(!m) return;
    $('modalMedal').textContent=medals[idx] || idx+1;
    $('modalName').textContent=item.name;
    $('modalCity').textContent=`📍 ${item.city}`;
    const dist=$('modalDistribution');
    if(dist){dist.textContent=item.distribution?`Distribución: ${item.distribution}`:''; dist.style.display=item.distribution?'block':'none';}
    $('modalVolume').textContent=fmtUSD(item.volume);
    $('modalCategory').textContent=`${category} · ${rankings[currentMonth].label}`;
    let movement=$('modalMovement');
    if(!movement){movement=document.createElement('div');movement.id='modalMovement';movement.className='modal-movement';$('modalCategory').insertAdjacentElement('afterend',movement);}
    movement.textContent=movementText(item);
    m.classList.remove('hidden');
    if(idx===0) requestAnimationFrame(()=>launchConfetti(m.querySelector('.modal-card')));
  }
  function extraInfo(item){return item.distribution?`<small class="topper-distribution">${item.distribution}</small>`:'';}
  function render(){
    if(!$('podium')) return;
    const month=rankings[currentMonth];
    const group=month[currentCategory];
    $('podiumTitle').textContent=`${group.title} · ${month.label}`;
    const [a,b,c]=group.items;
    $('podium').innerHTML=`
      <button class="podium-place first podium-enter" data-idx="0"><span class="medal">🥇</span><strong>${a.name}</strong><small>${a.city}</small>${extraInfo(a)}<b>${fmtUSD(a.volume)}</b><span class="movement-wrap">${movementHTML(a)}</span></button>
      <div class="podium-row">
        <button class="podium-place second podium-enter" data-idx="1"><span class="medal">🥈</span><strong>${b.name}</strong><small>${b.city}</small>${extraInfo(b)}<b>${fmtUSD(b.volume)}</b><span class="movement-wrap">${movementHTML(b)}</span></button>
        <button class="podium-place third podium-enter" data-idx="2"><span class="medal">🥉</span><strong>${c.name}</strong><small>${c.city}</small>${extraInfo(c)}<b>${fmtUSD(c.volume)}</b><span class="movement-wrap">${movementHTML(c)}</span></button>
      </div>`;
    $('topperList').innerHTML=group.items.slice(3).map((x,i)=>`<button class="topper-row" data-idx="${i+3}"><span>${i+4}°</span><strong>${x.name}</strong><small>${x.city}${x.distribution?` · ${x.distribution}`:''}</small><b>${fmtUSD(x.volume)}</b><span class="movement-wrap">${movementHTML(x)}</span></button>`).join('');
    document.querySelectorAll('.podium-enter').forEach((el,i)=>{el.style.animationDelay=`${i*110}ms`;});
    document.querySelectorAll('#podium [data-idx], #topperList [data-idx]').forEach(el=>el.addEventListener('click',()=>openModal(group.items[Number(el.dataset.idx)],Number(el.dataset.idx),group.title)));
    setTimeout(()=>launchConfetti($('podium')),430);
  }
  function setMonth(monthKey){
    currentMonth=monthKey;
    document.querySelectorAll('.topper-month-tab').forEach(b=>b.classList.toggle('active',b.dataset.month===monthKey));
    const note=$('topperMonthNote');
    if(note) note.textContent=monthKey==='junio'?'Resultados finales de Junio 2026. Felicitamos a quienes cerraron el mes en el Top 5.':'Ranking de Julio a la fecha. Se actualizará semanalmente hasta el cierre del mes.';
    render();
  }
  document.querySelectorAll('.topper-month-tab').forEach(btn=>btn.addEventListener('click',()=>setMonth(btn.dataset.month)));
  document.querySelectorAll('.topper-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.topper-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); currentCategory=btn.dataset.top; render();
  }));
  $('modalClose')?.addEventListener('click',()=> $('topperModal')?.classList.add('hidden'));
  $('topperModal')?.addEventListener('click',(e)=>{if(e.target.id==='topperModal') $('topperModal').classList.add('hidden');});

  function endOfJulyBogota(){return new Date('2026-08-01T00:00:00-05:00');}
  function tick(){
    const el=$('topCountdown'); if(!el) return;
    let diff=Math.max(0,endOfJulyBogota().getTime()-Date.now());
    const d=Math.floor(diff/86400000); diff-=d*86400000;
    const h=Math.floor(diff/3600000); diff-=h*3600000;
    const m=Math.floor(diff/60000); diff-=m*60000;
    const s=Math.floor(diff/1000);
    const vals=[d,h,m,s].map(x=>String(x).padStart(2,'0'));
    el.querySelectorAll('strong').forEach((node,i)=>node.textContent=vals[i]);
  }
  setMonth('julio'); tick(); setInterval(tick,1000);
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


// Programa Moño Azul
(function initMonoAzul(){
  const root=document.getElementById('monoazul');
  if(!root) return;
  const q=id=>document.getElementById(id);
  const levels=[
    {sales:2,min:2000000,max:2499000},
    {sales:3,min:2500000,max:3399000},
    {sales:4,min:3400000,max:3999000},
    {sales:5,min:4000000,max:5499000},
    {sales:6,min:5500000,max:7000000}
  ];
  const adn=[
    'Moño Azul no reemplaza el 4 en 14: es un plus que lo complementa y genera más actividad instantánea.',
    'Usa Moño Azul para generar más actividad instantánea, siempre con estrategia y seguimiento.',
    'Las personas tienen máximo un mes para activar y desarrollar este programa.',
    'El Programa Moño Azul solo se usa con autorización de tu Distribuidor.',
    'El éxito está en que el cliente mismo agende las visitas, no únicamente en que envíe contactos.',
    'Haz sinergia con el cliente y un seguimiento exhaustivo para que el programa sea exitoso.',
    'Moño Azul históricamente ha ayudado a muchos asesores y distribuidores a construir su mejor mes.',
    'Todos los caminos deben seguir fortaleciendo el 4 en 14: Moño Azul es un acelerador, nunca un reemplazo.',
    'La exclusividad no está solo en el beneficio: está en la experiencia que construyes alrededor del cliente.',
    'Un cliente acompañado con excelencia puede convertirse en la puerta de entrada a todo un nuevo mercado.',
    'La emoción abre la conversación; el seguimiento disciplinado convierte esa emoción en resultados.',
    'Cada reconocimiento enviado a tiempo renueva el compromiso del cliente con su siguiente meta.',
    'No administres contactos: administra confianza, agenda y experiencia.',
    'Cuando el cliente siente que el programa también es suyo, comienza a defender el resultado contigo.',
    'La mejor forma de cuidar la percepción del programa es cumplir cada promesa con precisión.',
  ];
  const messages=[
    'La primera venta inicia el camino. Activa seguimiento desde hoy.',
    '¡Primera venta aprobada! El programa ya está en movimiento.',
    '🎉 Primer beneficio desbloqueado. Mantén la emoción y agenda la siguiente visita.',
    'Excelente avance. El cliente ya puede aspirar a un beneficio superior.',
    'El programa está tomando fuerza. No disminuyas el seguimiento.',
    'Están muy cerca del máximo nivel. Convierte la energía en acción.',
    '👑 Nivel máximo de beneficios desbloqueado. Coordina la selección con tu Distribuidor.',
    '✨ Séptima venta lograda. Un resultado extraordinario construido con confianza y ejecución.'
  ];
  let adnIdx=0;

  root.querySelectorAll('.mono-tab').forEach(btn=>btn.addEventListener('click',()=>{
    root.querySelectorAll('.mono-tab').forEach(b=>b.classList.remove('active'));
    root.querySelectorAll('.mono-tab-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    q('monoTab-'+btn.dataset.monoTab)?.classList.add('active');
  }));

  function localDate(str){
    if(!str) return null;
    const [y,m,d]=str.split('-').map(Number);
    return new Date(y,m-1,d,12,0,0);
  }
  function update(){
    const sales=Math.max(0,Math.min(7,Number(q('monoVentas')?.value||0)));
    q('monoVentasOut').textContent=`${sales} de 7`;
    q('monoVentasBar').style.width=`${(sales/7)*100}%`;
    q('monoBow').classList.toggle('active',sales>0);
    q('monoBow').classList.toggle('complete',sales>=6);
    q('monoMensaje').textContent=messages[sales];
    q('monoMensaje').className='progress-message '+(sales>=6?'celebrate':'encourage');
    q('monoSalesDots').innerHTML=Array.from({length:7},(_,i)=>`<i class="${i<sales?'done':''}"></i>`).join('');
    root.querySelectorAll('#monoLevels article').forEach(card=>{
      const need=Number(card.dataset.sales);
      card.classList.toggle('unlocked',sales>=need);
      card.classList.toggle('current',sales===need);
    });
    let benefit='Completa 2 ventas aprobadas para desbloquear el primer nivel de beneficio.';
    const unlocked=[...levels].reverse().find(x=>sales>=x.sales);
    if(unlocked) benefit=`Beneficio desbloqueado: producto entre ${fmtCOP(unlocked.min)} y ${fmtCOP(unlocked.max)}.`;
    if(sales>=7) benefit='Séptima venta alcanzada. Celebra el resultado y coordina con tu Distribuidor el cierre exitoso del programa.';
    q('monoBenefitMsg').textContent=benefit;

    const start=localDate(q('monoInicio')?.value);
    if(start){
      const end=new Date(start); end.setDate(end.getDate()+30);
      const now=new Date();
      const total=30*86400000;
      const remaining=Math.ceil((end-now)/86400000);
      const elapsed=Math.max(0,Math.min(100,((now-start)/total)*100));
      q('monoFin').textContent=`Finaliza el ${end.toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})}`;
      q('monoTiempoBar').style.width=`${elapsed}%`;
      q('monoDias').textContent=remaining>0?`${remaining} días restantes para completar el programa.`:'La vigencia de 30 días ya finalizó. Consulta con tu Distribuidor.';
    }else{
      q('monoFin').textContent='Selecciona fecha de inicio';
      q('monoTiempoBar').style.width='0%';
      q('monoDias').textContent='30 días máximo para activar y desarrollar el programa.';
    }
  }
  q('monoVentas')?.addEventListener('change',update);
  q('monoInicio')?.addEventListener('change',update);
  const syncRecognitionFields=()=>{
    const c=q('monoCliente')?.value||''; const d=q('monoDistribucion')?.value||'';
    if(q('monoClienteDescarga') && document.activeElement!==q('monoClienteDescarga')) q('monoClienteDescarga').value=c;
    if(q('monoDistribucionDescarga') && document.activeElement!==q('monoDistribucionDescarga')) q('monoDistribucionDescarga').value=d;
    renderRecognition(2,q('monoPreviewCanvas'));
  };
  ['monoCliente','monoDistribucion','monoClienteDescarga','monoDistribucionDescarga'].forEach(id=>q(id)?.addEventListener('input',()=>{
    if(id==='monoClienteDescarga' && q('monoCliente')) q('monoCliente').value=q(id).value;
    if(id==='monoDistribucionDescarga' && q('monoDistribucion')) q('monoDistribucion').value=q(id).value;
    if(id==='monoCliente' && q('monoClienteDescarga')) q('monoClienteDescarga').value=q(id).value;
    if(id==='monoDistribucion' && q('monoDistribucionDescarga')) q('monoDistribucionDescarga').value=q(id).value;
    renderRecognition(Number(root.dataset.previewSale||2),q('monoPreviewCanvas'));
  }));
  update();
  setTimeout(syncRecognitionFields,80);

  const monoBubble=document.createElement('aside');
  monoBubble.className='adn-chat-bubble';
  monoBubble.setAttribute('aria-live','polite');
  monoBubble.innerHTML=`<div class="adn-chat-head"><span class="adn-diamond">💎</span><strong>ADN BLEU</strong></div><div class="adn-typing"><i></i><i></i><i></i></div><p></p><button type="button" aria-label="Mostrar otra frase ADN BLEU">Otra frase →</button>`;
  root.appendChild(monoBubble);
  const monoQuote=monoBubble.querySelector('p');
  const showMonoAdn=()=>{
    monoBubble.classList.add('is-typing');
    setTimeout(()=>{
      adnIdx=(adnIdx+1)%adn.length;
      monoQuote.textContent=adn[adnIdx];
      monoBubble.classList.remove('is-typing');
    },520);
  };
  monoQuote.textContent=adn[Math.floor(Math.random()*adn.length)];
  monoBubble.querySelector('button').addEventListener('click',showMonoAdn);
  q('copyMonoSpeech')?.addEventListener('click',async()=>{
    const text=q('monoSpeechText').innerText.trim();
    try{await navigator.clipboard.writeText(text);q('copyMonoSpeech').textContent='Speech copiado ✓';setTimeout(()=>q('copyMonoSpeech').textContent='Copiar speech',1800)}catch(e){q('copyMonoSpeech').textContent='Selecciona y copia';}
  });

  const ordinal=['Primera','Segunda','Tercera','Cuarta','Quinta','Sexta','Séptima'];
  const grid=q('monoDownloadGrid');
  if(grid){
    grid.innerHTML=ordinal.map((word,i)=>`<article class="mono-download-card"><div><strong>${word} venta</strong><br><span>Pieza personalizada premium</span></div><div class="mono-download-actions"><button type="button" data-mono-preview="${i+1}">Vista previa</button><button type="button" data-mono-download="${i+1}">Descargar PNG</button></div></article>`).join('');
    grid.querySelectorAll('[data-mono-preview]').forEach(btn=>btn.addEventListener('click',()=>{const n=Number(btn.dataset.monoPreview);root.dataset.previewSale=n;renderRecognition(n,q('monoPreviewCanvas'));q('monoPreviewCanvas')?.scrollIntoView({behavior:'smooth',block:'center'});}));
    grid.querySelectorAll('[data-mono-download]').forEach(btn=>btn.addEventListener('click',()=>downloadRecognition(Number(btn.dataset.monoDownload))));
  }

  function recognitionCopy(sale){
    if(sale===1) return ['¡FELICITACIONES!','Tu primera venta ya fue aprobada.','Has dado el primer paso hacia beneficios exclusivos.'];
    const level=levels.find(x=>x.sales===sale);
    if(level) return ['¡NUEVO NIVEL DESBLOQUEADO!',`Has logrado tu ${ordinal[sale-1].toLowerCase()} venta.`,`Ya puedes elegir un producto entre ${fmtCOP(level.min)} y ${fmtCOP(level.max)}.`];
    if(sale===7) return ['¡RESULTADO EXTRAORDINARIO!','Has logrado tu séptima venta.','Tu confianza y compromiso han llevado este programa a otro nivel.'];
    return ['¡FELICITACIONES!',`Has logrado tu ${ordinal[sale-1].toLowerCase()} venta.`,`Cada venta te acerca a beneficios más exclusivos.`];
  }
  function wrap(ctx,text,x,y,maxWidth,lineHeight){
    const words=String(text).split(' ');let line='';let yy=y;
    for(const word of words){const test=line+word+' ';if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line.trim(),x,yy);line=word+' ';yy+=lineHeight}else line=test}
    if(line)ctx.fillText(line.trim(),x,yy);return yy;
  }
  function drawLuxuryBow(ctx,cx,cy,scale=1){
    ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
    const ribbon=ctx.createLinearGradient(-220,-120,220,140);ribbon.addColorStop(0,'#061b47');ribbon.addColorStop(.35,'#0c4eb6');ribbon.addColorStop(.62,'#082c72');ribbon.addColorStop(1,'#031435');
    ctx.shadowColor='rgba(31,100,235,.65)';ctx.shadowBlur=34;ctx.fillStyle=ribbon;ctx.strokeStyle='rgba(162,199,255,.72)';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(-26,-18);ctx.bezierCurveTo(-92,-142,-270,-126,-244,-20);ctx.bezierCurveTo(-224,68,-102,56,-24,16);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(26,-18);ctx.bezierCurveTo(92,-142,270,-126,244,-20);ctx.bezierCurveTo(224,68,102,56,24,16);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(-36,20);ctx.lineTo(-116,224);ctx.lineTo(-12,172);ctx.lineTo(8,34);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(36,20);ctx.lineTo(116,224);ctx.lineTo(12,172);ctx.lineTo(-8,34);ctx.closePath();ctx.fill();ctx.stroke();
    const knot=ctx.createRadialGradient(-18,-18,8,0,0,74);knot.addColorStop(0,'#2b79e7');knot.addColorStop(.5,'#0c4aa7');knot.addColorStop(1,'#031739');ctx.fillStyle=knot;ctx.beginPath();ctx.roundRect(-62,-58,124,112,34);ctx.fill();ctx.stroke();
    ctx.restore();
  }
  function renderRecognition(sale,canvas){
    if(!canvas) return;
    sale=Math.max(1,Math.min(7,Number(sale)||1));
    const name=((q('monoClienteDescarga')?.value||q('monoCliente')?.value||'CLIENTE VIP').trim()||'CLIENTE VIP').toUpperCase();
    const distribution=((q('monoDistribucionDescarga')?.value||q('monoDistribucion')?.value||'TU DISTRIBUCIÓN').trim()||'TU DISTRIBUCIÓN').toUpperCase();
    canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
    const bg=ctx.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,'#01040b');bg.addColorStop(.38,'#061530');bg.addColorStop(.72,'#020817');bg.addColorStop(1,'#000207');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
    // silk-like light folds
    for(let i=0;i<7;i++){const x=80+i*170;const g=ctx.createLinearGradient(x-130,0,x+130,1350);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,i%2?'rgba(21,66,145,.08)':'rgba(255,255,255,.025)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(x-150,0,300,1350)}
    const aura=ctx.createRadialGradient(540,370,40,540,370,530);aura.addColorStop(0,'rgba(26,99,224,.32)');aura.addColorStop(.45,'rgba(12,47,112,.16)');aura.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=aura;ctx.fillRect(0,0,1080,900);
    // premium frames
    const gold=ctx.createLinearGradient(0,0,1080,0);gold.addColorStop(0,'#7b5418');gold.addColorStop(.22,'#f0d58e');gold.addColorStop(.5,'#b9852e');gold.addColorStop(.78,'#f6dfa1');gold.addColorStop(1,'#765015');ctx.strokeStyle=gold;ctx.lineWidth=4;ctx.strokeRect(42,42,996,1266);ctx.lineWidth=1;ctx.globalAlpha=.55;ctx.strokeRect(66,66,948,1218);ctx.globalAlpha=1;
    // corner ornaments
    ctx.strokeStyle=gold;ctx.lineWidth=3;[[92,92,1,1],[988,92,-1,1],[92,1258,1,-1],[988,1258,-1,-1]].forEach(([x,y,sx,sy])=>{ctx.beginPath();ctx.moveTo(x,y+sy*70);ctx.quadraticCurveTo(x,y,x+sx*70,y);ctx.stroke();ctx.beginPath();ctx.arc(x+sx*18,y+sy*18,6,0,Math.PI*2);ctx.stroke()});
    drawLuxuryBow(ctx,540,285,.86);
    ctx.textAlign='center';ctx.fillStyle='#e7c674';ctx.font='700 26px Georgia';ctx.letterSpacing='8px';ctx.fillText('PROGRAMA',540,118);ctx.letterSpacing='0px';ctx.font='900 70px Georgia';ctx.fillText('MOÑO AZUL',540,184);
    const [title,line1,line2]=recognitionCopy(sale);
    ctx.fillStyle='#ead085';ctx.font='800 34px Arial';ctx.fillText(title,540,535);
    ctx.fillStyle='#ffffff';ctx.font='900 52px Arial';wrap(ctx,name,540,620,820,62);
    ctx.strokeStyle='rgba(234,208,133,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(200,700);ctx.lineTo(880,700);ctx.stroke();
    ctx.fillStyle='#e9c86f';ctx.font='900 132px Georgia';ctx.fillText(String(sale).padStart(2,'0'),540,840);
    ctx.fillStyle='#f8fafc';ctx.font='800 36px Arial';ctx.letterSpacing='5px';ctx.fillText(`${ordinal[sale-1].toUpperCase()} VENTA`,540,900);ctx.letterSpacing='0px';
    ctx.fillStyle='#dce5f4';ctx.font='500 30px Arial';wrap(ctx,line1,540,988,790,43);
    ctx.fillStyle='#f0d58b';ctx.font='700 28px Arial';wrap(ctx,line2,540,1084,820,40);
    ctx.strokeStyle='rgba(234,208,133,.34)';ctx.beginPath();ctx.moveTo(250,1160);ctx.lineTo(830,1160);ctx.stroke();
    ctx.fillStyle='#f2d88d';ctx.font='700 26px Georgia';ctx.letterSpacing='3px';ctx.fillText(distribution,540,1212);ctx.letterSpacing='0px';
    ctx.fillStyle='#8fa0bb';ctx.font='500 21px Arial';ctx.fillText(new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'}),540,1255);
  }
  function downloadRecognition(sale){
    const canvas=document.createElement('canvas');renderRecognition(sale,canvas);
    const name=((q('monoClienteDescarga')?.value||q('monoCliente')?.value||'CLIENTE-VIP').trim()).replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9]+/g,'-');
    const a=document.createElement('a');a.download=`Programa-Mono-Azul-${sale}-venta-${name}.png`;a.href=canvas.toDataURL('image/png',1);a.click();
  }})();

// ADN BLEU en todos los módulos
(function initGlobalAdnBleu(){
  const libraries={
    orden:[
      'Una orden bien explicada no solo evita errores: transmite seguridad desde el primer minuto.',
      'La claridad financiera también es una forma de servir al cliente.',
      'Cuando dominas los números, negocias con tranquilidad y cierras con autoridad.',
      'La confianza crece cuando cada cifra coincide con lo que prometiste.',
      'El profesionalismo se nota en los detalles que otros suelen pasar por alto.',
      'No corras al llenar una orden: la precisión protege la venta y la relación.',
      'Una venta sólida comienza con una conversación clara y termina con una orden correcta.',
      'Cada cálculo exacto fortalece la percepción de valor de tu asesoría.',
      'El cliente recuerda cómo lo hiciste sentir, pero también agradece que todo haya quedado claro.',
      'La excelencia comercial también se escribe en números bien presentados.',
      'Revisar dos veces tarda minutos; corregir una mala orden puede costar días.',
      'La transparencia no debilita el cierre: lo hace sostenible.',
      'Una orden sin dudas le permite al cliente disfrutar su decisión.',
      'La precisión es una disciplina silenciosa que construye reputación.',
      'No entregues solo productos: entrega certeza, acompañamiento y confianza.'
    ],
    cuota:[
      'Una cuota clara evita confusión, y una negociación clara acerca al cliente a la decisión.',
      'No vendas una cifra mensual: muestra la solución que esa cifra hace posible.',
      'Cuando el cliente entiende su opción, deja de defenderse y empieza a decidir.',
      'La mejor cuota es la que el cliente puede honrar con tranquilidad.',
      'Ayudar a decidir también significa cuidar la capacidad de pago.',
      'La flexibilidad abre puertas; la claridad mantiene esas puertas abiertas.',
      'Un buen asesor convierte números complejos en decisiones sencillas.',
      'El valor no está en bajar la cuota, sino en elevar la comprensión del beneficio.',
      'Escucha primero la realidad del cliente y luego construye la alternativa.',
      'Negociar con empatía crea clientes que vuelven y recomiendan.',
      'La cuota correcta no presiona: encaja.',
      'Cada opción debe acercar al cliente a una compra responsable.',
      'La seguridad con la que explicas la cuota se convierte en seguridad para comprar.',
      'No improvises números frente al cliente; prepárate para liderar la conversación.',
      'Una decisión cómoda hoy puede convertirse en una relación duradera mañana.'
    ],
    agregados:[
      'Un agregado bien calculado evita reprocesos y ayuda a que el cliente entienda su nuevo compromiso.',
      'El cliente que vuelve ya confió una vez; tu tarea es honrar aún más esa confianza.',
      'Agregar valor no es vender por vender: es completar mejor la experiencia.',
      'Cada nueva compra debe sentirse como una evolución, no como una presión.',
      'Conocer el saldo demuestra preparación y respeto por la realidad del cliente.',
      'La recompra nace de una primera experiencia extraordinaria.',
      'Antes de ofrecer más, confirma cuánto valor ha recibido el cliente hasta hoy.',
      'Un agregado inteligente resuelve una necesidad que ya estaba esperando respuesta.',
      'La confianza acumulada vale más que cualquier descuento improvisado.',
      'El mejor momento para ampliar una solución es cuando el cliente ya reconoce su valor.',
      'Una explicación simple convierte un cálculo complejo en una decisión cómoda.',
      'Cuida la relación como si cada agregado fuera una nueva primera venta.',
      'La fidelización comienza cuando el servicio continúa después de la entrega.',
      'No busques aumentar el ticket; busca aumentar el resultado del cliente.',
      'Un cliente bien atendido no siente que le vendieron más: siente que lo asesoraron mejor.'
    ],
    nombres:[
      'Quien sabe cuántos nombres necesita, deja de esperar resultados y empieza a construirlos.',
      'Sin nombres no hay paraíso; con nombres trabajados hay futuro.',
      'Tu siguiente venta probablemente ya existe en una conversación que aún no has iniciado.',
      'La agenda vacía no se llena con preocupación, se llena con prospección.',
      'Los nombres son semillas: el seguimiento determina cuáles se convierten en resultados.',
      'No necesitas conocer a todo el mundo; necesitas trabajar bien a quienes ya conoces.',
      'La abundancia comienza cuando dejas de administrar escasez en tu lista.',
      'Cada nombre nuevo reduce la dependencia de una sola oportunidad.',
      'Prospectar no es molestar: es abrir una posibilidad con respeto y convicción.',
      'La actividad de hoy protege el volumen de las próximas semanas.',
      'Tu lista no se termina; se expande cada vez que entregas una buena experiencia.',
      'El miedo a llamar cuesta más oportunidades que cualquier respuesta negativa.',
      'No califiques a las personas antes de permitirles conocer la oportunidad.',
      'Una semana extraordinaria casi siempre fue preparada con nombres días antes.',
      'La constancia en los nombres convierte metas grandes en acciones diarias.'
    ],
    ascenso:[
      'Todos los caminos deben conducir a mejorar nuestro 4 en 14.',
      'El ascenso no ocurre el día del reconocimiento; ocurre en cada día que decidiste cumplir.',
      'La meta te muestra la distancia, pero la disciplina construye el puente.',
      'No persigas el rango: conviértete en la persona capaz de sostenerlo.',
      'Cada mes mínimo protege la consistencia que tu próximo nivel necesita.',
      'El volumen es el resultado visible de hábitos que nadie aplaude.',
      'Tu siguiente ascenso comienza cuando tu estándar deja de negociar con tus excusas.',
      'Avanzar lento con dirección siempre será mejor que correr sin sistema.',
      'La presión disminuye cuando conviertes la meta mensual en actividad semanal.',
      'Un rango nuevo exige una identidad nueva antes de exigir un resultado nuevo.',
      'No esperes sentirte listo: el proceso te prepara mientras avanzas.',
      'El liderazgo empieza cuando tu compromiso deja de depender del ánimo.',
      'Cada seguimiento pendiente es una parte del ascenso que aún no has construido.',
      'El reconocimiento dura un momento; la transformación permanece.',
      'La cima se alcanza con actividad, pero se sostiene con carácter.'
    ],
    ticket:[
      'Los grandes premios no cambian la disciplina: la hacen visible.',
      'Cada semana cuenta cuando la competencia se gana por acumulación.',
      'No mires cuánto falta; identifica qué actividad debes repetir hoy.',
      'El Ticket Dorado premia el resultado, pero primero transforma el estándar.',
      'La competencia saludable revela capacidades que la comodidad mantenía escondidas.',
      'Tu posición de hoy no define tu cierre; tu actividad de hoy sí lo influencia.',
      'Un gran cuatrimestre se construye con cuatro meses que no se abandonan.',
      'No compitas contra nombres: compite contra tu versión anterior.',
      'La constancia hace posible que una meta ambiciosa deje de parecer lejana.',
      'Cada venta suma dos veces: al volumen y a la confianza con la que continúas.',
      'El premio inspira, pero el hábito que desarrollas vale todavía más.',
      'Mantente en movimiento incluso cuando el tablero todavía no refleje tu esfuerzo.',
      'Los cierres extraordinarios pertenecen a quienes sostienen la actividad ordinaria.',
      'No necesitas un día perfecto; necesitas no desaparecer del proceso.',
      'La oportunidad permanece abierta mientras tú permanezcas activo.'
    ],
    sistema122:[
      'Tu ingreso crece cuando ayudas a otros a producir su primera victoria.',
      'Patrocinar no es sumar personas: es multiplicar capacidades.',
      'La primera venta de un nuevo socio puede cambiar la percepción que tiene de sí mismo.',
      'El residual comienza con una conversación, pero se sostiene con acompañamiento.',
      'No busques muchos directos sin dirección; construye directos con sistema.',
      'Cada socio bien activado puede convertirse en una nueva historia familiar.',
      'El 2% es una consecuencia; el verdadero activo es una persona creciendo contigo.',
      'Tu volumen personal protege el derecho a participar del crecimiento que impulsas.',
      'El patrocinador que acompaña crea cultura; el que solo inscribe crea dependencia.',
      'No hay límite para el desarrollo cuando tampoco hay límite para servir.',
      'La duplicación ocurre cuando lo sencillo se repite con excelencia.',
      'Ayuda a lograr la primera venta rápido: la velocidad inicial construye creencia.',
      'Un socio activo vale más que una lista larga de personas desconectadas.',
      'Construir profundidad exige paciencia, ejemplo y conversaciones constantes.',
      'El mejor ingreso residual nace de liderazgo activo, no de expectativa pasiva.'
    ],
    desarrollo:[
      'Asociar no es pedir un favor: es abrirle una puerta a alguien con hambre de crecer.',
      'No busques personas desocupadas; busca personas inconformes con su siguiente nivel.',
      'Una invitación poderosa despierta curiosidad sin prometer lo que aún no se ha construido.',
      'El desarrollo comienza cuando dejas de pensar solo en tus ventas.',
      'Cada líder que formas amplía el impacto que tú solo podrías alcanzar.',
      'La humildad aprende, el trabajo ejecuta y la ambición saludable sostiene.',
      'No necesitas convencer a todos; necesitas encontrar a quienes ya están buscando más.',
      'Una entrevista puede parecer pequeña y terminar cambiando generaciones.',
      'El seguimiento después de la invitación demuestra que tu visión es seria.',
      'La duplicación exige que enseñes lo que haces y hagas lo que enseñas.',
      'Construye personas antes de construir organigramas.',
      'El candidato correcto muchas veces está ocupado porque ya sabe producir.',
      'Tu historia puede inspirar, pero tu sistema debe darle una ruta para avanzar.',
      'Invitar con convicción es compartir una posibilidad, no perseguir aprobación.',
      'El legado empieza cuando alguien crece porque tú decidiste creer primero.'
    ],
    moto:[
      'Los grandes premios no se ganan en un solo día: se construyen con actividad sostenida.',
      'Cada ticket representa una decisión de no abandonar el ritmo.',
      'El premio final hace visible todo lo que nadie vio durante el proceso.',
      'No esperes a la última semana para construir lo que exige meses de constancia.',
      'La actividad acumulada convierte posibilidades pequeñas en resultados extraordinarios.',
      'Quien celebra a los ganadores también aprende el camino para convertirse en uno.',
      'La competencia termina; el estándar que desarrollaste puede quedarse para siempre.',
      'Cada venta te acerca al premio y te fortalece para metas aún mayores.',
      'No dependas de la suerte: aumenta tus probabilidades con ejecución.',
      'El verdadero motor de la competencia es la disciplina diaria.',
      'Mira a los ganadores como evidencia de que el sistema sí recompensa la constancia.',
      'Una meta emocionante puede despertar una versión de ti que aún no conocías.',
      'Los resultados acumulados siempre terminan hablando más fuerte que las excusas.',
      'La próxima historia de victoria puede comenzar con tu actividad de hoy.',
      'Prepárate antes de que anuncien el premio; los ganadores casi siempre empiezan primero.'
    ],
    ingresos:[
      'El ingreso crece cuando la actividad crece; convierte tu meta de dinero en meta de volumen y nombres.',
      'Una cifra deseada sin un plan semanal es solo una intención.',
      'No persigas dinero directamente: construye el valor y la actividad que lo producen.',
      'Tu proyección debe inspirarte, pero también decirte exactamente qué hacer mañana.',
      'El volumen convierte sueños abstractos en resultados medibles.',
      'Cada nombre trabajado es una pequeña parte del ingreso que quieres construir.',
      'La ambición saludable no se avergüenza de ponerle número a sus metas.',
      'Ganar más exige aprender a producir más valor de manera consistente.',
      'La meta mensual se vuelve posible cuando deja de depender de los últimos días.',
      'No confundas esperanza con estrategia: proyecta, divide y ejecuta.',
      'Tu ingreso futuro está conectado con las conversaciones que hoy estás evitando.',
      'Una meta grande necesita un calendario, no solo entusiasmo.',
      'El dinero amplifica hábitos; construye primero hábitos que merezcan ser amplificados.',
      'No reduzcas la meta por miedo: mejora el sistema que debe sostenerla.',
      'La libertad financiera comienza cuando entiendes cómo se produce cada peso.'
    ],
    admin:[
      'La disciplina financiera no limita el crecimiento: lo protege.',
      'No todo lo que entra está disponible para gastar.',
      'La reinversión convierte el ingreso de hoy en oportunidades para mañana.',
      'Quien administra con visión puede sostener lo que logró con esfuerzo.',
      'Separar primero evita lamentar después.',
      'Tu negocio necesita combustible antes de entregarte comodidad.',
      'La riqueza no depende solo de cuánto produces, sino de cuánto conservas y multiplicas.',
      'Cada peso debe recibir una misión antes de que aparezca una tentación.',
      'La caja del negocio no es una extensión de la billetera personal.',
      'Administrar bien en pequeño te prepara para liderar cifras mayores.',
      'El crecimiento sin control financiero puede convertirse en una ilusión costosa.',
      'Reinvertir no es perder dinero: es contratar al futuro para que trabaje por ti.',
      'La estabilidad se construye cuando los buenos meses financian los meses de expansión.',
      'No eleves tus gastos al mismo ritmo que elevas tus ingresos.',
      'La libertad llega cuando el dinero deja de desaparecer sin dirección.'
    ],
    toppers:[
      'El reconocimiento honra el resultado. La disciplina construye el camino para volver a estar aquí.',
      'El podio no separa a los capaces de los incapaces; muestra quién sostuvo mejor la actividad.',
      'Celebra sin compararte y observa sin justificarte.',
      'Cada Topper demuestra que el estándar puede elevarse otra vez.',
      'El ranking cambia; la excelencia que desarrollas puede permanecer.',
      'No mires el podio para sentirte menos: míralo para recordar lo que es posible.',
      'Reconocer a otros fortalece una cultura donde todos quieren crecer.',
      'La posición es temporal; el carácter construido durante la competencia es permanente.',
      'Quien hoy aparece primero también tuvo días donde comenzó desde cero.',
      'El verdadero Topper inspira resultados más allá de su propio nombre.',
      'La excelencia no necesita ruido, pero merece reconocimiento.',
      'Subir posiciones exige hacer hoy algo distinto a lo que hiciste ayer.',
      'El podio se conquista con volumen y se honra con humildad.',
      'Tu nombre puede estar aquí cuando tu actividad esté a la altura de tu visión.',
      'El próximo reconocimiento comienza en la próxima llamada.'
    ]
  };
  Object.entries(libraries).forEach(([id,phrases])=>{
    const screen=document.getElementById(id);
    if(!screen || screen.querySelector('.adn-chat-bubble')) return;
    const oldTabs=screen.querySelector('.module-tabs');
    const oldPanel=screen.querySelector('.module-adn-panel');
    if(oldTabs) oldTabs.remove();
    if(oldPanel) oldPanel.remove();
    screen.classList.remove('adn-mode');

    const bubble=document.createElement('aside');
    bubble.className='adn-chat-bubble';
    bubble.setAttribute('aria-live','polite');
    bubble.innerHTML=`<div class="adn-chat-head"><span class="adn-diamond">💎</span><strong>ADN BLEU</strong></div><div class="adn-typing"><i></i><i></i><i></i></div><p></p><button type="button" aria-label="Mostrar otra frase ADN BLEU">Otra frase →</button>`;
    screen.appendChild(bubble);

    let idx=Math.floor(Math.random()*phrases.length);
    const quote=bubble.querySelector('p');
    quote.textContent=phrases[idx];
    bubble.querySelector('button').addEventListener('click',()=>{
      bubble.classList.add('is-typing');
      setTimeout(()=>{
        idx=(idx+1)%phrases.length;
        quote.textContent=phrases[idx];
        bubble.classList.remove('is-typing');
      },520);
    });
  });
})();


// ===== Experto en 4 en 14 =====
(()=>{
  const screen=document.getElementById('experto414');
  if(!screen) return;
  const tabs=[...screen.querySelectorAll('.expert-tab')];
  const panels=[...screen.querySelectorAll('.expert-panel')];
  tabs.forEach(btn=>btn.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.toggle('active',x===btn));
    panels.forEach(p=>p.classList.toggle('active',p.id===`expertTab-${btn.dataset.expertTab}`));
  }));
  const subtabs=[...screen.querySelectorAll('.instant-subtab')];
  const contents=[...screen.querySelectorAll('.instant-content')];
  subtabs.forEach(btn=>btn.addEventListener('click',()=>{
    subtabs.forEach(x=>x.classList.toggle('active',x===btn));
    contents.forEach(p=>p.classList.toggle('active',p.id===`instantTab-${btn.dataset.instantTab}`));
  }));
  const learned=new Set();
  const bar=document.getElementById('expertProgressBar');
  const label=document.getElementById('expertProgressLabel');
  screen.querySelectorAll('.learn-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const n=btn.dataset.learn;
    if(learned.has(n)){learned.delete(n);btn.classList.remove('learned');btn.textContent='Marcar paso como aprendido';}
    else{learned.add(n);btn.classList.add('learned');btn.textContent='✓ Paso aprendido';}
    const pct=Math.round(learned.size/8*100);bar.style.width=pct+'%';label.textContent=`${learned.size} de 8 pasos`;
  }));
  async function copyText(text,button){
    try{await navigator.clipboard.writeText(text);const old=button.textContent;button.textContent='✓ Copiado';setTimeout(()=>button.textContent=old,1500)}catch(e){button.textContent='Selecciona y copia'}
  }
  document.getElementById('copyChristianSpeech')?.addEventListener('click',e=>copyText(document.getElementById('christianSpeechText').innerText,e.currentTarget));
  screen.querySelector('.copy-activation')?.addEventListener('click',e=>copyText(document.getElementById('activationSpeech').innerText,e.currentTarget));

  const scenarios=[
    {q:'El cliente dice: “Yo mañana les escribo y te cuento.”',opts:['Aceptar y salir con los datos','Explicar que para asegurar que tú visites a su familia deben agendar ahora','Enviar una cadena de WhatsApp al día siguiente'],a:1,why:'La instantánea aprovecha la confianza y la emoción del momento. Lidera la llamada ahora.'},
    {q:'Ya calificaste los prospectos. ¿A quién llamas primero?',opts:['Al prospecto número 1','Al contacto 6 o 7 para entrar en ritmo','A nadie hasta sentirte completamente seguro'],a:1,why:'Las primeras llamadas sirven para ganar naturalidad sin arriesgar a los prospectos más valiosos.'},
    {q:'El prospecto pregunta: “¿Tengo que comprar algo?”',opts:['Explicar precios y planes','Decir que no hay obligación, que es una experiencia gratuita y agendar','Prometer que no se mostrará ningún producto'],a:1,why:'No vendas por teléfono. Reduce la tensión, explica lo mínimo y confirma la visita.'},
    {q:'La primera persona no contesta.',opts:['Terminar el intento','Esperar al día siguiente','Llamar inmediatamente al siguiente contacto'],a:2,why:'La instantánea se sostiene por ritmo. Una llamada fallida no puede detener el proceso.'},
    {q:'El cliente toma el celular y se va a otra habitación.',opts:['Dejarlo explicar todo','Pedirle amablemente que solo salude, te presente y entregue el teléfono','Enviar un texto después'],a:1,why:'Una explicación larga puede confundir o quemar el contacto. La instrucción debe ser breve.'}
  ];
  let current=0,score=0;
  const q=document.getElementById('trainerScenario'),opts=document.getElementById('trainerOptions'),fb=document.getElementById('trainerFeedback'),start=document.getElementById('trainerStart');
  function showScenario(){const s=scenarios[current];q.textContent=s.q;opts.innerHTML='';fb.textContent='';fb.className='trainer-feedback';s.opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...opts.children].forEach(x=>x.disabled=true);const good=i===s.a;if(good)score++;fb.className='trainer-feedback '+(good?'good':'bad');fb.textContent=(good?'✓ Excelente. ':'⚠ Se puede mejorar. ')+s.why;start.textContent=current===scenarios.length-1?`Ver resultado (${score}/${scenarios.length})`:'Siguiente situación →';start.style.display='inline-flex'};opts.appendChild(b)});start.style.display='none'}
  start?.addEventListener('click',()=>{if(start.dataset.started!=='1'){start.dataset.started='1';current=0;score=0;showScenario();return}if(current<scenarios.length-1){current++;showScenario()}else{q.textContent=`Entrenamiento completado: ${score} de ${scenarios.length}`;opts.innerHTML='';fb.textContent=score>=4?'Muy buen criterio. Ahora llévalo a una demostración real.':'Repasa el Speech de Christian Prieto y vuelve a intentarlo.';start.textContent='Repetir entrenamiento';start.dataset.started='0';start.style.display='inline-flex'}});

  const quiz=[
    ['¿Cuál es la meta completa del 4 en 14?',['4 nombres y una venta','4 visitas, mínimo una venta y 14 días','14 visitas y 4 ventas'],1],
    ['¿Cuál es el objetivo del puente?',['Pedir teléfonos rápido','Aliviar el estrés post negociación y crear transición','Cerrar una segunda venta'],1],
    ['¿Qué diferencia hay entre pedir y anotar nombres?',['Ninguna','Pedir busca calidad; anotar solo llena espacios','Anotar siempre es mejor'],1],
    ['¿Qué círculo debe priorizarse?',['Conocidos lejanos','Compañeros de trabajo','Familiares y núcleo de máxima confianza'],2],
    ['¿Por qué se califican los prospectos?',['Para conversar más','Para proteger tiempo y trabajar mejores mercados','Para eliminar todos los nombres'],1],
    ['Después de una venta dentro del programa, ¿qué puede faltar?',['Nada','Las visitas necesarias hasta completar cuatro','Otro premio'],1],
    ['¿Con qué contacto conviene iniciar la instantánea?',['Siempre el número 1','Uno intermedio, como el 6 o 7','El contacto más difícil'],1],
    ['¿Cuál es la frase más efectiva?',['¿Será que podemos llamar?','Vamos a llamar de una vez','Me avisa mañana'],1],
    ['¿Cuál es el plazo ideal para la visita instantánea?',['Hoy, mañana o máximo pasado mañana','En dos semanas','Cuando el prospecto recuerde'],0],
    ['Si no contestan, ¿cuál es la segunda opción?',['Cadena genérica','Mensaje de voz personal','No hacer nada'],1],
    ['¿Qué busca la llamada instantánea?',['Cerrar la venta por teléfono','Explicar precios','Abrir la puerta y agendar'],2],
    ['¿Cuándo se hace seguimiento?',['Aproximadamente a las 48 horas','Al mes','Solo si el cliente llama'],0]
  ];
  const quizBox=document.getElementById('expertQuiz');
  quiz.forEach((item,idx)=>{const d=document.createElement('div');d.className='quiz-question';d.innerHTML=`<strong>${idx+1}. ${item[0]}</strong>`+item[1].map((o,i)=>`<label><input type="radio" name="eq${idx}" value="${i}"> ${o}</label>`).join('');quizBox.appendChild(d)});
  document.getElementById('gradeExpertQuiz')?.addEventListener('click',()=>{let correct=0;quiz.forEach((item,idx)=>{const v=screen.querySelector(`input[name="eq${idx}"]:checked`);if(v&&Number(v.value)===item[2])correct++});const pct=Math.round(correct/quiz.length*100);const result=document.getElementById('expertQuizResult');document.getElementById('examScore').textContent=pct+'%';result.className='quiz-result show';result.innerHTML=pct>=90?`<strong>🏅 Experto en 4 en 14</strong><p>${correct} de ${quiz.length} respuestas correctas. Estás listo para llevar el sistema a la práctica y enseñarlo con el ejemplo.</p>`:pct>=70?`<strong>Muy buen avance</strong><p>${correct} de ${quiz.length}. Repasa especialmente Instantánea y Activación antes de repetir.</p>`:`<strong>La práctica apenas comienza</strong><p>${correct} de ${quiz.length}. Recorre nuevamente los ocho pasos y vuelve a presentar la evaluación.</p>`});
})();

// ===== Bleu One v2.1 · Gimnasio 4 en 14 =====
(()=>{
  const screen=document.getElementById('gimnasio414');
  const expertScreen=document.getElementById('experto414');
  const stage=document.getElementById('gymStage');
  if(!screen||!stage) return;

  const state={order:0,objections:0,markets:0,instant:0,total:0};
  const steps=['El puente','Presentar los premios','Pedir nombres','Calificar los nombres','Explicar el programa','Instantánea y activación','Seguimiento','Mover programas'];
  const daily=[
    'Haz hoy una instantánea completa antes de salir de la casa del cliente.',
    'Consigue un programa donde al menos cinco nombres pertenezcan al primer círculo de influencia.',
    'Pregunta hoy por el jefe como contacto estratégico en al menos un programa.',
    'Practica el speech de activación en menos de 35 segundos.',
    'Califica diez nombres antes de aceptar una sola visita.',
    'Recupera hoy un programa que se haya enfriado.',
    'Explica correctamente la fórmula: 4 visitas + mínimo 1 venta + 14 días.',
    'Haz seguimiento a un programa dentro de las próximas 48 horas.'
  ];
  const objections=[
    {cat:'Pedir nombres',q:'“No quiero molestar a mi familia.”',opts:['Aceptar y pedir conocidos lejanos','Explicar que no se les venderá por teléfono y guiarlos hacia personas de confianza','Pedir únicamente compañeros de trabajo'],a:1,why:'El objetivo no es presionar, sino transferir confianza. El primer círculo reduce cancelaciones y mejora la calidad del programa.'},
    {cat:'Pedir nombres',q:'“No sé quién podría estar interesado.”',opts:['Preguntar quién compraría','Guiar por perfiles: quién cocina, cuida su salud, vive en familia o disfruta recibir visitas','Anotar cualquier nombre'],a:1,why:'No se adivina quién comprará. Se identifican perfiles con mejor probabilidad de disfrutar la experiencia.'},
    {cat:'Primer círculo',q:'“Prefiero no dar a mis hermanos.”',opts:['Insistir de forma agresiva','Preguntar qué hermano confiaría más en su recomendación y explicarle por qué la cercanía ayuda','Cambiar de tema'],a:1,why:'La guía debe ser segura, pero respetuosa. La cercanía fortalece la asistencia y la confianza.'},
    {cat:'Jefe',q:'“A mi jefe no le interesan estas cosas.”',opts:['Descartarlo sin preguntar','Explicar que el detalle será de parte del cliente y que la experiencia puede ser un gesto de reconocimiento','Decir que seguro comprará'],a:1,why:'El valor está en el gesto personal, no en prometer una compra.'},
    {cat:'Instantánea',q:'“Yo los llamo mañana.”',opts:['Aceptar','Explicar que para asegurar que tú visites a su familia deben agendar de una vez','Enviar una cadena más tarde'],a:1,why:'La emoción y la confianza están en su punto más alto ahora. Mañana el programa ya estará más frío.'},
    {cat:'Instantánea',q:'“¿Será que sí contesta?”',opts:['Decir “no sé”','Responder “vamos a marcarle de una vez y lo comprobamos”','Esperar hasta la próxima semana'],a:1,why:'La instrucción sutil mantiene el ritmo. No se pide permiso para intentar.'},
    {cat:'Instantánea',q:'“Eso es lo de las ollas, ¿cierto?”',opts:['Dar una explicación extensa','Decir que es una experiencia gratuita, sin obligación, y volver al agendamiento','Hablar de precios'],a:1,why:'La llamada busca abrir la puerta, no vender por teléfono.'},
    {cat:'Instantánea',q:'“¿Tengo que comprar algo?”',opts:['Prometer que no verá productos','Aclarar que no tiene obligación de compra, que recibirá el detalle y vivirá una experiencia gratuita','Cambiar de tema'],a:1,why:'Reduce la tensión sin dar información innecesaria.'},
    {cat:'Activación',q:'“No me contestaron.”',opts:['Dar el programa por muerto','Enviar un mensaje de voz personal y, si hace falta, una fotografía real de la experiencia','Enviar un texto genérico'],a:1,why:'La llamada es primera opción; la voz y la fotografía mantienen la confianza cuando no responden.'},
    {cat:'Seguimiento',q:'“Creo que ya no voy a completar las cuatro visitas.”',opts:['Cancelar el programa','Revisar cuáles visitas siguen vivas y reemplazar las que se enfriaron','Esperar que el cliente lo resuelva'],a:1,why:'El seguimiento mueve el programa. No se abandona sin revisar reemplazos y nuevas fechas.'},
    {cat:'Premios',q:'“No me interesan los premios.”',opts:['Omitir el programa','Mostrar el valor de la experiencia y preguntar qué beneficio sería útil para su hogar','Decir que tiene que escoger uno'],a:1,why:'El premio se conecta con una necesidad o emoción, no se impone.'},
    {cat:'Calificar',q:'“Él recibe a cualquiera, anótelo.”',opts:['Anotarlo de inmediato','Preguntar ocupación, núcleo familiar, hábitos de cocina y relación antes de decidir','Asumir que es buen mercado'],a:1,why:'Aceptar una visita no convierte automáticamente a alguien en un prospecto de calidad.'}
  ];
  const markets=[
    {name:'María',chips:['42 años','Casada','2 hijos','Trabaja','Cocina a diario'],q:'¿Qué tan atractivo es este mercado?',opts:['Bajo','Medio','Alto'],a:2,why:'Tiene núcleo familiar, hábitos de cocina y capacidad de decisión compartida.'},
    {name:'Carlos',chips:['28 años','Vive solo','No cocina','Sin empleo actual'],q:'¿Invertirías una demostración completa?',opts:['Sí, porque aceptó','Solo después de profundizar mucho más','Es prioridad alta'],a:1,why:'Aceptar no basta. El perfil necesita más calificación antes de invertir tiempo y recursos.'},
    {name:'Sandra',chips:['55 años','Docente','Casada','Le gusta cocinar','Red familiar amplia'],q:'¿Qué línea de mercado puede abrir?',opts:['Primer círculo y colegas calificados','Solo conocidos lejanos','Ninguna'],a:0,why:'Combina confianza familiar, estabilidad y una red social potencialmente valiosa.'},
    {name:'Julián',chips:['36 años','Empresario','Casado','No cocina','Su pareja cocina'],q:'¿Qué pregunta es indispensable?',opts:['Cuánto gana','Si su pareja estará presente y participa en decisiones','Qué carro tiene'],a:1,why:'El núcleo decisor debe estar presente para que la visita sea productiva.'},
    {name:'Luisa',chips:['31 años','Vive con su madre','Ambas cocinan','Trabaja desde casa'],q:'¿Cómo la clasificarías?',opts:['Mercado bajo','Mercado con potencial familiar','No venta automática'],a:1,why:'Tiene convivencia, uso frecuente de cocina y cercanía familiar.'},
    {name:'Pedro',chips:['47 años','Separado','Vive solo','Come siempre fuera'],q:'¿Qué harías?',opts:['Agendar sin preguntar','Explorar si existe otro hogar cercano al que pueda recomendar','Convertirlo en prioridad'],a:1,why:'Puede no ser el mejor hogar para visitar, pero sí abrir una recomendación de mayor calidad.'}
  ];
  const errors=[
    {q:'Cliente: “Yo los llamo después.” Asesor: “Bueno, me cuenta.”',opts:['No explicó premios','Cedió el liderazgo y dejó enfriar la instantánea','No pidió el jefe'],a:1,why:'Debía guiar: “Vamos a llamar de una vez para asegurar que yo los visite.”'},
    {q:'El cliente toma el celular, se va a otra habitación y explica durante cinco minutos.',opts:['No hay error','El asesor perdió el control de la transferencia y puede quemar el contacto','Debió hablar de precios'],a:1,why:'La instrucción debe ser: saludar, presentar y entregar el teléfono.'},
    {q:'El asesor llama primero al prospecto número 1 y ambos están nerviosos.',opts:['Empezó por el mejor prospecto sin entrar en ritmo','No presentó premios','Debió enviar un texto'],a:0,why:'Conviene iniciar con el contacto 6 o 7 y luego pasar a los mejores.'},
    {q:'El asesor anotó diez nombres sin preguntar ocupación, convivencia ni hábitos de cocina.',opts:['Hizo el programa más rápido','Confundió anotar nombres con pedir nombres de calidad','Eso mejora el mercado'],a:1,why:'Una hoja llena no vale si está llena de próximas cancelaciones o visitas improductivas.'}
  ];
  const speeches=[
    {q:'“Señora Andrea, ¿a usted le gustaría que estas personas las visitara…”',opts:['cualquier asesor disponible?','yo, que ya me conoce, o una persona desconocida?','alguien la próxima semana?'],a:1,why:'La pregunta hace que el cliente reconozca y verbalice la confianza que ya existe.'},
    {q:'Después de que el cliente responde “usted”, la siguiente pregunta es:',opts:['¿Entonces me da los teléfonos?','¿Por qué?','¿Cuánto cree que comprarían?'],a:1,why:'El “¿por qué?” hace que el cliente confirme que confía en ti.'},
    {q:'La instrucción correcta antes de marcar es:',opts:['¿Será que podemos llamar?','Vamos a llamar de una vez a su tía Carolina','Me avisa si ella acepta'],a:1,why:'La seguridad se transmite con una instrucción sutil, no con una pregunta insegura.'},
    {q:'Al recibir el teléfono, el objetivo principal es:',opts:['Explicar todo el programa','Agendar la visita para hoy, mañana o máximo pasado mañana','Cerrar la venta'],a:1,why:'La llamada abre la puerta. La experiencia presencial hace el resto.'}
  ];
  const challenges=document.getElementById('dailyChallenge');
  function setChallenge(){challenges.textContent=daily[Math.floor(Math.random()*daily.length)]}
  setChallenge();
  document.getElementById('newDailyChallenge')?.addEventListener('click',setChallenge);

  function updateMastery(area,good){
    if(good){state[area]=Math.min(100,state[area]+20);state.total++}
    document.getElementById('masteryOrder').style.width=state.order+'%';
    document.getElementById('masteryObjections').style.width=state.objections+'%';
    document.getElementById('masteryMarkets').style.width=state.markets+'%';
    document.getElementById('masteryInstant').style.width=state.instant+'%';
    const avg=Math.round((state.order+state.objections+state.markets+state.instant)/4);
    document.getElementById('masteryScore').textContent=avg+'%';
    screen.querySelector('.mastery-ring')?.style.setProperty('--mastery',(avg*3.6)+'deg');
  }
  function optionGame(title,kicker,item,area,onNext){
    stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">${kicker}</span><h3>${title}</h3></div><span class="badge">Decisión práctica</span></div><div class="game-card"><span class="question-label">¿Qué responderías?</span><div class="game-question">${item.q}</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="bleu-advice" hidden><strong>💎 Bleu te aconseja</strong><span></span></div><button class="primary-action next-game" hidden>Siguiente <span>→</span></button></div>`;
    const box=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),ad=stage.querySelector('.bleu-advice'),next=stage.querySelector('.next-game');
    item.opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;b.classList.add(good?'correct':'wrong');if(!good)box.children[item.a].classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.innerHTML=(good?'✓ <strong>Excelente.</strong> ':'⚠ <strong>Se puede mejorar.</strong> ')+item.why;ad.hidden=false;ad.querySelector('span').textContent=good?'No memorices solamente la respuesta: entiende qué paso del sistema estás protegiendo.':'El error no está en equivocarte aquí; está en repetirlo frente a un cliente real.';next.hidden=false;updateMastery(area,good)};box.appendChild(b)});
    next.onclick=onNext;
  }
  // Selección sin repeticiones: recorre todo el banco antes de volver a empezar.
  const randomBags=new Map();
  let randomFlow=false;
  function pickFresh(list,key){
    let bag=randomBags.get(key);
    if(!bag||bag.length===0){
      bag=list.map((_,i)=>i);
      for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}
      const last=randomBags.get(key+'-last');
      if(bag.length>1&&bag[0]===last){[bag[0],bag[1]]=[bag[1],bag[0]]}
    }
    const idx=bag.shift();
    randomBags.set(key,bag);
    randomBags.set(key+'-last',idx);
    return list[idx];
  }
  function nextFor(standardRenderer){return randomFlow?renderRandom:standardRenderer}
  function renderObjection(){const item=pickFresh(objections,'objections');optionGame('Laboratorio de objeciones','Objeción · '+item.cat,item,'objections',nextFor(renderObjection))}
  function renderObjectionFixed(){const item=pickFresh(objections,'objections');optionGame('Laboratorio de objeciones','Objeción · '+item.cat,item,'objections',nextFor(renderObjectionFixed))}
  function renderMarket(){const item=pickFresh(markets,'markets');stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Juego de mercados</span><h3>${item.name}</h3></div><span class="badge">Califica antes de agendar</span></div><div class="game-card"><div class="profile-chips">${item.chips.map(x=>`<span>${x}</span>`).join('')}</div><div class="game-question">${item.q}</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="bleu-advice" hidden><strong>💎 Bleu te aconseja</strong><span>Una visita aceptada no siempre es una visita productiva. Protege tu tiempo.</span></div><button class="primary-action next-game" hidden>Otro perfil <span>→</span></button></div>`;const box=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),next=stage.querySelector('.next-game'),ad=stage.querySelector('.bleu-advice');item.opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;b.classList.add(good?'correct':'wrong');if(!good)box.children[item.a].classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.textContent=(good?'✓ ':'⚠ ')+item.why;ad.hidden=false;next.hidden=false;updateMastery('markets',good)};box.appendChild(b)});next.onclick=nextFor(renderMarket)}
  function renderError(){const item=pickFresh(errors,'errors');optionGame('Detecta el error','Conversación real',item,'instant',nextFor(renderError))}
  function renderSpeech(){const item=pickFresh(speeches,'speeches');optionGame('Completa el speech','Laboratorio del speech experto',item,'instant',nextFor(renderSpeech))}
  function renderOrder(){let shuffled=[...steps].sort(()=>Math.random()-.5),chosen=[];stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">La magia del orden</span><h3>Orden perfecto</h3></div><span class="badge">Toca las tarjetas en secuencia</span></div><div class="game-card"><p>Selecciona los ocho pasos en el orden exacto.</p><div class="order-game"></div><div class="game-feedback" hidden></div><button class="small-action" id="resetOrder">Reiniciar</button></div>`;const box=stage.querySelector('.order-game'),fb=stage.querySelector('.game-feedback');shuffled.forEach(s=>{const b=document.createElement('button');b.className='order-chip';b.textContent=s;b.onclick=()=>{if(b.classList.contains('selected'))return;b.classList.add('selected');chosen.push(s);if(chosen.length===8){const good=chosen.every((x,i)=>x===steps[i]);fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.innerHTML=good?'✓ <strong>Orden perfecto.</strong> Cada paso prepara el siguiente.':`⚠ El orden correcto es:<br><strong>${steps.join(' → ')}</strong>`;updateMastery('order',good)}};box.appendChild(b)});stage.querySelector('#resetOrder').onclick=renderOrder}
  function renderTimer(){
    stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Entrena tu instantánea</span><h3>Agenda al cliente en 1 minuto y 30 segundos</h3></div><span class="badge">01:30</span></div>
    <div class="game-card timer-training">
      <div class="instant-goal"><span>🎯 Misión</span><strong>La llamada no busca vender ni explicar todo. Busca comprometer al cliente y dejar la visita agendada.</strong></div>
      <div class="timer-guide-grid">
        <article><b>1</b><h4>Explicación rápida</h4><p>Preséntate, menciona quién te recomendó y explica brevemente que recibirá una experiencia sin obligación.</p></article>
        <article><b>2</b><h4>Compromiso</h4><p>Haz una pregunta directa para que el cliente acepte recibir la visita. No cierres con “me avisa”.</p></article>
        <article><b>3</b><h4>Fecha y hora</h4><p>Ofrece opciones concretas: hoy, mañana o máximo pasado mañana.</p></article>
        <article><b>4</b><h4>Dirección</h4><p>Confirma dirección, barrio, quién estará presente y un dato de referencia.</p></article>
      </div>
      <div class="timer-display" id="speechTimer">01:30</div>
      <div class="timer-phase" id="timerPhase"><span>PREPARACIÓN</span><strong>Respira. Tu misión es agendar, no explicar de más.</strong></div>
      <div class="timer-progress"><i id="timerProgress"></i></div>
      <div class="timer-cue" id="timerCue">Pulsa comenzar y realiza la llamada en voz alta.</div>
      <div class="timer-actions"><button class="primary-action" id="timerStart">Comenzar entrenamiento <span>→</span></button><button class="small-action" id="timerReset">Reiniciar</button></div>
      <div class="instant-checklist" id="instantChecklist" hidden><h4>Autoevaluación de la llamada</h4>${['Me presenté y mencioné la recomendación','Di una explicación rápida y clara','Comprometí al cliente con una pregunta directa','Agendé fecha y hora concretas','Confirmé dirección y quién estará presente','Cerré sin seguir explicando'].map((x,i)=>`<label><input type="checkbox" data-check="${i}"> ${x}</label>`).join('')}<button class="primary-action" id="finishInstant">Calcular resultado <span>→</span></button><div class="game-feedback" id="instantResult" hidden></div></div>
      <div class="bleu-advice"><strong>⭐ Lo que buscan los expertos</strong><span>Una acción concreta al final de la llamada: fecha, hora, dirección y compromiso. La curiosidad abre la puerta; la agenda la asegura.</span></div>
    </div>`;
    let left=90,t=null;
    const phases=[
      {at:90,label:'0:00–0:20 · CONFIANZA',cue:'Preséntate. Menciona a quien lo recomendó y rompe el hielo con naturalidad.'},
      {at:70,label:'0:20–0:40 · EXPLICACIÓN RÁPIDA',cue:'Explica en una frase la experiencia. Sin precios, sin catálogo y sin un discurso largo.'},
      {at:50,label:'0:40–1:00 · COMPROMISO',cue:'Pregunta directamente: “¿Qué día de esta semana podría recibirnos?”'},
      {at:30,label:'1:00–1:20 · AGENDA Y DIRECCIÓN',cue:'Define fecha y hora. Confirma la dirección completa y quién estará presente.'},
      {at:10,label:'1:20–1:30 · CIERRE',cue:'Repite fecha, hora y dirección. Agradece y termina la llamada.'}
    ];
    const display=stage.querySelector('#speechTimer'),cue=stage.querySelector('#timerCue'),phase=stage.querySelector('#timerPhase'),progress=stage.querySelector('#timerProgress'),startBtn=stage.querySelector('#timerStart'),checklist=stage.querySelector('#instantChecklist');
    function paint(){const m=Math.floor(left/60),sec=left%60;display.textContent=`0${m}:${String(sec).padStart(2,'0')}`;progress.style.width=`${((90-left)/90)*100}%`;const ph=phases.find(x=>x.at===left);if(ph){phase.querySelector('span').textContent=ph.label;phase.querySelector('strong').textContent=ph.cue;cue.textContent=ph.cue}}
    function tick(){left--;paint();if(left<=0){clearInterval(t);phase.querySelector('span').textContent='ENTRENAMIENTO TERMINADO';phase.querySelector('strong').textContent='Ahora evalúa si realmente lograste la agenda.';cue.textContent='No se trata de hablar durante 90 segundos. Se trata de salir con una cita concreta.';startBtn.disabled=false;startBtn.textContent='Repetir entrenamiento';checklist.hidden=false}}
    startBtn.onclick=()=>{clearInterval(t);left=90;paint();checklist.hidden=true;startBtn.disabled=true;t=setInterval(tick,1000)};
    stage.querySelector('#timerReset').onclick=renderTimer;
    stage.querySelector('#finishInstant').onclick=()=>{const checks=[...stage.querySelectorAll('[data-check]')],score=checks.filter(x=>x.checked).length,pct=Math.round(score/checks.length*100),result=stage.querySelector('#instantResult');result.hidden=false;result.className='game-feedback '+(pct>=84?'good':pct>=50?'':'bad');result.innerHTML=pct>=84?`✓ <strong>${pct}% · Instantánea sólida.</strong><br>Lograste convertir confianza en una cita concreta.`:pct>=50?`<strong>${pct}% · Buena base.</strong><br>Repite y concéntrate en fecha, dirección y compromiso.`:`⚠ <strong>${pct}% · La llamada quedó abierta.</strong><br>Un experto no termina sin una próxima acción concreta.`;updateMastery('instant',pct>=84)};
  }

  const expertCases=[
    {scene:'El cliente dice: “No tengo tiempo.”',think:['Realmente no confía todavía','Está rechazando para siempre','Solo debo hablar más rápido','Debo enviarle toda la información'],a:0,feels:'Puede sentir presión, desconfianza o temor a que la visita sea una venta forzada.',goal:'Reducir la presión, recuperar confianza y llevarlo a escoger un momento concreto.',expert:'Los expertos resuelven primero la emoción y después piden el compromiso.'},
    {scene:'El cliente solo entrega compañeros de trabajo y evita hablar de su familia.',think:['La hoja ya está llena, puedo seguir','Debo explorar el primer círculo con preguntas respetuosas','Debo aceptar cualquier nombre','Debo decirle que su familia comprará'],a:1,feels:'Puede sentir que recomendar a la familia es exponerla o incomodarla.',goal:'Explicar el valor de la confianza y encontrar al familiar que recibiría mejor su recomendación.',expert:'Los expertos no confunden cantidad con calidad. Protegen el programa desde el primer círculo.'},
    {scene:'El prospecto pregunta: “¿Tengo que comprar algo?”',think:['Debo prometer que nunca verá productos','Debo explicar precios y financiación','Debo eliminar presión y regresar a la agenda','Debo cambiar de tema'],a:2,feels:'Está anticipando presión comercial y quiere proteger su libertad de decisión.',goal:'Aclarar que no hay obligación, mantener curiosidad y volver a fecha y hora.',expert:'Los expertos contestan la preocupación real sin convertir la llamada en una presentación.'},
    {scene:'La primera persona no contesta la instantánea.',think:['El programa salió mal','Debo seguir con el siguiente contacto sin perder ritmo','Debo esperar hasta mañana','Debo llamar al mejor prospecto de inmediato'],a:1,feels:'El cliente puede empezar a dudar si percibe inseguridad o frustración.',goal:'Mantener energía y continuar con el siguiente contacto.',expert:'Los expertos no convierten una llamada sin respuesta en una conclusión.'},
    {scene:'El cliente dice: “Yo después les escribo.”',think:['Debo aceptar para no incomodar','Debo dejar una acción concreta agendada ahora','Debo enviar un catálogo','Debo hablar más del premio'],a:1,feels:'Quiere salir del compromiso sin decir que no de frente.',goal:'Liderar con respeto y convertir una intención vaga en fecha, hora y dirección.',expert:'Los expertos nunca terminan con “cualquier cosa me avisa”.'}
  ];
  function renderExpertMind(){const item=pickFresh(expertCases,'expertCases');stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Mentalidad del experto</span><h3>¿Qué está pensando el cliente?</h3></div><span class="badge">Psicología aplicada</span></div><div class="game-card"><div class="client-thought"><span>👤 SITUACIÓN</span><strong>${item.scene}</strong></div><div class="game-question"><span class="question-label">¿Qué interpretación usaría un experto?</span>Elige la lectura más útil antes de responder.</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="expert-insight" hidden><article><span>🧠 Lo que puede estar pensando o sintiendo</span><p>${item.feels}</p></article><article><span>🎯 Lo que busca el experto</span><p>${item.goal}</p></article><article><span>⭐ Mentalidad del experto</span><p>${item.expert}</p></article></div><button class="primary-action next-game" hidden>Nuevo caso <span>→</span></button></div>`;const box=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),ins=stage.querySelector('.expert-insight'),next=stage.querySelector('.next-game');item.think.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;b.classList.add(good?'correct':'wrong');if(!good)box.children[item.a].classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.textContent=good?'✓ Leíste la intención detrás de la frase.':'⚠ No te quedes solo con las palabras. Busca la emoción y la intención.';ins.hidden=false;next.hidden=false;updateMastery('objections',good)};box.appendChild(b)});next.onclick=nextFor(renderExpertMind)}

  function renderQuick(){const item=pickFresh(expertCases,'quickCases');let left=10,t=null;stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Decisiones bajo presión</span><h3>Reto de 10 segundos</h3></div><span class="badge" id="quickBadge">10 s</span></div><div class="game-card"><div class="client-thought"><span>👤 CLIENTE</span><strong>${item.scene}</strong></div><div class="game-question"><span class="question-label">¿Qué busca un experto conseguir ahora?</span>Decide antes de que termine el tiempo.</div><div class="game-options"></div><div class="game-feedback" hidden></div><button class="primary-action next-game" hidden>Otro reto <span>→</span></button></div>`;const badge=stage.querySelector('#quickBadge'),box=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),next=stage.querySelector('.next-game');function finish(i){clearInterval(t);[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;if(i>=0){box.children[i].classList.add(good?'correct':'wrong')}box.children[item.a].classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.innerHTML=good?`✓ <strong>Decisión experta.</strong><br>${item.goal}`:`⚠ <strong>El tiempo terminó o la intención no fue la mejor.</strong><br>${item.goal}`;next.hidden=false;updateMastery('instant',good)}item.think.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>finish(i);box.appendChild(b)});t=setInterval(()=>{left--;badge.textContent=left+' s';if(left<=0)finish(-1)},1000);next.onclick=nextFor(renderQuick)}

  const mentorCases=[
    {title:'El cliente evita dar familiares',dialog:['Cliente: “Mejor anote compañeros de trabajo.”','Asesor: “Perfecto, deme los nombres.”'],pause:'¿Dónde debería detenerse el experto?',opts:['Antes de aceptar, para explorar el primer círculo','Después de anotar todos','No debería detenerse'],a:0,psych:'El cliente puede estar protegiendo a su familia porque teme incomodarla.',intent:'Construir seguridad y encontrar a la persona de mayor confianza.',avoid:'Aceptar el primer sí y llenar la hoja con nombres débiles.'},
    {title:'La llamada se vuelve demasiado larga',dialog:['Prospecto: “¿De qué se trata?”','Asesor: explica productos, materiales, precios y financiación durante cuatro minutos.'],pause:'¿Qué debió hacer?',opts:['Dar una explicación breve y regresar a la agenda','Seguir explicando hasta que entienda todo','Enviar más información'],a:0,psych:'El prospecto está tratando de medir el riesgo, no pidiendo una capacitación completa.',intent:'Reducir presión y conservar curiosidad suficiente para recibir la visita.',avoid:'Vender por teléfono y quitarle valor a la experiencia presencial.'},
    {title:'La cita queda abierta',dialog:['Cliente: “Yo le aviso cuando pueda.”','Asesor: “Listo, cualquier cosa me escribe.”'],pause:'¿Qué falta?',opts:['Una acción concreta: fecha, hora y dirección','Una explicación de premios','Un mensaje de cadena'],a:0,psych:'La frase permite salir sin comprometerse.',intent:'Transformar una intención vaga en un acuerdo verificable.',avoid:'Cerrar sin próxima acción.'}
  ];
  function renderMentor(){const item=pickFresh(mentorCases,'mentorCases');stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Entrenamiento guiado</span><h3>💎 Modo Mentor interactivo</h3></div><span class="badge">Analiza · Decide · Comprende</span></div><div class="game-card"><div class="mentor-case"><span>CASO</span><h4>${item.title}</h4>${item.dialog.map(x=>`<p>${x}</p>`).join('')}</div><div class="mentor-stop"><b>⏸ El mentor detiene la llamada</b><p>${item.pause}</p></div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="expert-insight" hidden><article><span>🧠 Psicología del cliente</span><p>${item.psych}</p></article><article><span>🎯 Lo que buscan los expertos</span><p>${item.intent}</p></article><article><span>🚫 Lo que nunca hacen los expertos</span><p>${item.avoid}</p></article></div><div class="mentor-reflection" hidden><h4>¿Qué aprendiste de esta decisión?</h4><button data-reflect>Que debo entender la intención antes de escoger las palabras.</button><button data-reflect>Que una llamada debe terminar con una acción concreta.</button><button data-reflect>Que hablar más no siempre genera más confianza.</button></div><button class="primary-action next-game" hidden>Nuevo caso de mentor <span>→</span></button></div>`;const box=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),ins=stage.querySelector('.expert-insight'),reflection=stage.querySelector('.mentor-reflection'),next=stage.querySelector('.next-game');item.opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;b.classList.add(good?'correct':'wrong');if(!good)box.children[item.a].classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.textContent=good?'✓ Identificaste el momento donde debía intervenir un experto.':'⚠ Observa qué intención se perdió en la conversación.';ins.hidden=false;reflection.hidden=false;updateMastery('objections',good)};box.appendChild(b)});reflection.querySelectorAll('[data-reflect]').forEach(b=>b.onclick=()=>{reflection.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');next.hidden=false});next.onclick=nextFor(renderMentor)}
  function renderRandom(){
    randomFlow=true;
    const modes=[renderObjectionFixed,renderMarket,renderError,renderSpeech,renderExpertMind,renderQuick,renderMentor];
    const mode=pickFresh(modes,'randomModes');
    mode();
  }
  const renderers={random:renderRandom,objections:renderObjectionFixed,markets:renderMarket,errors:renderError,order:renderOrder,speech:renderSpeech,timer:renderTimer,expertmind:renderExpertMind,quick:renderQuick,mentor:renderMentor};
  document.getElementById('startGym')?.addEventListener('click',renderRandom);
  screen.querySelectorAll('.gym-mode').forEach(btn=>btn.addEventListener('click',()=>{
    screen.querySelectorAll('.gym-mode').forEach(x=>x.classList.toggle('active',x===btn));
    randomFlow=btn.dataset.gym==='random';
    renderers[btn.dataset.gym]();
  }));

  // Examen breve antes de marcar cada paso como aprendido.
  const checkpoint={
    1:{q:'¿Qué prepara el puente?',opts:['La transición emocional después de negociar','La llamada al mejor prospecto','El seguimiento de 48 horas'],a:0},
    2:{q:'¿Qué debe ocurrir al presentar premios?',opts:['El cliente debe visualizarlos y elegir','Se muestran rápido y se sigue','Se prometen sin condiciones'],a:0},
    3:{q:'¿Cuál es la diferencia esencial?',opts:['Pedir busca calidad; anotar solo llena espacios','No existe diferencia','Anotar es suficiente'],a:0},
    4:{q:'¿Por qué calificamos?',opts:['Para proteger tiempo y mercado','Para tener menos nombres','Para vender por teléfono'],a:0},
    5:{q:'¿Qué debe comprender el cliente?',opts:['4 visitas + mínimo 1 venta + 14 días','Una venta basta','Solo necesita nombres'],a:0},
    6:{q:'¿Qué es lo más importante?',opts:['Intentar la llamada inmediata y transferir confianza','Esperar a mañana','Enviar una cadena'],a:0},
    7:{q:'¿Cuándo se hace seguimiento?',opts:['Dentro de aproximadamente 48 horas','Al mes','Solo cuando el cliente llame'],a:0},
    8:{q:'¿Qué significa mover programas?',opts:['Reactivar, reemplazar y recuperar oportunidades','Eliminar los contactos','Esperar nuevos clientes'],a:0}
  };
  const modal=document.createElement('div');modal.className='learning-modal';modal.innerHTML='<div class="learning-dialog"><span class="game-kicker">Examen antes de avanzar</span><h3></h3><p>Responde correctamente para marcar este paso como aprendido.</p><div class="game-options"></div><div class="game-feedback" hidden></div><button class="small-action" data-close hidden>Cerrar</button></div>';document.body.appendChild(modal);
  expertScreen?.querySelectorAll('.learn-btn').forEach(btn=>{const clone=btn.cloneNode(true);btn.replaceWith(clone);clone.addEventListener('click',()=>{const n=Number(clone.dataset.learn),item=checkpoint[n],dialog=modal.querySelector('.learning-dialog'),box=modal.querySelector('.game-options'),fb=modal.querySelector('.game-feedback'),close=modal.querySelector('[data-close]');dialog.querySelector('h3').textContent=`Paso ${n}: ${steps[n-1]}`;box.innerHTML='';fb.hidden=true;close.hidden=true;item.opts.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);const good=i===item.a;b.classList.add(good?'correct':'wrong');fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.textContent=good?'✓ Correcto. Puedes avanzar al siguiente paso.':'⚠ Repasa el contenido y vuelve a intentarlo.';if(good){clone.classList.add('learned');clone.textContent='✓ Paso aprendido';close.hidden=false;updateMastery('order',true)}};box.appendChild(b)});modal.classList.add('show')})});
  modal.querySelector('[data-close]').onclick=()=>modal.classList.remove('show');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
})();
