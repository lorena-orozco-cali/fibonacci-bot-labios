var chat=document.getElementById("chat"),inp=document.getElementById("userInput"),btn=document.getElementById("sendBtn"),step="inicio";
var M={
  s1:"Bienvenid@ al consultorio del <em>doctor Esteban Pinto</em>, ser\u00e1 un placer atenderte \uD83C\uDF3F",
  s2:"Ya que est\u00e1s interesad@ en el proceso de <em>perfilamiento labial</em>, tengo que hacerte una pregunta para poder orientarte de la mejor manera posible. \uD83D\uDE0A",
  s3:"\u00BFTe has realizado anteriormente alg\u00FAn tipo de procedimiento con <em>\u00e1cido hialur\u00f3nico</em> u otro producto en labios?",
  s4:"Perfecto, gracias por contarnos \uD83D\uDC4C \u00BFCu\u00e1ndo fue la \u00FAltima vez que lo aplicaste?",
  s5:"Anotado \u2728 Esta informaci\u00f3n le permitir\u00e1 al doctor generar un diagn\u00f3stico preciso para ti. \uD83D\uDE4F",
  s6:"Perfecto, sin procedimientos previos podemos orientarte de manera muy directa. \uD83C\uDF3F",
  s7:"Para continuar, necesitamos una fotograf\u00eda de tu rostro (<em>perfil y de frente</em>) para definir el mejor tratamiento, basado en tus caracter\u00edsticas f\u00edsicas. \uD83D\uDCAB",
  s8:"\u00A1Muchas Gracias! Recibimos tus fotos correctamente. \uD83D\uDCF8\uD83D\uDE4F",
  s9:"Por favor, ind\u00edcanos tu nombre y en breve nuestro equipo te contactar\u00e1 para continuar tu valoraci\u00f3n.",
  s10:"Hemos recibido toda tu informaci\u00f3n y tus fotos. Nuestro equipo especializado se pondr\u00e1 en contacto contigo personalmente para orientarte y agendar tu cita, en el menor tiempo posible \uD83D\uDE0A"
};

function esPrecio(m){
  var t=m.toLowerCase();
  return ["precio","cuesta","cuanto","valor","cuanto vale","cuanto cobran","cuanto queda"].some(function(p){return t.indexOf(p)>=0;});
}

function esFuera(m){
  var t=m.toLowerCase();
  return ["hola","buenas","hey","gracias","quien","donde"].some(function(p){return t.indexOf(p)>=0;});
}

function fallback(m){
  if(esPrecio(m)) return "El perfilamiento labial tiene un valor que oscila entre $1.000.000 y $1.200.000 dependiendo del tratamiento personalizado que el doctor defina para ti \uD83C\uDF3F Nuestro asesor te dar\u00e1 todos los detalles en la valoraci\u00f3n.";
  if(esFuera(m)){
    var t=m.toLowerCase();
    if(t.indexOf("hola")>=0||t.indexOf("buenas")>=0||t.indexOf("hey")>=0) return "\u00A1Hola! Bienvenid@, con gusto te atiendo \uD83D\uDE0A";
    if(t.indexOf("gracias")>=0) return "\u00A1Con mucho gusto! Estamos aqu\u00ed para ayudarte \uD83C\uDF3F";
    if(t.indexOf("donde")>=0) return "Estamos en Cali, Colombia. Nuestro equipo te dar\u00e1 la direcci\u00f3n exacta al contactarte \uD83D\uDE0A";
  }
  return "Entendido \uD83D\uDE0A Continuemos con tu proceso de valoraci\u00f3n.";
}

function sc(){chat.scrollTop=chat.scrollHeight;}
function en(on){inp.disabled=!on;btn.disabled=!on;if(on)inp.focus();}
function bm(h,d,e){
  return new Promise(function(r){
    var t=document.createElement("div");t.className="msg bot";
    t.innerHTML="<div class='avatar-bot'>F</div><div class='bubble bot'><div class='typing-dots'><span></span><span></span><span></span></div></div>";
    chat.appendChild(t);sc();
    setTimeout(function(){
      t.remove();var d2=document.createElement("div");d2.className="msg bot";
      d2.innerHTML="<div class='avatar-bot'>F</div><div class='"+(e?"bubble error":"bubble bot")+"'>"+h+"</div>";
      chat.appendChild(d2);sc();r();
    },d||700);
  });
}
function um(t){var d=document.createElement("div");d.className="msg user";d.innerHTML="<div class='bubble user'>"+t+"</div>";chat.appendChild(d);sc();}
function so(arr,cb){
  var ex=document.getElementById("opts");if(ex)ex.remove();
  var r=document.createElement("div");r.className="options-row";r.id="opts";
  arr.forEach(function(o){
    var b=document.createElement("button");b.className="opt-btn";b.textContent=o;
    b.onclick=function(){r.querySelectorAll("button").forEach(function(x){x.disabled=true;x.style.opacity="0.5";});um(o);r.remove();cb(o);};
    r.appendChild(b);
  });
  chat.appendChild(r);sc();
}
function sr(){
  if(document.getElementById("ri"))return;
  var w=document.createElement("div");w.className="ref-img-wrap";w.id="ri";
  w.innerHTML="<img src='foto_referencia_labios.jpg' onerror=\"this.style.display='none'\"/><div class='ref-label'>Referencia: as\u00ed deben ser tus fotos \uD83C\uDF37</div>";
  chat.appendChild(w);sc();
}
function su(){
  if(document.getElementById("uz"))return;
  var z=document.createElement("div");z.className="upload-zone";z.id="uz";
  z.innerHTML="<input type='file' id='fi' accept='image/*' multiple/><div class='upload-icon'>\uD83D\uDCF7</div><div class='upload-title'>Adjunta tus fotos aqu\u00ed</div><div class='upload-sub'>Selecciona foto de frente y de perfil</div>";
  chat.appendChild(z);sc();
  document.getElementById("fi").onchange=function(){
    var files=Array.from(this.files);
    var el=document.getElementById("uz");if(el)el.remove();
    var p=document.createElement("div");p.className="photo-preview";
    files.forEach(function(f){var i=document.createElement("img");i.src=URL.createObjectURL(f);p.appendChild(i);});
    chat.appendChild(p);sc();
    if(files.length<2){
      bm("\u00A1Ay, qu\u00e9 pena! \uD83E\uDD7A Necesitamos <em>dos fotos</em>: frente y perfil. \u00BFPodr\u00edas intentarlo de nuevo? \uD83C\uDF3F",900,true).then(function(){su();});
      return;
    }
    step="pedir_nombre";
    bm(M.s8,700).then(function(){return bm(M.s9,900);}).then(function(){en(true);});
  };
}
function sa(){
  if(document.getElementById("ac"))return;
  var c=document.createElement("div");c.className="asesor-card";c.id="ac";
  c.innerHTML="<div class='asesor-title'>\u2746 Un asesor revisar\u00e1 tu caso</div><div class='asesor-sub'>"+M.s10+"</div><button class='asesor-btn' onclick=\"window.open('https://wa.me/573502480590','_blank')\">Confirmar por WhatsApp</button>";
  chat.appendChild(c);sc();en(false);
}

