async function main(b){
	const data = await import("./quran.json");
	let sr=[];
	data.forEach(s=>{
		sr.push({name:s.name,translation:s.translation,audio:s.audio});
	})
	b(sr);
}
async function surah(a,b){
	b(a);
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
