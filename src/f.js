async function main(qurl,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let sr=[];
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
function ayah(a,b){
	console.log(a);
}
function q(a,b){
	console.log(a);
}
module.exports = {
  main,surah,ayah,q
};
