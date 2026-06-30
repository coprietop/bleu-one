const porcentajes = {2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
const COP_RATE = 3600;
const $ = (id)=>document.getElementById(id);
const moneyCOP = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
const numFmt = new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
function n(v){return Number(String(v ?? '').replace(/[^0-9]/g,''))||0}
function fmtCOP(v){return moneyCOP.format(Math.round(v)).replace('COP','').trim()}
function fmtUSD(v){return 'US$ ' + numFmt.format(Math.round(v))}
function pct(v){return Math.max(0, Math.min(100, v));}
function bindMoney(id, cb){ const el=$(id); if(!el) return; el.addEventListener('input',()=>{const val=n(el.value); el.value=val?numFmt.format(val):''; cb&&cb();}); el.dispatchEvent(new Event('input')); }

function calcOrden(){
  const total=n($('total').value); const dep=n($('deposito').value); const cuotas=Number($('cuotas').value);
  const compra=total/1.19; const iva=total-compra; const min=total*0.05; const saldo=Math.max(total-dep,0); const p=porcentajes[cuotas]||0; const pago=saldo*(p/100); const mg=total*0.20;
  $('precioCompra').textContent=fmtCOP(compra); $('iva').textContent=fmtCOP(iva); $('precioTotal').textContent=fmtCOP(total); $('depositoHoy').textContent=fmtCOP(dep); $('saldo').textContent=fmtCOP(saldo); $('cuotasOut').textContent=cuotas; $('pagoMinimo').textContent=fmtCOP(pago);
  const mgEl=$('mgValor'); if(mgEl) mgEl.textContent=fmtCOP(mg);
  $('depositHint').textContent=`Mínimo requerido: ${fmtCOP(min)}.`; $('formula').textContent=`Pago mínimo mensual = ${fmtCOP(saldo)} × ${p.toFixed(2)}% = ${fmtCOP(pago)}.`;
  const alerta=$('alerta');
  if(dep>=min){alerta.className='alert ok'; alerta.textContent='Depósito correcto. Cumple con el mínimo requerido del 5%.'}
  else{alerta.className='alert bad'; alerta.textContent=`Depósito insuficiente. Debe ser mínimo ${fmtCOP(min)}.`}
}
for(let i=2;i<=27;i++){const o=document.createElement('option'); o.value=i; o.textContent=`${i} cuotas — ${porcentajes[i].toFixed(2)}%`; if(i===27)o.selected=true; $('cuotas').appendChild(o)}
['total','deposito'].forEach(id=>bindMoney(id, calcOrden)); $('cuotas').addEventListener('change',calcOrden); calcOrden();

for(let i=2;i<=27;i++){const o=document.createElement('option'); o.value=i; o.textContent=`${i} meses — ${porcentajes[i].toFixed(2)}%`; if(i===27)o.selected=true; const sel=$('cuotaMeses'); if(sel) sel.appendChild(o)}
function calcCuota(){
  const v=n($('cuotaValor').value);
  const meses=Number($('cuotaMeses')?.value || 27);
  const p=porcentajes[meses]||5;
  const venta=p ? v/(p/100) : 0;
  $('cuotaVenta').textContent=fmtCOP(venta);
  const f=$('cuotaFormula'); if(f) f.textContent=`${meses} meses usa ${p.toFixed(2)}% según tabla. Venta aproximada = cuota ÷ ${p.toFixed(2)}%.`;
}
bindMoney('cuotaValor', calcCuota); const cuotaMeses=$('cuotaMeses'); if(cuotaMeses) cuotaMeses.addEventListener('change',calcCuota); calcCuota();
function calcNombres(){const v=n($('metaNombres').value); $('nombresOut').textContent=numFmt.format(Math.ceil(v/185));}
bindMoney('metaNombres', calcNombres);

const niveles = [
  {name:'JD', compras:null, volumen:20000, desc:'Meta para ascender a JD: lograr US$20.000 en volumen dentro de una ventana de 3 meses. Cada mes debe tener mínimo US$4.000; si un mes no cumple, la ventana se corre al siguiente periodo.', nota:'Meta: US$20.000 en volumen en 3 meses. Mínimo US$4.000 por mes.'},
  {name:'D3', compras:27000, desc:'Meta para ascender a D3: lograr US$27.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'},
  {name:'D2', compras:80000, desc:'Meta para ascender a D2: lograr US$80.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'},
  {name:'D1', compras:135000, desc:'Meta para ascender a D1: lograr US$135.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'},
  {name:'BLUE', compras:275000, desc:'Meta para ascender a BLUE: lograr US$275.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'},
  {name:'ROYAL', compras:550000, desc:'Meta para ascender a ROYAL: lograr US$550.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'},
  {name:'PREMIER', compras:1000000, desc:'Meta para ascender a PREMIER: lograr US$1.000.000 en compras dentro del año. Bleu One también te muestra el volumen aproximado que debes construir.'}
];
niveles.forEach((x,i)=>{const o=document.createElement('option'); o.value=i; o.textContent=x.name; $('ascensoNivel').appendChild(o)});
function calcAscenso(){
  const idx=Number($('ascensoNivel').value);
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
  $('ascensoTitulo').textContent=`Meta: ${nivel.name}`;
  $('ascensoDescripcion').textContent=nivel.desc;
  $('ascensoPct').textContent=`${avance.toFixed(0)}%`;
  $('ascensoBar').style.width=`${avance}%`;
  $('ascensoCompras').textContent=nivel.compras?fmtUSD(nivel.compras):'No aplica';
  $('ascensoMetaVol').textContent=fmtUSD(metaVol);
  $('ascensoActualLabel').textContent=isJD?'Volumen acumulado en 3 meses':'Volumen actual aproximado';
  $('ascensoActual').textContent=fmtUSD(actual);
  $('ascensoFalta').textContent=fmtUSD(falta);
  const faltaCopIva = falta * COP_RATE * 1.19;
  const faltaCopEl = $('ascensoFaltaCOP'); if(faltaCopEl) faltaCopEl.textContent = fmtCOP(faltaCopIva) + ' COP';
  $('ascensoMensualLabel').textContent=isJD?'Faltante para los US$20.000':'Volumen mensual necesario';
  $('ascensoMensual').textContent=fmtUSD(mensual);
  $('ascensoExtra').textContent=isJD ? nivel.nota : `Meta anual en compras: ${fmtUSD(nivel.compras)}. Volumen de venta aproximado: ${fmtUSD(metaVol)}. Estos valores son aproximados.`;

  const nombres=Math.ceil((isJD ? falta : mensual)/185);
  let consejo='Consejo: revisa tu meta cada semana y convierte el faltante en nombres, puntos de prospección y movimiento de programas.';
  if(isJD && falta>0){
    consejo=`Consejo útil: para cerrar el faltante necesitas aprox. ${numFmt.format(nombres)} nombres semanales. Reúnete con tu distribuidor, activa puntos de prospección, QR, buzones y stands. Lo más efectivo: movimiento de programas; revisa con la tele de tu distribución los programas antiguos que quedaron a 1 o 2 visitas del premio y reactívalos con permiso del distribuidor.`;
  } else if(!isJD && falta>0){
    consejo=`Consejo útil: si faltan ${fmtUSD(falta)}, divide la meta en meses, semanas y nombres. Aproximadamente necesitas ${numFmt.format(nombres)} nombres semanales según el volumen mensual requerido.`;
  }
  $('ascensoConsejo').textContent=consejo;
}
bindMoney('ascensoVol', calcAscenso); ['jdMes1','jdMes2','jdMes3'].forEach(id=>bindMoney(id, calcAscenso)); $('ascensoNivel').addEventListener('change',calcAscenso); $('ascensoMeses').addEventListener('input',calcAscenso); const ascTipo=$('ascensoTipoActual'); if(ascTipo) ascTipo.addEventListener('change',calcAscenso); calcAscenso();

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
    $('ticketPct').textContent='0%'; $('ticketBar').style.width='0%'; $('ticketFalta').textContent='Selecciona una categoría para calcular tu avance.';
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
  $('ticketPct').textContent=`${avance.toFixed(0)}%`; $('ticketBar').style.width=`${avance}%`; $('ticketFalta').textContent=falta?`Faltan ${fmtUSD(falta)} para clasificar.`:'Meta cumplida para este cuatrimestre.';
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

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.screen).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}));
let deferredPrompt; const installBtn=$('installBtn'); window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault(); deferredPrompt=e; installBtn.classList.remove('hidden')}); installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; installBtn.classList.add('hidden')});
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js').catch(()=>{})}

