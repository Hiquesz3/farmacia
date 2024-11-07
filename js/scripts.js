$(document).ready(function() {
    // Carregar carrinho do LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Carregar produtos do LocalStorage ou usar lista pré-definida
    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: "Medicamento A", price: 10.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento A." },
        { id: 2, name: "Medicamento B", price: 20.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento B." },
        { id: 3, name: "Medicamento C", price: 30.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento C." }
    ];

    // Exibir produtos na página de produtos
    function displayProducts() {
        $('#product-list').empty();
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
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTotal();
        loadCartItems();

        alert(`${product.name} adicionado ao carrinho!`);
    });

    function updateCartCount() {
        $('#cart-count').text(cart.length).toggle(cart.length > 0);
    }

    function loadCartItems() {
        $('#cart-items').empty();

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            $('#cart-items').append(`
                <div class="cart-item">
                    <span>${item.name} - Quantidade: <input type="number" class="item-quantity" data-id="${item.id}" value="${item.quantity}" min="1" /></span>
                    <span>R$ ${itemTotal.toFixed(2)}</span>
                </div>
            `);
        });
    }

    function updateCartTotal() {
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });
        $('#total-price').text(`R$ ${totalPrice.toFixed(2)}`);
    }

    $(document).on('change', '.item-quantity', function() {
        const itemId = $(this).data('id');
        const newQuantity = parseInt($(this).val(), 10);
        const cartItem = cart.find(item => item.id === itemId);

        if (cartItem && newQuantity > 0) {
            cartItem.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTotal();
            loadCartItems();
        }
    });

    $('#checkout-form').submit(function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        alert('Compra finalizada com sucesso! Obrigado pelo seu pedido. Você receberá mais informações em breve.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        updateCartTotal();
        $(this).trigger("reset");
    });

    // Adicionar produtos pelo admin
    $('#add-product-form').submit(function(e) {
        e.preventDefault();
        const newProduct = {
            id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: $('#product-name').val(),
            price: parseFloat($('#product-price').val()),
            image: $('#product-image').val(),
            description: $('#product-description').val(),
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));

        alert('Produto adicionado com sucesso!');
        $(this).trigger("reset");

        displayProducts();
        displayAdminProducts();
    });

    $(document).on('click', '.delete-product', function() {
        const productId = $(this).data('id');
        products = products.filter(product => product.id !== productId);

        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        displayProducts();

        alert('Produto excluído com sucesso!');
    });

    function displayAdminProducts() {
        $('#admin-product-list').empty();
        products.forEach(product => {
            $('#admin-product-list').append(`
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                        <button class="btn btn-danger delete-product" data-id="${product.id}">Excluir</button>
                    </div>
                </div>
            `);
        });
    }

    $('#clear-cart').click(function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
        updateCartTotal();
    });

    displayProducts();
    updateCartTotal();
    updateCartCount();
    loadCartItems();
    displayAdminProducts();
});
