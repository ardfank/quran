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
export default {
  async fetch(request, env, ctx) {
	const f = require('./f.js');
	const url = new URL(request.url);
	let surah=url.searchParams.get('surah');
	let ayah=url.searchParams.get('ayah');
	let q=url.searchParams.get('q');
	let hin="";
	if(surah!=null && ayah===null && q===null){
		f.surah(surah,function(g){
			hin=g;
		});
	}else{
		await f.main((g)=>{
			hin=JSON.stringify(g);
		});
	}
    return new Response(hin, {
		headers: {
			"content-type": "text/plain;charset=UTF-8",
		},
	});
  },
};
