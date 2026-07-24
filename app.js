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


// ===== Bleu One v3.1 · Gimnasios claros, variados y por dificultad =====
(()=>{
  const shuffle=(arr)=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const levelLabel={beginner:'Principiante',intermediate:'Intermedio',expert:'Experto'};
  const levelWeight={beginner:1,intermediate:2,expert:4};
  const levelGoal={beginner:30,intermediate:90,expert:220};
  const pools=new Map();
  function fresh(list,key){let bag=pools.get(key);if(!bag||!bag.length){bag=shuffle(list.map((_,i)=>i));const last=pools.get(key+'-last');if(bag.length>1&&bag[0]===last)[bag[0],bag[1]]=[bag[1],bag[0]];}const idx=bag.shift();pools.set(key,bag);pools.set(key+'-last',idx);return list[idx];}
  function easyIntro(level){return level==='beginner'?'Casos sencillos, con pistas y explicaciones claras.':level==='intermediate'?'Casos más reales. Varias opciones pueden servir, pero una funciona mejor.':'Casos difíciles, sin pistas antes de responder y con opciones muy parecidas.'}
  function choices(best,others){return shuffle([best,...others]).map(text=>({text,best:text===best}));}
  class SessionMastery{
    constructor(prefix,areas){this.prefix=prefix;this.areas=areas;this.data={};areas.forEach(a=>this.data[a]={points:0,correct:0,total:0});}
    add(area,good,level){const d=this.data[area];d.total++;if(good){d.correct++;d.points+=levelWeight[level]}else d.points+=.2;this.paint();}
    pct(area){const d=this.data[area];if(!d.total)return 0;const accuracy=d.correct/d.total;const points=Math.min(1,d.points/levelGoal.expert);return Math.round((accuracy*.7+points*.3)*100)}
    total(){return Math.round(this.areas.reduce((s,a)=>s+this.pct(a),0)/this.areas.length)}
    paint(){this.areas.forEach(a=>{const id=this.prefix+'Bar'+a[0].toUpperCase()+a.slice(1),el=document.getElementById(id);if(el)el.style.width=this.pct(a)+'%'});const s=document.getElementById(this.prefix+'MasteryScore');if(s)s.textContent=this.total()+'%';}
  }
  function how(title,text,level){return `<div class="how-game"><span>¿CÓMO JUGAR?</span><h4>${title}</h4><p>${text}</p><small>${easyIntro(level)}</small></div>`}
  function renderQuestion(stage,item,onAnswer,onNext,label='Siguiente pregunta'){
    const qz=stage.querySelector('.question-zone');
    qz.innerHTML=`${item.context?`<div class="case-context">${item.context}</div>`:''}<div class="game-question">${item.q}</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="expert-insight" hidden><article><span>⭐ La mejor opción</span><p>${item.why}</p></article>${item.thought?`<article><span>🧠 Lo que puede estar pensando</span><p>${item.thought}</p></article>`:''}${item.tip?`<article><span>💡 Para la próxima</span><p>${item.tip}</p></article>`:''}</div><button class="primary-action next-v3" hidden>${label} <span>→</span></button>`;
    const box=qz.querySelector('.game-options'),fb=qz.querySelector('.game-feedback'),ins=qz.querySelector('.expert-insight'),next=qz.querySelector('.next-v3');
    item.choices.forEach((c,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${String.fromCharCode(65+i)}</b><span>${c.text}</span>`;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);b.classList.add(c.best?'correct':'wrong');const best=[...box.children].find((_,j)=>item.choices[j].best);best?.classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(c.best?'good':'bad');fb.innerHTML=c.best?'✓ <strong>Muy bien.</strong> Esta opción cuida mejor el proceso.':'Esta respuesta podría ayudar, pero había una opción más completa. Mira la explicación.';ins.hidden=false;next.hidden=false;onAnswer(c.best,item)};box.appendChild(b)});
    next.onclick=onNext;
  }
  function item(q,context,best,others,why,thought='',tip=''){return {q,context,choices:choices(best,others),why,thought,tip}}

  // GIMNASIO 4 EN 14
  const gym=document.getElementById('gimnasio414');
  if(gym){
    gym.innerHTML=`<section class="panel gym-hero"><div><span class="eyebrow">Entrena, repite, mejora</span><h3>🏋️ Gimnasio 4 en 14</h3><p>Practica el sistema con situaciones fáciles de entender y aprende qué hacer en cada paso.</p></div><div class="mastery-ring"><strong id="g414MasteryScore">0%</strong><span>Avance de esta sesión</span></div></section>
    <section class="panel difficulty-panel"><div><span class="eyebrow">Nivel</span><h3>Elige la dificultad</h3><p>Cada nivel tiene preguntas diferentes. Al cambiar de nivel, también cambian los casos.</p></div><div class="difficulty-switch" id="g414Difficulty"><button data-level="beginner" class="active">Principiante</button><button data-level="intermediate">Intermedio</button><button data-level="expert">Experto</button></div></section>
    <div class="mastery-bars panel"><div><span>Orden</span><i><b id="g414BarOrder"></b></i></div><div><span>Objeciones</span><i><b id="g414BarObjections"></b></i></div><div><span>Mercados</span><i><b id="g414BarMarkets"></b></i></div><div><span>Instantánea</span><i><b id="g414BarInstant"></b></i></div><small>Este avance solo dura mientras la página está abierta. Llegar alto exige muchas respuestas correctas, especialmente en Experto.</small></div>
    <div class="gym-menu"><button class="gym-mode active" data-g414="objections">🧪 Objeciones</button><button class="gym-mode" data-g414="markets">📊 Mercados</button><button class="gym-mode" data-g414="errors">🚨 Encuentra el error</button><button class="gym-mode" data-g414="order">🧩 Orden perfecto</button><button class="gym-mode" data-g414="speech">🎤 Completa el speech</button><button class="gym-mode" data-g414="timer">⏱️ Entrena tu instantánea</button><button class="gym-mode" data-g414="mind">🧠 Piensa como experto</button><button class="gym-mode" data-g414="quick">⚡ Reto de 10 segundos</button><button class="gym-mode" data-g414="mentor">💎 Modo mentor</button></div>
    <section class="panel gym-stage" id="g414Stage"></section>`;
    let level='beginner',mode='objections';const stage=document.getElementById('g414Stage');const mastery=new SessionMastery('g414',['order','objections','markets','instant']);
    const banks={
      objections:{
        beginner:[
          item('El cliente dice: “No quiero molestar a mi familia”. ¿Qué harías tú?','Estás pidiendo nombres.','Le explicaría que no se trata de obligar a nadie y le preguntaría quién de su familia confiaría más en su recomendación.',['Aceptaría solo compañeros de trabajo.','Le pediría cualquier nombre para llenar la lista.','Cambiaría de tema para evitar incomodarlo.'],'La idea es cuidar la confianza y llegar al primer círculo sin presionar.','Teme quedar mal con su familia.','Habla de confianza, no de obligación.'),
          item('El cliente dice: “No sé a quién anotar”. ¿Qué harías tú?','Todavía estás pidiendo nombres.','Le haría preguntas sencillas: quién cocina, quién vive en familia y quién disfruta recibir visitas.',['Le preguntaría quién compraría.','Le pediría revisar sus contactos al azar.','Le diría que anote a cualquier persona.'],'Las preguntas ayudan a recordar buenos perfiles sin adivinar quién comprará.','','Guía por perfiles, no por intención de compra.'),
          item('El cliente dice: “Yo los llamo mañana”. ¿Qué harías tú?','Estás en la instantánea.','Le propondría llamar ahora de forma breve para dejar la visita agendada.',['Aceptaría y esperaría.','Le enviaría un mensaje genérico.','Le pediría que me avise cuando pueda.'],'La confianza está más fuerte en ese momento.','Quiere dejar el compromiso para después.','Busca fecha, hora y dirección antes de salir.')
        ],
        intermediate:[
          item('El cliente acepta dar familiares, pero solo los más lejanos. ¿Qué harías tú?','Ya te dio varios nombres.','Agradecería los nombres y luego le preguntaría cuál familiar cercano recibiría mejor un detalle de su parte.',['Aceptaría la lista porque ya colaboró.','Le pediría directamente los teléfonos de sus hermanos.','Le diría que los familiares lejanos no sirven.'],'Reconoce su ayuda y luego lo guía hacia una recomendación más fuerte.','Puede sentir menos riesgo al dar nombres lejanos.','No rechaces lo que dio; mejora la calidad con preguntas.'),
          item('El cliente quiere explicar él mismo toda la experiencia por teléfono. ¿Qué harías tú?','Estás a punto de marcar.','Le pediría que salude, me presente y me pase el teléfono para mantener el mensaje corto.',['Lo dejaría hablar para que suene más natural.','Le daría un texto largo para leer.','Le pediría enviar un audio de cinco minutos.'],'Una explicación larga puede confundir o enfriar el contacto.','','La presentación del cliente debe ser breve.'),
          item('Un prospecto no contesta y el cliente se desanima. ¿Qué harías tú?','Primera llamada de la instantánea.','Mantendría la energía y llamaría al siguiente contacto.',['Esperaría hasta mañana.','Llamaría de inmediato al mejor prospecto.','Terminaría el programa.'],'Una llamada sin respuesta no significa que el programa falló.','El cliente puede interpretar tu reacción como inseguridad.','Sigue el ritmo sin dramatizar.')
        ],
        expert:[
          item('El cliente entregó 10 nombres, pero ninguno es cercano y dice que no quiere “mezclar familia con negocios”. ¿Qué harías tú?','La hoja está llena, pero la calidad es baja.','Validaría su límite, explicaría que el programa depende de confianza y exploraría una sola persona cercana que recibiría bien el detalle, sin imponer.',['Aceptaría la lista completa y compensaría con más seguimiento.','Le explicaría que debe dar familiares porque son mejores mercados.','Descartaría la lista y comenzaría otra vez.'],'Protege la relación, explica el motivo y busca una mejora concreta sin enfrentarlo.','No quiere sentirse utilizado ni exponer a su familia.','En experto, la meta no es ganar la discusión: es mejorar el programa.'),
          item('El cliente quiere hacer la instantánea, pero insiste en llamar primero al mejor contacto. ¿Qué harías tú?','Ambos están algo nerviosos.','Le explicaría que empezaremos con uno intermedio para entrar en ritmo y luego iremos por el mejor.',['Aceptaría porque el cliente conoce a sus contactos.','Aplazaría todas las llamadas hasta practicar más.','Llamaría al mejor y leería el speech completo.'],'Cuida los mejores prospectos mientras ambos ganan naturalidad.','','Entrar en ritmo también es parte de la estrategia.'),
          item('El cliente dice: “Mi hermana sí recibe, pero no cocina; mi cuñado cocina y decide con ella”. ¿Qué harías tú?','Estás calificando antes de agendar.','Confirmaría que ambos puedan estar presentes y agendaría según el núcleo que toma decisiones.',['Agendaría solo con la hermana porque es la recomendada.','Descartaría el hogar porque ella no cocina.','Llamaría al cuñado sin involucrarla.'],'La visita mejora cuando está el núcleo que usa y decide.','','Calificar no es juzgar; es preparar una visita más completa.')
        ]
      },
      markets:{
        beginner:[item('María vive con su pareja, ambos trabajan y cocinan. ¿Cómo ves este mercado?','Perfil familiar claro.','Es un buen mercado para calificar y agendar.',['Es un mercado malo.','Hay que venderle por teléfono.','No importa quién esté presente.'],'Tiene uso de cocina, núcleo familiar y decisión compartida.'),item('Pedro vive solo y come siempre fuera. ¿Qué harías tú?','Aceptó recibir una visita.','Preguntaría más antes de agendar y exploraría si puede recomendar otro hogar.',['Lo pondría como prioridad.','Lo descartaría sin hablar.','Haría una demo larga para convencerlo.'],'Aceptar la visita no siempre significa que sea el mejor uso del tiempo.')],
        intermediate:[item('Laura vive con su mamá, ambas cocinan y trabajan desde casa. ¿Qué harías tú?','Hay dos usuarias en el hogar.','Confirmaría que ambas estén presentes y preguntaría cómo toman decisiones.',['Agendaría solo con Laura.','Preguntaría únicamente cuánto ganan.','Asumiría que compran juntas.'],'La presencia del núcleo ayuda a que la visita sea más completa.'),item('Andrés es casado, no cocina, pero su pareja sí. ¿Qué dato falta?','Él aceptó la visita.','Saber si su pareja estará presente y participa en la decisión.',['El modelo del carro.','El nombre del jefe.','Cuánto vale su casa.'],'La persona que usa y decide debe estar considerada.')],
        expert:[item('Una clienta tiene buen perfil, pero vive lejos y solo puede recibir sola. ¿Qué harías tú?','El costo de la visita es alto.','Evaluaría si puede estar el núcleo familiar o buscaría otra fecha antes de confirmar.',['Agendaría porque el perfil compensa todo.','Descartaría por distancia.','Mandaría una presentación por mensaje.'],'Un buen perfil no reemplaza las condiciones mínimas de una visita productiva.'),item('Un prospecto parece ideal, pero fue recomendado por un conocido lejano que casi no habla con él. ¿Qué harías tú?','La confianza transferida es baja.','Reforzaría la activación antes de agendar y confirmaría el vínculo real.',['Agendaría de inmediato por el perfil.','Llamaría sin mencionar al recomendador.','Le enviaría un catálogo.'],'El perfil importa, pero también la fuerza de la recomendación.')]
      },
      errors:{
        beginner:[item('Asesor: “Bueno, me avisa si puede”. ¿Qué falló?','La llamada quedó abierta.','No dejó una fecha y una acción concreta.',['No habló de precios.','No explicó todos los premios.','No pidió una compra.'],'La instantánea debe terminar con una cita clara.'),item('El asesor anotó 10 nombres sin preguntar nada. ¿Qué falló?','La hoja está llena.','Confundió anotar nombres con pedir nombres de calidad.',['No habló de descuentos.','No cerró una venta.','No mostró el catálogo.'],'Pedir nombres también incluye conocer el perfil.')],
        intermediate:[item('El cliente hizo una llamada de cinco minutos explicando todo. ¿Qué falló?','El prospecto quedó confundido.','El asesor perdió el control de una presentación que debía ser corta.',['Faltó hablar de financiación.','La llamada fue demasiado amable.','Debió mandar fotos primero.'],'La activación funciona mejor cuando el mensaje es breve.'),item('El asesor hizo seguimiento un mes después. ¿Qué falló?','El programa se enfrió.','Dejó pasar demasiado tiempo; debía revisar aproximadamente a las 48 horas.',['Debió esperar más.','Debió cancelar sin llamar.','Faltó vender por teléfono.'],'El seguimiento mantiene vivo el programa.')],
        expert:[item('El asesor hizo todo en orden, pero en seguimiento solo preguntó “¿cómo vamos?”. ¿Qué faltó?','El cliente respondió “bien”.','Una pregunta concreta sobre qué visita sigue viva, cuál falta y qué se debe reemplazar.',['Más entusiasmo.','Volver a explicar todos los premios.','Pedir otros 10 nombres de inmediato.'],'El seguimiento necesita decisiones, no una conversación vaga.'),item('El programa tiene 3 visitas hechas y una caída. El asesor lo da por perdido. ¿Qué falló?','Faltaba una sola visita.','No revisó reemplazos ni habló con el Distribuidor para reactivar el programa.',['Debió ofrecer un descuento.','Debió cerrar por teléfono.','Debió borrar los datos.'],'Mover programas recupera actividad que ya estaba avanzada.')]
      },
      speech:{beginner:[],intermediate:[],expert:[]},mind:{beginner:[],intermediate:[],expert:[]},quick:{beginner:[],intermediate:[],expert:[]},mentor:{beginner:[],intermediate:[],expert:[]}
    };
    const speechPrompts=[
      ['Antes de llamar, la mejor forma de dirigir el paso es:','Vamos a llamar de una vez a su tía Carolina.',['¿Será que llamamos?','Me avisa mañana.','Tal vez podríamos intentar.'],'La frase segura convierte intención en acción.'],
      ['Cuando recibes el teléfono, tu meta principal es:','Agendar fecha, hora y dirección.',['Explicar toda la empresa.','Hablar de precios.','Cerrar una compra.'],'La llamada abre la puerta; no reemplaza la visita.'],
      ['Si preguntan “¿tengo que comprar?”, lo mejor es:','Aclarar que no hay obligación y volver a la agenda.',['Prometer que no verán productos.','Explicar financiación.','Cambiar de tema.'],'Responde la preocupación sin alargar la llamada.'],
      ['Antes de pasar el teléfono, dile al cliente:','Salúdelo, presénteme y páseme el teléfono.',['Explíquele todo.','Léale un catálogo.','Pregúntele si quiere comprar.'],'La transferencia debe ser corta y clara.'],
      ['Al cerrar la llamada, confirma:','Fecha, hora, dirección y quién estará presente.',['Solo el nombre.','Solo el barrio.','Que luego te escriba.'],'Una cita completa evita confusiones.']
    ];
    ['beginner','intermediate','expert'].forEach((lv,li)=>{banks.speech[lv]=Array.from({length:15},(_,i)=>{const p=speechPrompts[(i+li)%speechPrompts.length];const extra=li===0?'Completa la idea.':li===1?'Elige la frase que deja el paso más claro.':'Todas pueden sonar bien; elige la que protege mejor la instantánea.';return item(p[0],extra,p[1],p[2],p[3],'','Habla corto y busca una acción concreta.')});banks.mind[lv]=banks.objections[lv].map(x=>({...x,q:x.q.replace('¿Qué harías tú?','¿Qué puede estar pensando el cliente y qué harías tú?')}));banks.quick[lv]=banks.objections[lv];banks.mentor[lv]=banks.errors[lv];});

    const stepOrder=['El puente','Presentar los premios','Pedir nombres','Calificar los nombres','Explicar el programa','Instantánea y activación','Seguimiento','Mover programas'];
    function shell(title,explain,count){stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${levelLabel[level]}</span><h3>${title}</h3></div><span class="badge">${count}</span></div>${explain}<div class="question-zone"></div>`}
    function playBank(key,title,area,desc){const bank=banks[key][level];const current=fresh(bank,`g414-${key}-${level}`);shell(title,how(title,desc,level),`${bank.length} casos distintos`);renderQuestion(stage,current,g=>mastery.add(area,g,level),()=>playBank(key,title,area,desc));}
    function orderGame(){
      const beginner=[...stepOrder], intermediate=['Pedir nombres','Calificar los nombres','Explicar el programa','Instantánea y activación','Seguimiento'], expert=['El cliente elige un premio','El asesor pide nombres','Califica perfiles','Explica 4 visitas + 1 venta + 14 días','Activa por llamada','Revisa a las 48 horas','Con autorización del Distribuidor, reactiva un programa incompleto'];
      const target=level==='beginner'?beginner:level==='intermediate'?intermediate:expert, shuffled=shuffle(target), chosen=[];
      shell('Orden perfecto',how('Orden perfecto','Toca las tarjetas en el orden correcto. Al terminar verás exactamente dónde fallaste.',level),`${target.length} pasos`);
      const z=stage.querySelector('.question-zone');z.innerHTML=`<p>${level==='expert'?'Ordena un caso completo, no solo los nombres de los pasos.':'Ordena la secuencia.'}</p><div class="order-game"></div><div class="game-feedback" hidden></div><button class="small-action" id="resetOrder">Reiniciar</button>`;const box=z.querySelector('.order-game'),fb=z.querySelector('.game-feedback');
      shuffled.forEach(s=>{const b=document.createElement('button');b.className='order-chip';b.textContent=s;b.onclick=()=>{if(b.classList.contains('selected'))return;b.classList.add('selected');chosen.push({s,b});if(chosen.length===target.length){let errors=[];chosen.forEach((x,i)=>{if(x.s!==target[i]){x.b.classList.add('wrong-order');errors.push(`${i+1}. pusiste “${x.s}”, debía ir “${target[i]}”`)}});const good=!errors.length;fb.hidden=false;fb.className='game-feedback '+(good?'good':'bad');fb.innerHTML=good?'✓ <strong>Orden perfecto.</strong> Cada paso prepara el siguiente.':`Esta vez fallaste en:<br>${errors.map(e=>`<span>${e}</span>`).join('<br>')}`;mastery.add('order',good,level)}};box.appendChild(b)});z.querySelector('#resetOrder').onclick=orderGame;
    }
    function timer(){stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Práctica guiada</span><h3>Agenda en 1 minuto y 30 segundos</h3></div><span class="badge">01:30</span></div>${how('Entrena tu instantánea','Haz la llamada en voz alta. La meta es dejar fecha, hora, dirección y compromiso.',level)}<div class="question-zone"><div class="timer-display" id="speechTimer">01:30</div><div class="timer-phase" id="timerPhase"><strong>Preséntate y menciona quién lo recomendó.</strong></div><button class="primary-action" id="timerStart">Comenzar</button><div class="instant-checklist" id="instantChecklist" hidden>${['Explicación breve','Compromiso claro','Fecha y hora','Dirección','Quién estará presente'].map(x=>`<label><input type="checkbox"> ${x}</label>`).join('')}</div></div>`;let left=90,t;const d=stage.querySelector('#speechTimer'),phase=stage.querySelector('#timerPhase strong'),check=stage.querySelector('#instantChecklist');stage.querySelector('#timerStart').onclick=()=>{clearInterval(t);left=90;check.hidden=true;t=setInterval(()=>{left--;d.textContent=`0${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;if(left===70)phase.textContent='Explica en una frase. No hables de más.';if(left===50)phase.textContent='Compromete al cliente con una pregunta directa.';if(left===30)phase.textContent='Define fecha, hora y dirección.';if(left===10)phase.textContent='Confirma todo y termina la llamada.';if(left<=0){clearInterval(t);check.hidden=false;phase.textContent='Revisa si realmente dejaste una cita concreta.'}},1000)}}
    const renderers={objections:()=>playBank('objections','Objeciones','objections','Lee la situación y elige qué harías tú.'),markets:()=>playBank('markets','Juego de mercados','markets','Mira el perfil y decide cómo seguir antes de agendar.'),errors:()=>playBank('errors','Encuentra el error','instant','Lee la situación y encuentra qué debilitó el 4 en 14.'),order:orderGame,speech:()=>playBank('speech','Completa el speech','instant','Elige la frase que mejor ayuda a completar el paso.'),timer,mind:()=>playBank('mind','Piensa como experto','objections','Mira más allá de las palabras y elige la respuesta más útil.'),quick:()=>playBank('quick','Reto de 10 segundos','instant','Decide rápido, como en una llamada real.'),mentor:()=>playBank('mentor','Modo mentor','objections','Encuentra el punto que se puede mejorar y aprende por qué.')};
    document.getElementById('g414Difficulty').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;gym.querySelectorAll('#g414Difficulty button').forEach(x=>x.classList.toggle('active',x===b));pools.clear();renderers[mode]()};
    gym.querySelectorAll('[data-g414]').forEach(b=>b.onclick=()=>{gym.querySelectorAll('[data-g414]').forEach(x=>x.classList.toggle('active',x===b));mode=b.dataset.g414;renderers[mode]()});renderers.objections();
  }

  // EXÁMENES DE LOS PASOS: tres preguntas, puede continuar con 1 o 2 errores
  document.addEventListener('click',e=>{const btn=e.target.closest('.learn-btn');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();const step=Number(btn.dataset.learn);let pos=0,score=0;const qs=[
    item('¿Qué busca este paso dentro del 4 en 14?',`Paso ${step}.`,'Preparar bien el siguiente paso y mantener vivo el programa.',['Cerrar una compra en ese momento.','Hablar más del producto.','Terminar rápido para pasar a otra cosa.'],'Cada paso existe para fortalecer el sistema, no para forzar una venta.'),
    item('¿Cómo sabes que este paso quedó bien hecho?',`Paso ${step}.`,'El cliente entendió, participó y quedó una acción clara para continuar.',['El asesor habló mucho.','No hubo ninguna pregunta.','La conversación terminó rápido.'],'Lo importante es que el programa pueda seguir con claridad.'),
    item('¿Qué harías si algo no salió perfecto?',`Paso ${step}.`,'Continuaría, tomaría nota del error y aplicaría el consejo en el siguiente programa.',['Bloquearía todo el avance.','Volvería a empezar toda la demostración.','Daría el programa por perdido.'],'Equivocarse en una o dos preguntas no detiene el aprendizaje; ayuda a mejorar.')
  ];
  const modal=document.createElement('div');modal.className='learning-modal show v3-exam-modal';modal.innerHTML=`<div class="learning-dialog"><span class="game-kicker">EXAMEN ANTES DE AVANZAR</span><h3>Paso ${step}</h3><p>Son tres preguntas. Puedes continuar aunque tengas uno o dos errores; al final recibirás consejos.</p><div class="exam-v3-zone"></div></div>`;document.body.appendChild(modal);
  function ask(){if(pos>=3){const missed=3-score;modal.querySelector('.exam-v3-zone').innerHTML=`<div class="game-feedback ${score===3?'good':''}"><strong>${score}/3 respuestas acertadas.</strong><br>${missed===0?'Excelente.':missed===1?'Muy bien. Revisa el consejo y sigue practicando.':'Puedes continuar. Te recomendamos volver a leer este paso después.'}</div><button class="primary-action">Marcar paso y continuar</button>`;modal.querySelector('button').onclick=()=>{btn.classList.add('learned');btn.textContent='✓ Paso aprendido';modal.remove()};return}const q=qs[pos];const zone=modal.querySelector('.exam-v3-zone');zone.innerHTML='<div class="question-zone"></div>';renderQuestion(zone,q,g=>{if(g)score++;pos++},ask,'Siguiente pregunta')};ask();},true);

  // MOVER PROGRAMAS: explicación correcta
  const mover=document.getElementById('expertTab-mover414');
  if(mover){const lead=mover.querySelector('.lesson-lead');if(lead)lead.textContent='Mover programas es una fuente para reactivar la actividad revisando programas antiguos de 4 en 14 que quedaron incompletos.';const first=mover.querySelector('.lesson-grid article p');if(first)first.textContent='Revisa programas antiguos donde al cliente le faltaron una o dos visitas. Con autorización del Distribuidor, puedes reactivarlos, completar lo pendiente y volver a generar actividad.';const principle=[...mover.querySelectorAll('.lesson-grid article')].find(a=>a.textContent.includes('Principio'));if(principle)principle.querySelector('p').textContent='Nunca reactives un programa por tu cuenta. Primero revisa el caso y solicita autorización del Distribuidor.';}

  // GIMNASIO DE VENTAS: 15 clientes x 15 situaciones, preguntas distintas por nivel
  const sales=document.getElementById('gimnasioventas');
  if(sales){
    let level='beginner',game='objections';const stage=document.getElementById('salesGymStage');const mastery=new SessionMastery('sales',['diagnosis','objections','closings','psychology']);
    const clients=[
      ['Marta','45 años','Casada, dos hijos','Cálida pero cuidadosa con el dinero'],['Julián','34 años','Vive con su pareja','Analítico y hace muchas preguntas'],['Sandra','52 años','Familia grande','Amable, necesita sentirse segura'],['David','29 años','Recién casado','Impaciente y directo'],['Paola','41 años','Dos hijos adolescentes','Compara todo antes de decidir'],['Carlos','48 años','Empresario','Tiene poco tiempo y quiere ir al punto'],['Luisa','36 años','Vive con su mamá','Emocional y consulta cada decisión'],['Andrés','39 años','Casado','Desconfiado por una mala compra anterior'],['Natalia','31 años','Pareja joven','Entusiasmada, pero teme endeudarse'],['Ricardo','55 años','Pensionado','Valora garantía y duración'],['Diana','44 años','Jefa de hogar','Práctica y enfocada en utilidad'],['Felipe','33 años','Soltero, recibe a su familia','Habla mucho y cambia de tema'],['Gloria','58 años','Casada','Quiere hablarlo con sus hijos'],['Sebastián','27 años','Vive con su pareja','Le gusta la tecnología, duda del precio'],['Carolina','46 años','Tres hijos','Le interesa la salud, pero pospone decisiones']
    ].map((x,i)=>({id:i,name:x[0],age:x[1],home:x[2],style:x[3]}));
    const topics=['romper el hielo','descubrir qué necesita','hacer preguntas','mostrar valor','involucrar a la pareja','manejar el precio','responder una duda','confirmar interés','evitar hablar de más','usar una comparación','presentar una opción de pago','manejar el “lo pienso”','pedir una decisión','cerrar con calma','confirmar el siguiente paso'];
    function salesQuestion(client,slot,type,lv){
      const topic=topics[slot],ctx=`Cliente: ${client.name} · ${client.age} · ${client.home} · ${client.style}. Tema: ${topic}.`;
      const sets={
        beginner:{objections:['Escuchar la duda, hacer una pregunta sencilla y responder solo lo necesario.',['Explicar todo de una vez.','Cambiar de tema.','Ofrecer un descuento sin preguntar.']],closing:['Recordar lo que más valoró y preguntarle si desea avanzar.',['Llenar la orden sin confirmar.','Hablar más rápido.','Dejarlo pensar sin un próximo paso.']],psychology:['Observar sus palabras y su tono antes de responder.',['Asumir que no quiere comprar.','Ignorar la emoción.','Repetir la misma explicación.']],diagnosis:['Preguntar qué necesita y qué le preocupa antes de mostrar más.',['Seguir presentando todo.','Hablar solo del producto.','Ir directo al precio.']],demo:['Bajar el ritmo, hacer una pregunta y adaptar la demostración a lo que diga.',['Seguir igual.','Hablar más fuerte.','Pasar de inmediato al cierre.']]},
        intermediate:{objections:['Validar lo que dice, descubrir la causa real y responder con una opción concreta.',['Resumir beneficios y preguntar si eso resuelve la duda.','Ofrecer otra forma de pago.','Pedirle que decida al final.']],closing:['Unir lo que dijo que necesita con dos caminos claros para decidir.',['Preguntar si le gustó.','Repetir el precio y esperar.','Ofrecer tiempo sin acordar cuándo hablar.']],psychology:['Leer si busca seguridad, permiso o tiempo, y responder a esa necesidad.',['Centrarse solo en las palabras.','Responder con más datos.','Cambiar de tema para aliviar tensión.']],diagnosis:['Detectar qué faltó entender del cliente y hacer una pregunta antes de seguir.',['Añadir más información.','Mostrar otro producto.','Intentar cerrar para medir interés.']],demo:['Ajustar el ritmo según su emoción y comprobar si se siente más cómodo antes de avanzar.',['Continuar con el guion.','Presentar el precio antes.','Cambiar de producto.']]},
        expert:{objections:['Reconocer la duda, aislar la causa principal, comprobar si hay algo más y responder sin perder el control de la conversación.',['Responder la primera objeción con una solución completa.','Dar dos alternativas y pedir que elija.','Resumir el valor y dejar un silencio.']],closing:['Elegir el momento exacto, conectar necesidad y decisión, y pedir un compromiso claro sin presionar.',['Usar una elección entre dos opciones.','Resumir beneficios y preguntar qué piensa.','Guardar silencio después de mencionar el valor.']],psychology:['Distinguir entre desconfianza, miedo a equivocarse y necesidad de aprobación antes de elegir la siguiente pregunta.',['Responder a la frase literal.','Dar evidencia para aumentar seguridad.','Incluir a la pareja de inmediato.']],diagnosis:['Encontrar la causa que está frenando la demo, explicar su efecto y corregir con una pregunta precisa.',['Cambiar el ritmo general.','Volver a una parte anterior.','Hacer una prueba de cierre.']],demo:['Leer el estado del cliente, ajustar una sola cosa y medir su reacción antes de continuar.',['Cambiar varias cosas a la vez.','Ir al cierre para probar interés.','Dar más información para recuperar confianza.']]}
      };
      const [best,others]=sets[lv][type];
      const q=type==='demo'?'¿Qué harías tú ahora?':type==='objections'?'¿Qué harías tú?':type==='closing'?'¿Cómo seguirías?':type==='psychology'?'¿Qué crees que está sintiendo y qué harías?':type==='diagnosis'?'¿Qué falta y cómo lo corregirías?':'¿Qué harías tú?';
      return item(q,ctx,best,others,`Esta opción se adapta mejor a ${client.name} y al momento de la conversación.`,`Puede estar ${slot%3===0?'desconfiado':slot%3===1?'impaciente':'interesado, pero todavía inseguro'}.`,`No uses una respuesta memorizada. Escucha y ajusta tu siguiente paso.`)
    }
    const clientBags={};
    function nextCase(type){const client=fresh(clients,`sales-client-${type}-${level}`);const slot=fresh(Array.from({length:15},(_,i)=>i),`sales-slot-${type}-${level}-${client.id}`);return {client,slot,q:salesQuestion(client,slot,type,level)}}
    function shell(title,desc){stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${levelLabel[level]}</span><h3>${title}</h3></div><span class="badge">15 clientes · 15 situaciones</span></div>${how(title,desc,level)}<div class="question-zone"></div>`}
    function play(type){const names={objections:'Responde la objeción',closing:'Elige cómo cerrar',psychology:'Entiende al cliente',demo:'Demo virtual',diagnosis:'Encuentra qué falta'};const desc={objections:'Escucha la duda y elige qué dirías tú.',closing:'Elige cómo ayudarías al cliente a tomar una decisión.',psychology:'Mira lo que dice y también lo que puede estar sintiendo.',demo:'Cada respuesta cambia el estado del cliente. Ajusta la demo con calma.',diagnosis:'Descubre qué está frenando la conversación y cómo lo mejorarías.'};const c=nextCase(type);shell(names[type],desc[type]);if(type==='demo')stage.querySelector('.question-zone').insertAdjacentHTML('beforebegin',`<div class="client-state"><span class="state suspicious">🤨 Desconfiado</span><span>Interés <b>${48+c.slot*3}%</b></span><span>Paciencia <b>${72-c.slot*2}%</b></span><p>💡 Consejo: mira su reacción, haz una pregunta y cambia solo una cosa a la vez.</p></div>`);renderQuestion(stage,c.q,g=>{const area=type==='closing'?'closings':type==='demo'?'psychology':type;mastery.add(area,g,level);if(type==='demo'){const st=stage.querySelector('.client-state .state');st.className='state '+(g?'receptive':'impatient');st.textContent=g?'🙂 Más cómodo':'😣 Más impaciente';}},()=>play(type),'Siguiente pregunta')}
    document.getElementById('salesDifficulty').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;sales.querySelectorAll('#salesDifficulty button').forEach(x=>x.classList.toggle('active',x===b));pools.clear();play(game)};
    sales.querySelectorAll('[data-sales-game]').forEach(b=>b.onclick=()=>{sales.querySelectorAll('[data-sales-game]').forEach(x=>x.classList.toggle('active',x===b));game=b.dataset.salesGame;play(game)});play('objections');
  }
})();

// ===== Bleu One v3.2 · Bancos amplios, demo experta y cronómetro guiado =====
(()=>{
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const labels={beginner:'Principiante',intermediate:'Intermedio',expert:'Experto'};
  const bags=new Map();
  function fresh(list,key){let b=bags.get(key);if(!b||!b.length)b=shuffle(list.map((_,i)=>i));const idx=b.shift();bags.set(key,b);return list[idx]}
  const choice=(correct,wrong)=>shuffle([{text:correct,ok:true},...wrong.map(text=>({text,ok:false}))]);
  function qObj(q,ctx,correct,wrong,why,tip,thought=''){return {q,ctx,choices:choice(correct,wrong),why,tip,thought}}
  function drawQuestion(stage,data,next,score){stage.innerHTML=`<div class="game-counter"><span>${score}</span><span>La mejor respuesta puede estar en cualquier opción</span></div>${data.ctx?`<div class="case-context">${data.ctx}</div>`:''}<div class="game-question">${data.q}</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="expert-insight" hidden><article><span>⭐ Por qué esta es la mejor</span><p>${data.why}</p></article>${data.thought?`<article><span>🧠 Lo que puede estar pensando</span><p>${data.thought}</p></article>`:''}<article><span>💡 Consejo sencillo</span><p>${data.tip}</p></article></div><button class="primary-action next-v32" hidden>Siguiente pregunta <span>→</span></button>`;
    const opts=stage.querySelector('.game-options'),fb=stage.querySelector('.game-feedback'),ins=stage.querySelector('.expert-insight'),btn=stage.querySelector('.next-v32');
    data.choices.forEach((c,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${String.fromCharCode(65+i)}</b><span>${c.text}</span>`;b.onclick=()=>{[...opts.children].forEach(x=>x.disabled=true);b.classList.add(c.ok?'correct':'wrong');const k=data.choices.findIndex(x=>x.ok);opts.children[k]?.classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(c.ok?'good':'bad');fb.innerHTML=c.ok?'✓ <strong>Muy bien.</strong> Elegiste la opción que mejor cuida el proceso.':'Esta opción podría servir, pero había una más completa. Mira el porqué.';ins.hidden=false;btn.hidden=false};opts.appendChild(b)});btn.onclick=next;
  }

  // EXPERTO EN LA DEMO
  const demoSteps=[
    {title:'Rompehielo',purpose:'Generar confianza y descubrir cómo adaptar toda la demostración.',before:'Llega puntual, con buena presentación y materiales limpios. Aprende los nombres de la familia.',during:['Escucha más de lo que hablas: cerca de 70% escuchar y 30% hablar.','Pregunta hace cuánto viven allí, quién cocina, qué valoran y cómo es su rutina.','Una casa propia puede hablar de estabilidad; vivir muchos años en el sector puede mostrar una red cercana.','Descubre si lo que más valoran es salud, tiempo, ahorro, facilidad o exclusividad.'],after:'Debes saber quién decide, quién cocina, qué problema quieres resolver y qué tema conectará mejor con la familia.',tips:['No conviertas el rompehielo en interrogatorio. Conversa con naturalidad.','El rompehielo también prepara el 4 en 14: escucha nombres, familiares, vecinos y relaciones.','No supongas que todos compran por salud. Usa lo que la familia te diga.']},
    {title:'Presentación de la compañía',purpose:'Dar seguridad y respaldo sin alargar la visita ni intentar vender todavía.',before:'Ten una explicación corta y clara: compañía estadounidense, más de 65 años de experiencia, innovación, tecnología y calidad.',during:['Pregunta qué les transmite una compañía con tantos años en el mercado.','Explica que en Colombia existe una trayectoria sólida y acompañamiento.','Conecta con preguntas: “Del 1 al 10, ¿qué tan importante es la salud para su familia?”'],after:'La familia debe sentir que está frente a una compañía seria y a una persona preparada.',tips:['Este paso es corto. No recites una historia larga.','Habla de respaldo, no de nombres comerciales.','Pregunta y escucha; no conviertas el paso en una conferencia.']},
    {title:'Metales y bicarbonato',purpose:'Comparar los utensilios que la familia realmente usa y generar una experiencia visible.',before:'Pide los utensilios donde hacen huevos, chocolate y arroz. No los más nuevos: los que más usan.',during:['El cliente debe poner el agua y media cucharada de bicarbonato de sodio.','Pon todos los utensilios a hervir antes de explicar los materiales. Mientras hierven, conversa: así ahorras tiempo.','Incluye también el utensilio que llevaste para hacer la misma comparación.','Explica con equilibrio: el aluminio conduce bien el calor; los recubrimientos dañados deben cuidarse y cambiarse; cada material merece estudio.'],after:'Déjalos enfriar un poco. En “todos a la vez”, cada persona usa una cuchara limpia y prueba primero el agua del utensilio que llevaste.',tips:['Debe ser bicarbonato de sodio. No sal ni sustitutos.','Primero prueban el agua de tu utensilio para no confundir el sabor.','No hables como químico. Invita a investigar y consultar al Distribuidor o a alguien experimentado.']},
    {title:'Presentación del producto y cocinado',purpose:'Mostrar beneficios reales mientras la familia vive la experiencia.',before:'Enjuaga bien el utensilio, déjalo seco y precaliéntalo a fuego medio o medio-alto durante uno o dos minutos.',during:['Pon primero el pollo sin aceite y deja la tapa medio cerrada.','Cuando suelte su grasa natural, muéstralo: no fue necesario agregar aceite.','Voltea el pollo, añade los demás ingredientes y aproximadamente medio vaso de agua.','Deja la válvula abierta; cuando avise, baja el fuego al mínimo, cierra la válvula y espera cerca de 15 minutos.'],after:'Sirve de forma ordenada y profesional. Guía la degustación y deja el pollo para el final porque suele generar mayor impacto.',tips:['Si al cumplir una hora desde que llegaste ya están comiendo, vas bien.','Habla de salud, ahorro de tiempo, ahorro de dinero, facilidad, garantía, exclusividad y versatilidad según la familia.','No hace falta ser experto en cocina para usar el sistema.']},
    {title:'Brochure y catálogo',purpose:'Ayudar al cliente a visualizar opciones sin saturarlo.',before:'Recuerda qué necesidad expresó la familia y qué productos llamaron su atención durante la demo.',during:['Comienza por la opción más completa y luego baja: esto ayuda a crear una referencia de valor.','No muestres todo el catálogo. Detente en lo que conecte con la necesidad.','Usa el brochure para explicar opciones y resolver preguntas concretas.'],after:'El cliente debe comprender qué opción le ayuda y por qué, no solo recordar muchos productos.',tips:['Asesora; no leas páginas.','Empieza alto y baja con sentido, no para presionar.','Muestra menos y explica mejor.']},
    {title:'Negociación y papelería',purpose:'Convertir el valor descubierto en una cuota cómoda y una decisión clara.',before:'Resume lo que la familia dijo que quería: salud, tiempo, ahorro, facilidad o duración.',during:['Piensa en cuotas, no solo en el precio total.','Pregunta cuánto podría separar cada integrante de forma quincenal después de sus gastos.','Suma la capacidad mensual y usa la calculadora de Cuota para encontrar una opción responsable.','Ante “es caro”, vuelve al valor, al uso diario, a la duración y a una opción que sí puedan manejar.'],after:'La decisión debe sentirse entendida, responsable y sin sorpresas en la papelería.',tips:['No regales valor antes de entender la objeción.','Usa cierres sencillos: doble opción, resumen, prueba, alternativa y confirmación.','Una objeción no siempre es precio; puede ser miedo, falta de confianza o necesidad de hablarlo.']},
    {title:'Programa 4 en 14 e invitación',purpose:'Convertir una buena experiencia en nuevas visitas y actividad.',before:'Termina primero la negociación. Luego crea el puente emocional hacia el programa.',during:['Aplica los pasos del 4 en 14 en orden.','Aclara que son 4 visitas, mínimo una venta y 14 días.','Activa las visitas desde la casa y evita salir solo con teléfonos.','Haz la invitación a la oportunidad de forma breve y respetuosa.'],after:'Debes salir con visitas reales, programa entendido y próximos pasos claros.',tips:['Una buena demo prepara un buen 4 en 14.','No confundas vender con activar el programa.','La demostración completa, con 4 en 14, no debe pasar de 3 horas.']}
  ];
  const demo=document.getElementById('expertodemo');
  if(demo){let step=0,count=0;const card=document.getElementById('demoLearningCard'),zone=document.getElementById('demoPracticeZone');
    const practice=Array.from({length:15},(_,i)=>qObj('¿Qué harías tú?',`Situación ${i+1}: estás en el paso ${demoSteps[step].title}.`,demoSteps[step].during[i%demoSteps[step].during.length],[`Explicaría todo de una vez para ahorrar preguntas.`,`Pasaría al siguiente paso sin confirmar si entendieron.`,`Usaría el mismo discurso con todas las familias.`],`Esta acción protege el objetivo real del paso: ${demoSteps[step].purpose.toLowerCase()}`,demoSteps[step].tips[i%demoSteps[step].tips.length]));
    function renderStep(){const d=demoSteps[step];card.innerHTML=`<span class="game-kicker">PASO ${step+1} DE 7</span><h3>${d.title}</h3><p class="demo-purpose">${d.purpose}</p><div class="demo-info-grid"><article><h4>Antes de empezar</h4><p>${d.before}</p></article><article><h4>Mientras lo haces</h4><ul>${d.during.map(x=>`<li>${x}</li>`).join('')}</ul></article><article><h4>Cómo saber si salió bien</h4><p>${d.after}</p></article><article><h4>Error que debes evitar</h4><p>No correr por cumplir el paso ni repetir un guion sin escuchar a la familia.</p></article></div><div class="demo-tip-stack">${d.tips.map(x=>`<div>💡 ${x}</div>`).join('')}</div>`;count=0;showPractice()}
    function showPractice(){const list=Array.from({length:15},(_,i)=>qObj('¿Qué harías tú?',`Caso ${i+1} de ${demoSteps[step].title}.`,demoSteps[step].during[i%demoSteps[step].during.length],[demoSteps[step].tips[(i+1)%3],`Pasaría rápido al siguiente paso.`,`Daría mucha más información sin preguntar.`],`La mejor acción mantiene el objetivo de ${demoSteps[step].title.toLowerCase()} y prepara el paso siguiente.`,demoSteps[step].tips[i%3]));const data=fresh(list,`demo-${step}`);count++;document.getElementById('demoPracticeCount').textContent=`${Math.min(count,15)} de 15`;drawQuestion(zone,data,showPractice,`Paso ${step+1}`)}
    document.getElementById('demoStepTabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;step=+b.dataset.demoStep;demo.querySelectorAll('#demoStepTabs button').forEach(x=>x.classList.toggle('active',x===b));renderStep()};renderStep();
  }

  // GIMNASIO 4 EN 14, 15 CASOS REALES POR JUEGO Y NIVEL
  const g=document.getElementById('gimnasio414');
  if(g){g.innerHTML=`<section class="panel gym-hero"><div><span class="eyebrow">Entrena, repite, mejora</span><h3>🏋️ Gimnasio 4 en 14</h3><p>Cada juego tiene al menos 15 casos diferentes en Principiante, Intermedio y Experto.</p></div><div class="mastery-ring"><strong id="v32gScore">0%</strong><span>Avance de esta sesión</span></div></section><section class="panel difficulty-panel"><div><span class="eyebrow">Nivel</span><h3>Elige la dificultad</h3><p>Las preguntas cambian por completo al cambiar de nivel.</p></div><div class="difficulty-switch" id="v32gLevel"><button class="active" data-level="beginner">Principiante</button><button data-level="intermediate">Intermedio</button><button data-level="expert">Experto</button></div></section><div class="gym-menu" id="v32gMenu"><button class="gym-mode active" data-mode="objections">🧪 Objeciones</button><button class="gym-mode" data-mode="markets">📊 Mercados</button><button class="gym-mode" data-mode="errors">🚨 Encuentra el error</button><button class="gym-mode" data-mode="order">🧩 Orden perfecto</button><button class="gym-mode" data-mode="speech">🎤 Completa el speech</button><button class="gym-mode" data-mode="timer">⏱️ Entrena tu instantánea</button><button class="gym-mode" data-mode="mind">🧠 Piensa como experto</button><button class="gym-mode" data-mode="quick">⚡ Reto 10 segundos</button><button class="gym-mode" data-mode="mentor">💎 Modo mentor</button></div><section class="panel gym-stage" id="v32gStage"></section>`;
    let level='beginner',mode='objections',answered=0,correct=0;const st=document.getElementById('v32gStage');
    const names=['Marta','Carlos','Andrea','Julián','Sandra','Felipe','Natalia','Ricardo','Paola','Andrés','Diana','Luisa','Sebastián','Gloria','Camilo'];
    const profiles=['familia cercana y dos hijos','vive con su pareja y cocina poco','docente con red familiar amplia','empresario con poco tiempo','hogar donde cocina la mamá','pareja joven y muy sociable','familia reservada','cliente entusiasmado pero inseguro','vive hace muchos años en el sector','cliente que conoce a sus vecinos','familia que valora la salud','cliente que prefiere compañeros de trabajo','hogar con decisiones compartidas','cliente que pospone llamadas','familia con varios programas antiguos'];
    const gameThemes={objections:['no quiere molestar a su familia','dice que no conoce a nadie','prefiere llamar después','no quiere dar teléfonos','cree que nadie tendrá tiempo','solo ofrece compañeros lejanos','no quiere incluir a su jefe','piensa que la experiencia obliga a comprar','quiere explicar todo por teléfono','se desanima porque no contestan','cree que una venta ya completa el programa','no quiere activar en ese momento','dice que las cuatro visitas son demasiadas','teme quedar mal con su recomendación','quiere dejar todo para otra semana'],markets:['cocina a diario y vive en familia','vive solo y come fuera','trabaja desde casa con su pareja','es pensionado y disfruta cocinar','tiene hijos y poco tiempo','no cocina pero su pareja sí','vive con su mamá y ambas cocinan','tiene una red grande de vecinos','está desempleado y vive solo','es empresario y casado','tiene casa propia y estabilidad','se mudó hace poco y conoce poca gente','es docente y muy sociable','vive en arriendo con familia estable','acepta la visita pero falta calificar'],errors:['anota nombres sin preguntar','empieza por el mejor prospecto','deja que el cliente hable cinco minutos','sale sin hacer instantánea','confunde una venta con el programa completo','espera más de 48 horas para seguir','manda una cadena genérica','agenda para dos semanas después','no confirma quién estará presente','acepta todos los nombres sin calificar','cambia el orden de los pasos','habla de premios sin crear puente','no explica las condiciones completas','abandona un programa con tres visitas','reactiva un programa sin autorización'],order:['puente antes de premios','premios antes de nombres','nombres antes de calificar','calificar antes de explicar','explicar antes de activar','instantánea antes de salir','seguimiento cerca de 48 horas','mover programas al revisar antiguos','activar con llamada primero','mensaje de voz como segunda opción','foto real como tercera opción','iniciar con contacto 6 o 7','confirmar fecha y dirección','completar 4 visitas y una venta','pedir autorización para reactivar'],speech:['pedir familiares con respeto','explicar que no hay obligación','pasar el teléfono de forma breve','preguntar fecha concreta','confirmar dirección','confirmar núcleo familiar','decir “vamos a llamar”','mantener curiosidad','explicar 4 visitas y una venta','hacer seguimiento','reactivar programas','pedir el contacto del jefe','guiar por perfiles','preguntar quién cocina','cerrar la llamada con compromiso'],mind:['detectar miedo a molestar','entender una respuesta vaga','leer desconfianza','mantener el ritmo','proteger el primer círculo','no adivinar quién comprará','distinguir cantidad de calidad','recuperar una llamada fallida','saber cuándo callar','evitar explicar de más','convertir intención en cita','mantener al cliente involucrado','revisar lo que falta','recuperar actividad antigua','pedir permiso al Distribuidor'],quick:['elegir el siguiente contacto','decidir si un mercado sirve','responder a “yo le aviso”','manejar una llamada sin respuesta','corregir una secuencia','detectar una cita débil','confirmar un dato faltante','evitar un mensaje genérico','proteger el tiempo','escoger el primer círculo','completar el programa','hacer seguimiento','reactivar con permiso','explicar sin vender','cerrar la instantánea'],mentor:['guiar sin presionar','hacer una pregunta mejor','detener una explicación larga','mejorar una lista débil','recuperar el liderazgo','escuchar la emoción','convertir un “después” en fecha','dar una instrucción clara','revisar un mercado','completar visitas pendientes','corregir un paso omitido','mantener confianza','pedir autorización','hacer seguimiento','cuidar el orden']};
    function makeCases(m,l){const themes=gameThemes[m]||gameThemes.objections;return themes.map((t,i)=>{const harder=l==='expert',mid=l==='intermediate';const ctx=`${names[i]}: ${profiles[i]}. Situación: ${t}.`;let best,others,why;
      if(m==='markets'){best=harder?'Haría dos preguntas más sobre convivencia, cocina y quién decide antes de priorizar la visita.':mid?'Calificaría el hogar y confirmaría quién estará presente antes de agendar.':'Preguntaría quién cocina, con quién vive y por qué disfrutaría la experiencia.';others=['Agendaría porque aceptó recibir la visita.','Lo descartaría solo por un dato del perfil.','Decidiría por su ocupación sin preguntar más.'];why='Un buen mercado se descubre preguntando. Aceptar una visita no basta.'}
      else if(m==='order'){best=`Colocaría “${t}” en el punto donde prepara mejor el siguiente paso y revisaría qué se dañaría si lo salto.`;others=['Lo pondría al final porque todos los pasos sirven igual.','Lo haría solo si el cliente está muy interesado.','Cambiaría el orden para ahorrar tiempo.'];why='La magia está en el orden: cada paso prepara emocionalmente el siguiente.'}
      else if(m==='speech'){best=`Usaría una frase corta, segura y natural para ${t}, y terminaría con una acción concreta.`;others=['Daría una explicación larga para evitar preguntas.','Preguntaría de forma insegura si se puede continuar.','Dejaría el siguiente paso abierto.'];why='Un buen speech no busca sonar bonito: busca mover el programa con claridad.'}
      else{best=harder?`Validaría lo que siente, haría una pregunta corta y elegiría la acción que proteja el orden y mantenga el programa vivo.`:mid?`Escucharía, aclararía la duda y propondría un siguiente paso concreto sin presionar.`:`Le explicaría con calma y lo guiaría al siguiente paso del 4 en 14.`;others=['Aceptaría la primera respuesta y seguiría sin profundizar.','Hablaría mucho para convencerlo.','Cambiaría de paso para evitar la incomodidad.'];why='La mejor opción cuida la confianza, el orden y la actividad; no intenta cerrar una venta.'}
      return qObj('¿Qué harías tú?',ctx,best,others,why,harder?'En nivel Experto, varias opciones parecen útiles. Elige la que mejor protege todo el sistema.':mid?'No busques una frase perfecta; busca el siguiente paso correcto.':'Piensa en el objetivo de este paso, no en vender.',i%3===0?'Puede estar inseguro.':i%3===1?'Puede sentir que lo están presionando.':'Puede no haber entendido el programa.')})}
    function shell(title,desc){st.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${labels[level]}</span><h3>${title}</h3></div><span class="badge">15 casos distintos</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><h4>${title}</h4><p>${desc}</p><small>${level==='beginner'?'Casos claros y consejos antes de avanzar.':level==='intermediate'?'Casos más parecidos a la vida real.': 'Casos difíciles; varias opciones pueden servir, pero una cuida mejor el sistema.'}</small></div><div class="question-zone"></div>`}
    function play(){if(mode==='timer'){timer();return}const titles={objections:'Objeciones del 4 en 14',markets:'Califica el mercado',errors:'Encuentra el error',order:'Orden perfecto',speech:'Completa el speech',mind:'Piensa como experto',quick:'Reto de 10 segundos',mentor:'Modo mentor'};shell(titles[mode],`Lee la situación y elige lo que harías. Al responder verás una explicación sencilla.`);const list=makeCases(mode,level),data=fresh(list,`v32-${mode}-${level}`);drawQuestion(st.querySelector('.question-zone'),data,()=>{answered++;play()},`Caso ${Math.min(answered+1,15)} de 15`)}
    function timer(){st.innerHTML=`<div class="game-head"><div><span class="game-kicker">Entrena tu instantánea</span><h3>Agenda en 1 minuto y 30 segundos</h3></div><span class="badge">01:30</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><h4>Practica una llamada completa</h4><p>El cronómetro te irá diciendo qué debes lograr en cada momento. La meta es terminar con fecha, hora, dirección y compromiso.</p></div><div class="timer-phase-list"><article><b>0–20 s</b><small>Preséntate y rompe el hielo</small></article><article><b>20–50 s</b><small>Explica brevemente la experiencia</small></article><article><b>50–70 s</b><small>Agenda y toma los datos</small></article><article><b>70–90 s</b><small>Compromete y “amarra” la cita</small></article></div><div class="timer-display" id="v32timer">01:30</div><div class="timer-live-guide"><span id="v32phase">PREPARACIÓN</span><strong id="v32title">Respira y habla con seguridad</strong><p id="v32tip">No vas a vender por teléfono. Vas a dejar una visita confirmada.</p></div><div class="timer-progress"><i id="v32prog"></i></div><div class="timer-actions"><button class="primary-action" id="v32start">Comenzar</button><button class="small-action" id="v32reset">Reiniciar</button></div>`;let left=90,t;const phases=[{min:71,k:'0–20 SEGUNDOS',h:'Preséntate y rompe el hielo',p:'Di tu nombre, menciona quién lo recomendó y crea cercanía.'},{min:41,k:'20–50 SEGUNDOS',h:'Explica brevemente la experiencia',p:'Una frase clara: experiencia en familia, detalle y sin obligación. No expliques todo.'},{min:21,k:'50–70 SEGUNDOS',h:'Agenda la visita y toma los datos',p:'Ofrece hoy, mañana o máximo pasado mañana. Confirma fecha, hora y dirección.'},{min:0,k:'70–90 SEGUNDOS',h:'Compromete y amarra la cita',p:'Confirma quién estará presente, repite los datos y deja un acuerdo claro.'}];const paint=()=>{document.getElementById('v32timer').textContent=`0${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;document.getElementById('v32prog').style.width=`${(90-left)/.9}%`;const ph=phases.find(x=>left>=x.min);document.getElementById('v32phase').textContent=ph.k;document.getElementById('v32title').textContent=ph.h;document.getElementById('v32tip').textContent=ph.p};document.getElementById('v32start').onclick=()=>{clearInterval(t);left=90;paint();t=setInterval(()=>{left--;paint();if(left<=0){clearInterval(t);document.getElementById('v32phase').textContent='TERMINADO';document.getElementById('v32title').textContent='¿Saliste con fecha, hora, dirección y compromiso?';document.getElementById('v32tip').textContent='Si faltó uno, repite la llamada y concéntrate en cerrar la agenda, no en explicar más.'}},1000)};document.getElementById('v32reset').onclick=timer}
    document.getElementById('v32gLevel').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;g.querySelectorAll('#v32gLevel button').forEach(x=>x.classList.toggle('active',x===b));bags.clear();answered=0;play()};document.getElementById('v32gMenu').onclick=e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.mode;g.querySelectorAll('#v32gMenu button').forEach(x=>x.classList.toggle('active',x===b));answered=0;play()};play();
  }

  // GIMNASIO DE VENTAS: 15 CLIENTES, 15 SITUACIONES DIFERENTES POR NIVEL
  const sales=document.getElementById('gimnasioventas');
  if(sales){const stage=document.getElementById('salesGymStage');let level='beginner',game='objections',clientIndex=0,step=0;const clients=['Marta, madre de dos hijos y cuidadosa con el dinero','Carlos, empresario con poco tiempo','Andrea, docente que hace muchas preguntas','Julián, recién casado y analítico','Sandra, muy familiar y necesita seguridad','Felipe, habla mucho y cambia de tema','Natalia, entusiasmada pero teme endeudarse','Ricardo, pensionado y enfocado en duración','Paola, compara todo antes de decidir','Andrés, desconfiado por una compra anterior','Diana, práctica y enfocada en utilidad','Luisa, consulta cada decisión con su mamá','Sebastián, interesado en tecnología','Gloria, quiere hablarlo con sus hijos','Camilo, valora salud pero pospone decisiones'];const stages=['llegada y confianza','descubrir quién cocina','conocer la prioridad','presentar respaldo','prueba de metales','mostrar el producto','cocinado','degustación','usar el brochure','presentar la opción más completa','hablar de cuota','escuchar una objeción','confirmar interés','pedir una decisión','cerrar el siguiente paso'];
    function makeSales(l,g){return clients.map((c,i)=>stages.map((s,j)=>{const ctx=`Cliente ${i+1}: ${c}. Momento: ${s}.`;const complex=l==='expert',mid=l==='intermediate';const best=g==='demo'?complex?'Observaría su reacción, haría una pregunta precisa y cambiaría solo una cosa antes de seguir.':mid?'Comprobaría si entendió y adaptaría la explicación a lo que más valora.':'Le haría una pregunta sencilla y seguiría con calma.':g==='objections'?complex?'Validaría la duda, descubriría la razón real y respondería solo a esa razón antes de confirmar si quedó resuelta.':mid?'Escucharía, preguntaría qué es lo que más le preocupa y respondería con una opción concreta.':'Escucharía la duda y preguntaría qué parte le preocupa más.':g==='closing'?complex?'Uniría lo que el cliente dijo que necesita con dos opciones claras y pediría un compromiso sin presionar.':mid?'Resumiría lo que más valoró y le daría dos formas sencillas de avanzar.':'Le recordaría el beneficio que eligió y preguntaría si desea continuar.':g==='psychology'?complex?'Distinguiría si está cansado, desconfiado, confundido o buscando aprobación antes de hablar.':mid?'Miraría su tono, sus pausas y a quién consulta antes de responder.':'Escucharía sus palabras y observaría si se siente cómodo.':'Revisaría qué parte de la demo quedó débil y haría una pregunta antes de agregar información.';return qObj('¿Qué harías tú?',ctx,best,['Hablaría más para asegurarme de que entienda.','Iría directo al precio para medir interés.','Cambiaría de tema y seguiría con el guion.'],`Esta respuesta se adapta al momento de la demo y a la forma de ser de este cliente.`,`Habla como una persona, no como un manual.`,j%4===0?'Puede estar desconfiado.':j%4===1?'Puede estar impaciente.':j%4===2?'Puede estar confundido.':'Puede estar interesado, pero inseguro.')}))}
    function playSales(){const bank=makeSales(level,game);const ci=fresh(clients.map((_,i)=>i),`sales-c-${game}-${level}`);const si=fresh(stages.map((_,i)=>i),`sales-s-${game}-${level}-${ci}`);const data=bank[ci][si];stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${labels[level]}</span><h3>${game==='demo'?'Demo virtual':game==='objections'?'Objeciones':game==='closing'?'Cierres':game==='psychology'?'Entiende al cliente':'Encuentra qué falta'}</h3></div><span class="badge">15 clientes · 15 situaciones</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><h4>Entrena con una familia diferente</h4><p>Lee la situación y responde con palabras sencillas. Las preguntas y los clientes cambian según el nivel.</p></div>${game==='demo'?`<div class="client-state"><span class="state suspicious">🤨 ${si%4===0?'Desconfiado':si%4===1?'Impaciente':si%4===2?'Confundido':'Interesado'}</span><span>Interés <b>${45+si*3}%</b></span><span>Paciencia <b>${85-si*3}%</b></span><p>💡 Mira el estado del cliente y ajusta el ritmo. No siempre necesita más información.</p></div>`:''}<div class="question-zone"></div>`;drawQuestion(stage.querySelector('.question-zone'),data,playSales,`Cliente ${ci+1} · Situación ${si+1}`)}
    document.getElementById('salesDifficulty').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;sales.querySelectorAll('#salesDifficulty button').forEach(x=>x.classList.toggle('active',x===b));bags.clear();playSales()};sales.querySelectorAll('[data-sales-game]').forEach(b=>b.onclick=()=>{game=b.dataset.salesGame;sales.querySelectorAll('[data-sales-game]').forEach(x=>x.classList.toggle('active',x===b));playSales()});playSales();
  }
})();

// ===== Bleu One v3.3 · Gimnasios simplificados, sin repeticiones y práctica clara =====
(()=>{
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const bags=new Map();
  function nextFresh(list,key){let b=bags.get(key);if(!b||!b.length)b=shuffle(list.map((_,i)=>i));const i=b.shift();bags.set(key,b);return list[i]}
  function answers(best,other){return shuffle([best,...other]).map(t=>({text:t,ok:t===best}))}
  function ask(root,data,next,label='Siguiente pregunta'){
    root.innerHTML=`<div class="game-counter"><span>${data.count||''}</span><span>Lee la situación y elige lo que tú harías</span></div><div class="case-context">${data.context}</div><div class="game-question">${data.q}</div><div class="game-options"></div><div class="game-feedback" hidden></div><div class="expert-insight" hidden><article><span>⭐ Por qué esta es la mejor</span><p>${data.why}</p></article>${data.tip?`<article><span>💡 Consejo sencillo</span><p>${data.tip}</p></article>`:''}</div><button class="primary-action v33-next" hidden>${label} <span>→</span></button>`;
    const box=root.querySelector('.game-options'),fb=root.querySelector('.game-feedback'),ins=root.querySelector('.expert-insight'),btn=root.querySelector('.v33-next');
    data.options.forEach((o,i)=>{const b=document.createElement('button');b.innerHTML=`<b>${String.fromCharCode(65+i)}</b><span>${o.text}</span>`;b.onclick=()=>{[...box.children].forEach(x=>x.disabled=true);b.classList.add(o.ok?'correct':'wrong');const k=data.options.findIndex(x=>x.ok);box.children[k]?.classList.add('correct');fb.hidden=false;fb.className='game-feedback '+(o.ok?'good':'bad');fb.innerHTML=o.ok?'✓ <strong>Muy bien.</strong> Elegiste la opción que mejor cuida el proceso.':'Esta opción podría servir, pero había una más completa. Mira la explicación.';ins.hidden=false;btn.hidden=false};box.appendChild(b)});btn.onclick=next;
  }
  // Experto en la Demo: cinco preguntas reales por paso y tip de metales corregido.
  const demo=document.getElementById('expertodemo');
  if(demo){
    const card=document.getElementById('demoLearningCard'),zone=document.getElementById('demoPracticeZone'),tabs=document.getElementById('demoStepTabs');
    const stepNames=['Rompehielo','Presentación de la compañía','Metales y bicarbonato','Producto y cocinado','Brochure y catálogo','Negociación y papelería','Programa 4 en 14 e invitación'];
    const qs=[
      [
        ['La familia te cuenta que vive hace 14 años en la misma casa y conoce a casi todos los vecinos. ¿Qué información útil acabas de descubrir?','Que puede existir estabilidad y una red cercana que vale la pena conocer.',['Que todos los vecinos comprarán.','Que debes pedir teléfonos de inmediato.','Que ya no hace falta seguir conversando.'],'El dato ayuda a entender estabilidad y posibles relaciones, pero todavía debes seguir escuchando.'],
        ['La esposa dice que cocinar le quita demasiado tiempo. ¿Qué deberías hacer con esa información?','Recordarla para mostrar después cómo el sistema puede ayudarle a cocinar más rápido.',['Cambiar de tema y hablar solo de salud.','Explicar inmediatamente todos los productos.','Prometerle un tiempo exacto para todas las recetas.'],'El rompehielo sirve para descubrir por dónde conectar la demostración.'],
        ['El cliente responde poco y mira el reloj. ¿Qué harías tú?','Haría preguntas cortas, escucharía y avanzaría con naturalidad sin volverlo un interrogatorio.',['Haría muchas preguntas seguidas para obtener toda la información.','Hablaría más para llenar los silencios.','Saltaría directamente al precio.'],'La confianza se construye con naturalidad, no con presión.'],
        ['Descubres que para la familia lo más importante es ahorrar dinero. ¿Qué cambia en tu demostración?','Darías más importancia al ahorro de gas, agua, tiempo y compras repetidas.',['Seguirías hablando principalmente de salud.','Evitarías mencionar otros beneficios.','Pasarías directo a la negociación.'],'La demostración se adapta a lo que la familia valora, no a lo que tú prefieres explicar.'],
        ['¿Cómo sabes que el rompehielo salió bien?','Conoces quién cocina, quién decide, qué les preocupa y qué beneficio valoran más.',['Lograste contar toda tu historia personal.','Hablaste más tiempo que la familia.','Ya te dieron nombres para el 4 en 14.'],'El objetivo es conocer a la familia y preparar el resto de la demo.']
      ],
      [
        ['La familia nunca ha escuchado de la compañía. ¿Qué harías tú?','Explicaría de forma breve su trayectoria, respaldo y experiencia, y preguntaría qué les transmite eso.',['Daría una conferencia completa sobre la historia.','Pasaría al producto sin aclarar nada.','Prometería que es la mejor compañía del mundo.'],'Este paso busca seguridad y respaldo, no cansar a la familia.'],
        ['El cliente pregunta por qué debería confiar. ¿Qué respuesta ayuda más?','Hablar de años de experiencia, acompañamiento y calidad de forma sencilla.',['Decirle que confíe porque tú se lo aseguras.','Mostrar precios de inmediato.','Evitar la pregunta y continuar.'],'La confianza se apoya en hechos fáciles de entender.'],
        ['¿Qué debes evitar en la presentación de empresa?','Una explicación larga, técnica y llena de nombres que la familia no recordará.',['Hacer una pregunta al cliente.','Mencionar trayectoria.','Hablar de respaldo.'],'Es un paso corto: debe dejar seguridad, no saturación.'],
        ['Después de explicar la trayectoria, ¿qué pregunta sencilla sirve para involucrar al cliente?','¿Qué le transmite una compañía con tantos años de experiencia?',['¿Cuánto dinero tiene disponible?','¿Qué set quiere comprar?','¿A quién podría recomendar?'],'La pregunta hace que el cliente exprese por sí mismo la confianza que le genera el respaldo.'],
        ['¿Cómo sabes que este paso funcionó?','La familia entiende que hay una organización seria y se siente más tranquila para continuar.',['La familia memorizó todas las fechas.','Ya escogió un producto.','Te dio documentos para crédito.'],'Aquí buscas tranquilidad y respaldo, todavía no una decisión de compra.']
      ],
      [
        ['La cliente quiere sacar las ollas más nuevas porque le da pena mostrar las usadas. ¿Qué harías tú?','La guiaría con naturalidad a sacar donde hace huevos, chocolate y arroz, porque son las que realmente usa.',['Aceptaría solo las nuevas.','Le diría que las viejas son mejores para vender.','Sacaría yo cualquier utensilio sin permiso.'],'La comparación tiene más sentido con los utensilios de uso diario.'],
        ['¿Qué debes hacer primero para ahorrar tiempo?','Poner agua y bicarbonato de sodio en todos los utensilios y dejarlos calentando mientras explicas los materiales.',['Explicar todos los metales y después encender el fuego.','Hacer la prueba solo en tu utensilio.','Esperar a terminar el cocinado.'],'Mientras hierve el agua puedes conversar y recortar tiempo sin perder el paso.'],
        ['¿Quién debería poner el agua y el bicarbonato?','El mismo cliente, guiado por el asesor.',['Solo el asesor para controlar el resultado.','La persona que refirió al cliente.','No importa quién lo haga.'],'Cuando el cliente participa, la experiencia se siente más transparente.'],
        ['Antes de probar las demás aguas, ¿cuál deben probar primero?','La del utensilio que llevaste, para no dejar sabores fuertes antes.',['La del utensilio más viejo.','La del aluminio.','Todas mezcladas.'],'El orden ayuda a que las papilas gustativas no confundan los sabores.'],
        ['¿Cómo debes explicar los metales?','Con palabras sencillas, sin hablar como químico, mostrando diferencias fáciles de entender.',['Usando muchos términos técnicos para demostrar conocimiento.','Afirmando que todos los demás materiales son peligrosos.','Leyendo estudios largos durante la demo.'],'Entre más sencilla la información, más impacto tiene. Como asesor, profundiza por tu cuenta investigando o aprendiendo de tu Distribuidor o de alguien experimentado.']
      ],
      [
        ['Después de enjuagar el utensilio, ¿qué haces antes de poner el pollo?','Lo secas y lo precalientas a fuego medio o medio-alto durante uno o dos minutos.',['Agregas aceite de inmediato.','Lo llenas de agua fría.','Pones todos los ingredientes al mismo tiempo.'],'El precalentado prepara la superficie para mostrar el cocinado sin aceite.'],
        ['El pollo comienza a soltar su propia grasa. ¿Qué oportunidad tienes?','Mostrar a la familia que no fue necesario agregar aceite.',['Botar la grasa sin decir nada.','Agregar más aceite para dorar.','Pasar al catálogo.'],'Ese momento convierte una característica en una experiencia visible.'],
        ['Cuando la válvula avisa, ¿qué haces?','Bajas el fuego al mínimo, cierras la válvula y esperas cerca de 15 minutos.',['Subes el fuego para terminar rápido.','Destapas cada minuto.','Apagas y sirves de inmediato.'],'El control de temperatura permite terminar el cocinado con poco fuego.'],
        ['En la degustación, ¿qué conviene dejar para el final?','El pollo, porque suele tener el sabor que genera mayor impacto.',['El alimento con menos sabor.','El agua del bicarbonato.','El producto más costoso.'],'El orden de degustación ayuda a cerrar con la sensación más fuerte.'],
        ['Ha pasado una hora desde que llegaste y la familia ya está comiendo. ¿Cómo vas de tiempo?','Vas bien: es una señal de que la demostración está avanzando al ritmo aconsejado.',['Vas demasiado rápido.','Debes empezar de nuevo.','Ya deberías estar cerrando el crédito.'],'La demo completa no debería superar dos horas y media o, máximo, tres horas con el 4 en 14.']
      ],
      [
        ['La familia mostró mucho interés en ahorrar tiempo. ¿Cómo usarías el brochure?','Empezaría por opciones completas y me detendría en las que mejor resuelven esa necesidad.',['Mostraría todas las páginas sin preguntar.','Empezaría por lo más barato.','Hablaría solo de materiales.'],'El brochure ayuda a asesorar, no a recitar un catálogo.'],
        ['¿Por qué conviene empezar por una opción completa?','Porque crea una referencia de valor y luego permite comparar opciones más pequeñas.',['Porque obliga a comprar lo más costoso.','Porque evita escuchar al cliente.','Porque todos necesitan el mismo set.'],'El anclaje sirve para comparar, no para presionar.'],
        ['El cliente se queda mirando un producto distinto al set principal. ¿Qué harías tú?','Le preguntaría qué le llamó la atención y conectaría esa respuesta con su necesidad.',['Pasaría la página rápido.','Le diría que eso no importa.','Le mostraría el precio sin contexto.'],'La atención del cliente te da información para personalizar la asesoría.'],
        ['¿Qué error debes evitar con el catálogo?','Mostrar demasiadas opciones y saturar a la familia.',['Hacer preguntas.','Empezar por una opción completa.','Relacionar productos con necesidades.'],'Mostrar menos y explicar mejor facilita la decisión.'],
        ['¿Cómo sabes que este paso salió bien?','La familia entiende qué opción le ayuda y por qué.',['La familia vio todo el catálogo.','Memorizó todos los nombres.','Pidió descuento antes de hablar de valor.'],'La claridad vale más que la cantidad de páginas mostradas.']
      ],
      [
        ['La esposa dice que puede separar $80.000 quincenales. ¿Qué harías después?','Preguntaría también al esposo cuánto podría separar después de sus gastos y sumaría la capacidad mensual de ambos.',['Le diría que es muy poco.','Mostraría el precio total y esperaría.','Supondría una cuota mayor sin preguntar.'],'La cuota debe construirse con la realidad de la familia.'],
        ['El cliente dice: “Está muy caro”. ¿Qué haces primero?','Pregunto qué parte le preocupa más y vuelvo al beneficio que él mismo dijo valorar.',['Bajo el precio de inmediato.','Discuto que no es caro.','Cambio de producto sin escuchar.'],'Antes de responder, descubre si la objeción es precio, cuota, confianza o momento.'],
        ['¿Qué significa vender cuotas?','Ayudar a la familia a encontrar una opción mensual responsable, sin esconder el valor total.',['Ocultar el precio total.','Aprobar cualquier cuota.','Hablar solo de financiación.'],'La cuota facilita entender la compra, pero debe ser clara y responsable.'],
        ['La pareja no está de acuerdo entre sí. ¿Qué harías tú?','Escucharía a ambos, resumiría lo que cada uno valora y buscaría una opción que puedan decidir juntos.',['Presionaría a quien parece más interesado.','Ignoraría a uno de los dos.','Llenaría la papelería sin acuerdo.'],'Una decisión familiar necesita claridad y participación de quienes deciden.'],
        ['¿Cómo sabes que la negociación salió bien?','La familia entiende la opción, la cuota, los documentos y la decisión que está tomando.',['Aceptó rápido sin preguntar.','Solo firmó la primera hoja.','No habló de ninguna duda.'],'Un cierre sólido no deja sorpresas ni confusión.']
      ],
      [
        ['Terminó la negociación. ¿Qué debes hacer antes de pedir nombres?','Crear el puente, presentar el programa y seguir los pasos del 4 en 14 en orden.',['Pedir teléfonos de inmediato.','Hablar otra vez del precio.','Esperar varios días.'],'Una buena demo prepara el 4 en 14, pero el sistema conserva su propio orden.'],
        ['El cliente ya logró una venta dentro del programa. ¿Qué debes aclarar?','Que todavía debe completar las cuatro visitas dentro del tiempo acordado.',['Que ya terminó todo.','Que necesita cuatro ventas.','Que el premio es automático.'],'La venta es una condición; el programa completo son cuatro visitas y mínimo una venta.'],
        ['El cliente te entrega diez teléfonos, pero no activa ninguno. ¿Qué falta?','Hacer la instantánea y dejar visitas reales agendadas.',['Más teléfonos.','Mostrar el catálogo otra vez.','Esperar al call center.'],'Entregar datos no significa activar el programa.'],
        ['¿Qué relación tiene una buena demo con el 4 en 14?','La confianza construida durante la demo facilita pedir, calificar y activar referencias de calidad.',['La demo reemplaza el 4 en 14.','El 4 en 14 solo funciona sin venta.','No tienen ninguna relación.'],'La demo prepara el terreno; el sistema convierte esa confianza en actividad.'],
        ['¿Qué debes lograr al terminar este paso?','Que el cliente entienda el programa y existan próximos pasos reales para moverlo.',['Solo una lista escrita.','Una promesa para el mes siguiente.','Otra explicación de la compañía.'],'El resultado debe ser actividad concreta, no una intención vaga.']
      ]
    ];
    let step=0,pos=0;
    const oldRender=()=>{};
    function patchCard(){if(!card)return;const tips=card.querySelectorAll('.demo-tip-stack div');tips.forEach(x=>{if(x.textContent.includes('No hables como químico'))x.innerHTML='💡 <strong>No hables como químico.</strong> Entre más sencilla la información, más impacto tiene; entre más tecnicismos, menos impacto tiene.<br><small>Como asesor comercial, profundiza por tu cuenta investigando sobre los metales o aprendiendo de tu Distribuidor o de alguien experimentado.</small>'});const err=card.querySelector('.demo-info-grid article:nth-child(4)');if(err)err.classList.add('expert-error-card')}
    function show(){const list=qs[step];const d=list[pos];document.getElementById('demoPracticeCount').textContent=`${pos+1} de 5`;ask(zone,{count:`Pregunta ${pos+1} de 5`,context:`Paso ${step+1}: ${stepNames[step]}`,q:d[0],options:answers(d[1],d[2]),why:d[3],tip:'Piensa siempre en el objetivo del paso y en cómo prepara el siguiente.'},()=>{pos=(pos+1)%5;show()})}
    tabs?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;step=Number(b.dataset.demoStep||0);pos=0;setTimeout(()=>{patchCard();show()},0)},true);
    setTimeout(()=>{patchCard();show()},0);
  }

  // Gimnasio 4 en 14: cinco juegos con objetivos diferentes.
  const gym=document.getElementById('gimnasio414');
  if(gym){
    gym.innerHTML=`<section class="panel gym-hero"><div><span class="eyebrow">Entrena, repite, mejora</span><h3>🏋️ Gimnasio 4 en 14</h3><p>Cinco entrenamientos diferentes. Cada uno practica una habilidad concreta del sistema.</p></div><div class="mastery-ring"><strong id="g33score">0%</strong><span>Avance de esta sesión</span></div></section><section class="panel difficulty-panel"><div><span class="eyebrow">Nivel</span><h3>Elige la dificultad</h3><p>Al cambiar de nivel cambian completamente las situaciones.</p></div><div class="difficulty-switch" id="g33level"><button class="active" data-level="beginner">Principiante</button><button data-level="intermediate">Intermedio</button><button data-level="expert">Experto</button></div></section><div class="gym-simple-menu" id="g33menu"><button class="active" data-game="situations">🧪 Situaciones</button><button data-game="markets">📊 Mercados</button><button data-game="order">🧩 Orden perfecto</button><button data-game="speech">🎤 Speech</button><button data-game="timer">⏱️ Instantánea</button></div><section class="panel gym-stage" id="g33stage"></section>`;
    const stage=document.getElementById('g33stage');let level='beginner',game='situations',done=0,correct=0;
    const steps=['El puente','Presentar los premios','Pedir nombres','Calificar los nombres','Explicar el programa','Instantánea y activación','Seguimiento','Mover programas'];
    const baseSituations=[
      ['El cliente dice que prefiere darte compañeros de trabajo y no familiares.','Agradecer lo que ofreció y explorar con respeto quién de su familia confiaría más en su recomendación.'],
      ['El cliente llenó la hoja rápido, pero no sabes nada de las personas.','Volver a preguntar relación, ocupación, convivencia y quién cocina antes de agendar.'],
      ['El cliente dice que llamará mañana a sus familiares.','Proponer una llamada breve en ese momento para dejar al menos una visita confirmada.'],
      ['Una persona no contesta la instantánea.','Mantener el ritmo y llamar al siguiente contacto.'],
      ['El cliente cree que una venta ya completó el programa.','Aclarar que necesita cuatro visitas y mínimo una venta dentro de 14 días.'],
      ['Han pasado 48 horas y una visita no confirmó.','Contactar al cliente, revisar el programa y reemplazar o reactivar esa visita.'],
      ['El cliente quiere empezar llamando a su mejor prospecto.','Explicar que conviene entrar en ritmo con un contacto intermedio y luego llamar a los mejores.'],
      ['El prospecto pregunta por teléfono si tiene que comprar.','Aclarar que no existe obligación, explicar brevemente la experiencia y volver a la agenda.'],
      ['El cliente se aleja con el teléfono y comienza a explicar demasiado.','Pedirle amablemente que solo presente al asesor y entregue el teléfono.'],
      ['Un programa antiguo quedó con dos visitas realizadas.','Con autorización del Distribuidor, revisar las visitas pendientes y reactivar el programa para generar actividad.'],
      ['El cliente solo te da nombres de personas que viven solas y no cocinan.','Volver a explorar círculos de confianza y perfiles familiares con mejores hábitos de cocina.'],
      ['La visita quedó en “yo le aviso”.','Convertir la intención en fecha, hora, dirección y personas presentes.'],
      ['El cliente no se siente motivado por los premios.','Conectar el beneficio con algo útil para su hogar y explicar el valor de completar el programa.'],
      ['El prospecto pide una explicación larga por teléfono.','Dar una respuesta corta, conservar la curiosidad y regresar a la fecha de la visita.'],
      ['Un programa parece frío después de varios días.','Hacer seguimiento, revisar cuáles visitas siguen vivas y proponer reemplazos concretos.']
    ];
    const markets=[
      ['María: casada, dos hijos, cocina a diario y trabaja.','Mercado con buen potencial familiar.'],['Carlos: vive solo, no cocina y come siempre fuera.','Primero profundizar; no es prioridad para una demo completa.'],['Sandra: docente, casada, cocina y tiene una familia amplia.','Buen mercado y posible red de referencias.'],['Julián: casado, no cocina, pero su pareja decide y cocina.','Confirmar que su pareja estará presente.'],['Luisa: vive con su madre, ambas cocinan y trabajan.','Mercado con potencial familiar.'],['Pedro: vive solo y come fuera.','Explorar si puede recomendar otro hogar más adecuado.'],['Ana: pensionada, cocina todos los días y vive con su esposo.','Buen mercado por uso y decisión compartida.'],['Felipe: joven, vive con cuatro familiares y ayuda en la cocina.','Vale la pena calificar quién decide y quién cocina.'],['Diana: empresaria, poco tiempo, compra soluciones premium.','Buen perfil si el núcleo decisor está presente.'],['Camilo: desempleado, vive solo y no cocina.','Mercado débil para priorizar una demo.'],['Gloria: tres hijos, cocina, pero el esposo maneja las decisiones.','Agendar cuando ambos estén presentes.'],['Ricardo: estable, casado, cocina fines de semana y valora duración.','Buen potencial por estabilidad y valor de garantía.'],['Paola: vive en arriendo, trabaja, cocina y comparte gastos con su pareja.','No descartarla; calificar capacidad y presencia de la pareja.'],['Andrés: vive con padres, la mamá cocina y él no decide.','Visitar solo si quienes cocinan y deciden estarán presentes.'],['Natalia: casada, dos hijos, le preocupa salud y tiempo.','Buen mercado por necesidad clara y núcleo familiar.']
    ];
    const speeches=[
      ['El cliente pregunta si deben llamar ahora.','Vamos a llamar de una vez y dejamos la visita organizada.'],['El prospecto pregunta si debe comprar.','No existe obligación de compra; queremos llevarle el detalle y compartir una experiencia.'],['Debes pedir fecha.','¿Qué día de esta semana podría recibirnos: hoy, mañana o pasado mañana?'],['Debes confirmar la dirección.','Perfecto, ¿me confirma la dirección completa y un punto de referencia?'],['Debes confirmar el núcleo familiar.','¿Quiénes estarán en casa y comparten las decisiones del hogar?'],['El cliente quiere dejarlo abierto.','Dejémoslo organizado de una vez: ¿le sirve más mañana en la tarde o pasado mañana?'],['Debes explicar el programa.','Son cuatro visitas, mínimo una venta y catorce días para completarlo.'],['El cliente ya logró una venta.','Excelente; ahora revisemos qué visitas faltan para completar las cuatro.'],['No contestaron la llamada.','Vamos con el siguiente contacto y luego enviamos un audio personal.'],['Debes pedir nombres de calidad.','Pensemos en familiares que cocinan, viven en familia y confían en su recomendación.'],['El cliente evita dar familiares.','¿Quién de su familia cercana recibiría mejor un detalle de parte suya?'],['Debes cerrar la instantánea.','Entonces confirmamos: mañana, 6:00 p. m., en esta dirección y estarán ambos.'],['Debes activar por audio.','Te van a llamar de mi parte; son personas de mi confianza y quiero regalarte esta experiencia.'],['Debes mover un programa.','Con autorización del Distribuidor, revisemos las visitas pendientes y reactivemos las que todavía tienen oportunidad.'],['Debes hacer seguimiento.','De las cuatro visitas, ¿cuál podemos confirmar hoy y cuál debemos reemplazar?']
    ];
    function choiceCase(pair,type,idx){const harder=level==='expert',mid=level==='intermediate';const best=pair[1];let others;if(type==='markets')others=['Agendar sin hacer más preguntas.','Descartarlo únicamente por un dato.','Asumir que comprará porque aceptó.'];else if(type==='speech')others=['Me avisa cuando pueda.','Le explicaría todo por teléfono.','Dejaría la conversación abierta.'];else others=['Seguiría sin profundizar.','Hablaría más para convencer.','Cambiaría de paso para evitar la incomodidad.'];return {count:`Caso ${idx+1} de 15`,context:pair[0],q:harder?'¿Qué decisión protege mejor todo el programa?':mid?'¿Qué harías tú en esta situación?':'¿Qué harías tú?',options:answers(best,others),why:'Esta opción mantiene la confianza, protege el orden y deja una acción concreta.',tip:'No pienses en vender. Piensa en mover correctamente el sistema 4 en 14.'}}
    function play(){if(game==='timer'){timer();return}if(game==='order'){order();return}const list=game==='markets'?markets:game==='speech'?speeches:baseSituations;const d=nextFresh(list,`g33-${game}-${level}`),idx=list.indexOf(d);stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${level==='beginner'?'Principiante':level==='intermediate'?'Intermedio':'Experto'}</span><h3>${game==='situations'?'Situaciones del 4 en 14':game==='markets'?'Califica el mercado':'Completa el speech'}</h3></div><span class="badge">15 casos diferentes</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><p>${game==='situations'?'Elige la acción que mejor mantiene vivo el programa.':game==='markets'?'Decide si vale la pena priorizar la visita y qué dato todavía falta.':'Elige la frase más clara, segura y fácil de entender.'}</p></div><div class="question-zone"></div>`;ask(stage.querySelector('.question-zone'),choiceCase(d,game,idx),()=>play())}
    function order(){const mixed=shuffle(steps),chosen=[];stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">La magia del orden</span><h3>Orden perfecto</h3></div><span class="badge">8 pasos</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><p>Toca los pasos en el orden correcto. Al final verás exactamente dónde te equivocaste.</p></div><div class="order-game"></div><div id="g33orderResult"></div><button class="small-action" id="g33reset">Reiniciar</button>`;const box=stage.querySelector('.order-game');mixed.forEach(s=>{const b=document.createElement('button');b.className='order-chip';b.textContent=s;b.onclick=()=>{if(b.disabled)return;b.disabled=true;b.classList.add('selected');chosen.push(s);if(chosen.length===8){const result=document.getElementById('g33orderResult');result.className='order-result-list';result.innerHTML=chosen.map((x,i)=>`<div class="order-result-row ${x===steps[i]?'good':'bad'}"><b>${i+1}</b><span>${x===steps[i]?`Correcto: ${x}`:`Elegiste “${x}”. Aquí debía ir “${steps[i]}”.`}</span></div>`).join('')}};box.appendChild(b)});document.getElementById('g33reset').onclick=order}
    function timer(){stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Entrena tu instantánea</span><h3>Agenda en 1 minuto y 30 segundos</h3></div><span class="badge">01:30</span></div><div class="timer-phase-list"><article><b>0–20 s</b><small>Preséntate y rompe el hielo</small></article><article><b>20–50 s</b><small>Explica brevemente la experiencia</small></article><article><b>50–70 s</b><small>Agenda y toma los datos</small></article><article><b>70–90 s</b><small>Compromete y amarra la cita</small></article></div><div class="timer-display" id="g33time">01:30</div><div class="timer-live-guide"><span id="g33phase">PREPARACIÓN</span><strong id="g33title">Respira y habla con seguridad</strong><p id="g33tip">Tu meta no es vender: es dejar fecha, hora, dirección y compromiso.</p></div><div class="timer-progress"><i id="g33prog"></i></div><div class="timer-actions"><button class="primary-action" id="g33start">Comenzar</button><button class="small-action" id="g33restart">Reiniciar</button></div>`;let left=90,t;const phases=[{min:71,k:'0–20 SEGUNDOS',h:'Preséntate y rompe el hielo',p:'Di tu nombre, menciona quién lo recomendó y crea cercanía.'},{min:41,k:'20–50 SEGUNDOS',h:'Explica brevemente la experiencia',p:'Una frase clara. No hables de precios y no expliques toda la demostración.'},{min:21,k:'50–70 SEGUNDOS',h:'Agenda y toma los datos',p:'Define fecha, hora, dirección y quién estará presente.'},{min:0,k:'70–90 SEGUNDOS',h:'Compromete y amarra la cita',p:'Repite el acuerdo, confirma la asistencia y termina con una acción clara.'}];const paint=()=>{document.getElementById('g33time').textContent=`0${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;document.getElementById('g33prog').style.width=`${(90-left)/.9}%`;const ph=phases.find(x=>left>=x.min);document.getElementById('g33phase').textContent=ph.k;document.getElementById('g33title').textContent=ph.h;document.getElementById('g33tip').textContent=ph.p};document.getElementById('g33start').onclick=()=>{clearInterval(t);left=90;paint();t=setInterval(()=>{left--;paint();if(left<=0){clearInterval(t);document.getElementById('g33phase').textContent='TERMINADO';document.getElementById('g33title').textContent='¿Saliste con fecha, hora, dirección y compromiso?';document.getElementById('g33tip').textContent='Si faltó algo, repite y habla menos: la meta es dejar la visita firme.'}},1000)};document.getElementById('g33restart').onclick=timer}
    document.getElementById('g33level').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;gym.querySelectorAll('#g33level button').forEach(x=>x.classList.toggle('active',x===b));play()};document.getElementById('g33menu').onclick=e=>{const b=e.target.closest('button');if(!b)return;game=b.dataset.game;gym.querySelectorAll('#g33menu button').forEach(x=>x.classList.toggle('active',x===b));play()};play();
  }

  // Gimnasio de ventas: cinco juegos realmente distintos y situaciones completas.
  const sales=document.getElementById('gimnasioventas');
  if(sales){
    const stage=document.getElementById('salesGymStage');let level='beginner',game='demo';
    const clients=['Marta, madre de dos hijos y cuidadosa con el dinero','Carlos, empresario con poco tiempo','Andrea, docente que hace muchas preguntas','Julián y Laura, pareja joven que decide todo juntos','Sandra, muy familiar y preocupada por la salud','Felipe, habla mucho y cambia de tema','Natalia, interesada pero teme endeudarse','Ricardo, pensionado que valora duración','Paola, compara cada opción antes de decidir','Andrés, desconfiado por una compra anterior','Diana, práctica y enfocada en ahorrar tiempo','Luisa, consulta cada decisión con su madre','Sebastián, interesado en tecnología','Gloria, quiere hablarlo con sus hijos','Camilo, valora la salud pero pospone decisiones'];
    const scenes={demo:['Llegas y notas que la familia está seria y habla poco.','La esposa dice que cocinar le quita demasiado tiempo.','El esposo mira constantemente el reloj.','Durante la prueba de metales, uno de ellos se muestra desconfiado.','La familia disfruta el cocinado, pero hace pocas preguntas.','En la degustación, la esposa se entusiasma y el esposo permanece callado.','Al mostrar el brochure, el cliente solo mira las opciones pequeñas.','La pareja discute sobre qué beneficio valora más.','La demostración lleva dos horas y todavía no han degustado.','El cliente entiende el producto, pero parece confundido con tantas opciones.','Uno de los dos toma todas las decisiones.','La familia compara el sistema con lo que ya tiene.','El cliente pregunta por la garantía.','La familia se ve cansada antes de llegar a negociación.','Termina la degustación y nadie expresa una opinión.'],objections:['El cliente dice: “Está demasiado caro”.','El cliente dice: “Ahora no tengo dinero”.','El cliente dice: “Quiero pensarlo”.','El cliente dice: “Debo hablarlo con mi pareja”.','El cliente dice: “Ya tengo buenas ollas”.','El cliente dice: “No quiero otra deuda”.','El cliente dice: “La cuota sigue alta”.','El cliente dice: “No sé si lo voy a usar”.','El cliente dice: “En internet vi algo más barato”.','El cliente dice: “No compro en la primera visita”.','El cliente dice: “Tengo otros gastos”.','El cliente dice: “No confío en los créditos”.','El cliente dice: “Me gusta, pero no es prioridad”.','El cliente dice: “Prefiero ahorrar y comprar después”.','El cliente dice: “Solo compraría una pieza pequeña”.'],closing:['La familia dijo que valora salud y ahorro, pero nadie toma la decisión.','La pareja duda entre dos opciones.','El cliente ya aceptó que la cuota le cabe, pero sigue aplazando.','La esposa está convencida y el esposo quiere más tiempo.','El cliente pregunta cuál opción escogerías tú.','La familia pide una recomendación concreta.','El cliente acepta el valor, pero no inicia la papelería.','La pareja quiere empezar con algo más pequeño.','El cliente responde positivamente a todos los beneficios.','La familia se queda en silencio después de ver la cuota.','El cliente pide “la última mejor opción”.','La pareja quiere pagar de contado o financiado.','El cliente duda entre comprar ahora o después.','La familia quiere una opción que pueda ampliar más adelante.','El cliente dice que sí, pero no entrega documentos.'],errors:['El asesor habla 35 minutos en el rompehielo y casi no escucha.','El asesor presenta la compañía durante 20 minutos.','El asesor explica metales antes de poner el bicarbonato a hervir.','El asesor deja que el cliente saque únicamente utensilios nuevos.','El asesor usa términos químicos que la familia no comprende.','El asesor agrega aceite al pollo durante la demostración.','El asesor muestra todo el catálogo sin detenerse.','El asesor empieza por la opción más económica.','El asesor pregunta solo el presupuesto de una persona de la pareja.','El asesor discute cuando el cliente dice que es caro.','El asesor ofrece descuento antes de descubrir la objeción real.','El asesor termina la demo sin confirmar qué valoró la familia.','El asesor deja la papelería con campos confusos.','El asesor inicia el 4 en 14 antes de terminar la negociación.','La demo lleva más de tres horas y el cliente está agotado.'],negotiation:['La esposa puede separar $80.000 quincenales y el esposo $100.000.','La pareja conoce su presupuesto mensual, pero teme comprometerse.','El cliente quiere pagar una cuota menor.','La familia tiene ingresos variables.','Uno de los dos decide y el otro administra el dinero.','El cliente puede pagar de contado, pero valora mantener liquidez.','La pareja tiene varias obligaciones mensuales.','El cliente pregunta cuánto terminará pagando.','La familia quiere empezar con una opción más pequeña.','El cliente tiene capacidad, pero no quiere usar crédito.','La pareja pide comparar dos plazos.','El cliente no tiene claro cuánto puede separar.','Uno de los dos minimiza los gastos del hogar.','La familia quiere saber qué documentos necesita.','El cliente acepta la cuota, pero no el depósito inicial.']};
    const gameNames={demo:'Demo virtual',objections:'Objeciones reales',closing:'Elige el mejor cierre',errors:'Detecta el error',negotiation:'Negociación práctica'};
    function make(scene,idx){const c=clients[idx];let best,others,why,tip,q='¿Qué harías tú?';if(game==='demo'){best='Haría una pregunta corta, observaría la reacción y adaptaría solo la parte necesaria antes de continuar.';others=['Seguiría el guion sin cambiar nada.','Daría más información para evitar dudas.','Pasaría directo al precio.'];why='La demo mejora cuando lees a la familia y ajustas el ritmo sin perder el orden.';tip='Mira si el cliente está interesado, confundido, desconfiado o cansado.'}else if(game==='objections'){best='Escucharía, preguntaría qué es lo que realmente le preocupa y respondería solo a esa preocupación.';others=['Bajaría el precio de inmediato.','Discutiría para demostrar que no es caro.','Cambiaría de producto sin preguntar.'];why='Una objeción puede esconder miedo, cuota, confianza o falta de prioridad.';tip='Primero entiende. Después responde.'}else if(game==='closing'){best='Resumiría lo que la familia dijo que necesita, presentaría dos opciones claras y pediría una decisión sin presionar.';others=['Preguntaría solamente “¿lo quiere?”.','Volvería a explicar toda la demo.','Esperaría en silencio sin guiar.'];why='El cierre conecta las necesidades expresadas con una decisión sencilla.';tip='Dos opciones claras suelen ser más fáciles que una pregunta de sí o no.'}else if(game==='errors'){q='¿Cuál es el error y cómo lo corregirías?';best='Identificaría el error, volvería al objetivo de ese paso y corregiría solo lo necesario.';others=['Continuaría para no perder tiempo.','Agregaría más explicación.','Cambiaría de tema sin reconocerlo.'];why='Corregir a tiempo evita que un error pequeño debilite toda la demostración.';tip='Cada paso tiene un objetivo. Si lo pierdes, vuelve a él.'}else{best='Aclararía la capacidad real de pago, mostraría una cuota responsable y explicaría con transparencia el valor total y los documentos.';others=['Ofrecería la cuota más alta posible.','Ocultaría el valor total para facilitar el cierre.','Decidiría por la familia sin preguntar.'];why='Una buena negociación busca una opción clara y sostenible para la familia.';tip='Vender cuotas no significa esconder cifras: significa hacerlas fáciles de entender.'}return {count:`Situación ${idx+1} de 15`,context:`${c}. ${scene}`,q,options:answers(best,others),why,tip}}
    function render(){const list=scenes[game],scene=nextFresh(list,`s33-${game}-${level}`),idx=list.indexOf(scene),state=['🤨 Desconfiado','⏱️ Impaciente','😕 Confundido','🙂 Interesado'][idx%4];stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">Nivel ${level==='beginner'?'Principiante':level==='intermediate'?'Intermedio':'Experto'}</span><h3>${gameNames[game]}</h3></div><span class="badge">15 situaciones distintas</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><p>${game==='demo'?'Acompaña una demostración y toma decisiones según lo que está pasando con la familia.':game==='objections'?'Escucha la duda y elige cómo responder sin discutir ni presionar.':game==='closing'?'Elige la forma más natural de guiar a la familia hacia una decisión.':game==='errors'?'Encuentra qué salió mal y cómo volver al objetivo del paso.':'Construye una opción clara y responsable usando cuota, capacidad de pago y papelería.'}</p></div>${game==='demo'?`<div class="client-state"><span class="state suspicious">${state}</span><p>💡 No siempre necesita más información. Ajusta el tono, el ritmo y la pregunta.</p></div>`:''}<div class="question-zone"></div>`;ask(stage.querySelector('.question-zone'),make(scene,idx),render)}
    sales.querySelector('.gym-menu')?.replaceWith(Object.assign(document.createElement('div'),{className:'gym-simple-menu',id:'s33menu',innerHTML:'<button class="active" data-game="demo">🎭 Demo virtual</button><button data-game="objections">🛡️ Objeciones</button><button data-game="closing">🤝 Cierres</button><button data-game="errors">🚨 Errores</button><button data-game="negotiation">💳 Negociación</button>'}));
    document.getElementById('salesDifficulty').onclick=e=>{const b=e.target.closest('button');if(!b)return;level=b.dataset.level;sales.querySelectorAll('#salesDifficulty button').forEach(x=>x.classList.toggle('active',x===b));render()};document.getElementById('s33menu').onclick=e=>{const b=e.target.closest('button');if(!b)return;game=b.dataset.game;sales.querySelectorAll('#s33menu button').forEach(x=>x.classList.toggle('active',x===b));render()};render();
  }
})();

