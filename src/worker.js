/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import index from "./index.html";
import ss from "./ss.html";
export default {
  async fetch(request, env, ctx) {
	const QURL=`${env.QURL}`;
	const f = require('./f.js');
	const url = new URL(request.url);
	if (url.pathname === "/ff.webmanifest") {
		let man='{\n\
			"name": "Quran - Network Reverse",\n\
			"short_name": "Quran - Network Reverse",\n\
			"description": "Mari Mengerti Al-Quran, Terjemahan dan Tafsirnya",\n\
			"icons": [\n\
				{\n\
				"src": "https://cdn.networkreverse.com/tt/pocut16.png",\n\
				"sizes": "16x16",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/tt/pocut.png",\n\
				"sizes": "128x128",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/tt/pocut256.png",\n\
				"sizes": "256x256",\n\
				"type": "image/png"\n\
				}\n\
			],\n\
			"start_url": "/",\n\
			"display": "minimal-ui",\n\
			"theme_color": "#B12A34",\n\
			"background_color": "#B12A34"\n\
			}';
		return new Response(man, {
			headers: {
				"content-type": "application/manifest+json; charset=utf-8",
			},
		});
	}
    if (url.pathname === "/robots.txt") {
		let man='User-agent: Mediapartners-Google\n\
Disallow: \n\
\n\
User-agent: *\n\
Disallow: /search\n\
Allow: /';
		return new Response(man, {
			headers: {
				"content-type": "text/plain; charset=UTF-8",
			},
		});
	}
	if (url.pathname === "/tafsir") {
		let s=url.searchParams.get('s')-1;
		let a=url.searchParams.get('a')-1;
		let t=url.searchParams.get('t');
		let taf="";
		console.log(url.searchParams);
		await f.tafsir(QURL,s,a,t,(g)=>{
			taf=g;
		})
		return new Response(JSON.stringify(taf), {
			headers: {
				"content-type": "text/plain; charset=UTF-8",
			},
		});
	}
	let surah=url.searchParams.get('surah');
	let ayah=url.searchParams.get('ayah');
	let q=url.searchParams.get('q');
	let hin="";
	let mkey="";
	let mdes="";
	let mimg="https://cdn.networkreverse.com/OIG4.jpg";
	let ttl="";
	let h21="";
	let header="";
	let bsm="";
	let ay="";
	if(surah!=null && surah < 115 && Number.isInteger(parseInt(surah)) && ayah===null && q===null){
		surah=((surah-1)<0)?1:surah;
		await f.surah(QURL,(surah-1),(g)=>{
			mkey=g[0].description.replace(/ /g,",");
			mdes=g[0].description.substring(0,150);
			// ttl="Surah "+g[0].number+" "+g[0].name+" ("+g[0].translation+") - "+g[0].description.substring(0,30)+" - Network Reverse";
			ttl="Surah "+g[0].number+" "+g[0].name+" ("+g[0].translation+") - Network Reverse";
			h21="<h1>"+g[0].name+" ("+g[0].translation+")</h1><h2>"+g[0].description+"</h2>";
			header="<audio preload='none' controls src='"+g[0].audio+"'></audio>";
			if(surah!=1){
				bsm="<div class='responsive' id='1' style='text-align: center;'><span class='arab'>"+g[0].bismillah.arab+"</span><br/><span class='trj'>"+g[0].bismillah.translation+"</span><br/><audio preload='none' controls src='"+g[0].bismillah.audio.alafasy+"'></audio></div>";
			}
			g[0].ayahs.forEach((b)=>{
				ay+="<div class='responsive' id='"+b.number.inSurah+"'><h3 class='arab'>"+b.arab+"</h3><br/><h4 class='trj'>"+b.number.inSurah+". "+b.translation+"</h4><br/><audio preload='none' controls src='"+b.audio.alafasy+"'></audio><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"kemenag\")' value='Tafsir Al-Tahlili (Kemenag)'/><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"quraish\")' value='Tafsir Al-Muntakhab (M. Quraish Shihab)'/><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"jalalayn\")' value='Tafsir Al-Jalalain'/><div class='tafsir' id='t"+b.number.inSurah+"'></div></div>";
			});
			// hin=JSON.stringify(g[0]);
		});
	}else{
		await f.main(QURL,(g)=>{
			bsm="<div class='responsive' id='1' style='text-align: center;'><span class='arab'>"+g.bismillah.arab+"</span><br/><span class='trj'>"+g.bismillah.translation+"</span><br/><audio preload='none' controls src='"+g.bismillah.audio.alafasy+"'></audio></div>";
			g.forEach((b)=>{
				ay+="<div class='responsive' id='"+b.number+"' onclick='location.href=\"/?surah="+b.number+"\"'><h3 class='arab'>"+b.name+" ("+b.translation+")</h3><br/><h4 class='trj'>"+b.desc+"</h4><br/><audio preload='none' controls src='"+b.audio+"'></audio></div>";
			})
			// hin=JSON.stringify(g);
		});
	}
	let bod="<body>\
		<div id='cont'>\
		<header><a title='Beranda' alt='Beranda' href='/' style='margin-left:25px'>🏡 </a><input id='q' type='text' style='width:80%;margin:10px auto' placeholder='Pencarian...'></input>"+header+"</header>\
		<div id='light'>\
		<div id='gal'>"+h21+bsm+ay+"</div>\
		</div>\
		</div>\
		<div class='clearfix'></div>\
		<footer style='text-align:center;position:relative;top:10px'>Thanks to <a href='https://github.com/renomureza/quran-api-id'>renomureza</a> untuk API nya.</footer>";
	let nih="<!DOCTYPE HTML>\
		<html lang='id'>\
		<head>\
		<meta name='viewport' content='width=device-width, initial-scale=1'>\
		<meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\
		<meta content='utf-8' http-equiv='encoding'>\
		<meta content=\""+mkey+"\" name='keywords' />\
		<meta content=\""+ttl+"\" name='twitter:title' />\
		<meta content='website' property='og:type' />\
		<link href=\""+request.url+"\" rel='canonical' />\
		<meta content=\""+mdes+"\" name='description' />\
		<meta content=\""+request.url+"\" property='og:url' />\
		<meta content=\""+request.url+"\" name='twitter:url' />\
		<meta content=\""+ttl+"\" property='og:title' />\
		<meta content=\""+mdes+"\" property='og:description' />\
		<meta content='en_US' property='og:locale' />\
		<meta content='Entaah Laah' name='author' />\
		<meta content='439353449473051' property='fb:app_id' />\
		<meta content='1116888916' property='fb:admins' />\
		<meta content='871DA67EF97FB6DCD35CADB10CA82392' name='msvalidate.01' />\
		<meta content='632a7a0aa06f3805' name='yandex-verification' />\
		<meta content='45d6554c365a341f86ca' name='wot-verification' />\
		<meta content='summary_large_image' name='twitter:card' />\
		<meta content='@EntaahLaah' name='twitter:site' />\
		<meta content='@EntaahLaah' name='twitter:creator' />\
		<meta content=\""+mdes+"\" name='twitter:description' />\
		<meta property='og:image' content='"+mimg+"'>\
		<meta name='twitter:image' content='"+mimg+"'>\
		<link rel='manifest' href='ff.webmanifest' />\
		<meta name='theme-color' content='#B12A34'/>\
		<title>"+ttl+"</title>\
		<link rel='icon' type='image/x-icon' href='https://www.networkreverse.com/favicon.ico'>";
	let hix=nih+index+bod+ss+"</body></html>";
	return new Response(hix, {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	});
  },
};
