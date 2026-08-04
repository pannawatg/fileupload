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
			const token = formData.get("token");
			if(!file){
				return new Response(JSON.stringify({error: "No file recieved"}),{status: 400, headers});
			}

			const buf = await file.arrayBuffer();
			const base64 = toBase64(buf);
			const filename = encodeURIComponent(file.name);

			const githubResponse = await fetch(
				`https://api.github.com/repos/pannawatg/fileupload/contents/uploads/${filename}`,
				{
					method: "PUT",
					headers: {
						"Accept": "application/vnd.github+json",
						"Authorization": `Bearer ${token}`,
						"X-GitHub-Api-Version": "2026-03-10",
						"User-Agent": "fileupload-worker",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						message: `Upload ${file.name}`,
						content: base64,
						branch: "main",
					}),
				}
			);

			const githubResult = await githubResponse.json();
			if(!githubResponse.ok){
				return new Response(JSON.stringify({error: githubResult.message || "GitHub upload failed",}),
					{status: githubResponse.status, headers});
			}

			return new Response(JSON.stringify({
				success: true,
				name: file.name,
				size: file.size,
				type: file.type,
			}),{status: 201, headers})
		}catch(error){
			return new Response(JSON.stringify({error: error.message}),{status: 500, headers});
		}
	},
};

function toBase64(buf){
	const bytes = new Uint8Array(buf);
	let binary = "";
	for(let i = 0;i<bytes.length;i++){
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
