function onpageload() {
    // 여기에 로그인 안되었을때 코드 작성
}

function createItemElement(imageuri, name, specs, point) {
    const color = point >= 0 ? 'green' : 'red';
    const div = document.createElement('div');
    div.className = 'row justify-content-center align-items-center';
    div.innerHTML = `
        <div class="col-md-3">
            <div class="product-image"><img class="img-fluid d-block mx-auto image" src="${imageuri}" /></div>
        </div>
        <div class="col-md-5 product-info"><a class="product-name" href="#">${name}</a>
            <div class="product-specs">
                ${specs}
            </div>
        </div>
        <div class="col-6 col-md-2 price"><span style="color: ${color}">${point}</span></div>
    `;

    document.getElementById('items').appendChild(div);
}

window.addEventListener('load', onpageload);