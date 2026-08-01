(()=>{
  'use strict';
  const RATES={2:51.67,3:34.83,4:26.41,5:21.36,6:17.99,7:15.59,8:13.79,9:12.39,10:11.27,11:10.36,12:9.59,13:8.95,14:8.40,15:7.92,16:7.50,17:7.14,18:6.81,19:6.52,20:6.25,21:6.02,22:5.80,23:5.61,24:5.43,25:5.21,26:5.06,27:5.00};
  const MONTHLY_RATE=0.0215;
  const $=id=>document.getElementById(id);
  const nf=new Intl.NumberFormat('es-CO',{maximumFractionDigits:0});
  const cop=new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
  const parseMoney=v=>Number(String(v??'').replace(/[^0-9]/g,''))||0;
  const money=v=>cop.format(Math.round(Number(v)||0)).replace('COP','').trim();
  const percent=v=>`${Number(v||0).toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})}%`;
  const monthsLabel=n=>`${n} ${n===1?'mes':'meses'}`;
  const setText=(id,value)=>{const el=$(id);if(el)el.textContent=value;};
  let timer=null;

  function schedule(principal, months, payment, extraMonth=0, extraAmount=0){
    if(principal<=0||payment<=0||months<1)return {rows:[],totalInterest:0,totalPaid:0,duration:0,lastPayment:0,totalNormal:0,totalExtra:0};
    let balance=principal,totalInterest=0,totalNormal=0,totalExtra=0;
    const rows=[];
    const hasExtra=extraMonth>0&&extraAmount>0;
    const limit=hasExtra?120:months;
    for(let m=1;m<=limit&&balance>0.5;m++){
      const initial=balance;
      const interest=initial*MONTHLY_RATE;
      let normal=Math.min(payment,initial+interest);
      let capital=Math.max(0,normal-interest);
      balance=Math.max(0,initial-capital);
      let extra=0;
      if(hasExtra&&m===extraMonth&&balance>0){extra=Math.min(extraAmount,balance);balance-=extra;}
      if(!hasExtra&&m===months&&balance>0){
        normal+=balance;
        capital+=balance;
        balance=0;
      }
      totalInterest+=interest;
      totalNormal+=normal;
      totalExtra+=extra;
      rows.push({month:m,initial,normal,interest,capital,extra,balance});
    }
    return {
      rows,
      totalInterest,
      totalPaid:totalNormal+totalExtra,
      duration:rows.length,
      lastPayment:rows.length?rows[rows.length-1].normal+rows[rows.length-1].extra:0,
      totalNormal,
      totalExtra
    };
  }

  function fillMonths(){
    const select=$('finMeses');
    if(!select)return;
    if(!select.options.length){
      const frag=document.createDocumentFragment();
      for(let i=2;i<=27;i++){
        const option=document.createElement('option');
        option.value=String(i);option.textContent=`${i} meses`;option.selected=i===27;frag.appendChild(option);
      }
      select.appendChild(frag);
    }
    select.addEventListener('change',()=>{fillExtraMonths();calculate();});
    fillExtraMonths();
  }

  function fillExtraMonths(){
    const select=$('finMesExtra');
    if(!select)return;
    const months=Number($('finMeses')?.value||27);
    const old=Math.min(Number(select.value)||0,months);
    const frag=document.createDocumentFragment();
    const none=document.createElement('option');none.value='0';none.textContent='Sin abono adicional';frag.appendChild(none);
    for(let i=1;i<=months;i++){
      const option=document.createElement('option');option.value=String(i);option.textContent=`Mes ${i}`;option.selected=i===old;frag.appendChild(option);
    }
    select.replaceChildren(frag);
    select.value=String(old);
  }

  function bindMoney(id){
    const input=$(id);if(!input)return;
    input.addEventListener('input',()=>{
      const value=parseMoney(input.value);
      input.value=value?nf.format(value):'';
      clearTimeout(timer);timer=setTimeout(calculate,80);
    });
  }

  function renderRows(rows,extraMonth){
    const body=$('finTablaBody');if(!body)return;
    if(!rows.length){body.innerHTML='<tr><td colspan="7" class="finance-empty-row">Completa los datos para generar la tabla.</td></tr>';return;}
    body.innerHTML=rows.map(r=>`<tr class="${r.month===extraMonth&&r.extra?'extra-row':''}"><td>${r.month}${r.month===extraMonth&&r.extra?'<small>ABONO</small>':''}</td><td>${money(r.initial)}</td><td>${money(r.normal)}</td><td>${money(r.interest)}</td><td>${money(r.capital)}</td><td>${r.extra?`<strong>+ ${money(r.extra)}</strong>`:'—'}</td><td>${money(r.balance)}</td></tr>`).join('');
  }

  function calculate(){
    const purchase=parseMoney($('finCompra')?.value);
    const deposit=parseMoney($('finDeposito')?.value);
    const months=Number($('finMeses')?.value||27);
    const principal=Math.max(0,purchase-deposit);
    const payment=principal*((RATES[months]||0)/100);
    const extraMonth=Number($('finMesExtra')?.value||0);
    const extraAmount=parseMoney($('finExtra')?.value);
    const hasExtra=principal>0&&extraMonth>0&&extraAmount>0;
    const base=schedule(principal,months,payment);
    const current=hasExtra?schedule(principal,months,payment,extraMonth,extraAmount):base;
    const savedMonths=Math.max(0,base.duration-current.duration);
    const savedInterest=Math.max(0,base.totalInterest-current.totalInterest);
    const totalCurrent=principal+current.totalInterest;
    const interestPct=principal?current.totalInterest/principal*100:0;
    const capitalShare=totalCurrent?principal/totalCurrent*100:0;
    const interestShare=totalCurrent?100-capitalShare:0;
    const fixedRate=principal&&current.duration?current.totalInterest/principal/current.duration*100:0;

    setText('finSaldo',money(principal));
    setText('finCuota',money(payment));
    setText('finInteresBase',money(base.totalInterest));
    setText('finInteresConExtra',money(current.totalInterest));
    setText('finInteresActual',money(current.totalInterest));
    setText('finInteresPctTotal',`${percent(interestPct)} del capital`);
    setText('finInteresActualLabel',hasExtra?'Intereses con abono':'Intereses totales');
    setText('finTotalPagado',money(totalCurrent));
    setText('finUltima',money(current.lastPayment));
    setText('finMesesAhorro',monthsLabel(savedMonths));
    setText('finAhorroInteres',money(savedInterest));
    setText('finNuevaDuracion',monthsLabel(current.duration));
    setText('finTablaBadge',monthsLabel(current.duration));
    const impact=$('finImpacto');if(impact)impact.classList.toggle('active',hasExtra);
    if($('finCapitalBar'))$('finCapitalBar').style.width=`${Math.max(0,Math.min(100,capitalShare))}%`;
    if($('finInterestBar'))$('finInterestBar').style.width=`${Math.max(0,Math.min(100,interestShare))}%`;
    setText('finCapitalPct',`${capitalShare.toFixed(1)}%`);
    setText('finInterestPct',`${interestShare.toFixed(1)}%`);

    const ref27=schedule(principal,27,principal*(RATES[27]/100));
    const termSave=Math.max(0,ref27.totalInterest-base.totalInterest);
    if(principal>0){
      if(months<27){
        setText('finTipPlazo',`Ahorras ${money(termSave)}`);
        setText('finTipPlazoTexto',`Al elegir ${months} meses en lugar de 27, terminarías ${27-months} meses antes y pagarías aproximadamente ${money(termSave)} menos en intereses.`);
      }else{
        setText('finTipPlazo','Plazo máximo seleccionado');
        setText('finTipPlazoTexto',`A 27 meses pagarías aproximadamente ${money(base.totalInterest)} en intereses. Elegir un plazo menor reduce el costo total.`);
      }
      if(hasExtra){
        setText('finTipExtra',`Ahorras ${money(savedInterest)}`);
        setText('finTipExtraTexto',`El abono de ${money(extraAmount)} en el mes ${extraMonth} reduce el plazo en ${monthsLabel(savedMonths)} y los intereses de ${money(base.totalInterest)} a ${money(current.totalInterest)}.`);
      }else{
        setText('finTipExtra','Sin abono extraordinario');
        setText('finTipExtraTexto','Agrega un abono para calcular automáticamente cuánto tiempo e intereses podrías ahorrar.');
      }
    }else{
      setText('finTipPlazo','—');setText('finTipPlazoTexto','Completa los datos para comparar el plazo.');
      setText('finTipExtra','—');setText('finTipExtraTexto','Agrega un abono extraordinario para ver su impacto.');
    }

    setText('finTasaFija',`${percent(fixedRate)} fija`);
    ['finCmpCapitalMv','finCmpCapitalFijo'].forEach(id=>setText(id,money(principal)));
    ['finCmpPlazoMv','finCmpPlazoFijo'].forEach(id=>setText(id,monthsLabel(current.duration)));
    ['finCmpCuotaMv','finCmpCuotaFijo'].forEach(id=>setText(id,money(payment)));
    ['finCmpInteresMv','finCmpInteresFijo'].forEach(id=>setText(id,money(current.totalInterest)));
    ['finTotalMv','finTotalFijo'].forEach(id=>setText(id,money(totalCurrent)));

    renderRows(current.rows,extraMonth);
    setText('finTablaCuotas',money(current.totalNormal));
    setText('finTablaIntereses',money(current.totalInterest));
    setText('finTablaCapital',money(Math.max(0,principal-current.totalExtra)));
    setText('finTablaExtras',money(current.totalExtra));
  }

  function init(){
    if(!$('simuladorfin')||!$('finCompra'))return;
    fillMonths();bindMoney('finCompra');bindMoney('finDeposito');bindMoney('finExtra');
    $('finMesExtra')?.addEventListener('change',calculate);
    calculate();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
