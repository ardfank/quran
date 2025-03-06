import index from "./index.html";
import ss from "./ss.html";
import sm from "./sitemap.txt";
function rad(){
	return Math.floor(Math.random() * (114 - 1 + 1) ) + 1;
}
export default {
  async fetch(request, env, ctx) {
	const QURL=`${env.QURL}`;
	const f = require('./f.js');
	const url = new URL(request.url);
	if (url.pathname === "/sitemap.xml") {
		return new Response(sm, {
			headers: {
				"content-type": "application/atom+xml; charset=UTF-8",
			},
		});
	}
	if (url.pathname === "/ff.webmanifest") {
		let man='{\n\
			"name": "Quran - Network Reverse",\n\
			"short_name": "Quran - Network Reverse",\n\
			"description": "Mari Mengerti Al-Quran, Terjemahan dan Tafsirnya",\n\
			"icons": [\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-72x72.png",\n\
				"sizes": "72x72",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-96x96.png",\n\
				"sizes": "96x96",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-128x128.png",\n\
				"sizes": "128x128",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-144x144.png",\n\
				"sizes": "144x144",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-152x152.png",\n\
				"sizes": "152x152",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-192x192.png",\n\
				"sizes": "192x192",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-384x384.png",\n\
				"sizes": "384x384",\n\
				"type": "image/png"\n\
				},\n\
				{\n\
				"src": "https://cdn.networkreverse.com/icons/icon-512x512.png",\n\
				"sizes": "512x512",\n\
				"type": "image/png"\n\
				}\n\
			],\n\
			"start_url": "/",\n\
			"display": "standalone",\n\
			"theme_color": "#ff8000",\n\
			"background_color": "#ff8000"\n\
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
Allow: /\n\
\n\
Sitemap: https://quran.networkreverse.com/sitemap.xml';
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
		await f.tafsir(QURL,s,a,t,(g)=>{
			taf=g;
		})
		return new Response(JSON.stringify(taf), {
			headers: {
				"content-type": "text/plain; charset=UTF-8",
			},
		});
	}
	function getCook(cookiename){
		var cookiestring=RegExp(cookiename+"=[^;]+").exec(request.headers.get('cookie'));
		return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
	}
	let surah=url.searchParams.get('surah');
	let ayah=url.searchParams.get('ayah');
	let q=url.searchParams.get('q');
	let mkey="";
	let mdes="";
	let mimg="https://cdn.networkreverse.com/OIG4.jpg";
	let ttl="";
	let h21="";
	let header="";
	let bsm="";
	let ay="";
	let nav=[];
	let qori=getCook('qori');
	let posisi=getCook('posisi');
	posisi=(posisi!=="")?`<input type='button' id='posisi' onclick='location.href="${posisi}"' value=' 📜 '/>`:'';
	qori=(qori=='ahmedajamy' || qori=='alafasy' || qori=='husarymujawwad' || qori=='minshawi' || qori=='muhammadayyoub' || qori=='muhammadjibreel')?qori:'alafasy';
	// let qori=url.searchParams.get('qori');
	// if (qori) {
	// 	console.log(url);
	// 	let cQ=`qori=${qori}; posisi=${qori}; Max-Age=${60 * 60 * 24 * 60}; secure; SameSite=Strict`;
	// 	return new Response(null, {
	// 		status: 302,
	// 		headers: {
	// 			'Location': url.referer || '/',
	// 			'Set-Cookie': cQ
	// 		}
	// 	});
	// }
	if(surah!=null && surah<1||surah>114){return Response.redirect(url.origin, 301);}
	if (url.pathname === "/search") {
		let taf="";
		await f.search(QURL,q,(g)=>{
			taf=g;
		})
		nav.push(`<input style='float:left' type='button' onclick='location.href="/?surah=114"' value='⏪ Al-Nas'/>`,`<input style='float:right' type='button' onclick='location.href="/?surah=1"' value='Al-Fatihah ⏩'/>`);
		ttl=`${taf.length} hasil pencarian: '${q}' pada surah, ayat dan tafsir`;
		let ft=(!taf[0])?'tidak ditemukan':taf[0].snippet.substr(3,111);
		mdes=ttl+' - Network Reverse '+ft;
		mkey=mdes.replace(/ /g,",");
		h21="<h1><a href='"+url.href+"' rel='bookmark' title='"+ttl+"'>"+ttl+"</a></h1>";
		taf.forEach((b)=>{
			let aya=(b.ayahs==='')?'pada deskripsi surah':'Ayat ke '+b.ayahs;
			ay+="<div class='responsive' onclick='location.href=\"/?surah="+b.surah+"&ayat="+b.ayahs+"&tafsir="+b.tafs+"#"+b.ayahs+"\"'><h3 class='arab'>Surah "+b.surah+": "+b.name+" "+aya+" "+b.tafsir+"</h3><h4 class='trj'>"+b.snippet+"</h4></div>";
		})
	}else if(surah!=null && surah < 115 && Number.isInteger(parseInt(surah)) && ayah===null && q===null){
		surah=((surah-1)<0)?1:surah;
		await f.surah(QURL,(surah-1),(g)=>{
			let prev=(g[0].prev==='')?`<input style='float:left' type='button' onclick='location.href="/?surah=114"' value='⏪ Al-Nas'/>`:`<input style='float:left' type='button' onclick='location.href="/?surah=${(parseInt(surah)-1)}"' value="⏪ ${g[0].prev}"/>`;
			let next=(g[0].next==='')?`<input style='float:right' type='button' onclick='location.href="/?surah=1"' value='Al-Fatihah ⏩'/>`:`<input style='float:right' type='button' onclick='location.href="/?surah=${(parseInt(surah)+1)}"' value="${g[0].next} ⏩"/>`;
			nav.push(prev,next);
			mkey=g[0].description.replace(/ /g,",");
			mdes=g[0].description.substring(0,150);
			ttl="Surah "+g[0].number+" "+g[0].name+" ("+g[0].translation+") - Network Reverse";
			h21="<h1><a href='"+url.href+"' rel='bookmark' title='"+g[0].name+" ("+g[0].translation+"'>"+g[0].name+" ("+g[0].translation+")</a></h1><h2>"+g[0].description+"</h2>";
			header="<audio preload='none' controls src='https://ia601601.us.archive.org/4/items/quraninindonesia/"+g[0].audio+"'></audio>";
			if(surah!=1){
				bsm="<div class='responsive' id='1' style='text-align: center;'><h3 class='arab'>"+g[0].bismillah.arab+"</h3><h4 class='trj'>"+g[0].bismillah.translation+"</h4><audio preload='none' controls src='"+g[0].bismillah.audio[qori]+"'></audio></div>";
			}
			g[0].ayahs.forEach((b)=>{
				ay+="<div class='responsive' id='"+b.number.inSurah+"' onclick='posisi(\"/?surah="+surah+"#"+b.number.inSurah+"\")'><h3 class='arab'>"+b.arab+"</h3><h4 class='trj'>"+b.number.inSurah+". "+b.translation+"</h4><audio preload='none' controls src='"+b.audio[qori]+"'></audio><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"kemenag\")' value='Tafsir Al-Tahlili (Kemenag)'/><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"quraish\")' value='Tafsir Al-Muntakhab (M. Quraish Shihab)'/><input type='button' onclick='tafs("+surah+","+b.number.inSurah+",\"jalalayn\")' value='Tafsir Al-Jalalain'/><div class='tafsir' id='t"+b.number.inSurah+"'></div></div>";
			});
		});
	}else{
		await f.main(QURL,(g)=>{
			console.log(JSON.stringify(g));
			nav.push(`<input style='float:left' type='button' onclick='location.href="/?surah=114"' value='⏪ Al-Nas'/>`,`<input style='float:right' type='button' onclick='location.href="/?surah=1"' value='Al-Fatihah ⏩'/>`);
			mdes="Al-Quran Terjemahan dan Tafsir dari Tafsir Kemenag Tafsir Al-Tahlili, Tafsir Al-Muntakhab (M. Quraish Shihab), Tafsir Al-Jalalain. Audio dengan terjemahan bahasa Indonesia - Network Reverse";
			mkey=mdes.replace(/ /g,",");
			ttl="Al-Quran - Audio, Terjemahan dan Tafsir - Network Reverse";
			h21="<h1><a href='"+url.href+"' rel='bookmark' title='"+ttl+"'>Al-Quran - Audio, Terjemahan dan Tafsir</a></h1><h2>"+mdes+"</h2>";
			bsm="<div class='responsive' id='1' style='text-align: center;'><h3 class='arab'>"+g.bismillah.arab+"</h3><h4 class='trj'>"+g.bismillah.translation+"</h4><audio preload='none' controls src='"+g.bismillah.audio[qori]+"'></audio></div>";
			g.forEach((b)=>{
				ay+="<div class='responsive' id='"+b.number+"' onclick='location.href=\"/?surah="+b.number+"\"'><h3 class='arab'>"+b.name+" ("+b.translation+")</h3><h4 class='trj'>"+b.desc+"</h4><audio preload='none' controls src='https://ia601601.us.archive.org/4/items/quraninindonesia/"+b.audio+"'></audio></div>";
			})
		});
	}

	let bod="<body>\
		<div id='cont'>\
		<header id='header'><input title='Random surah' type='button' onclick='location.href=\"/?surah="+rad()+"\"' value=' 🔀 '/><input title='Beranda' type='button' onclick='location.href=\"/\"' value=' 🏡 '/><input title='Ganti Qori' id='menu' type='button' onclick='toggleMenu()' value=' 🗣️ '/>"+posisi+"<input id='q' type='text' placeholder='Pencarian...' onchange='location.href=\"/search?q=\"+this.value'/>\
		<ul id='menu-box' style='display:none'>\
		<li onclick='qori(\"ahmedajamy\")'>Ahmad Al-Ajmi</li>\
		<li onclick='qori(\"alafasy\")'>Mishari Rashid al-`Afasy</li>\
		<li onclick='qori(\"husarymujawwad\")'>Mahmoud Khalil Al-Hussary</li>\
		<li onclick='qori(\"minshawi\")'>Mohamed Siddiq al-Minshawi</li>\
		<li onclick='qori(\"muhammadayyoub\")'>Muhammad Ayyub</li>\
		<li onclick='qori(\"muhammadjibreel\")'>Muhammad Jibril</li>\
		</ul>"+nav[0]+nav[1]+header+"</header>\
		<div id='light'>\
		<div id='gal'>"+h21+bsm+ay+"</div>\
		</div>\
		</div>\
		<footer>Source: quran.json Thanks to <a href='https://github.com/renomureza/quran-api-id'>renomureza</a><br/>Source on <a href='https://github.com/ardfank/quran'>Github</a> develop using <a href='https://workers.cloudflare.com/'>Cloudflare Workers</a><br/>Masukan, saran, kritik, koreksi, dll silahkan kontak <a href='https://twitter.com/EntaahLaah' target='_blank'>@EntaahLaah</a></footer>";
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