// Agregados
(function initAgregados(){
  const sel=$('agMeses');
  if(sel){
    for(let i=2;i<=27;i++){
      const o=document.createElement('option');
      o.value=i; o.textContent=`${i} meses — ${porcentajes[i].toFixed(2)}%`;
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
    $('agFormula').textContent=`Pago mensual = ${fmtCOP(total)} × ${p.toFixed(2)}% (${meses} meses) = ${fmtCOP(pago)}.`;
  }
  ['agSaldo','agCompra','agInicial'].forEach(id=>bindMoney(id, calcAgregados));
  if(sel) sel.addEventListener('change', calcAgregados);
  calcAgregados();
})();

// Botón Somos Bleu
(function initSomos(){
  document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>{
    const target=btn.dataset.go;
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
      {name:'Maricela Chilito & Eduardo Mayordomo', city:'Funza', volume:20648},
      {name:'Cristian Camilo Forero', city:'Cajicá', volume:11201},
      {name:'Lina Marcela Molina', city:'Cajicá', volume:11172},
      {name:'Samuel Camilo Riaño', city:'Chía', volume:11071},
      {name:'Alba Lucía Gonzales', city:'Sopó', volume:11012}
    ]},
    junior:{title:'Distribuidores Junior', items:[
      {name:'Maricela Chilito & Eduardo Mayordomo', city:'Funza', volume:20648},
      {name:'Samuel Camilo Riaño', city:'Chía', volume:13268},
      {name:'Cristian Camilo Forero', city:'Cajicá', volume:11201},
      {name:'Lina Marcela Molina', city:'Cajicá', volume:11172},
      {name:'Andrés & Samuel Álvarez', city:'Chía', volume:9182}
    ]},
    distribuidores:{title:'Distribuidores', items:[
      {name:'Yurani Chacón & Luis Villarraga', city:'Cajicá', volume:21525},
      {name:'Alejandro Camelo & Karol Viloria', city:'Tocancipá', volume:13776},
      {name:'Rodolfo Tarazona & Edna Ruiz', city:'Tocancipá', volume:13628},
      {name:'Alex Prieto & Valentina Rodríguez', city:'Chía', volume:12605},
      {name:'Javier Barrera & Kelly Soto', city:'Tocancipá', volume:12287}
    ]}
  };
  const medals=['🥇','🥈','🥉','4','5'];
  let current='personal';
  function openModal(item, idx, category){
    const m=$('topperModal'); if(!m) return;
    $('modalMedal').textContent=medals[idx] || idx+1;
    $('modalName').textContent=item.name;
    $('modalCity').textContent=`📍 ${item.city}`;
    $('modalVolume').textContent=fmtUSD(item.volume);
    $('modalCategory').textContent=category;
    m.classList.remove('hidden');
  }
  function render(key=current){
    if(!$('podium')) return;
    current=key;
    const group=data[key];
    $('podiumTitle').textContent=group.title;
    const [a,b,c]=group.items;
    $('podium').innerHTML=`
      <button class="podium-place first" data-idx="0"><span class="medal">🥇</span><strong>${a.name}</strong><small>${a.city}</small><b>${fmtUSD(a.volume)}</b></button>
      <div class="podium-row">
        <button class="podium-place second" data-idx="1"><span class="medal">🥈</span><strong>${b.name}</strong><small>${b.city}</small><b>${fmtUSD(b.volume)}</b></button>
        <button class="podium-place third" data-idx="2"><span class="medal">🥉</span><strong>${c.name}</strong><small>${c.city}</small><b>${fmtUSD(c.volume)}</b></button>
      </div>`;
    $('topperList').innerHTML=group.items.slice(3).map((x,i)=>`<button class="topper-row" data-idx="${i+3}"><span>${i+4}°</span><strong>${x.name}</strong><small>${x.city}</small><b>${fmtUSD(x.volume)}</b></button>`).join('');
    document.querySelectorAll('#podium [data-idx], #topperList [data-idx]').forEach(el=>el.addEventListener('click',()=>openModal(group.items[Number(el.dataset.idx)], Number(el.dataset.idx), group.title)));
  }
  document.querySelectorAll('.topper-tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.topper-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active'); render(btn.dataset.top);
  }));
  $('modalClose')?.addEventListener('click',()=> $('topperModal')?.classList.add('hidden'));
  $('topperModal')?.addEventListener('click',(e)=>{ if(e.target.id==='topperModal') $('topperModal').classList.add('hidden'); });
  function tick(){
    const el=$('topCountdown'); if(!el) return;
    const now=new Date();
    const endColombia = new Date('2026-07-01T04:59:59Z'); // 30 junio 2026, 11:59:59 p.m. Colombia
    let diff=Math.max(0, endColombia-now);
    const d=Math.floor(diff/86400000); diff-=d*86400000;
    const h=Math.floor(diff/3600000); diff-=h*3600000;
    const m=Math.floor(diff/60000); diff-=m*60000;
    const s=Math.floor(diff/1000);
    const vals=[d,h,m,s].map(x=>String(x).padStart(2,'0'));
    el.querySelectorAll('strong').forEach((node,i)=>node.textContent=vals[i]);
  }
  render(); tick(); setInterval(tick,1000);
})();
