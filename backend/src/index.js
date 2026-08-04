/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const allowedOrigin = "https://pannawatg.github.io";

export default {
	async fetch(request) {
		const headers = {
			"Access-Control-Allow-Origin": allowedOrigin,
			"Content-Type": "application/json",
		};
		if(request.method != "POST"){
			return new Response(JSON.stringify({error: "POST only"}),{status: 405, headers});
		}
		try{
			const formData = await request.formData();
			const file = formData.get("file");
			if(!file){
				return new Response(JSON.stringify({error: "No file recieved"}),{status: 400, headers});
			}
			return new Response(JSON.stringify({
				success: true,
				name: file.name,
				size: file.size,
				type: file.type,
			}),{status: 200, headers})
		}catch(error){
			return new Response(JSON.stringify({error: error.message}),{status: 500, headers});
		}
	},
};
