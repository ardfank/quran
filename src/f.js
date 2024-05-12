async function main(qurl,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let sr=[];
	sr.bismillah=data[0].bismillah;
	data.forEach(s=>{
		sr.push({number:s.number,name:s.name,translation:s.translation,desc:s.description,audio:s.audio});
	})
	b(sr);
}
async function surah(qurl,a,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let sr=[];
	sr.push(data[a]);
	b(sr);
}
async function tafsir(qurl,s,a,t,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let tf=(t==='kemenag')?data[s].ayahs[a].tafsir.kemenag.long:((t==='quraish')?data[s].ayahs[a].tafsir.quraish:data[s].ayahs[a].tafsir.jalalayn);
	b(tf);
}
function q(a,b){
	console.log(a);
}
module.exports = {
  main,surah,tafsir,q
};