// ===== Bleu One v3.4 · Gimnasio de Ventas reconstruido =====
(()=>{
  const sales=document.getElementById('gimnasioventas');
  const stage=document.getElementById('salesGymStage');
  if(!sales||!stage) return;

  const oldMenu=sales.querySelector('.gym-simple-menu, .sales-menu, .gym-menu');
  const menu=document.createElement('div');
  menu.className='gym-simple-menu sales-core-menu';
  menu.id='salesCoreMenu';
  menu.innerHTML=`
    <button class="active" data-core-game="demo">🎯 Simulador de demostraciones</button>
    <button data-core-game="objections">🛡️ Entrenador de objeciones</button>
    <button data-core-game="negotiation">🤝 Negociación y cierres</button>`;
  if(oldMenu) oldMenu.replaceWith(menu); else stage.before(menu);

  const oldDifficulty=document.getElementById('salesDifficulty');
  let difficulty=oldDifficulty;
  if(oldDifficulty){
    difficulty=oldDifficulty.cloneNode(true);
    oldDifficulty.replaceWith(difficulty);
  }

  let level='beginner';
  let game='demo';
  const bags=new Map();
  const stats={confidence:65,interest:55,participation:55,energy:85,correct:0,total:0};
  const levelName={beginner:'Principiante',intermediate:'Intermedio',expert:'Experto'};

  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function nextFresh(list,key){
    let bag=bags.get(key);
    if(!bag||!bag.length){bag=shuffle(list.map((_,i)=>i));const last=bags.get(key+'-last');if(bag.length>1&&bag[0]===last)[bag[0],bag[1]]=[bag[1],bag[0]]}
    const idx=bag.shift();bags.set(key,bag);bags.set(key+'-last',idx);return {item:list[idx],idx};
  }
  function scoreColor(v){return v>=75?'good':v>=45?'mid':'low'}
  function renderMeters(){
    return `<div class="sales-live-meters">
      ${[['Confianza',stats.confidence],['Interés',stats.interest],['Participación',stats.participation],['Energía',stats.energy]].map(([n,v])=>`<div><span>${n}</span><b>${v}%</b><i><em class="${scoreColor(v)}" style="width:${v}%"></em></i></div>`).join('')}
    </div>`;
  }
  function setStats(delta){Object.entries(delta||{}).forEach(([k,v])=>stats[k]=Math.max(0,Math.min(100,stats[k]+v)));stats.total++;}
  function answerCard(container,data,onDone){
    const opts=shuffle(data.options.map((text,i)=>({text,good:i===data.answer})));
    container.innerHTML=`
      <div class="sales-question-card">
        ${data.label?`<span class="question-label">${data.label}</span>`:''}
        <div class="case-context">${data.context}</div>
        <h3>${data.question}</h3>
        <div class="game-options sales-varied-options"></div>
        <div class="game-feedback" hidden></div>
        <div class="sales-coach" hidden>
          <article><span>💭 Lo que puede estar pensando el cliente</span><p>${data.thought}</p></article>
          <article><span>⭐ Por qué esta opción funciona mejor</span><p>${data.why}</p></article>
          <article><span>💡 Consejo para la próxima</span><p>${data.tip}</p></article>
        </div>
        <button class="primary-action sales-next" hidden>${data.nextLabel||'Continuar'} <span>→</span></button>
      </div>`;
    const box=container.querySelector('.game-options'),fb=container.querySelector('.game-feedback'),coach=container.querySelector('.sales-coach'),next=container.querySelector('.sales-next');
    opts.forEach((o,idx)=>{const b=document.createElement('button');b.innerHTML=`<b>${String.fromCharCode(65+idx)}</b><span>${o.text}</span>`;b.onclick=()=>{
      [...box.children].forEach(x=>x.disabled=true);
      b.classList.add(o.good?'correct':'wrong');
      if(!o.good)[...box.children].find(x=>x.__good)?.classList.add('correct');
      fb.hidden=false;fb.className='game-feedback '+(o.good?'good':'bad');
      fb.innerHTML=o.good?'✓ <strong>Muy bien.</strong> Esta decisión ayuda a que la demostración avance.':'Esta opción podría servir, pero había una mejor para este momento.';
      coach.hidden=false;next.hidden=false;setStats(o.good?data.goodDelta:data.badDelta);if(o.good)stats.correct++;
    };b.__good=o.good;box.appendChild(b)});
    next.onclick=onDone;
  }

  const clients={
    beginner:[
      {name:'Marta y Luis',profile:'Pareja amable, dos hijos. Marta cocina todos los días.',priority:'tiempo',mood:'colaboradores',hook:'Llegan del trabajo cansados y quieren cocinar más rápido.'},
      {name:'Carlos',profile:'Pensionado, vive con su esposa y valora la duración.',priority:'garantía',mood:'tranquilo',hook:'No quiere volver a comprar utensilios en muchos años.'},
      {name:'Diana y Andrés',profile:'Pareja joven, primera vivienda propia.',priority:'ahorro',mood:'curiosos',hook:'Están organizando sus gastos y comparan todo.'},
      {name:'Gloria',profile:'Madre de tres hijos. Cocina a diario.',priority:'salud',mood:'amable',hook:'Quiere reducir grasa y sal en las comidas.'},
      {name:'Sebastián',profile:'Le gusta la tecnología y hacer recetas nuevas.',priority:'facilidad',mood:'entusiasta',hook:'Quiere cocinar sin ser experto.'},
      {name:'Paola y Camilo',profile:'Ambos trabajan y comparten las tareas del hogar.',priority:'tiempo',mood:'participativos',hook:'Tienen poco tiempo entre semana.'},
      {name:'Rosa',profile:'Vive con su hija y su nieta.',priority:'salud',mood:'cálida',hook:'Le preocupa cuidar a tres generaciones.'},
      {name:'Felipe',profile:'Soltero, recibe amigos y cocina los fines de semana.',priority:'versatilidad',mood:'relajado',hook:'Le gusta preparar varias recetas con pocos utensilios.'},
      {name:'Natalia y Jorge',profile:'Pareja que paga arriendo y controla el presupuesto.',priority:'ahorro',mood:'prudentes',hook:'Necesitan ver que la cuota sea cómoda.'},
      {name:'Ricardo',profile:'Empresario con agenda apretada.',priority:'exclusividad',mood:'directo',hook:'Valora productos durables y premium.'},
      {name:'Sandra',profile:'Docente, muy conversadora y familiar.',priority:'facilidad',mood:'sociable',hook:'Quiere soluciones sencillas para cocinar.'},
      {name:'Iván y Laura',profile:'Tienen un bebé y están cambiando hábitos.',priority:'salud',mood:'atentos',hook:'Buscan preparar alimentos con menos añadidos.'},
      {name:'Marcos',profile:'Cocina para toda su familia los domingos.',priority:'capacidad',mood:'curioso',hook:'Necesita preparar bastante comida sin complicarse.'},
      {name:'Elena',profile:'Compra pensando en largo plazo.',priority:'garantía',mood:'serena',hook:'Pregunta por respaldo y mantenimiento.'},
      {name:'Óscar y Viviana',profile:'Pareja muy organizada con sus finanzas.',priority:'ahorro',mood:'analíticos',hook:'Quieren entender bien antes de decidir.'}
    ],
    intermediate:[
      {name:'Marcela y Hernán',profile:'Ella quiere ahorrar tiempo; él solo habla de precio.',priority:'mixta',mood:'divididos',hook:'Necesitas involucrar a ambos sin tomar partido.'},
      {name:'Julián',profile:'Analítico, hace muchas preguntas y compara marcas.',priority:'respaldo',mood:'cuestionador',hook:'Quiere pruebas claras, no discursos.'},
      {name:'Andrea y Mateo',profile:'Ella cocina; él administra el dinero.',priority:'mixta',mood:'reservados',hook:'La decisión debe construirse entre los dos.'},
      {name:'Lucía',profile:'Tuvo una mala experiencia con otra compra financiada.',priority:'confianza',mood:'desconfiada',hook:'Necesita claridad antes de hablar de cuota.'},
      {name:'Germán',profile:'Dice que ya tiene buenos utensilios.',priority:'diferenciación',mood:'seguro',hook:'No puedes atacar lo que ya tiene; debes mostrar diferencias.'},
      {name:'Carolina y Samuel',profile:'Tienen capacidad, pero siempre aplazan decisiones.',priority:'urgencia',mood:'indecisos',hook:'Debes ayudarles a concretar sin presionar.'},
      {name:'Patricia',profile:'Habla mucho y cambia de tema constantemente.',priority:'orden',mood:'dispersa',hook:'Necesitas mantener una conversación amable y enfocada.'},
      {name:'Miguel',profile:'Poco expresivo; responde con monosílabos.',priority:'lectura',mood:'frío',hook:'Debes usar preguntas sencillas y observar reacciones.'},
      {name:'Lorena y David',profile:'Se contradicen sobre quién cocina y quién decide.',priority:'roles',mood:'tensos',hook:'Aclara roles sin generar incomodidad.'},
      {name:'Wilson',profile:'Quiere conocer precios antes de ver la demostración.',priority:'proceso',mood:'impaciente',hook:'Debes mantener su interés sin saltarte toda la experiencia.'},
      {name:'Mónica',profile:'Le interesa la salud, pero teme que cocinar sea complicado.',priority:'facilidad',mood:'insegura',hook:'Convierte la demostración en algo fácil de imaginar.'},
      {name:'Esteban y Sara',profile:'Tienen ingresos variables.',priority:'cuota',mood:'prudentes',hook:'La opción debe adaptarse a meses buenos y normales.'},
      {name:'Claudia',profile:'Está interesada, pero consulta todo con sus hijos adultos.',priority:'decisión',mood:'dependiente',hook:'Debes definir quién necesita participar.'},
      {name:'Ramiro',profile:'Valora exclusividad, pero odia sentirse vendido.',priority:'experiencia',mood:'exigente',hook:'La asesoría debe sentirse personalizada.'},
      {name:'Yolanda y César',profile:'La demo empezó tarde y ya están cansados.',priority:'tiempo',mood:'fatigados',hook:'Debes acelerar sin perder claridad.'}
    ],
    expert:[
      {name:'Valentina y Nicolás',profile:'Ella desea comprar; él cuestiona cada cifra y evita decidir.',priority:'equilibrio',mood:'tensos',hook:'Una mala frase puede convertir la demo en discusión.'},
      {name:'Álvaro',profile:'Abogado, pide sustento de cada afirmación.',priority:'precisión',mood:'escéptico',hook:'Debes hablar sencillo sin hacer afirmaciones absolutas.'},
      {name:'Sofía',profile:'Chef aficionada, conoce materiales y técnicas.',priority:'desempeño',mood:'experta',hook:'No puedes tratarla como principiante.'},
      {name:'Hugo y Marcela',profile:'Tienen capacidad, pero arrastran varias deudas.',priority:'responsabilidad',mood:'preocupados',hook:'El cierre debe ser responsable, no solo posible.'},
      {name:'Tatiana',profile:'Está interesada, pero dice “sí” para evitar incomodidad.',priority:'compromiso',mood:'evasiva',hook:'Debes diferenciar cortesía de intención real.'},
      {name:'Diego',profile:'Empresario impaciente; recibe llamadas durante la demo.',priority:'control',mood:'distraído',hook:'Necesitas recuperar atención sin confrontarlo.'},
      {name:'Beatriz y Fernando',profile:'Discuten entre ellos sobre dinero frente a ti.',priority:'armonía',mood:'conflictivos',hook:'No debes convertirte en árbitro ni tomar partido.'},
      {name:'Mauricio',profile:'Dice que todo le gusta, pero nunca se compromete.',priority:'decisión',mood:'amable-evasivo',hook:'Debes pasar de aprobación general a una decisión concreta.'},
      {name:'Adriana',profile:'Pregunta por descuento antes de probar la comida.',priority:'valor',mood:'negociadora',hook:'No debes regalar valor antes de construirlo.'},
      {name:'Cristóbal',profile:'Tuvo productos premium y no se impresiona fácilmente.',priority:'diferencia',mood:'exigente',hook:'Debes descubrir qué sí le importa.'},
      {name:'Inés',profile:'Quiere comprar para ayudar al asesor, no por necesidad.',priority:'necesidad',mood:'bondadosa',hook:'Debes evitar una venta débil o arrepentida.'},
      {name:'Tomás y Juliana',profile:'Ambos quieren, pero ninguno admite cuánto puede pagar.',priority:'capacidad',mood:'reservados',hook:'Necesitas obtener cifras sin invadir.'},
      {name:'Cecilia',profile:'Está cansada y responde con impaciencia al final.',priority:'ritmo',mood:'agotada',hook:'Debes simplificar el cierre y respetar su energía.'},
      {name:'Roberto',profile:'Rechaza el crédito por una mala experiencia bancaria.',priority:'confianza financiera',mood:'defensivo',hook:'No basta con decir que la financiación es fácil.'},
      {name:'Laura y Sergio',profile:'Uno quiere el set grande; el otro pide empezar pequeño.',priority:'acuerdo',mood:'divididos',hook:'Debes encontrar una decisión que ambos puedan sostener.'}
    ]
  };

  function demoStepData(client,step){
    const p=client.priority;
    const common=[
      {label:'LLEGADA',context:`Llegas a la casa de ${client.name}. ${client.profile}`,question:'¿Cómo iniciarías la visita?',options:['Saludar, aprender sus nombres y hacer una pregunta natural sobre la familia.','Sacar inmediatamente los utensilios para aprovechar el tiempo.','Preguntar cuánto dinero pueden invertir antes de sentarte.','Entregar el catálogo y pedir que marquen lo que les guste.'],answer:0,thought:'Quiere saber si puede sentirse cómodo contigo antes de escucharte.',why:'La confianza se construye antes de hablar de producto.',tip:'Escucha más de lo que hablas en los primeros minutos.',goodDelta:{confidence:12,participation:7},badDelta:{confidence:-12,energy:-4}},
      {label:'ROMPEHIELO',context:`Durante la conversación descubres: ${client.hook}`,question:`¿Qué información te conviene profundizar ahora?`,options:p==='tiempo'?['Cuánto tardan hoy en cocinar y qué momento del día les pesa más.','Qué color de utensilios prefieren.','Cuántos años tiene el barrio.','Si conocen a alguien que quiera comprar.']:p==='salud'?['Qué hábitos desean cambiar y quién prepara normalmente los alimentos.','Cuánto pagarían por verse más saludables.','Qué marca usan hoy.','Si quieren recibir un catálogo por WhatsApp.']:p==='ahorro'||p==='cuota'?['Qué gastos quieren reducir y cuánto pueden separar cómodamente al mes.','Qué producto comprarían si fuera gratis.','Cuántos vecinos tienen.','Qué utensilio es el más nuevo.']:['Qué valoran más al cocinar: tiempo, salud, facilidad, duración o exclusividad.','Qué opción es la más costosa.','Si quieren comprar hoy.','Qué banco utilizan.'],answer:0,thought:'Cuando hablas de su realidad, siente que la demostración fue pensada para su familia.',why:'La prioridad del cliente te indica qué beneficio debes destacar después.',tip:'No supongas que todos compran por salud.',goodDelta:{confidence:6,interest:12,participation:10},badDelta:{interest:-8,participation:-7}},
      {label:'PRESENTACIÓN',context:`La familia ya conversa contigo con naturalidad.`,question:'¿Cómo presentarías el respaldo de la compañía?',options:['En menos de dos minutos: experiencia, respaldo, innovación y presencia en el país; luego haría una pregunta.','Contaría toda la historia de la compañía desde su fundación.','Mostraría primero precios para demostrar seriedad.','Usaría palabras técnicas para sonar más preparado.'],answer:0,thought:'Quiere seguridad, pero no una conferencia.',why:'Este paso debe generar respaldo sin enfriar la conversación.',tip:'Corto, claro y conectado con una pregunta.',goodDelta:{confidence:10,energy:2},badDelta:{energy:-12,interest:-6}},
      {label:'METALES',context:`La familia va contigo a la cocina y quiere sacar los utensilios más nuevos.`,question:'¿Qué harías?',options:['Pediría con naturalidad el utensilio de los huevos, el chocolate y el arroz: los que realmente usan.','Aceptaría los más nuevos para no incomodar.','Escogería yo mismo sin preguntar.','Omitiría la prueba y explicaría solo de memoria.'],answer:0,thought:'Puede sentir pena de mostrar utensilios viejos o muy usados.',why:'La comparación debe hacerse con lo que realmente usan todos los días.',tip:'Pon el agua y el bicarbonato primero; explica los materiales mientras hierve.',goodDelta:{interest:10,participation:10},badDelta:{interest:-8,confidence:-5}},
      {label:'COCINADO',context:`La prueba terminó. Vas a preparar los alimentos y la familia observa.`,question:'¿Cuál es la mejor siguiente acción?',options:['Enjuagar bien, precalentar el utensilio seco y mostrar cómo el pollo libera su propia grasa.','Agregar bastante aceite para evitar que se pegue.','Poner todos los ingredientes en frío y subir el fuego al máximo.','Explicar la receta durante veinte minutos antes de cocinar.'],answer:0,thought:'Quiere ver algo sencillo que pueda repetir en su casa.',why:'La demostración debe convertir beneficios en algo visible y fácil.',tip:'Al degustar, deja el pollo para el final porque suele generar mayor impacto.',goodDelta:{interest:14,participation:6,energy:4},badDelta:{interest:-12,energy:-8}},
      {label:'BROCHURE',context:`Después de degustar, la familia muestra interés y pregunta por opciones.`,question:'¿Cómo usarías el brochure?',options:['Empezaría por la opción más completa, observaría qué llama su atención y bajaría según su necesidad.','Abriría directamente en lo más económico.','Mostraría todas las páginas sin detenerme.','Entregaría el brochure y guardaría silencio hasta que escojan.'],answer:0,thought:'Está comparando valor, no solo precios.',why:'El anclaje ayuda a entender las opciones desde una referencia alta.',tip:'Asesora: no muestres por mostrar.',goodDelta:{interest:10,confidence:4},badDelta:{interest:-9,energy:-6}},
      {label:'NEGOCIACIÓN',context:`La familia ya conoce la opción y pregunta por la cuota.`,question:'¿Qué harías antes de recomendar un valor mensual?',options:['Preguntaría cuánto puede separar cada adulto después de sus gastos y sumaría una capacidad cómoda.','Mostraría la cuota máxima que apruebe el sistema.','Preguntaría solo a quien parece ganar más.','Ocultaría el valor total y hablaría únicamente del pago mensual.'],answer:0,thought:'Necesita sentir que la opción cabe en su vida, no que le están imponiendo una cifra.',why:'La cuota debe construirse desde una capacidad real y responsable.',tip:'Vender cuotas no significa esconder cifras. Explica todo con claridad.',goodDelta:{confidence:12,interest:8},badDelta:{confidence:-15,interest:-8}}
    ];
    return common[step];
  }

  function playDemo(){
    const {item:client,idx}=nextFresh(clients[level],`sales34-demo-client-${level}`);
    Object.assign(stats,{confidence:65,interest:55,participation:55,energy:85,correct:0,total:0});
    let step=0;const elapsed=[0,12,28,45,70,88,105,125];
    function draw(){
      if(step>=7){
        const avg=Math.round((stats.confidence+stats.interest+stats.participation+stats.energy)/4);
        stage.innerHTML=`<div class="sales-story-result"><span>🎬 ASÍ TERMINÓ ESTA DEMOSTRACIÓN</span><h3>${client.name}</h3>${renderMeters()}<div class="story-ending ${avg>=75?'success':avg>=50?'partial':'lost'}"><strong>${avg>=75?'La familia quedó lista para tomar una decisión.':avg>=50?'La familia mantuvo interés, pero quedaron dudas.':'La demostración perdió fuerza antes del cierre.'}</strong><p>${stats.correct} de 7 decisiones fortalecieron la experiencia.</p></div><div class="sales-timeline">${['Llegada','Rompehielo','Compañía','Metales','Cocinado','Brochure','Negociación'].map((x,i)=>`<span class="${i<stats.correct?'good':''}">${x}</span>`).join('')}</div><button class="primary-action" id="newDemoStory">Visitar otra familia <span>→</span></button></div>`;
        document.getElementById('newDemoStory').onclick=playDemo;return;
      }
      const d=demoStepData(client,step);const mins=Math.floor(elapsed[step]/60),secs=elapsed[step]%60;
      stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">${levelName[level]} · Familia ${idx+1} de 15</span><h3>🎯 Simulador de demostraciones</h3></div><span class="badge">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')} h</span></div><div class="sales-client-profile"><div><span>CLIENTE</span><h4>${client.name}</h4><p>${client.profile}</p></div><div class="client-mood">${stats.confidence<45?'🤨 Desconfiado':stats.energy<45?'😒 Cansado':stats.interest>75?'😍 Muy interesado':'🙂 Atento'}</div></div>${renderMeters()}<div class="sales-time-tip">⏱ ${elapsed[step]>=60&&step<5?'Ya pasó una hora. La familia debería estar cerca de degustar.':'Vas bien de tiempo. Mantén el ritmo y no expliques de más.'}</div><div id="salesStoryQuestion"></div>`;
      answerCard(document.getElementById('salesStoryQuestion'),{...d,nextLabel:'Siguiente momento',goodDelta:d.goodDelta,badDelta:d.badDelta},()=>{step++;draw()});
    }draw();
  }

  const objections={
    beginner:[
      ['“Está muy caro.”','¿Qué responderías primero?',['“¿Qué parte le pareció más costosa: el valor total o la cuota mensual?”','“No es caro si piensa en la garantía.”','“Le puedo bajar el precio.”','“Entonces miremos algo pequeño.”'],0,'Puede estar hablando de valor, cuota o miedo a comprometerse.','La pregunta descubre qué significa “caro” para esa persona.','No discutas el precio antes de entender la preocupación.'],
      ['“No tengo dinero ahora.”','¿Qué dirías?',['“Entiendo. ¿Se refiere al depósito inicial o a la cuota mensual?”','“Puede pedir prestado.”','“Entonces no se puede hacer nada.”','“Le guardo el precio indefinidamente.”'],0,'Quiere proteger su presupuesto y evitar una presión inmediata.','Separar depósito de cuota permite encontrar el verdadero obstáculo.','Una objeción general necesita una pregunta concreta.'],
      ['“Déjeme pensarlo.”','¿Cómo seguirías?',['“Claro. ¿Qué parte quisiera pensar con más calma?”','“Listo, yo le escribo en un mes.”','“No hay nada que pensar.”','“Le doy cinco minutos.”'],0,'Todavía hay una duda que no ha expresado.','Preguntar con respeto permite saber qué falta para decidir.','No cierres la conversación con una frase vaga.'],
      ['“Tengo que hablarlo con mi esposo.”','¿Qué harías?',['“Perfecto. ¿Qué aspecto cree que él querrá revisar primero?”','“Compre sin decirle.”','“Entonces vuelva a llamarme.”','“Seguro él va a decir que no.”'],0,'Quiere compartir la decisión o evitar decidir sola.','La pregunta prepara una conversación real y ayuda a identificar la duda.', 'Involucra a quien comparte la decisión.'],
      ['“Ya tengo ollas.”','¿Qué responderías?',['“Claro. ¿Qué es lo que más le gusta de las que usa hoy?”','“Estas son mejores.”','“Entonces véndalas.”','“Eso no importa.”'],0,'Quiere que respetes lo que ya tiene.','Reconocer su experiencia abre la puerta para mostrar diferencias sin atacar.','Nunca descalifiques lo que el cliente ya compró.'],
      ['“No me gusta comprar a crédito.”','¿Qué dirías?',['“Lo entiendo. ¿Qué experiencia le hizo sentirse así?”','“Todos compran financiado.”','“El crédito es obligatorio.”','“No se preocupe por el total.”'],0,'Puede existir una mala experiencia anterior.','Comprender el origen permite hablar de opciones con transparencia.','Primero recupera confianza; después explica alternativas.'],
      ['“La cuota me queda alta.”','¿Qué harías?',['“Revisemos una opción que quede cómoda sin perder lo que más necesita.”','“Haga un esfuerzo.”','“Le alargamos el plazo sin explicar.”','“Entonces no compre.”'],0,'Quiere proteger sus gastos mensuales.','La solución debe ser sostenible para la familia.','Una venta responsable también cuida el después.'],
      ['“No cocino mucho.”','¿Qué responderías?',['“¿Quién cocina normalmente y qué parte le resulta más incómoda?”','“Entonces no le sirve.”','“Aprenderá por obligación.”','“Igual debería comprar.”'],0,'Puede no cocinar por falta de tiempo, habilidad o gusto.','La pregunta descubre si existe una necesidad escondida.','No confundas “no cocino” con “no necesito”.'],
      ['“Quiero comparar.”','¿Qué dirías?',['“Claro. ¿Qué tres cosas serán más importantes para comparar?”','“No encontrará nada igual.”','“Eso es perder tiempo.”','“Le bajo el precio para que no compare.”'],0,'Quiere sentir que toma una decisión informada.','Definir criterios ayuda a comparar valor, no solo precio.','Ayuda al cliente a decidir, no a defenderse.'],
      ['“No quiero decidir hoy.”','¿Qué harías?',['“Entiendo. ¿Qué necesitaría quedar claro hoy para avanzar con tranquilidad?”','“La promoción se acaba ya.”','“Entonces cancelo todo.”','“Le llamo todos los días.”'],0,'Puede sentir presión o falta de claridad.','La pregunta reduce presión y descubre lo pendiente.','Urgencia no es amenaza.'],
      ['“Mi cocina es muy pequeña.”','¿Qué responderías?',['“¿Qué piezas usa más y cuánto espacio tiene disponible?”','“Tiene que remodelar.”','“Compre el set más grande.”','“Eso no afecta.”'],0,'Le preocupa la utilidad diaria y el espacio.','La respuesta adapta la solución a su realidad.','La mejor opción no siempre es la más grande.'],
      ['“No sé si lo voy a usar.”','¿Qué dirías?',['“¿Qué recetas prepara más y qué le gustaría hacer más fácil?”','“Seguro sí lo usa.”','“Eso depende de usted.”','“La garantía lo resuelve.”'],0,'Teme pagar por algo que termine guardado.','Conectar con recetas reales aumenta la utilidad percibida.','Aterriza el producto en su vida diaria.'],
      ['“Es mucha plata por utensilios.”','¿Qué responderías?',['“Entiendo. Además del producto, ¿qué valor le daría al ahorro de tiempo, duración y acompañamiento?”','“Es una inversión, punto.”','“No piense en el precio.”','“Le regalo algo para compensar.”'],0,'Está reduciendo todo a la categoría “utensilios”.','La respuesta amplía el valor sin negar su percepción.','Reafirma valor sin discutir.'],
      ['“Mis hijos no están de acuerdo.”','¿Qué harías?',['“¿Qué es lo que más les preocupa a ellos?”','“La decisión es suya.”','“No les cuente.”','“Ellos no entienden.”'],0,'Necesita armonía familiar para decidir.','Identificar la preocupación permite incluirla en la conversación.','No pongas al cliente contra su familia.'],
      ['“Quiero empezar después.”','¿Qué dirías?',['“¿Qué tendría que cambiar para que después sea un mejor momento?”','“Le respeto el precio para siempre.”','“Después será más caro.”','“Entonces no le interesa.”'],0,'Puede estar aplazando por dinero, miedo o falta de prioridad.','La pregunta convierte “después” en una razón concreta.','Las fechas vagas esconden dudas reales.']
    ],
    intermediate:[],expert:[]
  };
  objections.intermediate=objections.beginner.map((x,i)=>{const y=JSON.parse(JSON.stringify(x));y[0]=['“Me gusta, pero prefiero esperar a que bajen las tasas.”','“La cuota cabe, pero no quiero otra obligación.”','“No quiero tomar una decisión emocional.”','“Mi pareja no vio toda la demostración.”','“Ya tuve un producto premium y no fue lo que esperaba.”','“No quiero que consulten mi crédito.”','“Prefiero ahorrar y comprar de contado.”','“Yo casi no estoy en la casa.”','“En internet vi algo parecido más barato.”','“No me gusta que me presionen con promociones.”','“El set que me gusta ocupa demasiado espacio.”','“Me preocupa que después nadie me acompañe.”','“El producto me encanta; la financiación no.”','“Mis hijos dicen que es innecesario.”','“Tal vez el próximo semestre.”'][i];y[1]='¿Qué respuesta mantendría mejor la conversación?';return y});
  objections.expert=objections.beginner.map((x,i)=>{const y=JSON.parse(JSON.stringify(x));y[0]=['“No es caro; simplemente hoy no quiero comprometer liquidez.”','“Podría pagarla, pero no sé si sea una decisión inteligente.”','“Pensarlo no significa que tenga una objeción.”','“Mi esposa dijo que sí, pero yo no participé en la decisión.”','“Ya conozco todos esos beneficios.”','“No le temo al crédito; no confío en las condiciones.”','“El problema no es la cuota, es pagar tantos meses.”','“No cocino, pero mi familia sí; yo solo pago.”','“La comparación online tiene mejores especificaciones.”','“La urgencia me hace desconfiar.”','“La opción ideal no cabe en mi espacio; la pequeña no me convence.”','“La garantía suena bien, pero ¿quién responde dentro de veinte años?”','“Puedo comprar, pero no quiero financiar consumo.”','“Mis hijos creen que estoy comprando por emoción.”','“El próximo semestre tendría más flujo, aunque hoy también puedo.”'][i];y[1]='¿Qué dirías sin discutir ni regalar valor?';return y});

  function playObjections(){
    const {item:o,idx}=nextFresh(objections[level],`sales34-obj-${level}`);
    const [context,question,options,answer,thought,why,tip]=o;
    stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">${levelName[level]} · Objeción ${idx+1} de 15</span><h3>🛡️ Entrenador de objeciones</h3></div><span class="badge">Conversación real</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><p>Lee lo que dijo el cliente y elige una respuesta que ayude a descubrir la duda real. No todas las objeciones se responden igual.</p></div><div id="salesObjQuestion"></div>`;
    answerCard(document.getElementById('salesObjQuestion'),{label:'EL CLIENTE DICE',context,question,options,answer,thought,why,tip,nextLabel:'Otra objeción',goodDelta:{confidence:8,interest:5},badDelta:{confidence:-8,interest:-4}},playObjections);
  }

  const negotiations={
    beginner:[
      ['La esposa puede separar $80.000 quincenales y el esposo $100.000.','¿Qué capacidad mensual usarías como referencia?',['$360.000 mensuales, siempre validando que sea cómoda para ambos.','$180.000 mensuales porque no se suman.','$720.000 mensuales porque son dos quincenas por persona.','La cuota máxima que permita el sistema.'],0,'Quieren una opción que no desordene su hogar.','La suma quincenal de ambos da una referencia mensual de $360.000.','Confirma la cifra antes de usar la calculadora.'],
      ['La familia pide ver una opción grande y una más pequeña.','¿Cómo presentarías la decisión?',['“¿Prefieren la opción más completa o comenzar con la que cubre lo esencial?”','“¿Lo compran sí o no?”','“La grande es la única que vale la pena.”','“Elijan ustedes sin mi ayuda.”'],0,'Necesitan comparar sin sentirse empujados.','La doble alternativa facilita elegir entre dos caminos válidos.','Guía la decisión sin quitar libertad.'],
      ['El cliente guarda silencio después de conocer la cuota.','¿Qué harías?',['Esperaría unos segundos y preguntaría: “¿Cómo se siente con esa cuota?”','Hablaría de inmediato para llenar el silencio.','Bajaría la cuota sin preguntar.','Retiraría la oferta.'],0,'Está procesando la cifra y observando tu reacción.','El silencio breve y una pregunta abierta permiten una respuesta honesta.','No rescates al cliente de cada silencio.'],
      ['La pareja quiere pagar de contado, pero conservar liquidez.','¿Qué opción mostrarías?',['Compararía claramente contado y financiación para que decidan según su flujo.','Insistiría en contado porque es mejor para ti.','Ocultaría la financiación.','Elegiría por ellos.'],0,'Quieren cuidar el dinero disponible sin pagar de más.','La comparación transparente permite tomar una decisión informada.','Presenta números, no presión.'],
      ['El cliente pide empezar con algo más pequeño.','¿Qué harías?',['Buscaría una opción menor que conserve el beneficio que más valoró.','Diría que solo se vende el set grande.','Eliminaría piezas al azar.','Ofrecería un descuento sin cambiar la opción.'],0,'Quiere reducir riesgo sin abandonar la compra.','Una opción inicial puede ser correcta si sigue resolviendo su necesidad.','No sacrifiques la necesidad por bajar la cifra.'],
      ['La esposa quiere comprar y el esposo aún duda.','¿Cómo avanzarías?',['Preguntaría al esposo qué necesita aclarar antes de sentirse cómodo.','Pediría a la esposa que lo convenza.','Ignoraría al esposo.','Cerraría solo con ella.'],0,'Él necesita participar en una decisión compartida.','Incluir su duda evita una compra con conflicto posterior.','Nunca conviertas a un miembro de la pareja en adversario.'],
      ['El cliente acepta la cuota, pero no el depósito inicial.','¿Qué aclararías?',['Qué monto puede cubrir hoy y qué alternativas reales existen sin prometer excepciones.','Que el depósito no importa.','Que firme y pague después.','Que pida dinero prestado.'],0,'La barrera está en el dinero inmediato, no en la cuota.','Separar ambas cifras permite buscar una opción responsable.','No prometas condiciones que no están autorizadas.'],
      ['La familia pregunta cuál escogerías tú.','¿Qué responderías?',['Recomendaría una opción explicando cómo coincide con lo que ellos dijeron necesitar.','Escogería la más cara.','Diría que todas son iguales.','Evitaría recomendar para no comprometerme.'],0,'Buscan orientación profesional, no una orden.','Una recomendación razonada demuestra escucha y criterio.','Asesorar es explicar el porqué.'],
      ['La familia quiere una opción que pueda ampliar después.','¿Qué cierre usarías?',['“Empecemos con esta solución y dejamos claro qué podrían agregar más adelante.”','“Compre todo hoy o perderá la oportunidad.”','“No se puede ampliar.”','“Después vemos.”'],0,'Quieren comenzar sin cerrar futuras posibilidades.','El cierre por avance reduce el miedo a equivocarse.','Define el siguiente paso, no una promesa vaga.'],
      ['El cliente responde “sí” a todos los beneficios, pero no decide.','¿Qué harías?',['Resumiría sus respuestas y preguntaría cuál de dos opciones desea iniciar.','Volvería a repetir toda la demostración.','Esperaría indefinidamente.','Le daría más regalos.'],0,'Está de acuerdo, pero necesita una guía concreta para actuar.','El resumen conecta sus propios motivos con una decisión.', 'Usa lo que el cliente ya dijo, no argumentos nuevos.'],
      ['La pareja duda entre 12 y 24 meses.','¿Cómo ayudarías?',['Compararía cuota, costo total y comodidad de cada plazo.','Mostraría solo la cuota más baja.','Elegiría el plazo más largo sin explicar.','Evitaría hablar del costo total.'],0,'Quieren equilibrar pago mensual y duración.','La transparencia permite elegir sin sorpresas.','Siempre explica plazo y valor total.'],
      ['El cliente tiene ingresos variables.','¿Qué capacidad usarías?',['Una cuota que pueda sostener incluso en un mes normal, no en su mejor mes.','La cifra de su mejor mes.','La máxima aprobación posible.','Una cuota elegida al azar.'],0,'Teme quedar apretado cuando baje el ingreso.','La venta debe sobrevivir a los meses normales.','Responsabilidad primero, volumen después.'],
      ['La familia dice “queremos la última mejor opción”.','¿Qué harías?',['Confirmaría qué significa “mejor” para ellos antes de presentar una alternativa final.','Daría el descuento más alto.','Inventaría una promoción.','Repetiría la misma opción con otro nombre.'],0,'Puede significar menor cuota, más producto o mejor relación valor-precio.','Definir “mejor” evita negociar contra ti mismo.','No ofrezcas algo sin saber qué buscan.'],
      ['El cliente acepta, pero no entrega documentos.','¿Cómo cerrarías el siguiente paso?',['Explicaría uno por uno qué documento falta y lo completaríamos en ese momento.','Dejaría todo para otro día.','Llenaría datos sin verificar.','Diría que no son importantes.'],0,'Puede sentirse confundido o cansado por la papelería.','Un proceso claro mantiene el compromiso hasta el final.','La venta no termina hasta que la documentación esté correcta.'],
      ['La pareja quiere pensarlo hasta mañana.','¿Qué harías?',['Preguntaría qué falta por resolver y dejaría un siguiente contacto con hora concreta.','Aceptaría un “luego hablamos” sin fecha.','Amenazaría con perder el precio.','Llamaría cada hora.'],0,'Quieren espacio, pero la decisión puede enfriarse.','Resolver dudas y acordar una próxima acción mantiene claridad sin presión.','Nunca cierres con “cualquier cosa me avisa”.']
    ],intermediate:[],expert:[]
  };
  negotiations.intermediate=negotiations.beginner.map((x,i)=>{const y=JSON.parse(JSON.stringify(x));y[0]=['La pareja puede pagar $360.000, pero quiere reservar margen para imprevistos.','La opción completa resuelve todo; la inicial cubre solo la prioridad principal.','El silencio aparece después de ver el valor total, no la cuota.','El contado tiene descuento, pero usaría casi todos sus ahorros.','La opción pequeña cabe, pero no incluye lo que más valoraron.','Ella quiere comprar por salud; él duda por el plazo.','El depósito cabe si reducen otra obligación ese mes.','Te piden que recomiendes sin conocer aún su prioridad final.','Quieren empezar pequeño, pero esperan beneficios del set grande.','Aceptan todos los beneficios, pero evitan escoger plazo.','La cuota corta es alta; la larga es cómoda pero aumenta el costo total.','Los ingresos varían mucho entre temporadas.','“La mejor opción” para ella es más piezas; para él, menor cuota.','La papelería está lista, pero falta verificar un ingreso.','Quieren decidir mañana porque un familiar les aconseja esperar.'][i];return y});
  negotiations.expert=negotiations.beginner.map((x,i)=>{const y=JSON.parse(JSON.stringify(x));y[0]=['La capacidad matemática es $500.000, pero emocionalmente solo aceptan $350.000.','Dos opciones son sostenibles: una maximiza valor y otra minimiza riesgo.','El cliente guarda silencio y la pareja evita mirarse entre sí.','El contado ahorra dinero, pero compromete el fondo de emergencia.','La opción pequeña no resuelve todo; la grande sí, pero exige disciplina financiera.','Ella quiere comprar; él teme repetir una deuda que salió mal.','El depósito requiere mover dinero que estaba destinado a otra obligación.','Te piden una recomendación y sabes que la opción más rentable no es la más cómoda.','Quieren ampliar después, pero el precio futuro es incierto.','Aceptan el valor, pero dicen “no somos de decidir rápido”.','El plazo largo mejora el flujo, pero el cliente rechaza pagar más intereses.','Los ingresos dependen de comisiones y no existe un salario fijo.','Cada miembro de la pareja define “mejor” de forma opuesta.','El documento de ingresos no coincide con lo conversado.','El familiar que aconseja esperar no estuvo en la demostración.'][i];return y});

  function playNegotiation(){
    const {item:o,idx}=nextFresh(negotiations[level],`sales34-neg-${level}`);
    const [context,question,options,answer,thought,why,tip]=o;
    stage.innerHTML=`<div class="game-head"><div><span class="game-kicker">${levelName[level]} · Caso ${idx+1} de 15</span><h3>🤝 Negociación y cierres</h3></div><span class="badge">Decisión responsable</span></div><div class="how-game"><span>¿CÓMO FUNCIONA?</span><p>Elige la forma más clara de convertir interés en una decisión. Aquí entrenas cuotas, pareja, opciones, silencios y cierre de papelería.</p></div><div id="salesNegQuestion"></div>`;
    answerCard(document.getElementById('salesNegQuestion'),{label:'SITUACIÓN REAL',context,question,options,answer,thought,why,tip,nextLabel:'Otro caso',goodDelta:{confidence:8,interest:8},badDelta:{confidence:-8,interest:-6}},playNegotiation);
  }

  function renderGame(){if(game==='demo')playDemo();else if(game==='objections')playObjections();else playNegotiation()}
  difficulty?.addEventListener('click',e=>{const b=e.target.closest('button[data-level]');if(!b)return;level=b.dataset.level;difficulty.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderGame()});
  menu.addEventListener('click',e=>{const b=e.target.closest('button[data-core-game]');if(!b)return;game=b.dataset.coreGame;menu.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderGame()});
  renderGame();
})();
