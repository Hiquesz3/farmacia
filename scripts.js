$(document).ready(function() {
    let cart = [];

    const products = [
        { id: 1, name: "Medicamento A", price: 10.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento A." },
        { id: 2, name: "Medicamento B", price: 20.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento B." },
        { id: 3, name: "Medicamento C", price: 30.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento C." },
    ];

    // Exibir produtos na página de produtos
    function displayProducts() {
        products.forEach(product => {
            $('#product-list').append(`
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Adicionar produto ao carrinho
    $(document).on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        const product = products.find(p => p.id === productId);
        cart.push(product);
        updateCartCount();
        alert(`${product.name} adicionado ao carrinho!`);
    });

    // Atualizar contagem do carrinho
    function updateCartCount() {
        $('#cart-count').text(cart.length).toggle(cart.length > 0);
    }

    // Carregar itens do carrinho
    function loadCartItems() {
        $('#cart-items').empty();
        let totalPrice = 0;

        cart.forEach(item => {
            $('#cart-items').append(`
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>R$ ${item.price.toFixed(2)}</span>
                </div>
            `);
            totalPrice += item.price;
        });

        $('#total-price').text(`R$ ${totalPrice.toFixed(2)}`);
    }

    // Finalizar compra
    $('#checkout-form').submit(function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        alert('Compra finalizada com sucesso! Obrigado pelo seu pedido. Você receberá mais informações em breve.');
        cart = [];
        updateCartCount();
        $('#cart-items').empty();
        $('#total-price').text(`R$ 0,00`);
        $(this).trigger("reset");
    });

    // Adicionar produtos pelo admin
    $('#add-product-form').submit(function(e) {
        e.preventDefault();
        const newProduct = {
            id: products.length + 1,
            name: $('#product-name').val(),
            price: parseFloat($('#product-price').val()),
            image: $('#product-image').val(),
            description: $('#product-description').val(),
        };
        products.push(newProduct);
        alert('Produto adicionado com sucesso!');
        $(this).trigger("reset");
        displayProducts(); // Atualiza a lista de produtos
    });

    // Inicialização
    displayProducts();
    loadCartItems();
});
