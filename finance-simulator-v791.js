(()=>{
  'use strict';
  const rates={2:51.63,3:34.79,4:26.38,5:21.33,6:17.96,7:15.56,8:13.76,9:12.36,10:11.24,11:10.33,12:9.56,13:8.92,14:8.37,15:7.89,16:7.47,17:7.11,18:6.78,19:6.49,20:6.22,21:5.99,22:5.77,23:5.58,24:5.40,25:5.18,26:5.03,27:5.00};
  const monthlyRate=.021;
  const $=id=>document.getElementById(id);
  const num=v=>Number(String(v??'').replace(/[^0-9]/g,''))||0;
  const nf=new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
  const cop=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  const money=v=>cop.format(Math.round(v||0)).replace('COP','').trim();
  const pct=v=>`${Number(v||0).toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})}%`;
  const monthsText=n=>`${n} ${n===1?'mes':'meses'}`;
  const screen=$('simuladorfin');
  let lastResult=null, calcTimer=0, chartTimer=0, initialized=false;

  function isVisible(){return !!screen?.classList.contains('active') && screen.offsetParent!==null;}
  function debounceCalculate(){clearTimeout(calcTimer);calcTimer=setTimeout(calculate,90);}
  function bindMoney(id){const x=$(id);if(!x)return;x.addEventListener('input',()=>{const v=num(x.value);x.value=v?nf.format(v):'';debounceCalculate();},{passive:true});}

  function buildSchedule(principal,months,payment,extraMonth=0,extraAmount=0){
    if(principal<=0||payment<=0)return {rows:[],totalInterest:0,totalPaid:0,duration:0,lastPayment:0,totalNormal:0,totalExtra:0};
    let balance=principal,totalInterest=0,totalPaid=0,totalNormal=0,totalExtra=0;const rows=[];
    const maxMonths=Math.min(120,Math.max(months+36,40));
    for(let m=1;m<=maxMonths&&balance>.5;m++){
      const initial=balance,interest=initial*monthlyRate;
      let normal=Math.min(payment,initial+interest),capital=Math.max(0,normal-interest);
      balance=Math.max(0,initial-capital);
      let extra=0;if(m===extraMonth&&extraAmount>0&&balance>0){extra=Math.min(extraAmount,balance);balance-=extra;}
      totalInterest+=interest;totalNormal+=normal;totalExtra+=extra;totalPaid+=normal+extra;
      rows.push({month:m,initial,normal,interest,capital,extra,balance});
      if(!extraMonth&&m===months&&balance>0){const residual=balance;const r=rows[rows.length-1];r.normal+=residual;r.capital+=residual;r.balance=0;totalNormal+=residual;totalPaid+=residual;balance=0;}
    }
    return {rows,totalInterest,totalPaid,duration:rows.length,lastPayment:rows.length?rows[rows.length-1].normal+rows[rows.length-1].extra:0,totalNormal,totalExtra};
  }

  function fillMonths(){
    const m=$('finMeses');if(!m||m.options.length)return;
    const frag=document.createDocumentFragment();for(let i=2;i<=27;i++){const o=document.createElement('option');o.value=i;o.textContent=`${i} meses`;o.selected=i===27;frag.appendChild(o)}m.appendChild(frag);
    m.addEventListener('change',()=>{fillExtraMonths();calculate();});fillExtraMonths();
  }
  function fillExtraMonths(){
    const months=Number($('finMeses')?.value||27),s=$('finMesExtra');if(!s)return;const old=Number(s.value)||0;
    const frag=document.createDocumentFragment(),first=document.createElement('option');first.value='0';first.textContent='Sin abono adicional';frag.appendChild(first);
    for(let i=1;i<=months;i++){const o=document.createElement('option');o.value=i;o.textContent=`Mes ${i}`;o.selected=i===old;frag.appendChild(o)}s.replaceChildren(frag);
  }

  function renderRows(rows,extraMonth){
    const body=$('finTablaBody');if(!body)return;
    if(!rows.length){body.innerHTML='<tr><td colspan="7" class="finance-empty-row">Completa los datos para generar la tabla.</td></tr>';return;}
    const html=new Array(rows.length);for(let i=0;i<rows.length;i++){const r=rows[i];html[i]=`<tr class="${r.month===extraMonth?'extra-row':''}"><td>${r.month}${r.month===extraMonth?'<small>ABONO</small>':''}</td><td>${money(r.initial)}</td><td>${money(r.normal)}</td><td>${money(r.interest)}</td><td>${money(r.capital)}</td><td>${r.extra?`<strong>+ ${money(r.extra)}</strong>`:'—'}</td><td>${money(r.balance)}</td></tr>`;}body.innerHTML=html.join('');
  }

  function canvasBox(id){
    const canvas=$(id);if(!canvas||!isVisible())return null;const wrap=canvas.parentElement;const cssW=Math.floor(wrap?.clientWidth||0)-16;if(cssW<100)return null;
    const w=Math.min(1400,Math.max(280,cssW)),h=Number(canvas.getAttribute('height')||270),dpr=Math.min(2,window.devicePixelRatio||1);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;}
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h};
  }
  function compact(v){if(v>=1e6)return `$${(v/1e6).toLocaleString('es-CO',{maximumFractionDigits:1})}M`;if(v>=1e3)return `$${Math.round(v/1e3)}k`;return `$${Math.round(v)}`;}
  function drawEmpty(id,text='Completa los datos para generar la gráfica'){
    const c=canvasBox(id);if(!c)return;const {ctx,w,h}=c;ctx.fillStyle='rgba(202,216,236,.68)';ctx.font='500 14px system-ui';ctx.textAlign='center';ctx.fillText(text,w/2,h/2);ctx.textAlign='start';
  }
  function drawChart(id,series,opts={}){
    const c=canvasBox(id);if(!c)return;const {ctx,w,h}=c,p={l:56,r:18,t:24,b:42};
    const all=series.flatMap(s=>s.data).filter(Number.isFinite);if(!all.length){drawEmpty(id);return;}const max=Math.max(1,...all)*1.08;
    ctx.font='11px system-ui';ctx.fillStyle='rgba(202,216,236,.72)';ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const yy=p.t+(h-p.t-p.b)*i/4;ctx.beginPath();ctx.moveTo(p.l,yy);ctx.lineTo(w-p.r,yy);ctx.stroke();ctx.fillText(compact(max*(1-i/4)),4,yy+4)}
    const n=Math.max(1,...series.map(s=>s.data.length)),x=i=>p.l+(w-p.l-p.r)*(n<=1?0:i/(n-1)),y=v=>p.t+(h-p.t-p.b)*(1-v/max);
    [0,Math.floor((n-1)/2),n-1].filter((v,i,a)=>a.indexOf(v)===i).forEach(i=>ctx.fillText(`Mes ${i+1}`,Math.min(w-58,Math.max(p.l-10,x(i)-15)),h-14));
    series.forEach(s=>{if(!s.data.length)return;ctx.beginPath();s.data.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle=s.color;ctx.lineWidth=2.5;ctx.stroke();if(s.fill){ctx.lineTo(x(s.data.length-1),h-p.b);ctx.lineTo(x(0),h-p.b);ctx.closePath();const g=ctx.createLinearGradient(0,p.t,0,h-p.b);g.addColorStop(0,s.fill);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fill();}});
    if(opts.marker&&opts.marker<=n){const mx=x(opts.marker-1);ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle='rgba(240,207,115,.85)';ctx.beginPath();ctx.moveTo(mx,p.t);ctx.lineTo(mx,h-p.b);ctx.stroke();ctx.restore();ctx.fillStyle='#f0cf73';ctx.font='bold 10px system-ui';ctx.fillText('ABONO',Math.min(mx+6,w-58),p.t+12)}
  }
  function renderCharts(){
    clearTimeout(chartTimer);chartTimer=setTimeout(()=>{
      if(!isVisible())return;if(!lastResult?.principal){['finChartCapital','finChartSaldo','finChartComparativo'].forEach(id=>drawEmpty(id));return;}
      const {base,current,extraMonth,hasExtra}=lastResult;
      drawChart('finChartCapital',[{data:current.rows.map(r=>r.capital),color:'#e6bd55',fill:'rgba(230,189,85,.20)'},{data:current.rows.map(r=>r.interest),color:'#6f9bd0',fill:'rgba(111,155,208,.12)'}],{marker:hasExtra?extraMonth:0});
      drawChart('finChartSaldo',[{data:[current.rows[0].initial,...current.rows.map(r=>r.balance)],color:'#e6bd55',fill:'rgba(230,189,85,.18)'}],{marker:hasExtra?extraMonth+1:0});
      drawChart('finChartComparativo',[{data:[base.rows[0].initial,...base.rows.map(r=>r.balance)],color:'#788aa4'},{data:[current.rows[0].initial,...current.rows.map(r=>r.balance)],color:'#e6bd55',fill:'rgba(230,189,85,.12)'}],{marker:hasExtra?extraMonth+1:0});
    },30);
  }

  function setText(id,value){const x=$(id);if(x)x.textContent=value;}
  function calculate(){
    if(!$('finCompra'))return;const purchase=num($('finCompra').value),deposit=num($('finDeposito').value),months=Number($('finMeses').value||27),principal=Math.max(0,purchase-deposit),payment=principal*((rates[months]||0)/100),extraMonth=Number($('finMesExtra').value||0),extraAmount=num($('finExtra').value),hasExtra=!!(extraMonth&&extraAmount);
    const base=buildSchedule(principal,months,payment),current=hasExtra?buildSchedule(principal,months,payment,extraMonth,extraAmount):base,savedMonths=Math.max(0,base.duration-current.duration),savedInterest=Math.max(0,base.totalInterest-current.totalInterest),interestPct=principal?current.totalInterest/principal*100:0,totalCurrent=principal+current.totalInterest,capitalShare=totalCurrent?principal/totalCurrent*100:0,interestShare=totalCurrent?100-capitalShare:0,fixedRate=principal&&current.duration?current.totalInterest/principal/current.duration*100:0;
    lastResult={principal,base,current,extraMonth,hasExtra};
    setText('finSaldo',money(principal));setText('finCuota',money(payment));setText('finInteresBase',money(base.totalInterest));setText('finInteresConExtra',money(current.totalInterest));setText('finInteresActual',money(current.totalInterest));setText('finInteresPctTotal',`${pct(interestPct)} del capital`);setText('finInteresActualLabel',hasExtra?'Intereses con abono':'Intereses totales');setText('finTotalPagado',money(totalCurrent));setText('finUltima',money(current.lastPayment));setText('finMesesAhorro',monthsText(savedMonths));setText('finAhorroInteres',money(savedInterest));setText('finNuevaDuracion',monthsText(current.duration));setText('finTablaBadge',monthsText(current.duration));
    $('finImpacto')?.classList.toggle('active',hasExtra);if($('finCapitalBar'))$('finCapitalBar').style.width=`${capitalShare}%`;if($('finInterestBar'))$('finInterestBar').style.width=`${interestShare}%`;setText('finCapitalPct',`${capitalShare.toFixed(1)}%`);setText('finInterestPct',`${interestShare.toFixed(1)}%`);
    const ref27=buildSchedule(principal,27,principal*(rates[27]/100)),termSave=Math.max(0,ref27.totalInterest-base.totalInterest);
    if(principal){if(months<27){setText('finTipPlazo',`Ahorras ${money(termSave)}`);setText('finTipPlazoTexto',`Al elegir ${months} meses en lugar de 27, terminarías ${27-months} meses antes y pagarías aproximadamente ${money(termSave)} menos en intereses.`)}else{setText('finTipPlazo','Plazo máximo seleccionado');setText('finTipPlazoTexto',`A 27 meses pagarías aproximadamente ${money(base.totalInterest)} en intereses. Elegir un plazo menor reduce el costo total.`)}if(hasExtra){setText('finTipExtra',`Ahorras ${money(savedInterest)}`);setText('finTipExtraTexto',`El abono de ${money(extraAmount)} en el mes ${extraMonth} reduce el plazo en ${monthsText(savedMonths)} y los intereses de ${money(base.totalInterest)} a ${money(current.totalInterest)}.`)}else{setText('finTipExtra','Sin abono extraordinario');setText('finTipExtraTexto','Agrega un abono para calcular automáticamente cuánto tiempo e intereses podrías ahorrar.')}}else{setText('finTipPlazo','—');setText('finTipExtra','—')}
    setText('finTasaFija',`${pct(fixedRate)} fija`);['finCmpCapitalMv','finCmpCapitalFijo'].forEach(id=>setText(id,money(principal)));['finCmpPlazoMv','finCmpPlazoFijo'].forEach(id=>setText(id,monthsText(current.duration)));['finCmpCuotaMv','finCmpCuotaFijo'].forEach(id=>setText(id,money(payment)));['finCmpInteresMv','finCmpInteresFijo'].forEach(id=>setText(id,money(current.totalInterest)));['finTotalMv','finTotalFijo'].forEach(id=>setText(id,money(totalCurrent)));
    renderRows(current.rows,extraMonth);setText('finTablaCuotas',money(current.totalNormal));setText('finTablaIntereses',money(current.totalInterest));setText('finTablaCapital',money(principal-current.totalExtra));setText('finTablaExtras',money(current.totalExtra));setText('finChartNote',hasExtra?`Desde el mes ${extraMonth}, el saldo con abono disminuye más rápido. Ahorro estimado: ${money(savedInterest)} y ${monthsText(savedMonths)}.`:'Las dos proyecciones coinciden mientras no exista un abono extraordinario.');renderCharts();
  }

  function init(){if(initialized)return;initialized=true;fillMonths();bindMoney('finCompra');bindMoney('finDeposito');bindMoney('finExtra');$('finMesExtra')?.addEventListener('change',calculate);calculate();}
  init();
  const observer=new MutationObserver(()=>{if(isVisible()){renderCharts();}});if(screen)observer.observe(screen,{attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',()=>{if(!isVisible())return;clearTimeout(window.__finResize791);window.__finResize791=setTimeout(renderCharts,180);},{passive:true});
})();
