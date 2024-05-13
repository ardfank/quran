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
	let next=(data[(a+1)]!==undefined)?data[(a+1)].name:'';
	let prev=(data[(a-1)]!==undefined)?data[(a-1)].name:'';
	data[a].next=next;
	data[a].prev=prev;
	sr.push(data[a]);
	b(sr);
}
async function tafsir(qurl,s,a,t,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let tf=(t==='kemenag')?data[s].ayahs[a].tafsir.kemenag.long:((t==='quraish')?data[s].ayahs[a].tafsir.quraish:data[s].ayahs[a].tafsir.jalalayn);
	b(tf);
}
function mA(a,c,b){
	let eq = new RegExp("\\b" + a + "\\b", 'gi');
	let rg="";
	let am=eq.test(c);
	if(am===true){
		let ge=c.toLowerCase().indexOf(a.toLowerCase());
		ge=((ge-70)<0)?0:ge-70;
		let sg=c.substr((ge),211);
		sg=sg.split(' ');
		for(var i=1;i<(sg.length-1);i++){
			rg+=sg[i]+' ';
		}
		rg=`...${rg}...`;
	}
	b(am,rg);
}
async function search(qurl,a,b){
	let data= await fetch(qurl).then(g=>{return g.json()});
	let be=[];
	data.forEach((e)=>{
		mA(a,e.description,(t,rg)=>{
			if(t===true){
				be.push({surah:e.number,name:e.name,ayahs:'',tafsir:'',snippet:rg});
			}
		});
		e.ayahs.forEach((y)=>{
			mA(a,y.translation,(t,rg)=>{
				if(t===true){
					be.push({surah:e.number,name:e.name,ayahs:y.number.inSurah,tafsir:'',snippet:rg});
				}
			});
			mA(a,y.tafsir.kemenag.long,(t,rg)=>{
				if(t===true){
					be.push({surah:e.number,name:e.name,ayahs:y.number.inSurah,tafsir:'pada Tafsir Al-Tahlili',snippet:rg});
				}
			});
			mA(a,y.tafsir.quraish,(t,rg)=>{
				if(t===true){
					be.push({surah:e.number,name:e.name,ayahs:y.number.inSurah,tafsir:'pada Tafsir Al-Muntakhab',snippet:rg});
				}
			});
			mA(a,y.tafsir.jalalayn,(t,rg)=>{
				if(t===true){
					be.push({surah:e.number,name:e.name,ayahs:y.number.inSurah,tafsir:'pada Tafsir Al-Jalalain',snippet:rg});
				}
			});
		});
	});
	b(be);
}
module.exports = {
  main,surah,tafsir,search
};