function cia(txt,ctx,cb){
  var done=false;
  var timer=setTimeout(function(){if(!done){done=true;cb(fallback(txt));}},5000);
  fetch("/.netlify/functions/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      system:"Eres asistente de Clinica Fibonacci, Dr. Esteban Pinto, Cali. Diseno labial. Respuestas cortas 1-2 oraciones. Contexto: "+ctx+". Si preguntan precio di exactamente: 'El perfilamiento labial tiene un valor que oscila entre $1.000.000 y $1.200.000 dependiendo del tratamiento personalizado que el doctor defina para ti \uD83C\uDF3F Nuestro asesor te dara todos los detalles en la valoracion.'",
      messages:[{role:"user",content:txt}]
    })
  }).then(function(r){return r.json();}).then(function(d){
    if(!done){done=true;clearTimeout(timer);cb(d&&d.content&&d.content[0]?d.content[0].text:fallback(txt));}
  }).catch(function(){if(!done){done=true;clearTimeout(timer);cb(fallback(txt));}});
}

function hd(m){
  en(false);

  // Si pregunta precio — responder siempre, en cualquier paso
  if(esPrecio(m)){
    bm(fallback(m),700).then(function(){
      // Retomar el flujo donde estaba
      if(step==="pregunta_antecedentes"){so(["S\u00ed","No"],hd);}
      else if(step==="pedir_fotos"){if(!document.getElementById("uz")){sr();setTimeout(su,400);}en(true);}
      else{en(true);}
    });
    return;
  }

  if(step==="pregunta_antecedentes"){
    var t=m.toLowerCase().trim();
    if(t==="s\u00ed"||t==="si"){step="pregunta_producto";bm(M.s4).then(function(){en(true);});return;}
    if(t==="no"){step="pedir_fotos";bm(M.s6,600).then(function(){return bm(M.s7,1000);}).then(function(){sr();setTimeout(su,500);en(true);});return;}
    cia(m,"Usuario debe responder si/no sobre procedimientos previos con acido hialuronico.",function(r){
      bm(r,600).then(function(){return bm(M.s3,700);}).then(function(){so(["S\u00ed","No"],hd);});
    });return;
  }
  if(step==="pregunta_producto"){
    if(esFuera(m)){cia(m,"Usuario debe indicar cuando fue su ultima aplicacion de acido hialuronico.",function(r){bm(r,600).then(function(){return bm(M.s4,700);}).then(function(){en(true);});});return;}
    step="pedir_fotos";bm(M.s5).then(function(){return bm(M.s7,1000);}).then(function(){sr();setTimeout(su,500);en(true);});return;
  }
  if(step==="pedir_fotos"){
    cia(m,"Usuario debe subir dos fotos de rostro frente y perfil.",function(r){
      bm(r,600).then(function(){if(!document.getElementById("uz")){sr();setTimeout(su,400);}en(true);});
    });return;
  }
  if(step==="pedir_nombre"){
    if(esFuera(m)){cia(m,"Usuario debe indicar su nombre.",function(r){bm(r,600).then(function(){return bm(M.s9,700);}).then(function(){en(true);});});return;}
    var n=m.split(" ")[0];step="fin";
    bm("<em>"+n+"</em>, muchas gracias por tu confianza. Pronto descubrir\u00e1s por qu\u00e9 somos la mejor opci\u00f3n cuando buscas armon\u00eda y salud \u2728",900).then(function(){sa();});return;
  }
  en(true);
}
btn.onclick=function(){var v=inp.value.trim();if(!v)return;inp.value="";um(v);hd(v);};
inp.onkeydown=function(e){if(e.key==="Enter")btn.onclick();};
window.onload=function(){
  en(false);
  bm(M.s1,600).then(function(){return bm(M.s2,1200);}).then(function(){return bm(M.s3,900);}).then(function(){step="pregunta_antecedentes";so(["S\u00ed","No"],hd);});
};
