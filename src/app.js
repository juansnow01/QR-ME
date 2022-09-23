/*
	Repo forked from: https://github.com/pudymody/firefox-qr

	- Removed the download actions, I do not want people using this add on in a way that could leave evidence to their history vai whatever URLs they download. (This is a privacy focused QR generator)

	- Apart from that it is virtually identical, I am not trying to reinvent the wheel.

	- Allowing for downloads of qr codes from sites visited allows for a potential history of visited URL's

	- This means that one could download a URL that could be considered forbidden (in certain regions) and if they were to have their machines seized that their history could be traced. 

*/


const $text = document.querySelector("input");
const $qr = document.querySelector(".qr");
const $exports = document.querySelectorAll(".actions a");
const SIZE = 800;

function drawQr(text){
	let fg = "#2a2a2e";
	let bg = "#f9f9fa";

	const qr = new QRCode({
		content: text || "Hi :)",
		padding: 0,
		color: fg,
		background: bg,
		join: true,
		xmlDeclaration: false,
		container: "g",
		width: SIZE,
		height: SIZE 
	}).svg();

	const qr_svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 800">${qr}</svg>`
	const qr_png = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800" height="800">${qr}</svg>`

	$qr.innerHTML = qr_svg;
	$exports[0].href = "data:image/svg+xml;base64," + btoa(qr_svg)

	const $img = new Image;
	$img.src = "data:image/svg+xml;base64," + btoa(qr_png)
	$img.addEventListener("load", function(e){
		const $canvas = document.createElement("canvas");
		$canvas.width = this.width;
		$canvas.height = this.height;

		const $ctx = $canvas.getContext("2d");
		$ctx.drawImage(this, 0, 0);
		$exports[1].href = $canvas.toDataURL(); 
	});

}

browser.tabs.query({currentWindow: true, active: true})
	.then(function onGot(tabInfo){
		const url = tabInfo[0].url;
		$text.value = url;
		drawQr(url);
	}, console.log);

$text.addEventListener("input", function(e){
	drawQr(this.value);
});

$text.addEventListener("focus", function(){
	this.select();
});
