async function qu(qurl,b){
	await fetch(qurl).then(g=>{
		return g.json();
	}).then(h=>{
		b(h);
	})
}
async function main(qurl,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let sr=[];
	data.forEach(s=>{
		sr.push({name:s.name,translation:s.translation,desc:s.description,audio:s.audio});
	})
	b(sr);
}
async function surah(qurl,a,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let sr=[];
	sr.push(data[a]);
	// console.log(data);
	// data.forEach(s=>{
	// 	sr.push({name:s.name,translation:s.translation,audio:s.audio});
	// })
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
