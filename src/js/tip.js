let $tip = null, $main = null;

function showTip(text) {
	if ($tip === null) {
		$tip = document.getElementsByClassName('tip')[0];
		$main = document.getElementsByTagName('main')[0];
	}
	let $t = $tip.cloneNode(true);
	$t.append(text);
	$main.appendChild($t);
	$t.classList.add('show');
	setTimeout(() => {
		$t.remove()
	}, 5000)
}

export default showTip;
